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
import ClassBindingEntry from './class-binding-entry'
import ClassMappingManager from './class-mapping-manager'
import type { IContainerClassSuperType as ClassSuperType } from './container.i'
import type { IContainerClassType as ClassType } from './container.i'
import type { IContainerConstructorParameterSymbolsType as ConstructorParameterSymbolsType } from './container.i'
import ContainerManager from './container-manager'
import ContextualBindingManager from './contextual-binding-manager'
import type { IContainerExtenderFunctionType as ExtenderFunctionType } from './container.i'
import ExtenderManager from './extender-manager'
import FactoryBindingEntry from './factory-binding-entry'
import type { IContainerFactoryType as FactoryType } from './container.i'
import type IContainer from './container.i'
import type IContainerConstructor from './container-constructor.i'
import type IContainerManager from './container-manager.i'
import type { IContainerRebindEventHandlerType as RebindEventHandlerType } from './container.i'
import RebindEventObserver from './rebind-event-observer'
import RebindEventSource from './rebind-event-source'
import ResolvedSymbolManager from './resolved-symbol-manager'
import type { IContainerResolveParametersType as ResolveParametersType } from './container.i'
import Resolver from './resolver'
import SimpleBindingManager from './simple-binding-manager'
import ValueBindingManager from './value-binding-manager'

let _getStaticContainerGetInstance: () => IContainer

class Container
  implements IContainer
{
  private _manager: IContainerManager

  public static getInstance()
  {
    return _getStaticContainerGetInstance()
  }

  public constructor()
  {
    const classMappings = new ClassMappingManager()
    const contextualBindings = new ContextualBindingManager()
    const extenders = new ExtenderManager()
    const rebindEvents = new RebindEventSource()
    const resolvedSymbols = new ResolvedSymbolManager()
    const simpleBindings = new SimpleBindingManager()
    const valueBindings = new ValueBindingManager()
    const resolver = new Resolver(classMappings, contextualBindings, extenders, resolvedSymbols, simpleBindings, valueBindings)

    this._manager = new ContainerManager(classMappings, contextualBindings, extenders, rebindEvents, resolvedSymbols, resolver, simpleBindings, valueBindings)

    Object.defineProperties(this, {
      _manager: { enumerable: false }
    })
  }

  private _triggerRebindEvent(key: symbol)
  {
    this._manager.triggerRebindEvent(key, () => {
      return this.resolve(key)
    })
  }

  public addRebindEventHandler(key: symbol,
                               handler: RebindEventHandlerType)
  {
    const observer = new RebindEventObserver((value) => {
      handler(this, value)
    })
    this._manager.addRebindEventObserver(key, observer)
    if (this.isBound(key)) {
      this.resolve(key)
    }
  }

  public bindClass<ClassTypeT extends ClassSuperType>(key: symbol,
                                                      class_: ClassType<ClassTypeT>,
                                                      parameterSymbols?: ConstructorParameterSymbolsType,
                                                      shouldResolveOnce?: boolean)
  {
    if (typeof parameterSymbols === 'undefined') {
      parameterSymbols = {}
    }
    if (typeof shouldResolveOnce === 'undefined') {
      shouldResolveOnce = false
    }

    this._manager.addClassMapping(key, class_, parameterSymbols)
    this._manager.removeValueBinding(key)
    const entry = new ClassBindingEntry(class_)
    this._manager.addClassBinding(key, entry, shouldResolveOnce)
    if (this.hasResolved(key)) {
      this._triggerRebindEvent(key)
    }
  }

  public bindFactory<FactoryTypeT>(key: symbol,
                                   factory: FactoryType<FactoryTypeT>,
                                   shouldResolveOnce?: boolean)
  {
    if (typeof shouldResolveOnce === 'undefined') {
      shouldResolveOnce = false
    }

    this._manager.removeValueBinding(key)
    const entry = new FactoryBindingEntry((parameters) => {
      return factory(this, parameters)
    })
    this._manager.addFactoryBinding(key, entry, shouldResolveOnce)
    if (this.hasResolved(key)) {
      this._triggerRebindEvent(key)
    }
  }

  public bindValue(key: symbol,
                   value: BindingValueType)
  {
    const keyBound = this.isBound(key)
    this._manager.addValueBinding(key, value)
    if (keyBound) {
      this._triggerRebindEvent(key)
    }
  }

  public contextuallyBindClass<ClassTypeT extends ClassSuperType>(key: symbol,
                                                                  dependentKey: symbol,
                                                                  class_: ClassType<ClassTypeT>,
                                                                  parameterSymbols?: ConstructorParameterSymbolsType)
  {
    if (typeof parameterSymbols === 'undefined') {
      parameterSymbols = {}
    }

    this._manager.addClassMapping(dependentKey, class_, parameterSymbols)
    const entry = new ClassBindingEntry(class_)
    this._manager.addContextualClassBinding(key, dependentKey, entry)
  }

  public contextuallyBindFactory<FactoryTypeT>(key: symbol,
                                               dependentKey: symbol,
                                               factory: FactoryType<FactoryTypeT>)
  {
    const entry = new FactoryBindingEntry((parameters) => {
      return factory(this, parameters)
    })
    this._manager.addContextualFactoryBinding(key, dependentKey, entry)
  }

  public empty()
  {
    this._manager.clearAll()
  }

  public extend(key: symbol,
                extender: ExtenderFunctionType)
  {
    if (this._manager.containsValueBinding(key)) {
      let value = this._manager.getValueBinding(key) as BindingValueType
      value = extender(value, this)
      this._manager.addValueBinding(key, value)
      this._triggerRebindEvent(key)
    } else {
      this._manager.addExtender(key, (value) => {
        return extender(value, this)
      })
      if (this.hasResolved(key)) {
        this._triggerRebindEvent(key)
      }
    }
  }

  public hasResolved(key: symbol)
  {
    return (this._manager.containsResolvedSymbol(key) ||
            this._manager.containsValueBinding(key))
  }

  public isBound(key: symbol)
  {
    return (this._manager.containsSimpleBinding(key) ||
            this._manager.containsValueBinding(key))
  }

  public resolve<ResolveValueTypeT = undefined>(key: symbol,
                                                parameters?: ResolveParametersType)
  {
    if (typeof parameters === 'undefined') {
      parameters = {}
    }

    return this._manager.resolveValue<ResolveValueTypeT>(key, parameters)
  }
}

_getStaticContainerGetInstance = ((Container) => {
  const value = new Container()
  return () => value
})(Container)

Object.defineProperties(Container, {
  getInstance: { enumerable: true }
})

Object.defineProperties(Container.prototype, {
  constructor: { enumerable: true },

  addRebindEventHandler: { enumerable: true },
  bindClass: { enumerable: true },
  bindFactory: { enumerable: true },
  bindValue: { enumerable: true },
  contextuallyBindClass: { enumerable: true },
  contextuallyBindFactory: { enumerable: true },
  empty: { enumerable: true },
  extend: { enumerable: true },
  hasResolved: { enumerable: true },
  isBound: { enumerable: true },
  resolve: { enumerable: true }
})

export default (Container as IContainerConstructor)
