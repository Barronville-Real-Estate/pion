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
import type IClassBindingEntry from './class-binding-entry.i'
import type IClassBindingEntryConstructor from './class-binding-entry-constructor.i'
import type IClassMappingManager from './class-mapping-manager.i'
import type IClassMappingManagerConstructor from './class-mapping-manager-constructor.i'
import type IContainerManager from './container-manager.i'
import type IContainerManagerConstructor from './container-manager-constructor.i'
import type IContextualBindingManager from './contextual-binding-manager.i'
import type IContextualBindingManagerConstructor from './contextual-binding-manager-constructor.i'
import type IExtenderManager from './extender-manager.i'
import type IExtenderManagerConstructor from './extender-manager-constructor.i'
import type { IExtenderManagerValueType } from './extender-manager.i'
import type IFactoryBindingEntry from './factory-binding-entry.i'
import type IFactoryBindingEntryConstructor from './factory-binding-entry-constructor.i'
import type { IFactoryBindingEntryFactoryType } from './factory-binding-entry.i'
import type IRebindEventObserverConstructor from './rebind-event-observer-constructor.i'
import type IRebindEventSource from './rebind-event-source.i'
import type IRebindEventSourceConstructor from './rebind-event-source-constructor.i'
import type IResolvedSymbolManager from './resolved-symbol-manager.i'
import type IResolvedSymbolManagerConstructor from './resolved-symbol-manager-constructor.i'
import type IResolver from './resolver.i'
import type IResolverConstructor from './resolver-constructor.i'
import type { IResolverParametersType } from './resolver.i'
import type { IResolverResolveValueType } from './resolver.i'
import type ISimpleBindingManager from './simple-binding-manager.i'
import type ISimpleBindingManagerConstructor from './simple-binding-manager-constructor.i'
import type IValueBindingManager from './value-binding-manager.i'
import type IValueBindingManagerConstructor from './value-binding-manager-constructor.i'
import type { IValueBindingManagerValueType } from './value-binding-manager.i'

type IContainerManagerPrivateType = (IContainerManager &
                                     {
                                       _classMappings: IClassMappingManager,
                                       _contextualBindings: IContextualBindingManager,
                                       _extenders: IExtenderManager,
                                       _rebindEvents: IRebindEventSource,
                                       _resolvedSymbols: IResolvedSymbolManager,
                                       _resolver: IResolver,
                                       _simpleBindings: ISimpleBindingManager,
                                       _valueBindings: IValueBindingManager
                                     });

const $p = (manager: IContainerManager) => (manager as IContainerManagerPrivateType)

