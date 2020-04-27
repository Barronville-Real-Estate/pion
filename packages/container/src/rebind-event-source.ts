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

import type IRebindEventObserver from './rebind-event-observer.i'
import type { IRebindEventObserverValueType } from './rebind-event-observer.i'
import type IRebindEventSource from './rebind-event-source.i'
import type IRebindEventSourceConstructor from './rebind-event-source-constructor.i'
import type { IRebindEventSourceTriggerEventValueCallbackType as TriggerEventValueCallbackType } from './rebind-event-source.i'

const RebindEventSource: IRebindEventSourceConstructor =
  class RebindEventSource
    implements IRebindEventSource
  {
    private _observers: Map<symbol, IRebindEventObserver[]>

    public constructor()
    {
      this._observers = new Map()

      Object.defineProperties(this, {
        _observers: { enumerable: false }
      })
    }

    private _getObservers(key: symbol)
    {
      const observers = this._observers.get(key)
      return (typeof observers !== 'undefined') ?
        observers :
        null
    }

    private _notifyObservers(key: symbol,
                             value: IRebindEventObserverValueType)
    {
      const observers = this._getObservers(key)
      if (observers === null) return
      observers.forEach((observer) => {
        observer.update(value)
      })
    }

    private _set(key: symbol,
                 observers: IRebindEventObserver[])
    {
      this._observers.set(key, observers)
    }

    public addObserver(key: symbol,
                       observer: IRebindEventObserver)
    {
      let observers = this._getObservers(key)
      if (observers === null) {
        observers = []
        this._set(key, observers)
      }
      observers.push(observer)
    }

    public clearObservers()
    {
      this._observers.clear()
    }

    public containsObservers(key: symbol)
    {
      return this._observers.has(key)
    }

    public removeObserver(key: symbol,
                          observer: IRebindEventObserver)
    {
      let observers = this._getObservers(key)
      if (observers === null) return
      observers = observers.filter((observer1) => (! Object.is(observer1, observer)))
      if (observers.length !== 0) {
        this._set(key, observers)
      } else {
        this.removeObservers(key)
      }
    }

    public removeObservers(key: symbol)
    {
      this._observers.delete(key)
    }

    public triggerEvent(key: symbol,
                        valueCallback: TriggerEventValueCallbackType)
    {
      const value = valueCallback()
      this._notifyObservers(key, value)
    }
  }

Object.defineProperties(RebindEventSource.prototype, {
  constructor: { enumerable: true },

  addObserver: { enumerable: true },
  clearObservers: { enumerable: true },
  containsObservers: { enumerable: true },
  removeObserver: { enumerable: true },
  removeObservers: { enumerable: true },
  triggerEvent: { enumerable: true }
})

export default RebindEventSource
