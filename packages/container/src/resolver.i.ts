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

type FactoryType<T> = (parameters: ParametersType) => T;

type ParametersType = { [parameterName: string]: any };

type ResolveValueType<T = undefined> = T extends undefined ?
  BindingValueType :
  T;

interface IResolver
{
  getClassStack(): ClassType<any>[]

  getParametersStack(): ParametersType[]

  resolve<ResolveValueTypeT>(key: symbol,
                             parameters: ParametersType): ResolveValueType<ResolveValueTypeT>
}

export {
  IResolver as default,

  BindingValueType as IResolverBindingValueType,
  ClassSuperType as IResolverClassSuperType,
  ClassType as IResolverClassType,
  FactoryType as IResolverFactoryType,
  ParametersType as IResolverParametersType,
  ResolveValueType as IResolverResolveValueType
}
