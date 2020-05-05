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
import type { IExtenderManagerExtenderFunctionType as ExtenderFunctionType } from './extender-manager.i'
import type IExtenderManager from './extender-manager.i'
import type IExtenderManagerConstructor from './extender-manager-constructor.i'
import type { IExtenderManagerValueType as ValueType } from './extender-manager.i'

type IExtenderManagerPrivateType = (IExtenderManager &
                                    { _functions: Map<symbol, ExtenderFunctionType[]> });

const $p = (extenders: IExtenderManager) => (extenders as IExtenderManagerPrivateType)

describe('ExtenderManager', () => {
  let ExtenderManager: ClassType<IExtenderManagerConstructor>



  beforeEach(async () => {
    ExtenderManager = ((module) => module.default)(await import('./extender-manager'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const extenders = new ExtenderManager()
    const extendersPrivate = $p(extenders)
    expect(extenders).toBeInstanceOf(ExtenderManager)
    expect(extendersPrivate._functions).toBeInstanceOf(Map)
    expect(extendersPrivate._functions).toBeEmpty()
  })



  test('#add() :: adds a key and extender function entry', () => {
    const extenders = new ExtenderManager()
    const fooSymbol = Symbol('foo')
    expect(extenders.contains(fooSymbol)).toBeFalse()
    const extender = (value: ValueType) => ({ value })
    extenders.add(fooSymbol, extender)
    expect(extenders.contains(fooSymbol)).toBeTrue()
  })



  test('#clear() :: clears the instance', () => {
    const extenders = new ExtenderManager()
    const extendersPrivate = $p(extenders)
    expect(extendersPrivate._functions).toBeEmpty()
    const fooSymbol = Symbol('foo')
    const extender = (value: ValueType) => ({ value })
    extenders.add(fooSymbol, extender)
    expect(extendersPrivate._functions.size).toStrictEqual(1)
    extenders.clear()
    expect(extendersPrivate._functions).toBeEmpty()
  })



  test('#contains() :: checks if an entry exists for a key', () => {
    const extenders = new ExtenderManager()
    const fooSymbol = Symbol('foo')
    expect(extenders.contains(fooSymbol)).toBeFalse()
    const extender = (value: ValueType) => ({ value })
    extenders.add(fooSymbol, extender)
    expect(extenders.contains(fooSymbol)).toBeTrue()
    extenders.remove(fooSymbol, extender)
    expect(extenders.contains(fooSymbol)).toBeFalse()
  })



  test('#getFunctions() :: gets the extender functions for a key', () => {
    const extenders = new ExtenderManager()
    const fooSymbol = Symbol('foo')
    const extenderCreator = () => {
      return (value: ValueType) => ({ value })
    }
    const extender1 = extenderCreator()
    extenders.add(fooSymbol, extender1)
    const extender2 = extenderCreator()
    extenders.add(fooSymbol, extender2)
    const extender3 = extenderCreator()
    extenders.add(fooSymbol, extender3)
    const extendersArray = [ ...extenders.getFunctions(fooSymbol)! ]
    expect(extendersArray).toBeArrayOfSize(3)
    expect(extendersArray[0]).toBe(extender1)
    expect(extendersArray[1]).toBe(extender2)
    expect(extendersArray[2]).toBe(extender3)
  })

  test('#getFunctions() :: gets the extender functions for a key :: when no entry exists, returns {null}', () => {
    const extenders = new ExtenderManager()
    const fooSymbol = Symbol('foo')
    expect(extenders.getFunctions(fooSymbol)).toBeNull()
  })



  test('#remove() :: removes a key and extender function entry', () => {
    const extenders = new ExtenderManager()
    const fooSymbol = Symbol('foo')
    const extender = (value: ValueType) => ({ value })
    extenders.add(fooSymbol, extender)
    expect(extenders.contains(fooSymbol)).toBeTrue()
    extenders.remove(fooSymbol, extender)
    expect(extenders.contains(fooSymbol)).toBeFalse()
  })



  test('#removeAll() :: removes all extender functions for a key', () => {
    const extenders = new ExtenderManager()
    const fooSymbol = Symbol('foo')
    expect(extenders.contains(fooSymbol)).toBeFalse()
    const extenderCreator = () => {
      return (value: ValueType) => ({ value })
    }
    const fooExtender1 = extenderCreator()
    extenders.add(fooSymbol, fooExtender1)
    const fooExtender2 = extenderCreator()
    extenders.add(fooSymbol, fooExtender2)
    expect(extenders.contains(fooSymbol)).toBeTrue()
    extenders.removeAll(fooSymbol)
    expect(extenders.contains(fooSymbol)).toBeFalse()
    const barSymbol = Symbol('bar')
    expect(extenders.contains(barSymbol)).toBeFalse()
    const barExtender = extenderCreator()
    extenders.add(barSymbol, barExtender)
    expect(extenders.contains(barSymbol)).toBeTrue()
    extenders.removeAll(barSymbol)
    expect(extenders.contains(barSymbol)).toBeFalse()
  })
})