describe('ContainerManager', () => {
  let ClassBindingEntry: ClassType<IClassBindingEntryConstructor>
  let ClassMappingManager: ClassType<IClassMappingManagerConstructor>
  let ContainerManager: ClassType<IContainerManagerConstructor>
  let ContextualBindingManager: ClassType<IContextualBindingManagerConstructor>
  let ExtenderManager: ClassType<IExtenderManagerConstructor>
  let FactoryBindingEntry: ClassType<IFactoryBindingEntryConstructor>
  let RebindEventObserver: ClassType<IRebindEventObserverConstructor>
  let RebindEventSource: ClassType<IRebindEventSourceConstructor>
  let ResolvedSymbolManager: ClassType<IResolvedSymbolManagerConstructor>
  let Resolver: ClassType<IResolverConstructor>
  let SimpleBindingManager: ClassType<ISimpleBindingManagerConstructor>
  let ValueBindingManager: ClassType<IValueBindingManagerConstructor>

  const createContainerManagerArguments = () => {
    const classMappings = new ClassMappingManager()
    const contextualBindings = new ContextualBindingManager()
    const extenders = new ExtenderManager()
    const rebindEvents = new RebindEventSource()
    const resolvedSymbols = new ResolvedSymbolManager()
    const simpleBindings = new SimpleBindingManager()
    const valueBindings = new ValueBindingManager()
    const resolver = new Resolver(classMappings, contextualBindings, extenders, resolvedSymbols, simpleBindings, valueBindings)
    return [
      classMappings,
      contextualBindings,
      extenders,
      rebindEvents,
      resolvedSymbols,
      resolver,
      simpleBindings,
      valueBindings
    ] as [
      IClassMappingManager,
      IContextualBindingManager,
      IExtenderManager,
      IRebindEventSource,
      IResolvedSymbolManager,
      IResolver,
      ISimpleBindingManager,
      IValueBindingManager
    ]
  }



  beforeEach(async () => {
    ClassBindingEntry = ((module) => module.default)(await import('./class-binding-entry'))
    ClassMappingManager = ((module) => module.default)(await import('./class-mapping-manager'))
    ContainerManager = ((module) => module.default)(await import('./container-manager'))
    ContextualBindingManager = ((module) => module.default)(await import('./contextual-binding-manager'))
    ExtenderManager = ((module) => module.default)(await import('./extender-manager'))
    FactoryBindingEntry = ((module) => module.default)(await import('./factory-binding-entry'))
    RebindEventObserver = ((module) => module.default)(await import('./rebind-event-observer'))
    RebindEventSource = ((module) => module.default)(await import('./rebind-event-source'))
    ResolvedSymbolManager = ((module) => module.default)(await import('./resolved-symbol-manager'))
    Resolver = ((module) => module.default)(await import('./resolver'))
    SimpleBindingManager = ((module) => module.default)(await import('./simple-binding-manager'))
    ValueBindingManager = ((module) => module.default)(await import('./value-binding-manager'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const managerArguments = createContainerManagerArguments()
    const manager = new ContainerManager(...managerArguments)
    const managerPrivate = $p(manager)
    expect(manager).toBeInstanceOf(ContainerManager)
    expect(managerPrivate._classMappings).toBeInstanceOf(ClassMappingManager)
    expect(managerPrivate._contextualBindings).toBeInstanceOf(ContextualBindingManager)
    expect(managerPrivate._extenders).toBeInstanceOf(ExtenderManager)
    expect(managerPrivate._rebindEvents).toBeInstanceOf(RebindEventSource)
    expect(managerPrivate._resolvedSymbols).toBeInstanceOf(ResolvedSymbolManager)
    expect(managerPrivate._resolver).toBeInstanceOf(Resolver)
    expect(managerPrivate._simpleBindings).toBeInstanceOf(SimpleBindingManager)
    expect(managerPrivate._valueBindings).toBeInstanceOf(ValueBindingManager)
  })



  test('#addClassBinding() :: proxies `SimpleBindingManager#set()` for a class', () => {
    const managerArguments = createContainerManagerArguments()
    const simpleBindings = managerArguments[6]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const entry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    const simpleBindingsSetSpy = jest.spyOn(simpleBindings, 'set')
    manager.addClassBinding(fooSymbol, entry, false)
    expect(simpleBindingsSetSpy).toHaveBeenCalledTimes(1)
    expect(simpleBindingsSetSpy).toHaveBeenCalledWith(fooSymbol, entry, false)
  })



  test('#addClassMapping() :: proxies `ClassMappingManager#set()`', () => {
    const managerArguments = createContainerManagerArguments()
    const classMappings = managerArguments[0]
    const manager = new ContainerManager(...managerArguments)
    const Foo = (class Foo
    {})
    const fooSymbol = Symbol('foo')
    const parameterSymbols = {}
    const classMappingsSetSpy = jest.spyOn(classMappings, 'set')
    manager.addClassMapping(fooSymbol, Foo, parameterSymbols)
    expect(classMappingsSetSpy).toHaveBeenCalledTimes(1)
    expect(classMappingsSetSpy).toHaveBeenCalledWith(Foo, fooSymbol, parameterSymbols)
  })



  test('#addContextualClassBinding() :: proxies `ContextualBindingManager#setDependent()` for a class', () => {
    const managerArguments = createContainerManagerArguments()
    const contextualBindings = managerArguments[1]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    const Foo = (class Foo
    {})
    const entry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    const contextualBindingsSetDependentSpy = jest.spyOn(contextualBindings, 'setDependent')
    manager.addContextualClassBinding(barSymbol, fooSymbol, entry)
    expect(contextualBindingsSetDependentSpy).toHaveBeenCalledTimes(1)
    expect(contextualBindingsSetDependentSpy).toHaveBeenCalledWith(barSymbol, fooSymbol, entry)
  })



  test('#addContextualFactoryBinding() :: proxies `ContextualBindingManager#setDependent()` for a factory', () => {
    const managerArguments = createContainerManagerArguments()
    const contextualBindings = managerArguments[1]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    const Foo = (class Foo
    {})
    const factory = (() => new Foo()) as IFactoryBindingEntryFactoryType<InstanceType<typeof Foo>>
    const entry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<typeof factory>
    const contextualBindingsSetDependentSpy = jest.spyOn(contextualBindings, 'setDependent')
    manager.addContextualFactoryBinding(barSymbol, fooSymbol, entry)
    expect(contextualBindingsSetDependentSpy).toHaveBeenCalledTimes(1)
    expect(contextualBindingsSetDependentSpy).toHaveBeenCalledWith(barSymbol, fooSymbol, entry)
  })



  test('#addExtender() :: proxies `ExtenderManager#add()`', () => {
    const managerArguments = createContainerManagerArguments()
    const extenders = managerArguments[2]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const extender = (value: IExtenderManagerValueType) => ({ value })
    const extendersAddSpy = jest.spyOn(extenders, 'add')
    manager.addExtender(fooSymbol, extender)
    expect(extendersAddSpy).toHaveBeenCalledTimes(1)
    expect(extendersAddSpy).toHaveBeenCalledWith(fooSymbol, extender)
  })



  test('#addFactoryBinding() :: proxies `SimpleBindingManager#set()` for a factory', () => {
    const managerArguments = createContainerManagerArguments()
    const simpleBindings = managerArguments[6]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = (() => new Foo()) as IFactoryBindingEntryFactoryType<InstanceType<typeof Foo>>
    const entry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<typeof factory>
    const simpleBindingsSetSpy = jest.spyOn(simpleBindings, 'set')
    manager.addFactoryBinding(fooSymbol, entry, false)
    expect(simpleBindingsSetSpy).toHaveBeenCalledTimes(1)
    expect(simpleBindingsSetSpy).toHaveBeenCalledWith(fooSymbol, entry, false)
  })



  test('#addRebindEventObserver() :: proxies `RebindEventSource#addObserver()`', () => {
    const managerArguments = createContainerManagerArguments()
    const rebindEvents = managerArguments[3]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const observer = new RebindEventObserver(() => {})
    const rebindEventsAddObserverSpy = jest.spyOn(rebindEvents, 'addObserver')
    manager.addRebindEventObserver(fooSymbol, observer)
    expect(rebindEventsAddObserverSpy).toHaveBeenCalledTimes(1)
    expect(rebindEventsAddObserverSpy).toHaveBeenCalledWith(fooSymbol, observer)
  })



  test('#addValueBinding() :: proxies `ValueBindingManager#set()`', () => {
    const managerArguments = createContainerManagerArguments()
    const valueBindings = managerArguments[7]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    const valueBindingsSetSpy = jest.spyOn(valueBindings, 'set')
    manager.addValueBinding(fooSymbol, foo)
    expect(valueBindingsSetSpy).toHaveBeenCalledTimes(1)
    expect(valueBindingsSetSpy).toHaveBeenCalledWith(fooSymbol, foo)
  })



  test('#clearAll() :: proxies all relevant method calls to clear the instance', () => {
    const managerArguments = createContainerManagerArguments()
    const classMappings = managerArguments[0]
    const contextualBindings = managerArguments[1]
    const extenders = managerArguments[2]
    const rebindEvents = managerArguments[3]
    const resolvedSymbols = managerArguments[4]
    const simpleBindings = managerArguments[6]
    const valueBindings = managerArguments[7]
    const manager = new ContainerManager(...managerArguments)
    const classMappingsClearSpy = jest.spyOn(classMappings, 'clear')
    const contextualBindingsClearSpy = jest.spyOn(contextualBindings, 'clear')
    const extendersClearSpy = jest.spyOn(extenders, 'clear')
    const rebindEventsClearObserversSpy = jest.spyOn(rebindEvents, 'clearObservers')
    const resolvedSymbolsClearSpy = jest.spyOn(resolvedSymbols, 'clear')
    const simpleBindingsClearSpy = jest.spyOn(simpleBindings, 'clear')
    const valueBindingsClearSpy = jest.spyOn(valueBindings, 'clear')
    manager.clearAll()
    expect(valueBindingsClearSpy).toHaveBeenCalledTimes(1)
    expect(simpleBindingsClearSpy).toHaveBeenCalledTimes(1)
    expect(resolvedSymbolsClearSpy).toHaveBeenCalledTimes(1)
    expect(rebindEventsClearObserversSpy).toHaveBeenCalledTimes(1)
    expect(extendersClearSpy).toHaveBeenCalledTimes(1)
    expect(contextualBindingsClearSpy).toHaveBeenCalledTimes(1)
    expect(classMappingsClearSpy).toHaveBeenCalledTimes(1)
  })



  test('#containsResolvedSymbol() :: proxies `ResolvedSymbolManager#contains()`', () => {
    const managerArguments = createContainerManagerArguments()
    const resolvedSymbols = managerArguments[4]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const resolvedSymbolsContainsSpy = jest.spyOn(resolvedSymbols, 'contains')
    const valueFound = manager.containsResolvedSymbol(fooSymbol)
    expect(resolvedSymbolsContainsSpy).toHaveBeenCalledTimes(1)
    expect(resolvedSymbolsContainsSpy).toHaveBeenCalledWith(fooSymbol)
    expect(resolvedSymbolsContainsSpy).toHaveReturnedWith(valueFound)
  })



  test('#containsSimpleBinding() :: proxies `SimpleBindingManager#contains()`', () => {
    const managerArguments = createContainerManagerArguments()
    const simpleBindings = managerArguments[6]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const simpleBindingsContainsSpy = jest.spyOn(simpleBindings, 'contains')
    const keyFound = manager.containsSimpleBinding(fooSymbol)
    expect(simpleBindingsContainsSpy).toHaveBeenCalledTimes(1)
    expect(simpleBindingsContainsSpy).toHaveBeenCalledWith(fooSymbol)
    expect(simpleBindingsContainsSpy).toHaveReturnedWith(keyFound)
  })



  test('#containsValueBinding() :: proxies `ValueBindingManager#contains()`', () => {
    const managerArguments = createContainerManagerArguments()
    const valueBindings = managerArguments[7]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const valueBindingsContainsSpy = jest.spyOn(valueBindings, 'contains')
    const keyFound = manager.containsValueBinding(fooSymbol)
    expect(valueBindingsContainsSpy).toHaveBeenCalledTimes(1)
    expect(valueBindingsContainsSpy).toHaveBeenCalledWith(fooSymbol)
    expect(valueBindingsContainsSpy).toHaveReturnedWith(keyFound)
  })



  test('#getValueBinding() :: proxies `ValueBindingManager#get()`', () => {
    const managerArguments = createContainerManagerArguments()
    const valueBindings = managerArguments[7]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const valueBindingsGetSpy = jest.spyOn(valueBindings, 'get')
    const foo = manager.getValueBinding(fooSymbol) as IValueBindingManagerValueType
    expect(valueBindingsGetSpy).toHaveBeenCalledTimes(1)
    expect(valueBindingsGetSpy).toHaveBeenCalledWith(fooSymbol)
    expect(valueBindingsGetSpy).toHaveReturnedWith(foo)
  })



  test('#removeValueBinding() :: proxies `ValueBindingManager#unset()`', () => {
    const managerArguments = createContainerManagerArguments()
    const valueBindings = managerArguments[7]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const valueBindingsUnsetSpy = jest.spyOn(valueBindings, 'unset')
    manager.removeValueBinding(fooSymbol)
    expect(valueBindingsUnsetSpy).toHaveBeenCalledTimes(1)
    expect(valueBindingsUnsetSpy).toHaveBeenCalledWith(fooSymbol)
  })



  test('#resolveValue() :: proxies `Resolver#resolve()`', () => {
    const managerArguments = createContainerManagerArguments()
    const resolver = managerArguments[5]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    manager.addValueBinding(fooSymbol, foo)
    const parameters = {}
    const resolverResolveSpy = jest.spyOn(resolver, 'resolve') as jest.SpyInstance<IResolverResolveValueType<undefined>, [ symbol, IResolverParametersType ]>
    manager.resolveValue<typeof foo>(fooSymbol, parameters)
    expect(resolverResolveSpy).toHaveBeenCalledTimes(1)
    expect(resolverResolveSpy).toHaveBeenCalledWith(fooSymbol, parameters)
    expect(resolverResolveSpy).toHaveReturnedWith(foo)
  })



  test('#triggerRebindEvent() :: proxies `RebindEventSource#triggerEvent()`', () => {
    const managerArguments = createContainerManagerArguments()
    const rebindEvents = managerArguments[3]
    const manager = new ContainerManager(...managerArguments)
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const valueCallback = () => new Foo()
    const rebindEventsTriggerEventSpy = jest.spyOn(rebindEvents, 'triggerEvent')
    manager.triggerRebindEvent(fooSymbol, valueCallback)
    expect(rebindEventsTriggerEventSpy).toHaveBeenCalledTimes(1)
    expect(rebindEventsTriggerEventSpy).toHaveBeenCalledWith(fooSymbol, valueCallback)
  })
})
