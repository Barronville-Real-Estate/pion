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

import type { IClassBindingEntryClassSuperType as ClassSuperType } from './class-binding-entry.i'
import type { IClassBindingEntryClassType as ClassType } from './class-binding-entry.i'
import type IBindingEntry from './binding-entry.i'
import type IClassBindingEntry from './class-binding-entry.i'
import type IClassBindingEntryConstructor from './class-binding-entry-constructor.i'

type IClassBindingEntryPrivateType<ClassTypeT extends ClassSuperType> = ((IBindingEntry &
                                                                          { _hasClass: boolean }) &
                                                                         (IClassBindingEntry<ClassTypeT> &
                                                                          { _class: ClassType<ClassTypeT> }));

const $p = <ClassTypeT extends ClassSuperType>(entry: IClassBindingEntry<ClassTypeT>) => (entry as IClassBindingEntryPrivateType<ClassTypeT>)

describe('ClassBindingEntry', () => {
  let ClassBindingEntry: ClassType<IClassBindingEntryConstructor>



  beforeEach(async () => {
    ClassBindingEntry = ((module) => module.default)(await import('./class-binding-entry'))
  })



  test('#constructor() :: properly constructs a new instance', async () => {
    const BindingEntry = ((module) => module.default)(await import('./binding-entry'))
    const Foo = (class Foo
    {})
    const entry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    const entryPrivate = $p(entry)
    expect(entry).toBeInstanceOf(ClassBindingEntry)
    expect(entryPrivate._class).toBe(Foo)
    expect(entry).toBeInstanceOf(BindingEntry)
    expect(entryPrivate._hasClass).toBeTrue()
  })



  test('#getClass() :: gets the class', () => {
    const Foo = (class Foo
    {})
    const entry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    expect(entry.getClass()).toBe(Foo)
  })



  test('#hasClass() :: checks if the instance has a class (instead of a factory) (should always return {true})', () => {
    const Foo = (class Foo
    {})
    const entry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    expect(entry.hasClass()).toBeTrue()
  })
})
