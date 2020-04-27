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

import type IResolver from '../../resolver.i'

class ResolutionFailedError
  extends Error
  implements Error
{
  constructor(message: string,
              resolver: IResolver)
  {
    super(message)
    const error = new Error(message)
    const thisPrototype = Object.getPrototypeOf(this)
    Object.setPrototypeOf(error, thisPrototype)
    const extraData = {
      classStack: resolver.getClassStack(),
      parametersStack: resolver.getParametersStack()
    }
    Object.defineProperty(error, 'extra', {
      configurable: true,
      value: extraData
    })
    return error
  }
}

Object.defineProperties(ResolutionFailedError.prototype, {
  constructor: {
    enumerable: true,
    value: Error
  },

  name: {
    configurable: true,
    value: ResolutionFailedError.name
  }
})

Object.setPrototypeOf(ResolutionFailedError, Error)

export default ResolutionFailedError
