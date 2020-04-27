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

import _$isEmpty from 'lodash/isEmpty'
import type { IResolverBindingValueType as BindingValueType } from './resolver.i'
import type { IResolverClassSuperType as ClassSuperType } from './resolver.i'
import type { IResolverClassType as ClassType } from './resolver.i'
import type { IResolverFactoryType as FactoryType } from './resolver.i'
import type IBindingEntry from './binding-entry.i'
import type IClassBindingEntry from './class-binding-entry.i'
import type IClassMappingManager from './class-mapping-manager.i'
import type IContextualBindingManager from './contextual-binding-manager.i'
import type IExtenderManager from './extender-manager.i'
import type IFactoryBindingEntry from './factory-binding-entry.i'
import type IResolvedSymbolManager from './resolved-symbol-manager.i'
import type IResolver from './resolver.i'
import type IResolverConstructor from './resolver-constructor.i'
import type ISimpleBindingManager from './simple-binding-manager.i'
import type IValueBindingManager from './value-binding-manager.i'
import type { IResolverParametersType as ParametersType } from './resolver.i'
import ResolutionFailedError from './errors/resolver/resolution-failed'
import type { IResolverResolveValueType as ResolveValueType } from './resolver.i'

const objectHasOwnProperty = (object: object,
                              property: (string |
                                         number |
                                         symbol)) => Object.prototype.hasOwnProperty.call(object, property)

