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

import type IClassBindingEntry from './class-binding-entry.i'
import type { IClassBindingEntryClassSuperType } from './class-binding-entry.i'
import type IClassMappingManager from './class-mapping-manager.i'
import type { IClassMappingManagerClassSuperType } from './class-mapping-manager.i'
import type { IClassMappingManagerClassType } from './class-mapping-manager.i'
import type { IClassMappingManagerConstructorParameterSymbolsType } from './class-mapping-manager.i'
import type IContainerManager from './container-manager.i'
import type IContainerManagerConstructor from './container-manager-constructor.i'
import type IContextualBindingManager from './contextual-binding-manager.i'
import type IExtenderManager from './extender-manager.i'
import type { IExtenderManagerExtenderFunctionType } from './extender-manager.i'
import type IFactoryBindingEntry from './factory-binding-entry.i'
import type IRebindEventObserver from './rebind-event-observer.i'
import type IRebindEventSource from './rebind-event-source.i'
import type { IRebindEventSourceTriggerEventValueCallbackType } from './rebind-event-source.i'
import type IResolvedSymbolManager from './resolved-symbol-manager.i'
import type IResolver from './resolver.i'
import type { IResolverParametersType } from './resolver.i'
import type ISimpleBindingManager from './simple-binding-manager.i'
import type IValueBindingManager from './value-binding-manager.i'
import type { IValueBindingManagerValueType } from './value-binding-manager.i'

const ContainerManager: IContainerManagerConstructor =
  class ContainerManager
    implements IContainerManager
  {
    private _classMappings: IClassMappingManager
    private _contextualBindings: IContextualBindingManager
    private _extenders: IExtenderManager
    private _rebindEvents: IRebindEventSource
    private _resolvedSymbols: IResolvedSymbolManager
    private _resolver: IResolver
    private _simpleBindings: ISimpleBindingManager
    private _valueBindings: IValueBindingManager

    public constructor(classMappings: IClassMappingManager,
                       contextualBindings: IContextualBindingManager,
                       extenders: IExtenderManager,
                       rebindEvents: IRebindEventSource,
                       resolvedSymbols: IResolvedSymbolManager,
                       resolver: IResolver,
                       simpleBindings: ISimpleBindingManager,
                       valueBindings: IValueBindingManager)
    {
      this._classMappings = classMappings
      this._contextualBindings = contextualBindings
      this._extenders = extenders
      this._rebindEvents = rebindEvents
      this._resolvedSymbols = resolvedSymbols
      this._resolver = resolver
      this._simpleBindings = simpleBindings
      this._valueBindings = valueBindings

      Object.defineProperties(this, {
        _classMappings: { enumerable: false },
        _contextualBindings: { enumerable: false },
        _extenders: { enumerable: false },
        _rebindEvents: { enumerable: false },
        _resolvedSymbols: { enumerable: false },
        _resolver: { enumerable: false },
        _simpleBindings: { enumerable: false },
        _valueBindings: { enumerable: false }
      })
    }

    public addClassBinding<IClassBindingEntryClassTypeT extends IClassBindingEntryClassSuperType>(key: symbol,
                                                                                                  entry: IClassBindingEntry<IClassBindingEntryClassTypeT>,
                                                                                                  shouldResolveOnce: boolean)
    {
      this._simpleBindings.set(key, entry, shouldResolveOnce)
    }

    public addClassMapping<IClassMappingManagerClassTypeT extends IClassMappingManagerClassSuperType>(key: symbol,
                                                                                                      class_: IClassMappingManagerClassType<IClassMappingManagerClassTypeT>,
                                                                                                      parameterSymbols: IClassMappingManagerConstructorParameterSymbolsType)
    {
      this._classMappings.set(class_, key, parameterSymbols)
    }

    public addContextualClassBinding<IClassBindingEntryClassTypeT extends IClassBindingEntryClassSuperType>(key: symbol,
                                                                                                            dependentKey: symbol,
                                                                                                            entry: IClassBindingEntry<IClassBindingEntryClassTypeT>)
    {
      this._contextualBindings.setDependent(key, dependentKey, entry)
    }

    public addContextualFactoryBinding<IFactoryBindingEntryFactoryTypeT>(key: symbol,
                                                                         dependentKey: symbol,
                                                                         entry: IFactoryBindingEntry<IFactoryBindingEntryFactoryTypeT>)
    {
      this._contextualBindings.setDependent(key, dependentKey, entry)
    }

    public addExtender(key: symbol,
                       function_: IExtenderManagerExtenderFunctionType)
    {
      this._extenders.add(key, function_)
    }

    public addFactoryBinding<IFactoryBindingEntryFactoryTypeT>(key: symbol,
                                                               entry: IFactoryBindingEntry<IFactoryBindingEntryFactoryTypeT>,
                                                               shouldResolveOnce: boolean)
    {
      this._simpleBindings.set(key, entry, shouldResolveOnce)
    }

    public addRebindEventObserver(key: symbol,
                                  observer: IRebindEventObserver)
    {
      this._rebindEvents.addObserver(key, observer)
    }

    public addValueBinding(key: symbol,
                           value: IValueBindingManagerValueType)
    {
      this._valueBindings.set(key, value)
    }

    public clearAll()
    {
      this._classMappings.clear()
      this._contextualBindings.clear()
      this._extenders.clear()
      this._rebindEvents.clearObservers()
      this._resolvedSymbols.clear()
      this._simpleBindings.clear()
      this._valueBindings.clear()
    }

    public containsResolvedSymbol(value: symbol)
    {
      return this._resolvedSymbols.contains(value)
    }

    public containsSimpleBinding(key: symbol)
    {
      return this._simpleBindings.contains(key)
    }

    public containsValueBinding(key: symbol)
    {
      return this._valueBindings.contains(key)
    }

    public getValueBinding(key: symbol)
    {
      return this._valueBindings.get(key)
    }

    public removeValueBinding(key: symbol)
    {
      this._valueBindings.unset(key)
    }

    public resolveValue<ResolveValueTypeT>(key: symbol,
                                           parameters: IResolverParametersType)
    {
      return this._resolver.resolve<ResolveValueTypeT>(key, parameters)
    }

    public triggerRebindEvent(key: symbol,
                              valueCallback: IRebindEventSourceTriggerEventValueCallbackType)
    {
      this._rebindEvents.triggerEvent(key, valueCallback)
    }
  }

Object.defineProperties(ContainerManager.prototype, {
  constructor: { enumerable: true },

  addClassBinding: { enumerable: true },
  addClassMapping: { enumerable: true },
  addContextualClassBinding: { enumerable: true },
  addContextualFactoryBinding: { enumerable: true },
  addExtender: { enumerable: true },
  addFactoryBinding: { enumerable: true },
  addRebindEventObserver: { enumerable: true },
  addValueBinding: { enumerable: true },
  clearAll: { enumerable: true },
  containsResolvedSymbol: { enumerable: true },
  containsSimpleBinding: { enumerable: true },
  containsValueBinding: { enumerable: true },
  getValueBinding: { enumerable: true },
  removeValueBinding: { enumerable: true },
  resolveValue: { enumerable: true },
  triggerRebindEvent: { enumerable: true }
})

export default ContainerManager
