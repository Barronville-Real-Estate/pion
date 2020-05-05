[@pion-toolkit/container](../README.md) › ["container"](../modules/_container_.md) › [Container](_container_.container.md)

# Class: Container

## Hierarchy

* **Container**

## Implements

* [IContainer](../interfaces/_container_i_.icontainer.md)

## Index

### Constructors

* [constructor](_container_.container.md#constructor)

### Methods

* [addRebindEventHandler](_container_.container.md#addrebindeventhandler)
* [bindClass](_container_.container.md#bindclass)
* [bindFactory](_container_.container.md#bindfactory)
* [bindValue](_container_.container.md#bindvalue)
* [contextuallyBindClass](_container_.container.md#contextuallybindclass)
* [contextuallyBindFactory](_container_.container.md#contextuallybindfactory)
* [empty](_container_.container.md#empty)
* [extend](_container_.container.md#extend)
* [hasResolved](_container_.container.md#hasresolved)
* [isBound](_container_.container.md#isbound)
* [resolve](_container_.container.md#resolve)
* [getInstance](_container_.container.md#static-getinstance)

## Constructors

### <a id="constructor" name="constructor"></a>  constructor

\+ **new Container**(): *[Container](_container_.container.md)*

**Returns:** *[Container](_container_.container.md)*

## Methods

### <a id="addrebindeventhandler" name="addrebindeventhandler"></a>  addRebindEventHandler

▸ **addRebindEventHandler**(`key`: symbol, `handler`: [RebindEventHandlerType](../modules/_container_i_.md#rebindeventhandlertype)): *void*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`handler` | [RebindEventHandlerType](../modules/_container_i_.md#rebindeventhandlertype) |

**Returns:** *void*

___

### <a id="bindclass" name="bindclass"></a>  bindClass

▸ **bindClass**<**ClassTypeT**>(`key`: symbol, `class_`: [ClassType](../modules/_container_i_.md#classtype)‹ClassTypeT›, `parameterSymbols?`: [ConstructorParameterSymbolsType](../modules/_container_i_.md#constructorparametersymbolstype), `shouldResolveOnce?`: undefined | false | true): *void*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Type parameters:**

▪ **ClassTypeT**: *[ClassSuperType](../modules/_container_i_.md#classsupertype)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`class_` | [ClassType](../modules/_container_i_.md#classtype)‹ClassTypeT› |
`parameterSymbols?` | [ConstructorParameterSymbolsType](../modules/_container_i_.md#constructorparametersymbolstype) |
`shouldResolveOnce?` | undefined &#124; false &#124; true |

**Returns:** *void*

___

### <a id="bindfactory" name="bindfactory"></a>  bindFactory

▸ **bindFactory**<**FactoryTypeT**>(`key`: symbol, `factory`: [FactoryType](../modules/_container_i_.md#factorytype)‹FactoryTypeT›, `shouldResolveOnce?`: undefined | false | true): *void*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Type parameters:**

▪ **FactoryTypeT**

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`factory` | [FactoryType](../modules/_container_i_.md#factorytype)‹FactoryTypeT› |
`shouldResolveOnce?` | undefined &#124; false &#124; true |

**Returns:** *void*

___

### <a id="bindvalue" name="bindvalue"></a>  bindValue

▸ **bindValue**(`key`: symbol, `value`: [BindingValueType](../modules/_container_i_.md#bindingvaluetype)): *void*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`value` | [BindingValueType](../modules/_container_i_.md#bindingvaluetype) |

**Returns:** *void*

___

### <a id="contextuallybindclass" name="contextuallybindclass"></a>  contextuallyBindClass

▸ **contextuallyBindClass**<**ClassTypeT**>(`key`: symbol, `dependentKey`: symbol, `class_`: [ClassType](../modules/_container_i_.md#classtype)‹ClassTypeT›, `parameterSymbols?`: [ConstructorParameterSymbolsType](../modules/_container_i_.md#constructorparametersymbolstype)): *void*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Type parameters:**

▪ **ClassTypeT**: *[ClassSuperType](../modules/_container_i_.md#classsupertype)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`dependentKey` | symbol |
`class_` | [ClassType](../modules/_container_i_.md#classtype)‹ClassTypeT› |
`parameterSymbols?` | [ConstructorParameterSymbolsType](../modules/_container_i_.md#constructorparametersymbolstype) |

**Returns:** *void*

___

### <a id="contextuallybindfactory" name="contextuallybindfactory"></a>  contextuallyBindFactory

▸ **contextuallyBindFactory**<**FactoryTypeT**>(`key`: symbol, `dependentKey`: symbol, `factory`: [FactoryType](../modules/_container_i_.md#factorytype)‹FactoryTypeT›): *void*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Type parameters:**

▪ **FactoryTypeT**

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`dependentKey` | symbol |
`factory` | [FactoryType](../modules/_container_i_.md#factorytype)‹FactoryTypeT› |

**Returns:** *void*

___

### <a id="empty" name="empty"></a>  empty

▸ **empty**(): *void*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Returns:** *void*

___

### <a id="extend" name="extend"></a>  extend

▸ **extend**(`key`: symbol, `extender`: [ExtenderFunctionType](../modules/_container_i_.md#extenderfunctiontype)): *void*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`extender` | [ExtenderFunctionType](../modules/_container_i_.md#extenderfunctiontype) |

**Returns:** *void*

___

### <a id="hasresolved" name="hasresolved"></a>  hasResolved

▸ **hasResolved**(`key`: symbol): *boolean*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |

**Returns:** *boolean*

___

### <a id="isbound" name="isbound"></a>  isBound

▸ **isBound**(`key`: symbol): *boolean*

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |

**Returns:** *boolean*

___

### <a id="resolve" name="resolve"></a>  resolve

▸ **resolve**<**ResolveValueTypeT**>(`key`: symbol, `parameters?`: [ResolveParametersType](../modules/_container_i_.md#resolveparameterstype))

*Implementation of [IContainer](../interfaces/_container_i_.icontainer.md)*

**Type parameters:**

▪ **ResolveValueTypeT**

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`parameters?` | [ResolveParametersType](../modules/_container_i_.md#resolveparameterstype) |

___

### <a id="static-getinstance" name="static-getinstance"></a> `Static` getInstance

▸ **getInstance**(): *[IContainer](../interfaces/_container_i_.icontainer.md)*

**Returns:** *[IContainer](../interfaces/_container_i_.icontainer.md)*
