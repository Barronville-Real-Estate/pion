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

import type { IExtenderManagerExtenderFunctionType as ExtenderFunctionType } from './extender-manager.i'
import type IExtenderManager from './extender-manager.i'
import type IExtenderManagerConstructor from './extender-manager-constructor.i'

class ExtenderManager
  implements IExtenderManager
{
  private _functions: Map<symbol, ExtenderFunctionType[]>

  public constructor()
  {
    this._functions = new Map()

    Object.defineProperties(this, {
      _functions: { enumerable: false }
    })
  }

  private _getAll(key: symbol)
  {
    const functions = this._functions.get(key)
    return (typeof functions !== 'undefined') ?
      functions :
      null
  }

  private _set(key: symbol,
               functions: ExtenderFunctionType[])
  {
    this._functions.set(key, functions)
  }

  public add(key: symbol,
             function_: ExtenderFunctionType)
  {
    let functions = this._getAll(key)
    if (functions === null) {
      functions = []
      this._set(key, functions)
    }
    functions.push(function_)
  }

  public clear()
  {
    this._functions.clear()
  }

  public contains(key: symbol)
  {
    return this._functions.has(key)
  }

  public getFunctions(key: symbol)
  {
    const functions = this._getAll(key)
    return (functions !== null) ?
      {
        [ Symbol.iterator ]: function* () {
          for (const function_ of functions) {
            yield function_
          }
        }
      } :
      null
  }

  public remove(key: symbol,
                function_: ExtenderFunctionType)
  {
    let functions = this._getAll(key)
    if (functions === null) return
    functions = functions.filter((function1) => (! Object.is(function1, function_)))
    if (functions.length !== 0) {
      this._set(key, functions)
    } else {
      this.removeAll(key)
    }
  }

  public removeAll(key: symbol)
  {
    this._functions.delete(key)
  }
}

Object.defineProperties(ExtenderManager.prototype, {
  constructor: { enumerable: true },

  add: { enumerable: true },
  clear: { enumerable: true },
  contains: { enumerable: true },
  getFunctions: { enumerable: true },
  remove: { enumerable: true },
  removeAll: { enumerable: true }
})

export default (ExtenderManager as IExtenderManagerConstructor)
