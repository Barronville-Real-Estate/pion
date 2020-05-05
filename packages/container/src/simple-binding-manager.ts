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
import type ISimpleBindingManager from './simple-binding-manager.i'
import type ISimpleBindingManagerConstructor from './simple-binding-manager-constructor.i'

class SimpleBindingManager
  implements ISimpleBindingManager
{
  private _bindings: Map<symbol, IBindingEntry>
  private _shouldResolveOnceFlags: Map<symbol, boolean>

  public constructor()
  {
    this._bindings = new Map()
    this._shouldResolveOnceFlags = new Map()

    Object.defineProperties(this, {
      _bindings: { enumerable: false },
      _shouldResolveOnceFlags: { enumerable: false }
    })
  }

  public clear()
  {
    this._shouldResolveOnceFlags.clear()
    this._bindings.clear()
  }

  public contains(key: symbol)
  {
    return this._bindings.has(key)
  }

  public get(key: symbol)
  {
    const entry = this._bindings.get(key)
    return (typeof entry !== 'undefined') ?
      entry :
      null
  }

  public set(key: symbol,
             entry: IBindingEntry,
             shouldResolveOnce: boolean)
  {
    this._bindings.set(key, entry)
    this._shouldResolveOnceFlags.set(key, shouldResolveOnce)
  }

  public shouldResolveOnce(key: symbol)
  {
    const value = this._shouldResolveOnceFlags.get(key)
    return (typeof value !== 'undefined') ?
      value :
      null
  }

  public unset(key: symbol)
  {
    this._shouldResolveOnceFlags.delete(key)
    this._bindings.delete(key)
  }
}

Object.defineProperties(SimpleBindingManager.prototype, {
  constructor: { enumerable: true },

  clear: { enumerable: true },
  contains: { enumerable: true },
  get: { enumerable: true },
  set: { enumerable: true },
  shouldResolveOnce: { enumerable: true },
  unset: { enumerable: true }
})

export default (SimpleBindingManager as ISimpleBindingManagerConstructor)
