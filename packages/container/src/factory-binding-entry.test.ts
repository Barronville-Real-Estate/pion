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

import type { IClassBindingEntryClassType as ClassType } from './class-binding-entry.i'
import type { IFactoryBindingEntryFactoryType as FactoryType } from './factory-binding-entry.i'
import type IBindingEntry from './binding-entry.i'
import type IFactoryBindingEntry from './factory-binding-entry.i'
import type IFactoryBindingEntryConstructor from './factory-binding-entry-constructor.i'

type IFactoryBindingEntryPrivateType<FactoryTypeT> = ((IBindingEntry &
                                                       { _hasClass: boolean }) &
                                                      (IFactoryBindingEntry<FactoryTypeT> &
                                                       { _factory: FactoryType<FactoryTypeT> }));

const $p = <FactoryTypeT>(entry: IFactoryBindingEntry<FactoryTypeT>) => (entry as IFactoryBindingEntryPrivateType<FactoryTypeT>)

describe('FactoryBindingEntry', () => {
  let FactoryBindingEntry: ClassType<IFactoryBindingEntryConstructor>



  beforeEach(async () => {
    FactoryBindingEntry = ((module) => module.default)(await import('./factory-binding-entry'))
  })



  test('#constructor() :: properly constructs a new instance', async () => {
    const BindingEntry = ((module) => module.default)(await import('./binding-entry'))
    const factory = () => null
    const entry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<ReturnType<typeof factory>>
    const entryPrivate = $p(entry)
    expect(entry).toBeInstanceOf(FactoryBindingEntry)
    expect(entryPrivate._factory).toBe(factory)
    expect(entry).toBeInstanceOf(BindingEntry)
    expect(entryPrivate._hasClass).toBeFalse()
  })



  test('#getFactory() :: gets the factory', () => {
    const factory = () => null
    const entry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<ReturnType<typeof factory>>
    expect(entry.getFactory()).toBe(factory)
  })



  test('#hasClass() :: checks if the instance has a class (instead of a factory) (should always return {false})', () => {
    const factory = () => null
    const entry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<ReturnType<typeof factory>>
    expect(entry.hasClass()).toBeFalse()
  })
})
