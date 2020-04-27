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

type BindingValueType = (bigint |
                         boolean |
                         number |
                         null |
                         object |
                         string |
                         symbol);

type ClassSuperType = new (...arguments_: any[]) => any;

type ClassType<T extends ClassSuperType> = new (...arguments_: ConstructorParameters<T>) => InstanceType<T>;

type ConstructorParameterSymbolsType = { [parameterName: string]: symbol };

type ExtenderFunctionType = (value: ExtenderValueType,
                             container: IContainer) => ExtenderValueType;

type ExtenderValueType = (bigint |
                          boolean |
                          number |
                          null |
                          object |
                          string |
                          symbol);

type FactoryType<T> = (container: IContainer,
                       parameters: ResolveParametersType) => T;

type RebindEventHandlerType = (container: IContainer,
                               value: RebindEventValueType) => void;

type RebindEventValueType = (bigint |
                             boolean |
                             number |
                             null |
                             object |
                             string |
                             symbol);

type ResolveParametersType = { [parameterName: string]: any };

type ResolveValueType<T = undefined> = T extends undefined ?
  BindingValueType :
  T;

interface IContainer
{
  addRebindEventHandler(key: symbol,
                        handler: RebindEventHandlerType): void

  bindClass<ClassTypeT extends ClassSuperType>(key: symbol,
                                               class_: ClassType<ClassTypeT>,
                                               parameterSymbols?: ConstructorParameterSymbolsType,
                                               shouldResolveOnce?: boolean): void

  bindFactory<FactoryTypeT>(key: symbol,
                            factory: FactoryType<FactoryTypeT>,
                            shouldResolveOnce?: boolean): void

  bindValue(key: symbol,
            value: BindingValueType): void

  contextuallyBindClass<ClassTypeT extends ClassSuperType>(key: symbol,
                                                           dependentKey: symbol,
                                                           class_: ClassType<ClassTypeT>,
                                                           parameterSymbols?: ConstructorParameterSymbolsType): void

  contextuallyBindFactory<FactoryTypeT>(key: symbol,
                                        dependentKey: symbol,
                                        factory: FactoryType<FactoryTypeT>): void

  empty(): void

  extend(key: symbol,
         extender: ExtenderFunctionType): void

  hasResolved(key: symbol): boolean

  isBound(key: symbol): boolean

  resolve<ResolveValueTypeT = undefined>(key: symbol,
                                         parameters?: ResolveParametersType): ResolveValueType<ResolveValueTypeT>
}

export {
  IContainer as default,

  BindingValueType as IContainerBindingValueType,
  ClassSuperType as IContainerClassSuperType,
  ClassType as IContainerClassType,
  ConstructorParameterSymbolsType as IContainerConstructorParameterSymbolsType,
  ExtenderFunctionType as IContainerExtenderFunctionType,
  ExtenderValueType as IContainerExtenderValueType,
  FactoryType as IContainerFactoryType,
  RebindEventHandlerType as IContainerRebindEventHandlerType,
  RebindEventValueType as IContainerRebindEventValueType,
  ResolveParametersType as IContainerResolveParametersType
}
