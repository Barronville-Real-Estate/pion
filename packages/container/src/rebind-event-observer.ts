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

import type { IRebindEventObserverHandlerType as HandlerType } from './rebind-event-observer.i'
import type IRebindEventObserver from './rebind-event-observer.i'
import type IRebindEventObserverConstructor from './rebind-event-observer-constructor.i'
import type { IRebindEventObserverValueType as ValueType } from './rebind-event-observer.i'

const RebindEventObserver: IRebindEventObserverConstructor =
  class RebindEventObserver
    implements IRebindEventObserver
  {
    _handler: HandlerType

    public constructor(handler: HandlerType)
    {
      this._handler = handler

      Object.defineProperties(this, {
        _handler: { enumerable: false }
      })
    }

    public update(value: ValueType)
    {
      this._handler(value)
    }
  }

Object.defineProperties(RebindEventObserver.prototype, {
  constructor: { enumerable: true },

  update: { enumerable: true }
})

export default RebindEventObserver
