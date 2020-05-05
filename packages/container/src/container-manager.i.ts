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
import type { IClassMappingManagerClassSuperType } from './class-mapping-manager.i'
import type { IClassMappingManagerClassType } from './class-mapping-manager.i'
import type { IClassMappingManagerConstructorParameterSymbolsType } from './class-mapping-manager.i'
import type { IExtenderManagerExtenderFunctionType } from './extender-manager.i'
import type IFactoryBindingEntry from './factory-binding-entry.i'
import type IRebindEventObserver from './rebind-event-observer.i'
import type { IRebindEventSourceTriggerEventValueCallbackType } from './rebind-event-source.i'
import type { IResolverParametersType } from './resolver.i'
import type { IResolverResolveValueType } from './resolver.i'
import type { IValueBindingManagerValueType } from './value-binding-manager.i'

interface IContainerManager
{
  addClassBinding<IClassBindingEntryClassTypeT extends IClassBindingEntryClassSuperType>(key: symbol,
                                                                                         entry: IClassBindingEntry<IClassBindingEntryClassTypeT>,
                                                                                         shouldResolveOnce: boolean): void

  addClassMapping<IClassMappingManagerClassTypeT extends IClassMappingManagerClassSuperType>(key: symbol,
                                                                                             class_: IClassMappingManagerClassType<IClassMappingManagerClassTypeT>,
                                                                                             parameterSymbols: IClassMappingManagerConstructorParameterSymbolsType): void

  addContextualClassBinding<IClassBindingEntryClassTypeT extends IClassBindingEntryClassSuperType>(key: symbol,
                                                                                                   dependentKey: symbol,
                                                                                                   entry: IClassBindingEntry<IClassBindingEntryClassTypeT>): void

  addContextualFactoryBinding<IFactoryBindingEntryFactoryTypeT>(key: symbol,
                                                                dependentKey: symbol,
                                                                entry: IFactoryBindingEntry<IFactoryBindingEntryFactoryTypeT>): void

  addExtender(key: symbol,
              function_: IExtenderManagerExtenderFunctionType): void

  addFactoryBinding<IFactoryBindingEntryFactoryTypeT>(key: symbol,
                                                      entry: IFactoryBindingEntry<IFactoryBindingEntryFactoryTypeT>,
                                                      shouldResolveOnce: boolean): void

  addRebindEventObserver(key: symbol,
                         observer: IRebindEventObserver): void

  addValueBinding(key: symbol,
                  value: IValueBindingManagerValueType): void

  clearAll(): void

  containsResolvedSymbol(value: symbol): boolean

  containsSimpleBinding(key: symbol): boolean

  containsValueBinding(key: symbol): boolean

  getValueBinding(key: symbol): (IValueBindingManagerValueType |
                                 undefined)

  removeValueBinding(key: symbol): void

  resolveValue<ResolveValueTypeT>(key: symbol,
                                  parameters: IResolverParametersType): IResolverResolveValueType<ResolveValueTypeT>

  triggerRebindEvent(key: symbol,
                     valueCallback: IRebindEventSourceTriggerEventValueCallbackType): void
}

export default IContainerManager
