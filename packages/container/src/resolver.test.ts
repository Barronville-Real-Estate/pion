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

import type { IResolverClassType as ClassType } from './resolver.i'
import type IClassBindingEntry from './class-binding-entry.i'
import type IClassBindingEntryConstructor from './class-binding-entry-constructor.i'
import type IClassMappingManager from './class-mapping-manager.i'
import type IClassMappingManagerConstructor from './class-mapping-manager-constructor.i'
import type IContextualBindingManager from './contextual-binding-manager.i'
import type IContextualBindingManagerConstructor from './contextual-binding-manager-constructor.i'
import type IExtenderManager from './extender-manager.i'
import type IExtenderManagerConstructor from './extender-manager-constructor.i'
import type { IExtenderManagerValueType } from './extender-manager.i'
import type IFactoryBindingEntry from './factory-binding-entry.i'
import type IFactoryBindingEntryConstructor from './factory-binding-entry-constructor.i'
import type { IFactoryBindingEntryFactoryType } from './factory-binding-entry.i'
import type IResolvedSymbolManager from './resolved-symbol-manager.i'
import type IResolvedSymbolManagerConstructor from './resolved-symbol-manager-constructor.i'
import type IResolver from './resolver.i'
import type IResolverConstructor from './resolver-constructor.i'
import type ISimpleBindingManager from './simple-binding-manager.i'
import type ISimpleBindingManagerConstructor from './simple-binding-manager-constructor.i'
import type IValueBindingManager from './value-binding-manager.i'
import type IValueBindingManagerConstructor from './value-binding-manager-constructor.i'
import type { IResolverParametersType as ParametersType } from './resolver.i'

type IResolverPrivateType = (IResolver &
                             {
                               _classMappings: IClassMappingManager,
                               _classStack: ClassType<any>[],
                               _contextualBindings: IContextualBindingManager,
                               _extenders: IExtenderManager,
                               _parametersStack: ParametersType[],
                               _resolvedSymbols: IResolvedSymbolManager,
                               _simpleBindings: ISimpleBindingManager,
                               _valueBindings: IValueBindingManager
                             });

const $p = (resolver: IResolver) => (resolver as IResolverPrivateType)

