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

import type IResolvedSymbolManager from './resolved-symbol-manager.i'
import type IResolvedSymbolManagerConstructor from './resolved-symbol-manager-constructor.i'

const ResolvedSymbolManager: IResolvedSymbolManagerConstructor =
  class ResolvedSymbolManager
    implements IResolvedSymbolManager
  {
    private _symbols: Set<symbol>

    public constructor()
    {
      this._symbols = new Set()

      Object.defineProperties(this, {
        _symbols: { enumerable: false }
      })
    }

    public add(value: symbol)
    {
      this._symbols.add(value)
    }

    public clear()
    {
      this._symbols.clear()
    }

    public contains(value: symbol)
    {
      return this._symbols.has(value)
    }

    public remove(value: symbol)
    {
      this._symbols.delete(value)
    }
  }

Object.defineProperties(ResolvedSymbolManager.prototype, {
  constructor: { enumerable: true },

  add: { enumerable: true },
  clear: { enumerable: true },
  contains: { enumerable: true },
  remove: { enumerable: true }
})

export default ResolvedSymbolManager
