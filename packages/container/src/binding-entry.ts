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

abstract class BindingEntry
  implements IBindingEntry
{
  private _hasClass: boolean

  public constructor(hasClass: boolean)
  {
    this._hasClass = hasClass

    Object.defineProperties(this, {
      _hasClass: { enumerable: false }
    })
  }

  public hasClass()
  {
    return this._hasClass
  }
}

Object.defineProperties(BindingEntry.prototype, {
  constructor: { enumerable: true },

  hasClass: { enumerable: true }
})

export default BindingEntry
