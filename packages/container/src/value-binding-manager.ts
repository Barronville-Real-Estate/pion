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

import type IValueBindingManager from './value-binding-manager.i'
import type IValueBindingManagerConstructor from './value-binding-manager-constructor.i'
import type { IValueBindingManagerValueType as ValueType } from './value-binding-manager.i'

const ValueBindingManager: IValueBindingManagerConstructor =
  class ValueBindingManager
    implements IValueBindingManager
  {
    private _bindings: Map<symbol, ValueType>

    public constructor()
    {
      this._bindings = new Map()

      Object.defineProperties(this, {
        _bindings: { enumerable: false }
      })
    }

    public clear()
    {
      this._bindings.clear()
    }

    public contains(key: symbol)
    {
      return this._bindings.has(key)
    }

    public get(key: symbol)
    {
      return this._bindings.get(key)
    }

    public set(key: symbol,
               value: ValueType)
    {
      this._bindings.set(key, value)
    }

    public unset(key: symbol)
    {
      this._bindings.delete(key)
    }
  }

Object.defineProperties(ValueBindingManager.prototype, {
  constructor: { enumerable: true },

  clear: { enumerable: true },
  contains: { enumerable: true },
  get: { enumerable: true },
  set: { enumerable: true },
  unset: { enumerable: true }
})

export default ValueBindingManager
