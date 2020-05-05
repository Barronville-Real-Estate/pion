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

import type { IContainerBindingValueType as BindingValueType } from './container.i'
import type { IClassBindingEntryClassType as ClassType } from './class-binding-entry.i'
import type { IContainerConstructorParameterSymbolsType as ConstructorParameterSymbolsType } from './container.i'
import type { IContainerExtenderValueType as ExtenderValueType } from './container.i'
import type { IContainerFactoryType as FactoryType } from './container.i'
import type IClassBindingEntry from './class-binding-entry.i'
import type IClassBindingEntryConstructor from './class-binding-entry-constructor.i'
import type IContainer from './container.i'
import type IContainerConstructor from './container-constructor.i'
import type IContainerManager from './container-manager.i'
import type IContainerManagerConstructor from './container-manager-constructor.i'
import type { IExtenderManagerExtenderFunctionType } from './extender-manager.i'
import type IFactoryBindingEntry from './factory-binding-entry.i'
import type IFactoryBindingEntryConstructor from './factory-binding-entry-constructor.i'
import type IRebindEventObserver from './rebind-event-observer.i'
import type IRebindEventObserverConstructor from './rebind-event-observer-constructor.i'
import type { IResolverParametersType } from './resolver.i'
import type { IResolverResolveValueType } from './resolver.i'

type IContainerPrivateType = (IContainer &
                              {
                                _manager: IContainerManager,
                                _triggerRebindEvent: (key: symbol) => void
                              });

const $p = (container: IContainer) => (container as IContainerPrivateType)

