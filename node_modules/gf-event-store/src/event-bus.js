class GFEventBus {
  constructor() {
    this.eventBus = {};
  }
  on(eventName, eventCallback, thisArgument) {
    if (typeof eventName !== "string" || !eventName) {
      throw new TypeError(
        "the event name must be string type and event name not be null string"
      );
    }

    if (typeof eventCallback !== "function") {
      throw new TypeError("the eventCallbackFnction must be function type");
    }

    let handlers = this.eventBus[eventName];
    if (!handlers) {
      handlers = [];
      this.eventBus[eventName] = handlers;
    }
    handlers.push({
      eventCallback,
      thisArgument,
    });

    return this;
  }

  once(eventName, eventCallback, thisArgument) {
    if (typeof eventName !== "string" || !eventName) {
      throw new TypeError(
        "the event name must be string type and event name not be null string"
      );
    }
    if (typeof eventCallback !== "function") {
      throw new TypeError("the eventCallbackFnction must be function type");
    }

    const onceCallback = (...payload) => {
      this.off(eventName, onceCallback);
      eventCallback.apply(thisArgument, payload);
    };
    return this.on(eventName, onceCallback, thisArgument);
  }

  emit(eventName, ...payload) {
    if (typeof eventName !== "string" || !eventName) {
      throw new TypeError(
        "the event name must be string type and event name not be null string"
      );
    }

    let handlers = this.eventBus[eventName] || [];
    handlers.forEach((handler) => {
      handler.eventCallback.apply(handler.thisArgument, payload);
    });
    return this;
  }

  off(eventName, eventCallback) {
    if (typeof eventName !== "string" || !eventName) {
      throw new TypeError(
        "the event name must be string type and event name not be null string"
      );
    }
    if (typeof eventCallback !== "function") {
      throw new TypeError("the eventCallbackFnction must be function type");
    }
    let handlers = this.eventBus[eventName];
    if (handlers && eventCallback) {
      let newhandlers = [...handlers];
      for (let i = 0; i < newhandlers.length; i++) {
        const handler = newhandlers[i];
        if (handler.eventCallback === eventCallback) {
          let index = newhandlers.indexOf(handler);
          handlers.splice(index, 1);
        }
      }
    }

    if (handlers.length === 0) {
      delete this.eventBus[eventName];
    }

    return this;
  }
}

module.exports = GFEventBus;
