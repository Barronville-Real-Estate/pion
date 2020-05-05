// *****************************************************************************
// * Copyright 2020-present Jonathan Barronville <jonathan@re.bville.cc>       *
// *                                                                           *
// * Licensed under the Apache License, Version 2.0 (the "License");           *
// * you may not use this file except in compliance with the License.          *
// * You may obtain a copy of the License at                                   *
// *                                                                           *
// *     http://www.apache.org/licenses/LICENSE-2.0                            *
// *                                                                           *
// * Unless required by applicable law or agreed to in writing, software       *
// * distributed under the License is distributed on an "AS IS" BASIS,         *
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
// * See the License for the specific language governing permissions and       *
// * limitations under the License.                                            *
// *****************************************************************************

import type { ClassExpression } from 'estree'
import type { IConstructorParameterNamesParserConstructorSuperType as ConstructorSuperType } from './constructor-parameter-names-parser.i'
import type { IConstructorParameterNamesParserConstructorType as ConstructorType } from './constructor-parameter-names-parser.i'
import { parseScript as esprimaParseScript } from 'esprima'
import type { ExpressionStatement } from 'estree'
import type { FunctionExpression } from 'estree'
import type IConstructorParameterNamesParser from './constructor-parameter-names-parser.i'
import type IConstructorParameterNamesParserConstructor from './constructor-parameter-names-parser-constructor.i'
import type { Identifier } from 'estree'

class ConstructorParameterNamesParser<ConstructorTypeT extends ConstructorSuperType>
  implements IConstructorParameterNamesParser
{
  private _constructor: ConstructorType<ConstructorTypeT>
  private _parsedNames: (string[] |
                         null)

  public constructor(constructor: ConstructorType<ConstructorTypeT>)
  {
    this._constructor = constructor
    this._parsedNames = null

    Object.defineProperties(this, {
      _constructor: { enumerable: false },
      _parsedNames: { enumerable: false }
    })
  }

  private _isParsed()
  {
    return (this._parsedNames !== null)
  }

  private _parseClassExpression(classExpressionAst: ClassExpression)
  {
    const { body: classBodyAst } = classExpressionAst
    const { body: methodDefinitionsAst } = classBodyAst
    const constructorMethodDefinitionsAst = methodDefinitionsAst.filter((bodyElementAst) => (bodyElementAst.kind === 'constructor'))
    if (constructorMethodDefinitionsAst.length !== 1) {
      return [] as string[]
    }
    const [ constructorMethodDefinitionAst ] = constructorMethodDefinitionsAst
    const { value: constructorFunctionExpressionAst } = constructorMethodDefinitionAst
    return this._parseFunctionExpression(constructorFunctionExpressionAst)
  }

  private _parseFunctionExpression(constructorFunctionExpressionAst: FunctionExpression)
  {
    const { params: parametersAst } = constructorFunctionExpressionAst
    const parameterIdentifiersAst = parametersAst.filter((parameterAst) => (parameterAst.type === 'Identifier')) as Identifier[]
    return parameterIdentifiersAst.map((identifierAst) => identifierAst.name)
  }

  public parse()
  {
    if (this._isParsed()) {
      return this._parsedNames!
    }
    const code = `(${this._constructor})`
    const programAst = esprimaParseScript(code)
    const wrapperExpressionAst = programAst.body[0] as ExpressionStatement
    const classOrFunctionExpressionAst = wrapperExpressionAst.expression as (ClassExpression |
                                                                             FunctionExpression)
    let parsedNames: string[]
    switch (classOrFunctionExpressionAst.type) {
      case 'ClassExpression': {
        const classExpressionAst = classOrFunctionExpressionAst
        parsedNames = this._parseClassExpression(classExpressionAst)
        break
      }
      case 'FunctionExpression': {
        const constructorFunctionExpressionAst = classOrFunctionExpressionAst
        parsedNames = this._parseFunctionExpression(constructorFunctionExpressionAst)
        break
      }
      default: {
        // NOTE: This block should never be reached.
        parsedNames = []
        break
      }
    }
    this._parsedNames = parsedNames
    return parsedNames
  }
}

Object.defineProperties(ConstructorParameterNamesParser.prototype, {
  constructor: { enumerable: true },

  parse: { enumerable: true }
})

export default (ConstructorParameterNamesParser as IConstructorParameterNamesParserConstructor)
