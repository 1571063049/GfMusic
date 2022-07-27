module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1658888414064, function(require, module, exports) {
module.exports = {
  GFEventBus: require("./event-bus"),
  GFEventStore: require("./event-store"),
};

}, function(modId) {var map = {"./event-bus":1658888414065,"./event-store":1658888414066}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1658888414065, function(require, module, exports) {
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

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1658888414066, function(require, module, exports) {
const GFEventBus = require("./event-bus");
const { isObject } = require("./utils");

class GFEventStore {
  constructor(store) {
    if (!isObject(store.state)) {
      throw new Error("the state must be object type");
    }
    if (store.actions && isObject(store.actions)) {
      const values = Object.values(store.actions);
      for (const value of values) {
        if (typeof value !== "function") {
          throw new Error("the value of actions must be function type");
        }
      }
      this.actions = store.actions;
    }
    this.state = store.state;
    this._observe(store.state);
    this.EventBus = new GFEventBus(); //监听多个事件
    this.EventBus2 = new GFEventBus(); //监听单个事件
  }

  _observe(state) {
    const _this = this;
    Object.keys(state).forEach((key) => {
      let _value = state[key];
      Object.defineProperty(state, key, {
        get: function () {
          return _value;
        },
        set: function (newValue) {
          if (_value === newValue) return;
          _value = newValue;
          _this.EventBus.emit(key, _value);
          _this.EventBus2.emit(key, { [key]: _value }); //
        },
      });
    });
  }

  onState(stateKey, stateCallback) {
    if (typeof stateKey !== "string" || !stateKey) {
      throw new TypeError(
        "the action name must be string type and event name not be null string"
      );
    }
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("stateKey is not found in state");
    }
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    this.EventBus.on(stateKey, stateCallback);
    const value = this.state[stateKey];
    stateCallback.apply(this.state, [value]);
  }

  onStates(stateKeys, stateCallback) {
    if (!(stateKeys instanceof Array)) {
      throw new TypeError("the stateKeys must be array type");
    }
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    const keys = Object.keys(this.state);
    const value = {};
    for (const stateKey of stateKeys) {
      if (keys.indexOf(stateKey) === -1) {
        throw new Error("stateKey is not found in state");
      }
      this.EventBus2.on(stateKey, stateCallback);
      value[stateKey] = this.state[stateKey];
    }
    stateCallback.apply(this.state, [value]);
  }

  offState(stateKey, stateCallback) {
    if (typeof stateKey !== "string" || !stateKey) {
      throw new TypeError(
        "the action name must be string type and event name not be null string"
      );
    }
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("stateKey is not found in state");
    }
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    this.EventBus.off(stateKey, stateCallback);
  }

  offStates(stateKeys, stateCallback) {
    if (!(stateKeys instanceof Array)) {
      throw new TypeError("the stateKeys must be array type");
    }
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type");
    }
    const keys = Object.keys(this.state);
    for (const stateKey of stateKeys) {
      if (keys.indexOf(stateKey) === -1) {
        throw new Error("stateKey is not found in state");
      }
      this.EventBus2.off(stateKey, stateCallback);
    }
  }

  setState(stateKey, stateValue) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("stateKey is not found in state");
    }
    this.state.stateKey = stateValue;
  }

  dispatch(actionName, ...args) {
    if (typeof actionName !== "string" || !actionName) {
      throw new TypeError(
        "the action name must be string type and event name not be null string"
      );
    }
    const names = Object.keys(this.actions);
    if (names.indexOf(actionName) === -1) {
      throw new Error("actionName is not found in actions");
    }
    const actionFn = this.actions[actionName];
    actionFn.apply(this, [this.state, ...args]);
  }
}

module.exports = GFEventStore;

}, function(modId) { var map = {"./event-bus":1658888414065,"./utils":1658888414067}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1658888414067, function(require, module, exports) {
function isObject(obj) {
  var type = typeof obj;
  return type === "object" && !!obj;
}

module.exports = {
  isObject,
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1658888414064);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map