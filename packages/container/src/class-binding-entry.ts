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
import type { IClassBindingEntryClassSuperType as ClassSuperType } from './class-binding-entry.i'
import type { IClassBindingEntryClassType as ClassType } from './class-binding-entry.i'
import type IClassBindingEntry from './class-binding-entry.i'
import type IClassBindingEntryConstructor from './class-binding-entry-constructor.i'

class ClassBindingEntry<ClassTypeT extends ClassSuperType>
  extends BindingEntry
  implements IClassBindingEntry<ClassTypeT>
{
  private _class: ClassType<ClassTypeT>

  public constructor(class_: ClassType<ClassTypeT>)
  {
    super(true)

    this._class = class_

    Object.defineProperties(this, {
      _class: { enumerable: false }
    })
  }

  public getClass()
  {
    return this._class
  }
}

Object.defineProperties(ClassBindingEntry.prototype, {
  constructor: { enumerable: true },

  getClass: { enumerable: true }
})

export default (ClassBindingEntry as IClassBindingEntryConstructor)
