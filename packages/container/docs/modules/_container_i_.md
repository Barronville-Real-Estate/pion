[@pion/container](../README.md) › ["container.i"](_container_i_.md)

# Module: "container.i"

## Index

### References

* [IContainerBindingValueType](_container_i_.md#icontainerbindingvaluetype)
* [IContainerClassSuperType](_container_i_.md#icontainerclasssupertype)
* [IContainerClassType](_container_i_.md#icontainerclasstype)
* [IContainerConstructorParameterSymbolsType](_container_i_.md#icontainerconstructorparametersymbolstype)
* [IContainerExtenderFunctionType](_container_i_.md#icontainerextenderfunctiontype)
* [IContainerExtenderValueType](_container_i_.md#icontainerextendervaluetype)
* [IContainerFactoryType](_container_i_.md#icontainerfactorytype)
* [IContainerRebindEventHandlerType](_container_i_.md#icontainerrebindeventhandlertype)
* [IContainerRebindEventValueType](_container_i_.md#icontainerrebindeventvaluetype)
* [IContainerResolveParametersType](_container_i_.md#icontainerresolveparameterstype)
* [default](_container_i_.md#default)

### Interfaces

* [IContainer](../interfaces/_container_i_.icontainer.md)

### Type aliases

* [BindingValueType](_container_i_.md#bindingvaluetype)
* [ClassSuperType](_container_i_.md#classsupertype)
* [ClassType](_container_i_.md#classtype)
* [ConstructorParameterSymbolsType](_container_i_.md#constructorparametersymbolstype)
* [ExtenderFunctionType](_container_i_.md#extenderfunctiontype)
* [ExtenderValueType](_container_i_.md#extendervaluetype)
* [FactoryType](_container_i_.md#factorytype)
* [RebindEventHandlerType](_container_i_.md#rebindeventhandlertype)
* [RebindEventValueType](_container_i_.md#rebindeventvaluetype)
* [ResolveParametersType](_container_i_.md#resolveparameterstype)
* [ResolveValueType](_container_i_.md#resolvevaluetype)

## References

### <a id="icontainerbindingvaluetype" name="icontainerbindingvaluetype"></a>  IContainerBindingValueType

• **IContainerBindingValueType**:

___

### <a id="icontainerclasssupertype" name="icontainerclasssupertype"></a>  IContainerClassSuperType

• **IContainerClassSuperType**:

___

### <a id="icontainerclasstype" name="icontainerclasstype"></a>  IContainerClassType

• **IContainerClassType**:

___

### <a id="icontainerconstructorparametersymbolstype" name="icontainerconstructorparametersymbolstype"></a>  IContainerConstructorParameterSymbolsType

• **IContainerConstructorParameterSymbolsType**:

___

### <a id="icontainerextenderfunctiontype" name="icontainerextenderfunctiontype"></a>  IContainerExtenderFunctionType

• **IContainerExtenderFunctionType**:

___

### <a id="icontainerextendervaluetype" name="icontainerextendervaluetype"></a>  IContainerExtenderValueType

• **IContainerExtenderValueType**:

___

### <a id="icontainerfactorytype" name="icontainerfactorytype"></a>  IContainerFactoryType

• **IContainerFactoryType**:

___

### <a id="icontainerrebindeventhandlertype" name="icontainerrebindeventhandlertype"></a>  IContainerRebindEventHandlerType

• **IContainerRebindEventHandlerType**:

___

### <a id="icontainerrebindeventvaluetype" name="icontainerrebindeventvaluetype"></a>  IContainerRebindEventValueType

• **IContainerRebindEventValueType**:

___

### <a id="icontainerresolveparameterstype" name="icontainerresolveparameterstype"></a>  IContainerResolveParametersType

• **IContainerResolveParametersType**:

___

### <a id="default" name="default"></a>  default

• **default**:

## Type aliases

### <a id="bindingvaluetype" name="bindingvaluetype"></a>  BindingValueType

Ƭ **BindingValueType**: *null | string | number | bigint | false | true | symbol | object*

___

### <a id="classsupertype" name="classsupertype"></a>  ClassSuperType

Ƭ **ClassSuperType**: *object*

#### Type declaration:

___

### <a id="classtype" name="classtype"></a>  ClassType

Ƭ **ClassType**: *object*

#### Type declaration:

___

### <a id="constructorparametersymbolstype" name="constructorparametersymbolstype"></a>  ConstructorParameterSymbolsType

Ƭ **ConstructorParameterSymbolsType**: *object*

#### Type declaration:

* \[ **parameterName**: *string*\]: symbol

___

### <a id="extenderfunctiontype" name="extenderfunctiontype"></a>  ExtenderFunctionType

Ƭ **ExtenderFunctionType**: *function*

#### Type declaration:

▸ (`value`: [ExtenderValueType](_container_i_.md#extendervaluetype), `container`: [IContainer](../interfaces/_container_i_.icontainer.md)): *[ExtenderValueType](_container_i_.md#extendervaluetype)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [ExtenderValueType](_container_i_.md#extendervaluetype) |
`container` | [IContainer](../interfaces/_container_i_.icontainer.md) |

___

### <a id="extendervaluetype" name="extendervaluetype"></a>  ExtenderValueType

Ƭ **ExtenderValueType**: *null | string | number | bigint | false | true | symbol | object*

___

### <a id="factorytype" name="factorytype"></a>  FactoryType

Ƭ **FactoryType**: *function*

#### Type declaration:

▸ (`container`: [IContainer](../interfaces/_container_i_.icontainer.md), `parameters`: [ResolveParametersType](_container_i_.md#resolveparameterstype)): *T*

**Parameters:**

Name | Type |
------ | ------ |
`container` | [IContainer](../interfaces/_container_i_.icontainer.md) |
`parameters` | [ResolveParametersType](_container_i_.md#resolveparameterstype) |

___

### <a id="rebindeventhandlertype" name="rebindeventhandlertype"></a>  RebindEventHandlerType

Ƭ **RebindEventHandlerType**: *function*

#### Type declaration:

▸ (`container`: [IContainer](../interfaces/_container_i_.icontainer.md), `value`: [RebindEventValueType](_container_i_.md#rebindeventvaluetype)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`container` | [IContainer](../interfaces/_container_i_.icontainer.md) |
`value` | [RebindEventValueType](_container_i_.md#rebindeventvaluetype) |

___

### <a id="rebindeventvaluetype" name="rebindeventvaluetype"></a>  RebindEventValueType

Ƭ **RebindEventValueType**: *null | string | number | bigint | false | true | symbol | object*

___

### <a id="resolveparameterstype" name="resolveparameterstype"></a>  ResolveParametersType

Ƭ **ResolveParametersType**: *object*

#### Type declaration:

* \[ **parameterName**: *string*\]: any

___

### <a id="resolvevaluetype" name="resolvevaluetype"></a>  ResolveValueType

Ƭ **ResolveValueType**: *T extends undefined ? BindingValueType : T*
