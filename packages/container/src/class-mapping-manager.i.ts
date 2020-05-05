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

type ClassSuperType = new (...arguments_: any[]) => any;

type ClassType<T extends ClassSuperType> = new (...arguments_: ConstructorParameters<T>) => InstanceType<T>;

type ConstructorParameterSymbolsType = { [parameterName: string]: symbol };

interface IClassMappingManager
{
  clear(): void

  contains<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>): boolean

  get<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>): ({
                                                                            parameterNames: string[];
                                                                            parameterSymbols: ConstructorParameterSymbolsType;
                                                                            symbol: symbol;
                                                                          } |
                                                                          null)

  getParameterNames<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>): (string[] |
                                                                                        null)

  getParameterSymbols<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>): (ConstructorParameterSymbolsType |
                                                                                          null)

  getSymbol<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>): (symbol |
                                                                                null)

  set<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>,
                                         symbol: symbol,
                                         parameterSymbols: ConstructorParameterSymbolsType): void

  unset<ClassTypeT extends ClassSuperType>(class_: ClassType<ClassTypeT>): void
}

export {
  IClassMappingManager as default,

  ClassSuperType as IClassMappingManagerClassSuperType,
  ClassType as IClassMappingManagerClassType,
  ConstructorParameterSymbolsType as IClassMappingManagerConstructorParameterSymbolsType
}
