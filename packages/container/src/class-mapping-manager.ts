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

import type { IClassMappingManagerClassSuperType as ClassSuperType } from './class-mapping-manager.i'
import type { IClassMappingManagerClassType as ClassType } from './class-mapping-manager.i'
import { ConstructorParameterNamesParser } from '@pion-toolkit/utilities'
import type { IClassMappingManagerConstructorParameterSymbolsType as ConstructorParameterSymbolsType } from './class-mapping-manager.i'
import type IClassMappingManager from './class-mapping-manager.i'
import type IClassMappingManagerConstructor from './class-mapping-manager-constructor.i'
import type { IConstructorParameterNamesParser } from '@pion-toolkit/utilities'

class ClassMappingManager
  implements IClassMappingManager
{
  private _parameterNamesParsers: Map<ClassType<any>, IConstructorParameterNamesParser>
  private _parameterSymbols: Map<ClassType<any>, ConstructorParameterSymbolsType>
  private _symbols: Map<ClassType<any>, symbol>

  public constructor()
  {
    this._parameterNamesParsers = new Map()
    this._parameterSymbols = new Map()
    this._symbols = new Map()

    Object.defineProperties(this, {
      _parameterNamesParsers: { enumerable: false },
      _parameterSymbols: { enumerable: false },
      _symbols: { enumerable: false }
    })
  }

  public clear()
  {
    this._parameterNamesParsers.clear()
    this._parameterSymbols.clear()
    this._symbols.clear()
  }

  public contains<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>)
  {
    return this._symbols.has(class_)
  }

  public get<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>)
  {
    const symbol = this._symbols.get(class_)
    if (typeof symbol === 'undefined') {
      return null
    }
    const parameterNamesParser = this._parameterNamesParsers.get(class_)!
    const parameterNames = parameterNamesParser.parse()
    const parameterSymbols = this._parameterSymbols.get(class_)!
    return {
      parameterNames,
      parameterSymbols,
      symbol
    }
  }

  public getParameterNames<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>)
  {
    const value = this.get(class_)
    return (value !== null) ?
      value.parameterNames :
      null
  }

  public getParameterSymbols<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>)
  {
    const value = this.get(class_)
    return (value !== null) ?
      value.parameterSymbols :
      null
  }

  public getSymbol<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>)
  {
    const value = this.get(class_)
    return (value !== null) ?
      value.symbol :
      null
  }

  public set<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>,
                                                symbol: symbol,
                                                parameterSymbols: ConstructorParameterSymbolsType)
  {
    this._symbols.set(class_, symbol)
    this._parameterSymbols.set(class_, parameterSymbols)
    const parameterNamesParser = new ConstructorParameterNamesParser(class_)
    this._parameterNamesParsers.set(class_, parameterNamesParser)
  }

  public unset<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>)
  {
    this._parameterNamesParsers.delete(class_)
    this._parameterSymbols.delete(class_)
    this._symbols.delete(class_)
  }
}

Object.defineProperties(ClassMappingManager.prototype, {
  constructor: { enumerable: true },

  clear: { enumerable: true },
  contains: { enumerable: true },
  get: { enumerable: true },
  getParameterNames: { enumerable: true },
  getParameterSymbols: { enumerable: true },
  getSymbol: { enumerable: true },
  set: { enumerable: true },
  unset: { enumerable: true }
})

export default (ClassMappingManager as IClassMappingManagerConstructor)
