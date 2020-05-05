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
import type IRebindEventObserver from './rebind-event-observer.i'
import type IRebindEventObserverConstructor from './rebind-event-observer-constructor.i'
import type { IRebindEventObserverValueType } from './rebind-event-observer.i'
import type IRebindEventSource from './rebind-event-source.i'
import type IRebindEventSourceConstructor from './rebind-event-source-constructor.i'

type IRebindEventSourcePrivateType = (IRebindEventSource &
                                      { _observers: Map<symbol, IRebindEventObserver[]> });

const $p = (events: IRebindEventSource) => (events as IRebindEventSourcePrivateType)

describe('RebindEventSource', () => {
  let RebindEventObserver: ClassType<IRebindEventObserverConstructor>
  let RebindEventSource: ClassType<IRebindEventSourceConstructor>



  beforeEach(async () => {
    RebindEventObserver = ((module) => module.default)(await import('./rebind-event-observer'))
    RebindEventSource = ((module) => module.default)(await import('./rebind-event-source'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const events = new RebindEventSource()
    const eventsPrivate = $p(events)
    expect(events).toBeInstanceOf(RebindEventSource)
    expect(eventsPrivate._observers).toBeInstanceOf(Map)
    expect(eventsPrivate._observers).toBeEmpty()
  })



  test('#addObserver() :: adds an observer for a key', () => {
    const events = new RebindEventSource()
    const fooSymbol = Symbol('foo')
    expect(events.containsObservers(fooSymbol)).toBeFalse()
    const handler = (value: IRebindEventObserverValueType) => {}
    const observer = new RebindEventObserver(handler)
    events.addObserver(fooSymbol, observer)
    expect(events.containsObservers(fooSymbol)).toBeTrue()
  })



  test('#clearObservers() :: clears the observers', () => {
    const events = new RebindEventSource()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    expect(events.containsObservers(fooSymbol)).toBeFalse()
    expect(events.containsObservers(barSymbol)).toBeFalse()
    const fooHandler1 = (value: IRebindEventObserverValueType) => {}
    const fooObserver1 = new RebindEventObserver(fooHandler1)
    events.addObserver(fooSymbol, fooObserver1)
    const fooHandler2 = (value: IRebindEventObserverValueType) => {}
    const fooObserver2 = new RebindEventObserver(fooHandler2)
    events.addObserver(fooSymbol, fooObserver2)
    expect(events.containsObservers(fooSymbol)).toBeTrue()
    const barHandler = (value: IRebindEventObserverValueType) => {}
    const barObserver = new RebindEventObserver(barHandler)
    events.addObserver(barSymbol, barObserver)
    expect(events.containsObservers(barSymbol)).toBeTrue()
    events.clearObservers()
    expect(events.containsObservers(fooSymbol)).toBeFalse()
    expect(events.containsObservers(barSymbol)).toBeFalse()
  })



  test('#containsObservers() :: checks if any observers exist for a key', () => {
    const events = new RebindEventSource()
    const fooSymbol = Symbol('foo')
    expect(events.containsObservers(fooSymbol)).toBeFalse()
    const fooHandler = (value: IRebindEventObserverValueType) => {}
    const fooObserver = new RebindEventObserver(fooHandler)
    events.addObserver(fooSymbol, fooObserver)
    expect(events.containsObservers(fooSymbol)).toBeTrue()
  })



  test('#removeObserver() :: removes an observer for a key', () => {
    const events = new RebindEventSource()
    const fooSymbol = Symbol('foo')
    expect(events.containsObservers(fooSymbol)).toBeFalse()
    const fooHandler1 = (value: IRebindEventObserverValueType) => {}
    const fooObserver1 = new RebindEventObserver(fooHandler1)
    events.addObserver(fooSymbol, fooObserver1)
    const fooHandler2 = (value: IRebindEventObserverValueType) => {}
    const fooObserver2 = new RebindEventObserver(fooHandler2)
    events.addObserver(fooSymbol, fooObserver2)
    expect(events.containsObservers(fooSymbol)).toBeTrue()
    events.removeObserver(fooSymbol, fooObserver1)
    expect(events.containsObservers(fooSymbol)).toBeTrue()
    events.removeObserver(fooSymbol, fooObserver2)
    expect(events.containsObservers(fooSymbol)).toBeFalse()
    const barSymbol = Symbol('bar')
    expect(events.containsObservers(barSymbol)).toBeFalse()
    const barHandler = (value: IRebindEventObserverValueType) => {}
    const barObserver = new RebindEventObserver(barHandler)
    events.addObserver(barSymbol, barObserver)
    expect(events.containsObservers(barSymbol)).toBeTrue()
    events.removeObserver(barSymbol, barObserver)
    expect(events.containsObservers(barSymbol)).toBeFalse()
    const bazSymbol = Symbol('baz')
    expect(events.containsObservers(bazSymbol)).toBeFalse()
    const bazHandler = (value: IRebindEventObserverValueType) => {}
    const bazObserver = new RebindEventObserver(bazHandler)
    events.removeObserver(bazSymbol, bazObserver)
    expect(events.containsObservers(bazSymbol)).toBeFalse()
  })



  test('#removeObservers() :: removes the observers for a key', () => {
    const events = new RebindEventSource()
    const fooSymbol = Symbol('foo')
    expect(events.containsObservers(fooSymbol)).toBeFalse()
    const fooHandler1 = (value: IRebindEventObserverValueType) => {}
    const fooObserver1 = new RebindEventObserver(fooHandler1)
    events.addObserver(fooSymbol, fooObserver1)
    const fooHandler2 = (value: IRebindEventObserverValueType) => {}
    const fooObserver2 = new RebindEventObserver(fooHandler2)
    events.addObserver(fooSymbol, fooObserver2)
    expect(events.containsObservers(fooSymbol)).toBeTrue()
    events.removeObservers(fooSymbol)
    expect(events.containsObservers(fooSymbol)).toBeFalse()
    const barSymbol = Symbol('bar')
    expect(events.containsObservers(barSymbol)).toBeFalse()
    const barHandler = (value: IRebindEventObserverValueType) => {}
    const barObserver = new RebindEventObserver(barHandler)
    events.addObserver(barSymbol, barObserver)
    expect(events.containsObservers(barSymbol)).toBeTrue()
    events.removeObservers(barSymbol)
    expect(events.containsObservers(barSymbol)).toBeFalse()
  })



  test('#triggerEvent() :: triggers the event for a key, which calls any associated observers', () => {
    const events = new RebindEventSource()
    const fooSymbol = Symbol('foo')
    const handler = jest.fn((value: IRebindEventObserverValueType) => {})
    expect(handler).not.toHaveBeenCalled()
    const observer = new RebindEventObserver(handler)
    events.addObserver(fooSymbol, observer)
    const value = 'foo'
    const valueCallback = jest.fn(() => value as IRebindEventObserverValueType)
    expect(valueCallback).not.toHaveBeenCalled()
    events.triggerEvent(fooSymbol, valueCallback)
    expect(valueCallback).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(value)
  })
})
