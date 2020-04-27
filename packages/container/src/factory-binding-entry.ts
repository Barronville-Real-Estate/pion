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

import BindingEntry from './binding-entry'
import type { IFactoryBindingEntryFactoryType as FactoryType } from './factory-binding-entry.i'
import type IFactoryBindingEntry from './factory-binding-entry.i'
import type IFactoryBindingEntryConstructor from './factory-binding-entry-constructor.i'

const FactoryBindingEntry: IFactoryBindingEntryConstructor =
  class FactoryBindingEntry<FactoryTypeT>
    extends BindingEntry
    implements IFactoryBindingEntry<FactoryTypeT>
  {
    private _factory: FactoryType<FactoryTypeT>

    public constructor(factory: FactoryType<FactoryTypeT>)
    {
      super(false)

      this._factory = factory

      Object.defineProperties(this, {
        _factory: { enumerable: false }
      })
    }

    public getFactory()
    {
      return this._factory
    }
  }

Object.defineProperties(FactoryBindingEntry.prototype, {
  constructor: { enumerable: true },

  getFactory: { enumerable: true }
})

export default FactoryBindingEntry
