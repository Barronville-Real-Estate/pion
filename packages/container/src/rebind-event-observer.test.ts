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
import type { IRebindEventObserverHandlerType as HandlerType } from './rebind-event-observer.i'
import type IRebindEventObserver from './rebind-event-observer.i'
import type IRebindEventObserverConstructor from './rebind-event-observer-constructor.i'
import type { IRebindEventObserverValueType as ValueType } from './rebind-event-observer.i'

type IRebindEventObserverPrivateType = (IRebindEventObserver &
                                        { _handler: HandlerType });

const $p = (observer: IRebindEventObserver) => (observer as IRebindEventObserverPrivateType)

describe('RebindEventObserver', () => {
  let RebindEventObserver: ClassType<IRebindEventObserverConstructor>



  beforeEach(async () => {
    RebindEventObserver = ((module) => module.default)(await import('./rebind-event-observer'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const handler = (value: ValueType) => {}
    const observer = new RebindEventObserver(handler)
    const observerPrivate = $p(observer)
    expect(observer).toBeInstanceOf(RebindEventObserver);
    expect(observerPrivate._handler).toBe(handler)
  })



  test('#update() :: calls the handler with a value', () => {
    const handler = jest.fn((value: ValueType) => {})
    expect(handler).not.toHaveBeenCalled()
    const observer = new RebindEventObserver(handler)
    observer.update('foo')
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('foo')
  })
})
