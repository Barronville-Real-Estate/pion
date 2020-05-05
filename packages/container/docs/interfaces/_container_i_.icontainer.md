[@pion/container](../README.md) › ["container.i"](../modules/_container_i_.md) › [IContainer](_container_i_.icontainer.md)

# Interface: IContainer

## Hierarchy

* **IContainer**

## Implemented by

* [Container](../classes/_container_.container.md)

## Index

### Methods

* [addRebindEventHandler](_container_i_.icontainer.md#addrebindeventhandler)
* [bindClass](_container_i_.icontainer.md#bindclass)
* [bindFactory](_container_i_.icontainer.md#bindfactory)
* [bindValue](_container_i_.icontainer.md#bindvalue)
* [contextuallyBindClass](_container_i_.icontainer.md#contextuallybindclass)
* [contextuallyBindFactory](_container_i_.icontainer.md#contextuallybindfactory)
* [empty](_container_i_.icontainer.md#empty)
* [extend](_container_i_.icontainer.md#extend)
* [hasResolved](_container_i_.icontainer.md#hasresolved)
* [isBound](_container_i_.icontainer.md#isbound)
* [resolve](_container_i_.icontainer.md#resolve)

## Methods

### <a id="addrebindeventhandler" name="addrebindeventhandler"></a>  addRebindEventHandler

▸ **addRebindEventHandler**(`key`: symbol, `handler`: [RebindEventHandlerType](../modules/_container_i_.md#rebindeventhandlertype)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`handler` | [RebindEventHandlerType](../modules/_container_i_.md#rebindeventhandlertype) |

**Returns:** *void*

___

### <a id="bindclass" name="bindclass"></a>  bindClass

▸ **bindClass**<**ClassTypeT**>(`key`: symbol, `class_`: [ClassType](../modules/_container_i_.md#classtype)‹ClassTypeT›, `parameterSymbols?`: [ConstructorParameterSymbolsType](../modules/_container_i_.md#constructorparametersymbolstype), `shouldResolveOnce?`: undefined | false | true): *void*

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

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`value` | [BindingValueType](../modules/_container_i_.md#bindingvaluetype) |

**Returns:** *void*

___

### <a id="contextuallybindclass" name="contextuallybindclass"></a>  contextuallyBindClass

▸ **contextuallyBindClass**<**ClassTypeT**>(`key`: symbol, `dependentKey`: symbol, `class_`: [ClassType](../modules/_container_i_.md#classtype)‹ClassTypeT›, `parameterSymbols?`: [ConstructorParameterSymbolsType](../modules/_container_i_.md#constructorparametersymbolstype)): *void*

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

**Returns:** *void*

___

### <a id="extend" name="extend"></a>  extend

▸ **extend**(`key`: symbol, `extender`: [ExtenderFunctionType](../modules/_container_i_.md#extenderfunctiontype)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`extender` | [ExtenderFunctionType](../modules/_container_i_.md#extenderfunctiontype) |

**Returns:** *void*

___

### <a id="hasresolved" name="hasresolved"></a>  hasResolved

▸ **hasResolved**(`key`: symbol): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |

**Returns:** *boolean*

___

### <a id="isbound" name="isbound"></a>  isBound

▸ **isBound**(`key`: symbol): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |

**Returns:** *boolean*

___

### <a id="resolve" name="resolve"></a>  resolve

▸ **resolve**<**ResolveValueTypeT**>(`key`: symbol, `parameters?`: [ResolveParametersType](../modules/_container_i_.md#resolveparameterstype)): *[ResolveValueType](../modules/_container_i_.md#resolvevaluetype)‹ResolveValueTypeT›*

**Type parameters:**

▪ **ResolveValueTypeT**

**Parameters:**

Name | Type |
------ | ------ |
`key` | symbol |
`parameters?` | [ResolveParametersType](../modules/_container_i_.md#resolveparameterstype) |

**Returns:** *[ResolveValueType](../modules/_container_i_.md#resolvevaluetype)‹ResolveValueTypeT›*
