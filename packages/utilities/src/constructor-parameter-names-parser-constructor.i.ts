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

import type { IConstructorParameterNamesParserConstructorSuperType as ConstructorSuperType } from './constructor-parameter-names-parser.i'
import type { IConstructorParameterNamesParserConstructorType as ConstructorType } from './constructor-parameter-names-parser.i'
import type IConstructorParameterNamesParser from './constructor-parameter-names-parser.i'

interface IConstructorParameterNamesParserConstructor
{
  new<ConstructorTypeT extends ConstructorSuperType>(constructor: ConstructorType<ConstructorTypeT>): IConstructorParameterNamesParser
}

export default IConstructorParameterNamesParserConstructor
