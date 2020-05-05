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

import type IBindingEntry from './binding-entry.i'
import type IContextualBindingManager from './contextual-binding-manager.i'
import type IContextualBindingManagerConstructor from './contextual-binding-manager-constructor.i'

class ContextualBindingManager
  implements IContextualBindingManager
{
  private _bindings: Map<symbol, Map<symbol, IBindingEntry>>

  public constructor()
  {
    this._bindings = new Map()

    Object.defineProperties(this, {
      _bindings: { enumerable: false }
    })
  }

  private _get(key: symbol)
  {
    const value = this._bindings.get(key)
    return (typeof value !== 'undefined') ?
      value :
      null
  }

  private _set(key: symbol,
               value: Map<symbol, IBindingEntry>)
  {
    this._bindings.set(key, value)
  }

  private _unset(key: symbol)
  {
    this._bindings.delete(key)
  }

  public clear()
  {
    this._bindings.clear()
  }

  public contains(key: symbol)
  {
    return this._bindings.has(key)
  }

  public containsDependent(key: symbol,
                           dependentKey: symbol)
  {
    const value = this._get(key)
    return (value !== null) ?
      value.has(dependentKey) :
      false
  }

  public getDependent(key: symbol,
                      dependentKey: symbol)
  {
    const value = this._get(key)
    if (value === null) {
      return null
    }
    const entry = value.get(dependentKey)
    return (typeof entry !== 'undefined') ?
      entry :
      null
  }

  public setDependent(key: symbol,
                      dependentKey: symbol,
                      entry: IBindingEntry)
  {
    let value = this._get(key)
    if (value === null) {
      value = new Map()
      this._set(key, value)
    }
    value.set(dependentKey, entry)
  }

  public unsetDependent(key: symbol,
                        dependentKey: symbol)
  {
    const value = this._get(key)
    if (value === null) return
    value.delete(dependentKey)
    if (value.size === 0) {
      this._unset(key)
    }
  }
}

Object.defineProperties(ContextualBindingManager.prototype, {
  constructor: { enumerable: true },

  clear: { enumerable: true },
  contains: { enumerable: true },
  containsDependent: { enumerable: true },
  getDependent: { enumerable: true },
  setDependent: { enumerable: true },
  unsetDependent: { enumerable: true }
})

export default (ContextualBindingManager as IContextualBindingManagerConstructor)