describe('Container', () => {
  let ClassBindingEntry: ClassType<IClassBindingEntryConstructor>
  let Container: ClassType<IContainerConstructor>
  let ContainerManager: ClassType<IContainerManagerConstructor>
  let FactoryBindingEntry: ClassType<IFactoryBindingEntryConstructor>
  let RebindEventObserver: ClassType<IRebindEventObserverConstructor>



  beforeEach(async () => {
    ClassBindingEntry = ((module) => module.default)(await import('./class-binding-entry'))
    Container = ((module) => module.default)(await import('./container'))
    ContainerManager = ((module) => module.default)(await import('./container-manager'))
    FactoryBindingEntry = ((module) => module.default)(await import('./factory-binding-entry'))
    RebindEventObserver = ((module) => module.default)(await import('./rebind-event-observer'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const container = new Container()
    const containerPrivate = $p(container)
    expect(container).toBeInstanceOf(Container)
    expect(containerPrivate._manager).toBeInstanceOf(ContainerManager)
  })



  test('#addRebindEventHandler() :: adds a rebind event handler for a key', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const handler = () => {}
    const containerIsBoundSpy = jest.spyOn(container, 'isBound')
    const { _manager: containerManager } = $p(container)
    const containerManagerAddRebindEventObserverSpy = jest.spyOn(containerManager, 'addRebindEventObserver')
    container.addRebindEventHandler(fooSymbol, handler)
    expect(containerManagerAddRebindEventObserverSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddRebindEventObserverSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((observer: IRebindEventObserver) => (observer instanceof RebindEventObserver)))
    expect(containerIsBoundSpy).toHaveBeenCalledTimes(1)
    expect(containerIsBoundSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerIsBoundSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#addRebindEventHandler() :: adds a rebind event handler for a key :: when a relevant binding already exists, resolves the binding', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    container.bindValue(fooSymbol, foo)
    const handler = () => {}
    const containerIsBoundSpy = jest.spyOn(container, 'isBound')
    const containerResolveSpy = jest.spyOn(container, 'resolve') as jest.SpyInstance<IResolverResolveValueType<typeof foo>, [ symbol, IResolverParametersType ]>
    const { _manager: containerManager } = $p(container)
    const containerManagerAddRebindEventObserverSpy = jest.spyOn(containerManager, 'addRebindEventObserver')
    container.addRebindEventHandler(fooSymbol, handler)
    expect(containerManagerAddRebindEventObserverSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddRebindEventObserverSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((observer: IRebindEventObserver) => (observer instanceof RebindEventObserver)))
    expect(containerIsBoundSpy).toHaveBeenCalledTimes(1)
    expect(containerIsBoundSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerIsBoundSpy).toHaveReturnedWith(
      expect.toBeTrue())
    expect(containerResolveSpy).toHaveBeenCalledTimes(1)
    expect(containerResolveSpy).toHaveBeenCalledWith(fooSymbol)
  })



  test('#bindClass() :: binds a class to the container', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const { _manager: containerManager } = $p(container)
    const containerManagerAddClassBindingSpy = jest.spyOn(containerManager, 'addClassBinding') as jest.SpyInstance<void, [ symbol, IClassBindingEntry<typeof Foo>, boolean ]>
    const containerManagerAddClassMappingSpy = jest.spyOn(containerManager, 'addClassMapping') as jest.SpyInstance<void, [ symbol, ClassType<typeof Foo>, ConstructorParameterSymbolsType ]>
    const containerManagerRemoveValueBindingSpy = jest.spyOn(containerManager, 'removeValueBinding')
    container.bindClass<typeof Foo>(fooSymbol, Foo)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledWith(fooSymbol, Foo, {})
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddClassBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassBindingSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((entry: IClassBindingEntry<typeof Foo>) => (entry instanceof ClassBindingEntry)),
      expect.toBeFalse())
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#bindClass() :: binds a class to the container :: when a parameter symbols object is provided, saves it for when resolving later', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const parameterSymbols = {}
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const { _manager: containerManager } = $p(container)
    const containerManagerAddClassBindingSpy = jest.spyOn(containerManager, 'addClassBinding') as jest.SpyInstance<void, [ symbol, IClassBindingEntry<typeof Foo>, boolean ]>
    const containerManagerAddClassMappingSpy = jest.spyOn(containerManager, 'addClassMapping') as jest.SpyInstance<void, [ symbol, ClassType<typeof Foo>, ConstructorParameterSymbolsType ]>
    const containerManagerRemoveValueBindingSpy = jest.spyOn(containerManager, 'removeValueBinding')
    container.bindClass<typeof Foo>(fooSymbol, Foo, parameterSymbols)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledWith(fooSymbol, Foo,
      expect.toSatisfy((value: object) => Object.is(value, parameterSymbols)))
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddClassBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassBindingSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((entry: IClassBindingEntry<typeof Foo>) => (entry instanceof ClassBindingEntry)),
      expect.toBeFalse())
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#bindClass() :: binds a class to the container :: when the flag to resolve once is set, sets up the binding to resolve only once when resolving', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const { _manager: containerManager } = $p(container)
    const containerManagerAddClassBindingSpy = jest.spyOn(containerManager, 'addClassBinding') as jest.SpyInstance<void, [ symbol, IClassBindingEntry<typeof Foo>, boolean ]>
    const containerManagerAddClassMappingSpy = jest.spyOn(containerManager, 'addClassMapping') as jest.SpyInstance<void, [ symbol, ClassType<typeof Foo>, ConstructorParameterSymbolsType ]>
    const containerManagerRemoveValueBindingSpy = jest.spyOn(containerManager, 'removeValueBinding')
    container.bindClass<typeof Foo>(fooSymbol, Foo, {}, true)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledWith(fooSymbol, Foo, {})
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddClassBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassBindingSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((entry: IClassBindingEntry<typeof Foo>) => (entry instanceof ClassBindingEntry)),
      expect.toBeTrue())
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#bindClass() :: binds a class to the container :: when a binding already exists and has been resolved, triggers any associated rebind events', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    container.bindClass<typeof Foo>(fooSymbol, Foo)
    container.resolve<InstanceType<typeof Foo>>(fooSymbol)
    const containerPrivate = $p(container)
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const containerTriggerRebindEventSpy = jest.spyOn(containerPrivate, '_triggerRebindEvent')
    const { _manager: containerManager } = containerPrivate
    const containerManagerAddClassBindingSpy = jest.spyOn(containerManager, 'addClassBinding') as jest.SpyInstance<void, [ symbol, IClassBindingEntry<typeof Foo>, boolean ]>
    const containerManagerAddClassMappingSpy = jest.spyOn(containerManager, 'addClassMapping') as jest.SpyInstance<void, [ symbol, ClassType<typeof Foo>, ConstructorParameterSymbolsType ]>
    const containerManagerRemoveValueBindingSpy = jest.spyOn(containerManager, 'removeValueBinding')
    container.bindClass<typeof Foo>(fooSymbol, Foo)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledWith(fooSymbol, Foo, {})
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddClassBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassBindingSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((entry: IClassBindingEntry<typeof Foo>) => (entry instanceof ClassBindingEntry)),
      expect.toBeFalse())
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeTrue())
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledTimes(1)
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledWith(fooSymbol)
  })



  test('#bindFactory() :: binds a factory to the container', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = (() => new Foo()) as FactoryType<InstanceType<typeof Foo>>
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const { _manager: containerManager } = $p(container)
    const containerManagerAddFactoryBindingSpy = jest.spyOn(containerManager, 'addFactoryBinding') as jest.SpyInstance<void, [ symbol, IFactoryBindingEntry<ReturnType<typeof factory>>, boolean ]>
    const containerManagerRemoveValueBindingSpy = jest.spyOn(containerManager, 'removeValueBinding')
    container.bindFactory(fooSymbol, factory)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddFactoryBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddFactoryBindingSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((entry: IFactoryBindingEntry<ReturnType<typeof factory>>) => (entry instanceof FactoryBindingEntry)),
      expect.toBeFalse())
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#bindFactory() :: binds a factory to the container :: when the flag to resolve once is set, sets up the binding to resolve only once when resolving', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = (() => new Foo()) as FactoryType<InstanceType<typeof Foo>>
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const { _manager: containerManager } = $p(container)
    const containerManagerAddFactoryBindingSpy = jest.spyOn(containerManager, 'addFactoryBinding') as jest.SpyInstance<void, [ symbol, IFactoryBindingEntry<ReturnType<typeof factory>>, boolean ]>
    const containerManagerRemoveValueBindingSpy = jest.spyOn(containerManager, 'removeValueBinding')
    container.bindFactory(fooSymbol, factory, true)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddFactoryBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddFactoryBindingSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((entry: IFactoryBindingEntry<ReturnType<typeof factory>>) => (entry instanceof FactoryBindingEntry)),
      expect.toBeTrue())
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#bindFactory() :: binds a factory to the container :: when a binding already exists and has been resolved, triggers any associated rebind events', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = (() => new Foo()) as FactoryType<InstanceType<typeof Foo>>
    container.bindFactory(fooSymbol, factory)
    container.resolve<ReturnType<typeof factory>>(fooSymbol)
    const containerPrivate = $p(container)
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const containerTriggerRebindEventSpy = jest.spyOn(containerPrivate, '_triggerRebindEvent')
    const { _manager: containerManager } = containerPrivate
    const containerManagerAddFactoryBindingSpy = jest.spyOn(containerManager, 'addFactoryBinding') as jest.SpyInstance<void, [ symbol, IFactoryBindingEntry<ReturnType<typeof factory>>, boolean ]>
    const containerManagerRemoveValueBindingSpy = jest.spyOn(containerManager, 'removeValueBinding')
    container.bindFactory(fooSymbol, factory)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerRemoveValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddFactoryBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddFactoryBindingSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((entry: IFactoryBindingEntry<ReturnType<typeof factory>>) => (entry instanceof FactoryBindingEntry)),
      expect.toBeFalse())
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeTrue())
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledTimes(1)
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledWith(fooSymbol)
  })



  test('#bindValue() :: binds a value to the container', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    const containerIsBoundSpy = jest.spyOn(container, 'isBound')
    const { _manager: containerManager } = $p(container)
    const containerManagerAddValueBindingSpy = jest.spyOn(containerManager, 'addValueBinding')
    container.bindValue(fooSymbol, foo)
    expect(containerIsBoundSpy).toHaveBeenCalledTimes(1)
    expect(containerIsBoundSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddValueBindingSpy).toHaveBeenCalledWith(fooSymbol, foo)
    expect(containerIsBoundSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#bindValue() :: binds a value to the container :: when a binding already exists, triggers any associated rebind events', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    container.bindValue(fooSymbol, foo)
    const containerPrivate = $p(container)
    const containerIsBoundSpy = jest.spyOn(container, 'isBound')
    const containerTriggerRebindEventSpy = jest.spyOn(containerPrivate, '_triggerRebindEvent')
    const { _manager: containerManager } = containerPrivate
    const containerManagerAddValueBindingSpy = jest.spyOn(containerManager, 'addValueBinding')
    container.bindValue(fooSymbol, foo)
    expect(containerIsBoundSpy).toHaveBeenCalledTimes(1)
    expect(containerIsBoundSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerAddValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddValueBindingSpy).toHaveBeenCalledWith(fooSymbol, foo)
    expect(containerIsBoundSpy).toHaveReturnedWith(
      expect.toBeTrue())
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledTimes(1)
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledWith(fooSymbol)
  })



  test('#contextuallyBindClass() :: contextually binds a class to the container', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    const Foo = (class Foo
    {})
    const { _manager: containerManager } = $p(container)
    const containerManagerAddClassMappingSpy = jest.spyOn(containerManager, 'addClassMapping') as jest.SpyInstance<void, [ symbol, ClassType<typeof Foo>, ConstructorParameterSymbolsType ]>
    const containerManagerAddContextualClassBindingSpy = jest.spyOn(containerManager, 'addContextualClassBinding') as jest.SpyInstance<void, [ symbol, symbol, IClassBindingEntry<typeof Foo> ]>
    container.contextuallyBindClass<typeof Foo>(barSymbol, fooSymbol, Foo)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledWith(fooSymbol, Foo, {})
    expect(containerManagerAddContextualClassBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddContextualClassBindingSpy).toHaveBeenCalledWith(barSymbol, fooSymbol,
      expect.toSatisfy((entry: IClassBindingEntry<typeof Foo>) => {
        if (! (entry instanceof ClassBindingEntry)) {
          return false
        }
        const entryClass = entry.getClass() as ClassType<typeof Foo>
        return Object.is(entryClass, Foo)
      }))
  })

  test('#contextuallyBindClass() :: contextually binds a class to the container :: when a parameter symbols object is provided, saves it for when resolving later', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    const Foo = (class Foo
    {})
    const parameterSymbols = {}
    const { _manager: containerManager } = $p(container)
    const containerManagerAddClassMappingSpy = jest.spyOn(containerManager, 'addClassMapping') as jest.SpyInstance<void, [ symbol, ClassType<typeof Foo>, ConstructorParameterSymbolsType ]>
    const containerManagerAddContextualClassBindingSpy = jest.spyOn(containerManager, 'addContextualClassBinding') as jest.SpyInstance<void, [ symbol, symbol, IClassBindingEntry<typeof Foo> ]>
    container.contextuallyBindClass<typeof Foo>(barSymbol, fooSymbol, Foo, parameterSymbols)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddClassMappingSpy).toHaveBeenCalledWith(fooSymbol, Foo,
      expect.toSatisfy((value: object) => Object.is(value, parameterSymbols)))
    expect(containerManagerAddContextualClassBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddContextualClassBindingSpy).toHaveBeenCalledWith(barSymbol, fooSymbol,
      expect.toSatisfy((entry: IClassBindingEntry<typeof Foo>) => {
        if (! (entry instanceof ClassBindingEntry)) {
          return false
        }
        const entryClass = entry.getClass() as ClassType<typeof Foo>
        return Object.is(entryClass, Foo)
      }))
  })



  test('#contextuallyBindFactory() :: contextually binds a factory to the container', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    const Foo = (class Foo
    {})
    const factory = (() => new Foo()) as FactoryType<InstanceType<typeof Foo>>
    const { _manager: containerManager } = $p(container)
    const containerManagerAddContextualFactoryBindingSpy = jest.spyOn(containerManager, 'addContextualFactoryBinding') as jest.SpyInstance<void, [ symbol, symbol, IFactoryBindingEntry<ReturnType<typeof factory>> ]>
    container.contextuallyBindFactory(barSymbol, fooSymbol, factory)
    expect(containerManagerAddContextualFactoryBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddContextualFactoryBindingSpy).toHaveBeenCalledWith(barSymbol, fooSymbol,
      expect.toSatisfy((entry: IFactoryBindingEntry<ReturnType<typeof factory>>) => (entry instanceof FactoryBindingEntry)))
  })



  test('#empty() :: empties the container', () => {
    const container = new Container()
    const { _manager: containerManager } = $p(container)
    const containerManagerClearAllSpy = jest.spyOn(containerManager, 'clearAll')
    container.empty()
    expect(containerManagerClearAllSpy).toHaveBeenCalledTimes(1)
  })



  test('#extend() :: extends a binding :: when an existing value binding exists, runs the value through the extender function, sets the extended value as the new value for the binding, and triggers any associated rebind events', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    container.bindValue(fooSymbol, foo)
    const extender = jest.fn((value: ExtenderValueType,
                              container: IContainer) => {
      return {
        container,
        value: value as InstanceType<typeof Foo>
      }
    })
    const containerPrivate = $p(container)
    const containerTriggerRebindEventSpy = jest.spyOn(containerPrivate, '_triggerRebindEvent')
    const { _manager: containerManager } = containerPrivate
    const containerManagerAddValueBindingSpy = jest.spyOn(containerManager, 'addValueBinding')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    const containerManagerGetValueBindingSpy = jest.spyOn(containerManager, 'getValueBinding')
    container.extend(fooSymbol, extender)
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsValueBindingSpy).toHaveReturnedWith(
      expect.toBeTrue())
    expect(containerManagerGetValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerGetValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    let containerManagerGetValueBindingSpyValue: (BindingValueType |
                                                  undefined)
    const [ containerManagerGetValueBindingSpyResult ] = containerManagerGetValueBindingSpy.mock.results
    switch (containerManagerGetValueBindingSpyResult.type) {
      case 'return': {
        containerManagerGetValueBindingSpyValue = containerManagerGetValueBindingSpyResult.value
        break
      }
      default: {
        // NOTE: This block should never be reached.
        containerManagerGetValueBindingSpyValue = undefined
        break
      }
    }
    expect(containerManagerGetValueBindingSpy).toHaveReturnedWith(containerManagerGetValueBindingSpyValue as BindingValueType)
    expect(extender).toHaveBeenCalledTimes(1)
    expect(extender).toHaveBeenCalledWith(containerManagerGetValueBindingSpyValue as BindingValueType, container)
    let extenderValue: (ReturnType<typeof extender> |
                        null)
    const [ extenderResult ] = extender.mock.results
    switch (extenderResult.type) {
      case 'return': {
        extenderValue = extenderResult.value
        break
      }
      default: {
        // NOTE: This block should never be reached.
        extenderValue = null
        break
      }
    }
    expect(extender).toHaveReturnedWith(extenderValue!)
    expect(containerManagerAddValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddValueBindingSpy).toHaveBeenCalledWith(fooSymbol, extenderValue!)
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledTimes(1)
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledWith(fooSymbol)
  })

  test('#extend() :: extends a binding :: when no value binding exists, saves the extender function when resolving later', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = jest.fn((() => {
      return new Foo()
    }) as FactoryType<InstanceType<typeof Foo>>)
    container.bindFactory(fooSymbol, factory)
    const extender = jest.fn((value: ExtenderValueType,
                              container: IContainer) => {
      return {
        container,
        value: value as InstanceType<typeof Foo>
      }
    })
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const { _manager: containerManager } = $p(container)
    const containerManagerAddExtenderSpy = jest.spyOn(containerManager, 'addExtender')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    container.extend(fooSymbol, extender)
    expect(containerManagerContainsValueBindingSpy).toHaveBeenNthCalledWith(1, fooSymbol)
    expect(containerManagerContainsValueBindingSpy).toHaveNthReturnedWith(1, false)
    expect(containerManagerAddExtenderSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddExtenderSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((function_: IExtenderManagerExtenderFunctionType) => ((typeof function_ === 'function') &&
                                                                             (function_.length === 1))))
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#extend() :: extends a binding :: when no value binding exists but a non-value binding exists and has been resolved, triggers any associated rebind events', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = jest.fn((() => {
      return new Foo()
    }) as FactoryType<InstanceType<typeof Foo>>)
    container.bindFactory(fooSymbol, factory)
    container.resolve<InstanceType<typeof Foo>>(fooSymbol)
    const extender = jest.fn((value: ExtenderValueType,
                              container: IContainer) => {
      return {
        container,
        value: value as InstanceType<typeof Foo>
      }
    })
    const containerHasResolvedSpy = jest.spyOn(container, 'hasResolved')
    const containerPrivate = $p(container)
    const containerTriggerRebindEventSpy = jest.spyOn(containerPrivate, '_triggerRebindEvent')
    const { _manager: containerManager } = containerPrivate
    const containerManagerAddExtenderSpy = jest.spyOn(containerManager, 'addExtender')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    container.extend(fooSymbol, extender)
    expect(containerManagerContainsValueBindingSpy).toHaveBeenNthCalledWith(1, fooSymbol)
    expect(containerManagerContainsValueBindingSpy).toHaveNthReturnedWith(1, false)
    expect(containerManagerAddExtenderSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerAddExtenderSpy).toHaveBeenCalledWith(fooSymbol,
      expect.toSatisfy((function_: IExtenderManagerExtenderFunctionType) => ((typeof function_ === 'function') &&
                                                                             (function_.length === 1))))
    expect(containerHasResolvedSpy).toHaveBeenCalledTimes(1)
    expect(containerHasResolvedSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerHasResolvedSpy).toHaveReturnedWith(
      expect.toBeTrue())
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledTimes(1)
    expect(containerTriggerRebindEventSpy).toHaveBeenCalledWith(fooSymbol)
  })



  test('#hasResolved() :: checks if a binding for a key has been resolved :: when no binding exists, returns {false}', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const { _manager: containerManager } = $p(container)
    const containerManagerContainsResolvedSymbolSpy = jest.spyOn(containerManager, 'containsResolvedSymbol')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    const keyResolved = container.hasResolved(fooSymbol)
    expect(keyResolved).toBeFalse()
    expect(containerManagerContainsResolvedSymbolSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsResolvedSymbolSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsResolvedSymbolSpy).toHaveReturnedWith(
      expect.toBeFalse())
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsValueBindingSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#hasResolved() :: checks if a binding for a key has been resolved :: when a key has been marked as resolved, returns {true}', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = jest.fn((() => {
      return new Foo()
    }) as FactoryType<InstanceType<typeof Foo>>)
    container.bindFactory(fooSymbol, factory)
    container.resolve<ReturnType<typeof factory>>(fooSymbol)
    const { _manager: containerManager } = $p(container)
    const containerManagerContainsResolvedSymbolSpy = jest.spyOn(containerManager, 'containsResolvedSymbol')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    const keyResolved = container.hasResolved(fooSymbol)
    expect(keyResolved).toBeTrue()
    expect(containerManagerContainsResolvedSymbolSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsResolvedSymbolSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsResolvedSymbolSpy).toHaveReturnedWith(keyResolved)
    expect(containerManagerContainsValueBindingSpy).not.toHaveBeenCalled()
  })

  test('#hasResolved() :: checks if a binding for a key has been resolved :: when a value binding exists, assuming the key has not been marked as resolved, returns {true}', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    container.bindValue(fooSymbol, foo)
    const { _manager: containerManager } = $p(container)
    const containerManagerContainsResolvedSymbolSpy = jest.spyOn(containerManager, 'containsResolvedSymbol')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    const keyResolved = container.hasResolved(fooSymbol)
    expect(keyResolved).toBeTrue()
    expect(containerManagerContainsResolvedSymbolSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsResolvedSymbolSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsResolvedSymbolSpy).toHaveReturnedWith(
      expect.toBeFalse())
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsValueBindingSpy).toHaveReturnedWith(keyResolved)
  })



  test('#isBound() :: checks if a key is bound to the container :: when no binding exists, returns {false}', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const { _manager: containerManager } = $p(container)
    const containerManagerContainsSimpleBindingSpy = jest.spyOn(containerManager, 'containsSimpleBinding')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    const keyFound = container.isBound(fooSymbol)
    expect(keyFound).toBeFalse()
    expect(containerManagerContainsSimpleBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsSimpleBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsSimpleBindingSpy).toHaveReturnedWith(
      expect.toBeFalse())
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsValueBindingSpy).toHaveReturnedWith(
      expect.toBeFalse())
  })

  test('#isBound() :: checks if a key is bound to the container :: when a simple binding exists, returns {true}', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = jest.fn((() => {
      return new Foo()
    }) as FactoryType<InstanceType<typeof Foo>>)
    container.bindFactory(fooSymbol, factory)
    const { _manager: containerManager } = $p(container)
    const containerManagerContainsSimpleBindingSpy = jest.spyOn(containerManager, 'containsSimpleBinding')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    const keyFound = container.isBound(fooSymbol)
    expect(keyFound).toBeTrue()
    expect(containerManagerContainsSimpleBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsSimpleBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsSimpleBindingSpy).toHaveReturnedWith(keyFound)
    expect(containerManagerContainsValueBindingSpy).not.toHaveBeenCalled()
  })

  test('#isBound() :: checks if a key is bound to the container :: when a value binding exists, assuming a simple binding does not exist for the key, returns {true}', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    container.bindValue(fooSymbol, foo)
    const { _manager: containerManager } = $p(container)
    const containerManagerContainsSimpleBindingSpy = jest.spyOn(containerManager, 'containsSimpleBinding')
    const containerManagerContainsValueBindingSpy = jest.spyOn(containerManager, 'containsValueBinding')
    const keyFound = container.isBound(fooSymbol)
    expect(keyFound).toBeTrue()
    expect(containerManagerContainsSimpleBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsSimpleBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsSimpleBindingSpy).toHaveReturnedWith(
      expect.toBeFalse())
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerContainsValueBindingSpy).toHaveBeenCalledWith(fooSymbol)
    expect(containerManagerContainsValueBindingSpy).toHaveReturnedWith(keyFound)
  })



  test('#resolve() :: resolves a binding', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    container.bindValue(fooSymbol, foo)
    const parameters = {}
    const { _manager: containerManager } = $p(container)
    const containerManagerResolveValueSpy = jest.spyOn(containerManager, 'resolveValue') as jest.SpyInstance<IResolverResolveValueType<typeof foo>, [ symbol, IResolverParametersType ]>
    const resolvedFoo = container.resolve<typeof foo>(fooSymbol, parameters)
    expect(containerManagerResolveValueSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerResolveValueSpy).toHaveBeenCalledWith(fooSymbol, parameters)
    expect(containerManagerResolveValueSpy).toHaveReturnedWith(resolvedFoo)
  })

  test('#resolve() :: resolves a binding :: when no parameters object is provided, uses an empty object', () => {
    const container = new Container()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    container.bindValue(fooSymbol, foo)
    const { _manager: containerManager } = $p(container)
    const containerManagerResolveValueSpy = jest.spyOn(containerManager, 'resolveValue') as jest.SpyInstance<IResolverResolveValueType<typeof foo>, [ symbol, IResolverParametersType ]>
    const resolvedFoo = container.resolve<typeof foo>(fooSymbol)
    expect(containerManagerResolveValueSpy).toHaveBeenCalledTimes(1)
    expect(containerManagerResolveValueSpy).toHaveBeenCalledWith(fooSymbol, {})
    expect(containerManagerResolveValueSpy).toHaveReturnedWith(resolvedFoo)
  })
})