describe('Resolver', () => {
  let ClassBindingEntry: ClassType<IClassBindingEntryConstructor>
  let ClassMappingManager: ClassType<IClassMappingManagerConstructor>
  let ContextualBindingManager: ClassType<IContextualBindingManagerConstructor>
  let ExtenderManager: ClassType<IExtenderManagerConstructor>
  let FactoryBindingEntry: ClassType<IFactoryBindingEntryConstructor>
  let ResolvedSymbolManager: ClassType<IResolvedSymbolManagerConstructor>
  let Resolver: ClassType<IResolverConstructor>
  let SimpleBindingManager: ClassType<ISimpleBindingManagerConstructor>
  let ValueBindingManager: ClassType<IValueBindingManagerConstructor>

  const createResolverArguments = () => {
    const classMappings = new ClassMappingManager()
    const contextualBindings = new ContextualBindingManager()
    const extenders = new ExtenderManager()
    const resolvedSymbols = new ResolvedSymbolManager()
    const simpleBindings = new SimpleBindingManager()
    const valueBindings = new ValueBindingManager()
    return [
      classMappings,
      contextualBindings,
      extenders,
      resolvedSymbols,
      simpleBindings,
      valueBindings
    ] as [
      IClassMappingManager,
      IContextualBindingManager,
      IExtenderManager,
      IResolvedSymbolManager,
      ISimpleBindingManager,
      IValueBindingManager
    ]
  }



  beforeEach(async () => {
    ClassBindingEntry = ((module) => module.default)(await import('./class-binding-entry'))
    ClassMappingManager = ((module) => module.default)(await import('./class-mapping-manager'))
    ContextualBindingManager = ((module) => module.default)(await import('./contextual-binding-manager'))
    ExtenderManager = ((module) => module.default)(await import('./extender-manager'))
    FactoryBindingEntry = ((module) => module.default)(await import('./factory-binding-entry'))
    ResolvedSymbolManager = ((module) => module.default)(await import('./resolved-symbol-manager'))
    Resolver = ((module) => module.default)(await import('./resolver'))
    SimpleBindingManager = ((module) => module.default)(await import('./simple-binding-manager'))
    ValueBindingManager = ((module) => module.default)(await import('./value-binding-manager'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const resolverArguments = createResolverArguments()
    const resolver = new Resolver(...resolverArguments)
    const resolverPrivate = $p(resolver)
    expect(resolver).toBeInstanceOf(Resolver)
    expect(resolverPrivate._classMappings).toBeInstanceOf(ClassMappingManager)
    expect(resolverPrivate._classStack).toBeArrayOfSize(0)
    expect(resolverPrivate._contextualBindings).toBeInstanceOf(ContextualBindingManager)
    expect(resolverPrivate._extenders).toBeInstanceOf(ExtenderManager)
    expect(resolverPrivate._parametersStack).toBeArrayOfSize(0)
    expect(resolverPrivate._resolvedSymbols).toBeInstanceOf(ResolvedSymbolManager)
    expect(resolverPrivate._simpleBindings).toBeInstanceOf(SimpleBindingManager)
    expect(resolverPrivate._valueBindings).toBeInstanceOf(ValueBindingManager)
  })



  test('#getClassStack() :: gets the class stack for a build', () => {
    const resolverArguments = createResolverArguments()
    const resolver = new Resolver(...resolverArguments)
    expect(resolver.getClassStack()).toStrictEqual([])
  })



  test('#getParametersStack() :: gets the parameters stack for a build', () => {
    const resolverArguments = createResolverArguments()
    const resolver = new Resolver(...resolverArguments)
    expect(resolver.getParametersStack()).toStrictEqual([])
  })



  test('#resolve() :: resolves the value binding for a key', () => {
    const resolverArguments = createResolverArguments()
    const valueBindings = resolverArguments[5]
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    valueBindings.set(fooSymbol, foo)
    const resolver = new Resolver(...resolverArguments)
    expect(resolver.resolve<InstanceType<typeof Foo>>(fooSymbol, {})).toBe(foo)
  })

  test('#resolve() :: resolves the simple class binding for a key', () => {
    const resolverArguments = createResolverArguments()
    const classMappings = resolverArguments[0]
    const simpleBindings = resolverArguments[4]
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    classMappings.set(Foo, fooSymbol, {})
    const entry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    simpleBindings.set(fooSymbol, entry, false)
    const resolver = new Resolver(...resolverArguments)
    const foo1 = resolver.resolve<InstanceType<typeof Foo>>(fooSymbol, {})
    expect(foo1).toBeInstanceOf(Foo)
    const foo2 = resolver.resolve<InstanceType<typeof Foo>>(fooSymbol, {})
    expect(foo2).toBeInstanceOf(Foo)
    expect(foo1).not.toBe(foo2)
  })

  test('#resolve() :: resolves the simple class binding for a key :: when the binding is set to resolve once, resolves it only once', () => {
    const resolverArguments = createResolverArguments()
    const classMappings = resolverArguments[0]
    const simpleBindings = resolverArguments[4]
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    classMappings.set(Foo, fooSymbol, {})
    const entry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    simpleBindings.set(fooSymbol, entry, true)
    const resolver = new Resolver(...resolverArguments)
    const foo1 = resolver.resolve<InstanceType<typeof Foo>>(fooSymbol, {})
    expect(foo1).toBeInstanceOf(Foo)
    const foo2 = resolver.resolve<InstanceType<typeof Foo>>(fooSymbol, {})
    expect(foo2).toBeInstanceOf(Foo)
    expect(foo1).toBe(foo2)
  })

  test('#resolve() :: resolves the simple factory binding for a key', () => {
    const resolverArguments = createResolverArguments()
    const simpleBindings = resolverArguments[4]
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {
      public a: number

      public constructor(a: number)
      {
        this.a = a
      }
    })
    const factory = jest.fn(((parameters) => {
      return new Foo(parameters.a)
    }) as IFactoryBindingEntryFactoryType<InstanceType<typeof Foo>>)
    const entry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<ReturnType<typeof factory>>
    simpleBindings.set(fooSymbol, entry, false)
    const resolver = new Resolver(...resolverArguments)
    const parameters1 = { a: 1 } as Parameters<IFactoryBindingEntryFactoryType<InstanceType<typeof Foo>>>[0]
    const foo1 = resolver.resolve<ReturnType<typeof factory>>(fooSymbol, parameters1)
    expect(factory).toHaveBeenCalledTimes(1)
    expect(factory).toHaveBeenCalledWith(parameters1)
    expect(factory).toHaveReturnedWith(foo1)
    expect(foo1).toBeInstanceOf(Foo)
    expect(foo1.a).toStrictEqual(1)
    const parameters2 = { a: 2 } as Parameters<IFactoryBindingEntryFactoryType<InstanceType<typeof Foo>>>[0]
    factory.mockClear()
    const foo2 = resolver.resolve<ReturnType<typeof factory>>(fooSymbol, parameters2)
    expect(factory).toHaveBeenCalledTimes(1)
    expect(factory).toHaveBeenCalledWith(parameters2)
    expect(factory).toHaveReturnedWith(foo2)
    expect(foo2).toBeInstanceOf(Foo)
    expect(foo2.a).toStrictEqual(2)
    expect(foo1).not.toBe(foo2)
  })

  test('#resolve() :: resolves the simple factory binding for a key :: when the binding is set to resolve once, resolves it only once', () => {
    const resolverArguments = createResolverArguments()
    const simpleBindings = resolverArguments[4]
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {
      public a: number

      public constructor(a: number)
      {
        this.a = a
      }
    })
    const factory = jest.fn((() => {
      return new Foo(4)
    }) as IFactoryBindingEntryFactoryType<InstanceType<typeof Foo>>)
    const entry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<ReturnType<typeof factory>>
    simpleBindings.set(fooSymbol, entry, true)
    const resolver = new Resolver(...resolverArguments)
    const foo1 = resolver.resolve<ReturnType<typeof factory>>(fooSymbol, {})
    expect(factory).toHaveBeenCalledTimes(1)
    expect(factory).toHaveReturnedWith(foo1)
    expect(foo1).toBeInstanceOf(Foo)
    expect(foo1.a).toStrictEqual(4)
    factory.mockClear()
    const foo2 = resolver.resolve<ReturnType<typeof factory>>(fooSymbol, {})
    expect(factory).not.toHaveBeenCalled()
    expect(foo2).toBeInstanceOf(Foo)
    expect(foo1).toBe(foo2)
  })

  test('#resolve() :: resolves the contextual class binding for a key', () => {
    const resolverArguments = createResolverArguments()
    const classMappings = resolverArguments[0]
    const contextualBindings = resolverArguments[1]
    const simpleBindings = resolverArguments[4]
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const fooEntry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    const barSymbol = Symbol('bar')
    const Bar = (class Bar
    {
      public foo: InstanceType<typeof Foo>

      public constructor(foo: InstanceType<typeof Foo>)
      {
        this.foo = foo
      }
    })
    classMappings.set(Bar, barSymbol, { foo: fooSymbol })
    const barEntry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    simpleBindings.set(barSymbol, barEntry, false)
    classMappings.set(Foo, fooSymbol, {})
    contextualBindings.setDependent(barSymbol, fooSymbol, fooEntry)
    const resolver = new Resolver(...resolverArguments)
    const bar = resolver.resolve<InstanceType<typeof Bar>>(barSymbol, {})
    expect(bar).toBeInstanceOf(Bar)
    expect(bar.foo).toBeInstanceOf(Foo)
  })

  test('#resolve() :: resolves the contextual factory binding for a key', () => {
    const resolverArguments = createResolverArguments()
    const classMappings = resolverArguments[0]
    const contextualBindings = resolverArguments[1]
    const simpleBindings = resolverArguments[4]
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const factory = jest.fn((() => {
      return new Foo()
    }) as IFactoryBindingEntryFactoryType<InstanceType<typeof Foo>>)
    const fooEntry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<ReturnType<typeof factory>>
    const barSymbol = Symbol('bar')
    const Bar = (class Bar
    {
      public foo: InstanceType<typeof Foo>

      public constructor(foo: InstanceType<typeof Foo>)
      {
        this.foo = foo
      }
    })
    classMappings.set(Bar, barSymbol, { foo: fooSymbol })
    const barEntry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    simpleBindings.set(barSymbol, barEntry, false)
    contextualBindings.setDependent(barSymbol, fooSymbol, fooEntry)
    const resolver = new Resolver(...resolverArguments)
    const bar = resolver.resolve<InstanceType<typeof Bar>>(barSymbol, {})
    expect(bar).toBeInstanceOf(Bar)
    expect(bar.foo).toBeInstanceOf(Foo)
  })

  test('#resolve() :: when the extenders of the instance has extender functions for a key, runs the resolved value through them', () => {
    const resolverArguments = createResolverArguments()
    const extenders = resolverArguments[2]
    const simpleBindings = resolverArguments[4]
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {
      public a: (string |
                 null)

      public constructor()
      {
        this.a = null
      }
    })
    const factory = jest.fn((() => {
      return new Foo()
    }) as IFactoryBindingEntryFactoryType<InstanceType<typeof Foo>>)
    const entry = new FactoryBindingEntry(factory) as IFactoryBindingEntry<ReturnType<typeof factory>>
    simpleBindings.set(fooSymbol, entry, false)
    const extender1 = jest.fn(() => {
      const foo = new Foo()
      foo.a = 'foo'
      return foo
    })
    extenders.add(fooSymbol, extender1)
    const extender2 = jest.fn((value: IExtenderManagerValueType) => {
      const foo = new Foo()
      const { a } = value as InstanceType<typeof Foo>
      foo.a! = `${a!}bar`
      return foo
    })
    extenders.add(fooSymbol, extender2)
    const resolver = new Resolver(...resolverArguments)
    const foo = resolver.resolve<ReturnType<typeof factory>>(fooSymbol, {})
    expect(factory).toHaveBeenCalledTimes(1)
    let factoryFoo: (InstanceType<typeof Foo> |
                     null)
    const [ factoryResult ] = factory.mock.results
    switch (factoryResult.type) {
      case 'return': {
        factoryFoo = factoryResult.value
        break
      }
      default: {
        // NOTE: This block should never be reached.
        factoryFoo = null
        break
      }
    }
    expect(factory).toHaveReturnedWith(factoryFoo!)
    expect(factoryFoo!).toBeInstanceOf(Foo)
    expect(factoryFoo!.a).toBeNull()
    expect(extender1).toHaveBeenCalledTimes(1)
    expect(extender1).toHaveBeenCalledWith(factoryFoo!)
    let extender1Foo: (InstanceType<typeof Foo> |
                       null)
    const [ extender1Result ] = extender1.mock.results
    switch (extender1Result.type) {
      case 'return': {
        extender1Foo = extender1Result.value
        break
      }
      default: {
        // NOTE: This block should never be reached.
        extender1Foo = null
        break
      }
    }
    expect(extender1).toHaveReturnedWith(extender1Foo!)
    expect(extender1Foo!).toBeInstanceOf(Foo)
    expect(extender1Foo!.a).toStrictEqual('foo')
    expect(extender2).toHaveBeenCalledTimes(1)
    expect(extender2).toHaveBeenCalledWith(extender1Foo!)
    let extender2Foo: (InstanceType<typeof Foo> |
                       null)
    const [ extender2Result ] = extender2.mock.results
    switch (extender2Result.type) {
      case 'return': {
        extender2Foo = extender2Result.value
        break
      }
      default: {
        // NOTE: This block should never be reached.
        extender2Foo = null
        break
      }
    }
    expect(extender2).toHaveReturnedWith(extender2Foo!)
    expect(extender2Foo!).toBeInstanceOf(Foo)
    expect(extender2Foo!.a).toStrictEqual('foobar')
    expect(foo).toBe(extender2Foo!)
  })
})