const Resolver: IResolverConstructor =
  class Resolver
    implements IResolver
  {
    private _classMappings: IClassMappingManager
    private _classStack: ClassType<any>[]
    private _contextualBindings: IContextualBindingManager
    private _extenders: IExtenderManager
    private _parametersStack: ParametersType[]
    private _resolvedSymbols: IResolvedSymbolManager
    private _simpleBindings: ISimpleBindingManager
    private _valueBindings: IValueBindingManager

    private get _classStackSize()
    {
      return this._classStack.length
    }

    private get _classStackTop()
    {
      const { _classStackTopIndex: topIndex } = this
      return (topIndex !== null) ?
        this._classStack[topIndex] :
        null
    }

    private get _classStackTopIndex()
    {
      const { _classStackSize: stackSize } = this
      return (stackSize !== 0) ?
        (stackSize - 1) :
        null
    }

    private get _currentClass()
    {
      return this._classStackTop
    }

    private get _currentParameters()
    {
      return this._parametersStackTop
    }

    private get _parametersStackSize()
    {
      return this._parametersStack.length
    }

    private get _parametersStackTop()
    {
      const { _parametersStackTopIndex: topIndex } = this
      return (topIndex !== null) ?
        this._parametersStack[topIndex] :
        null
    }

    private get _parametersStackTopIndex()
    {
      const { _parametersStackSize: stackSize } = this
      return (stackSize !== 0) ?
        (stackSize - 1) :
        null
    }

    public constructor(classMappings: IClassMappingManager,
                       contextualBindings: IContextualBindingManager,
                       extenders: IExtenderManager,
                       resolvedSymbols: IResolvedSymbolManager,
                       simpleBindings: ISimpleBindingManager,
                       valueBindings: IValueBindingManager)
    {
      this._classMappings = classMappings
      this._classStack = []
      this._contextualBindings = contextualBindings
      this._extenders = extenders
      this._parametersStack = []
      this._resolvedSymbols = resolvedSymbols
      this._simpleBindings = simpleBindings
      this._valueBindings = valueBindings

      Object.defineProperties(this, {
        _classMappings: { enumerable: false },
        _classStack: { enumerable: false },
        _contextualBindings: { enumerable: false },
        _extenders: { enumerable: false },
        _parametersStack: { enumerable: false },
        _resolvedSymbols: { enumerable: false },
        _simpleBindings: { enumerable: false },
        _valueBindings: { enumerable: false }
      })
    }

    private _build(entry: IBindingEntry)
    {
      if (entry.hasClass()) {
        const class_ = (entry as IClassBindingEntry<any>).getClass()
        return this._buildClass(class_)
      } else {
        const factory = (entry as IFactoryBindingEntry<BindingValueType>).getFactory()
        return this._buildFactory(factory)
      }
    }

    private _buildClass(class_: ClassType<any>)
    {
      const classMapping = this._classMappings.get(class_)!
      const { parameterNames: constructorParameterNames } = classMapping
      if (constructorParameterNames.length === 0) {
        return new class_() as object
      }
      const parameters = this._currentParameters!
      const { parameterSymbols: constructorParameterMappings } = classMapping
      const constructorParameters = constructorParameterNames.map((parameterName) => {
        if (objectHasOwnProperty(parameters, parameterName)) {
          return parameters[parameterName]
        } else if (objectHasOwnProperty(constructorParameterMappings, parameterName)) {
          const parameterKey = constructorParameterMappings[parameterName]
          this._pushOntoClassStack(class_)
          let value: BindingValueType
          try {
            value = this.resolve(parameterKey, {})
          } catch (error) {
            if (error instanceof ResolutionFailedError) {
              this._popOffClassStack()
            }
            throw error
          }
          this._popOffClassStack()
          return value
        } else {
          throw new ResolutionFailedError(`Could not resolve a value for parameter {${parameterName}} of constructor {${class_.name}}.`, this)
        }
      })
      return new class_(...constructorParameters) as object
    }

    private _buildFactory(factory: FactoryType<BindingValueType>)
    {
      const parameters = this._currentParameters!
      return factory(parameters)
    }

    private _popOffClassStack()
    {
      const class_ = this._classStack.pop()
      return (typeof class_ !== 'undefined') ?
        class_ :
        null
    }

    private _popOffParametersStack()
    {
      const parameters = this._parametersStack.pop()
      return (typeof parameters !== 'undefined') ?
        parameters :
        null
    }

    private _pushOntoClassStack<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>)
    {
      this._classStack.push(class_)
    }

    private _pushOntoParametersStack(parameters: ParametersType)
    {
      this._parametersStack.push(parameters)
    }

    public getClassStack()
    {
      return [ ...this._classStack ]
    }

    public getParametersStack()
    {
      return [ ...this._parametersStack ]
    }

    public resolve<ResolveValueTypeT>(key: symbol,
                                      parameters: ParametersType)
    {
      const { _currentClass: currentClass } = this
      let contextualBindingEntry: (IBindingEntry |
                                   null)
      if (currentClass !== null) {
        const currentClassSymbol = this._classMappings.getSymbol(currentClass)!
        contextualBindingEntry = this._contextualBindings.getDependent(currentClassSymbol, key)
      } else {
        contextualBindingEntry = null
      }
      const contextualBindingEntryFound = (contextualBindingEntry !== null)
      const contextualBuildNeeded = ((! _$isEmpty(parameters)) ||
                                     contextualBindingEntryFound)
      if (this._valueBindings.contains(key) &&
          (! contextualBuildNeeded)) {
        return this._valueBindings.get(key) as ResolveValueType<ResolveValueTypeT>
      }
      const bindingEntry = contextualBindingEntryFound ?
        contextualBindingEntry! :
        this._simpleBindings.get(key)
      if (bindingEntry === null) {
        const keyString = key.toString()
        throw new ResolutionFailedError(`Could not find a binding for symbol {${keyString}}.`, this)
      }
      this._pushOntoParametersStack(parameters)
      let value: BindingValueType
      try {
        value = this._build(bindingEntry) as BindingValueType
      } catch (error) {
        if (error instanceof ResolutionFailedError) {
          this._popOffParametersStack()
        }
        throw error
      }
      this._popOffParametersStack()
      if (this._extenders.contains(key)) {
        const extenders = this._extenders.getFunctions(key)!
        for (const extender of extenders) {
          value = extender(value)
        }
      }
      const shouldResolveOnce = ((! contextualBindingEntryFound) &&
                                 this._simpleBindings.shouldResolveOnce(key)!)
      if (shouldResolveOnce &&
          (! contextualBuildNeeded)) {
        this._valueBindings.set(key, value)
      }
      this._resolvedSymbols.add(key)
      return value as ResolveValueType<ResolveValueTypeT>
    }
  }

Object.defineProperties(Resolver.prototype, {
  constructor: { enumerable: true },

  getClassStack: { enumerable: true },
  getParametersStack: { enumerable: true },
  resolve: { enumerable: true }
})

export default Resolver
