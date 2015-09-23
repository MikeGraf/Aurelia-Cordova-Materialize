"bundle";
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/metadata@0.8.0/aurelia-metadata", ["exports", "npm:core-js@0.9.18"], function(exports, _coreJs) {
  'use strict';
  exports.__esModule = true;
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var theGlobal = (function() {
    if (typeof self !== 'undefined') {
      return self;
    }
    if (typeof global !== 'undefined') {
      return global;
    }
    return new Function('return this')();
  })();
  var emptyMetadata = Object.freeze({});
  var metadataContainerKey = '__metadata__';
  if (typeof theGlobal.System === 'undefined') {
    theGlobal.System = {isFake: true};
  }
  if (typeof theGlobal.System.forEachModule === 'undefined') {
    theGlobal.System.forEachModule = function() {};
  }
  if (typeof theGlobal.Reflect === 'undefined') {
    theGlobal.Reflect = {};
  }
  if (typeof theGlobal.Reflect.getOwnMetadata === 'undefined') {
    Reflect.getOwnMetadata = function(metadataKey, target, targetKey) {
      return ((target[metadataContainerKey] || emptyMetadata)[targetKey] || emptyMetadata)[metadataKey];
    };
  }
  if (typeof theGlobal.Reflect.defineMetadata === 'undefined') {
    Reflect.defineMetadata = function(metadataKey, metadataValue, target, targetKey) {
      var metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : target[metadataContainerKey] = {};
      var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
      targetContainer[metadataKey] = metadataValue;
    };
  }
  if (typeof theGlobal.Reflect.metadata === 'undefined') {
    Reflect.metadata = function(metadataKey, metadataValue) {
      return function(target, targetKey) {
        Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
      };
    };
  }
  function ensureDecorators(target) {
    var applicator = undefined;
    if (typeof target.decorators === 'function') {
      applicator = target.decorators();
    } else {
      applicator = target.decorators;
    }
    if (typeof applicator._decorate === 'function') {
      delete target.decorators;
      applicator._decorate(target);
    } else {
      throw new Error('The return value of your decorator\'s method was not valid.');
    }
  }
  var Metadata = {
    global: theGlobal,
    noop: function noop() {},
    resource: 'aurelia:resource',
    paramTypes: 'design:paramtypes',
    properties: 'design:properties',
    get: function get(metadataKey, target, targetKey) {
      if (!target) {
        return undefined;
      }
      var result = Metadata.getOwn(metadataKey, target, targetKey);
      return result === undefined ? Metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
    },
    getOwn: function getOwn(metadataKey, target, targetKey) {
      if (!target) {
        return undefined;
      }
      if (target.hasOwnProperty('decorators')) {
        ensureDecorators(target);
      }
      return Reflect.getOwnMetadata(metadataKey, target, targetKey);
    },
    define: function define(metadataKey, metadataValue, target, targetKey) {
      Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
    },
    getOrCreateOwn: function getOrCreateOwn(metadataKey, Type, target, targetKey) {
      var result = Metadata.getOwn(metadataKey, target, targetKey);
      if (result === undefined) {
        result = new Type();
        Reflect.defineMetadata(metadataKey, result, target, targetKey);
      }
      return result;
    }
  };
  exports.Metadata = Metadata;
  var originStorage = new Map();
  var unknownOrigin = Object.freeze({
    moduleId: undefined,
    moduleMember: undefined
  });
  var Origin = (function() {
    function Origin(moduleId, moduleMember) {
      _classCallCheck(this, Origin);
      this.moduleId = moduleId;
      this.moduleMember = moduleMember;
    }
    Origin.get = function get(fn) {
      var origin = originStorage.get(fn);
      if (origin === undefined) {
        System.forEachModule(function(key, value) {
          for (var _name in value) {
            var exp = value[_name];
            if (exp === fn) {
              originStorage.set(fn, origin = new Origin(key, _name));
              return true;
            }
          }
          if (value === fn) {
            originStorage.set(fn, origin = new Origin(key, 'default'));
            return true;
          }
        });
      }
      return origin || unknownOrigin;
    };
    Origin.set = function set(fn, origin) {
      originStorage.set(fn, origin);
    };
    return Origin;
  })();
  exports.Origin = Origin;
  var DecoratorApplicator = (function() {
    function DecoratorApplicator() {
      _classCallCheck(this, DecoratorApplicator);
      this._first = null;
      this._second = null;
      this._third = null;
      this._rest = null;
    }
    DecoratorApplicator.prototype.decorator = (function(_decorator) {
      function decorator(_x) {
        return _decorator.apply(this, arguments);
      }
      decorator.toString = function() {
        return _decorator.toString();
      };
      return decorator;
    })(function(decorator) {
      if (this._first === null) {
        this._first = decorator;
        return this;
      }
      if (this._second === null) {
        this._second = decorator;
        return this;
      }
      if (this._third === null) {
        this._third = decorator;
        return this;
      }
      if (this._rest === null) {
        this._rest = [];
      }
      this._rest.push(decorator);
      return this;
    });
    DecoratorApplicator.prototype._decorate = function _decorate(target) {
      if (this._first !== null) {
        this._first(target);
      }
      if (this._second !== null) {
        this._second(target);
      }
      if (this._third !== null) {
        this._third(target);
      }
      var rest = this._rest;
      if (rest !== null) {
        for (var i = 0,
            ii = rest.length; i < ii; ++i) {
          rest[i](target);
        }
      }
    };
    return DecoratorApplicator;
  })();
  exports.DecoratorApplicator = DecoratorApplicator;
  var Decorators = {configure: {
      parameterizedDecorator: function parameterizedDecorator(name, decorator) {
        Decorators[name] = function() {
          var applicator = new DecoratorApplicator();
          return applicator[name].apply(applicator, arguments);
        };
        DecoratorApplicator.prototype[name] = function() {
          var result = decorator.apply(null, arguments);
          return this.decorator(result);
        };
      },
      simpleDecorator: function simpleDecorator(name, decorator) {
        Decorators[name] = function() {
          return new DecoratorApplicator().decorator(decorator);
        };
        DecoratorApplicator.prototype[name] = function() {
          return this.decorator(decorator);
        };
      }
    }};
  exports.Decorators = Decorators;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/metadata@0.8.0", ["github:aurelia/metadata@0.8.0/aurelia-metadata"], function(main) {
  return main;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/logging@0.7.0/aurelia-logging", ["exports"], function(exports) {
  'use strict';
  exports.__esModule = true;
  exports.AggregateError = AggregateError;
  exports.getLogger = getLogger;
  exports.addAppender = addAppender;
  exports.setLevel = setLevel;
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  function AggregateError(message, innerError, skipIfAlreadyAggregate) {
    if (innerError) {
      if (innerError.innerError && skipIfAlreadyAggregate) {
        return innerError;
      }
      if (innerError.stack) {
        message += '\n------------------------------------------------\ninner error: ' + innerError.stack;
      }
    }
    var e = new Error(message);
    if (innerError) {
      e.innerError = innerError;
    }
    return e;
  }
  var logLevel = {
    none: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  };
  exports.logLevel = logLevel;
  var loggers = {};
  var currentLevel = logLevel.none;
  var appenders = [];
  var slice = Array.prototype.slice;
  var loggerConstructionKey = {};
  function log(logger, level, args) {
    var i = appenders.length;
    var current = undefined;
    args = slice.call(args);
    args.unshift(logger);
    while (i--) {
      current = appenders[i];
      current[level].apply(current, args);
    }
  }
  function debug() {
    if (currentLevel < 4) {
      return;
    }
    log(this, 'debug', arguments);
  }
  function info() {
    if (currentLevel < 3) {
      return;
    }
    log(this, 'info', arguments);
  }
  function warn() {
    if (currentLevel < 2) {
      return;
    }
    log(this, 'warn', arguments);
  }
  function error() {
    if (currentLevel < 1) {
      return;
    }
    log(this, 'error', arguments);
  }
  function connectLogger(logger) {
    logger.debug = debug;
    logger.info = info;
    logger.warn = warn;
    logger.error = error;
  }
  function createLogger(id) {
    var logger = new Logger(id, loggerConstructionKey);
    if (appenders.length) {
      connectLogger(logger);
    }
    return logger;
  }
  function getLogger(id) {
    return loggers[id] || (loggers[id] = createLogger(id));
  }
  function addAppender(appender) {
    appenders.push(appender);
    if (appenders.length === 1) {
      for (var key in loggers) {
        connectLogger(loggers[key]);
      }
    }
  }
  function setLevel(level) {
    currentLevel = level;
  }
  var Logger = (function() {
    function Logger(id, key) {
      _classCallCheck(this, Logger);
      if (key !== loggerConstructionKey) {
        throw new Error('You cannot instantiate "Logger". Use the "getLogger" API instead.');
      }
      this.id = id;
    }
    Logger.prototype.debug = function debug(message) {};
    Logger.prototype.info = function info(message) {};
    Logger.prototype.warn = function warn(message) {};
    Logger.prototype.error = function error(message) {};
    return Logger;
  })();
  exports.Logger = Logger;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/logging@0.7.0", ["github:aurelia/logging@0.7.0/aurelia-logging"], function(main) {
  return main;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/dependency-injection@0.10.1/aurelia-dependency-injection", ["exports", "npm:core-js@0.9.18", "github:aurelia/metadata@0.8.0", "github:aurelia/logging@0.7.0"], function(exports, _coreJs, _aureliaMetadata, _aureliaLogging) {
  'use strict';
  exports.__esModule = true;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.autoinject = autoinject;
  exports.inject = inject;
  exports.registration = registration;
  exports.transient = transient;
  exports.singleton = singleton;
  exports.instanceActivator = instanceActivator;
  exports.factory = factory;
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var TransientRegistration = (function() {
    function TransientRegistration(key) {
      _classCallCheck(this, TransientRegistration);
      this.key = key;
    }
    TransientRegistration.prototype.register = function register(container, key, fn) {
      container.registerTransient(this.key || key, fn);
    };
    return TransientRegistration;
  })();
  exports.TransientRegistration = TransientRegistration;
  var SingletonRegistration = (function() {
    function SingletonRegistration(keyOrRegisterInChild) {
      var registerInChild = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      _classCallCheck(this, SingletonRegistration);
      if (typeof keyOrRegisterInChild === 'boolean') {
        this.registerInChild = keyOrRegisterInChild;
      } else {
        this.key = keyOrRegisterInChild;
        this.registerInChild = registerInChild;
      }
    }
    SingletonRegistration.prototype.register = function register(container, key, fn) {
      var destination = this.registerInChild ? container : container.root;
      destination.registerSingleton(this.key || key, fn);
    };
    return SingletonRegistration;
  })();
  exports.SingletonRegistration = SingletonRegistration;
  var Resolver = (function() {
    function Resolver() {
      _classCallCheck(this, Resolver);
    }
    Resolver.prototype.get = function get(container) {
      throw new Error('A custom Resolver must implement get(container) and return the resolved instance(s).');
    };
    return Resolver;
  })();
  exports.Resolver = Resolver;
  var Lazy = (function(_Resolver) {
    _inherits(Lazy, _Resolver);
    function Lazy(key) {
      _classCallCheck(this, Lazy);
      _Resolver.call(this);
      this.key = key;
    }
    Lazy.prototype.get = function get(container) {
      var _this = this;
      return function() {
        return container.get(_this.key);
      };
    };
    Lazy.of = function of(key) {
      return new Lazy(key);
    };
    return Lazy;
  })(Resolver);
  exports.Lazy = Lazy;
  var All = (function(_Resolver2) {
    _inherits(All, _Resolver2);
    function All(key) {
      _classCallCheck(this, All);
      _Resolver2.call(this);
      this.key = key;
    }
    All.prototype.get = function get(container) {
      return container.getAll(this.key);
    };
    All.of = function of(key) {
      return new All(key);
    };
    return All;
  })(Resolver);
  exports.All = All;
  var Optional = (function(_Resolver3) {
    _inherits(Optional, _Resolver3);
    function Optional(key) {
      var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      _classCallCheck(this, Optional);
      _Resolver3.call(this);
      this.key = key;
      this.checkParent = checkParent;
    }
    Optional.prototype.get = function get(container) {
      if (container.hasHandler(this.key, this.checkParent)) {
        return container.get(this.key);
      }
      return null;
    };
    Optional.of = function of(key) {
      var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      return new Optional(key, checkParent);
    };
    return Optional;
  })(Resolver);
  exports.Optional = Optional;
  var Parent = (function(_Resolver4) {
    _inherits(Parent, _Resolver4);
    function Parent(key) {
      _classCallCheck(this, Parent);
      _Resolver4.call(this);
      this.key = key;
    }
    Parent.prototype.get = function get(container) {
      return container.parent ? container.parent.get(this.key) : null;
    };
    Parent.of = function of(key) {
      return new Parent(key);
    };
    return Parent;
  })(Resolver);
  exports.Parent = Parent;
  var ClassActivator = (function() {
    function ClassActivator() {
      _classCallCheck(this, ClassActivator);
    }
    ClassActivator.prototype.invoke = function invoke(fn, args) {
      return Reflect.construct(fn, args);
    };
    _createClass(ClassActivator, null, [{
      key: 'instance',
      value: new ClassActivator(),
      enumerable: true
    }]);
    return ClassActivator;
  })();
  exports.ClassActivator = ClassActivator;
  var FactoryActivator = (function() {
    function FactoryActivator() {
      _classCallCheck(this, FactoryActivator);
    }
    FactoryActivator.prototype.invoke = function invoke(fn, args) {
      return fn.apply(undefined, args);
    };
    _createClass(FactoryActivator, null, [{
      key: 'instance',
      value: new FactoryActivator(),
      enumerable: true
    }]);
    return FactoryActivator;
  })();
  exports.FactoryActivator = FactoryActivator;
  var badKeyError = 'key/value cannot be null or undefined. Are you trying to inject/register something that doesn\'t exist with DI?';
  _aureliaMetadata.Metadata.registration = 'aurelia:registration';
  _aureliaMetadata.Metadata.instanceActivator = 'aurelia:instance-activator';
  function test() {}
  if (!test.name) {
    Object.defineProperty(Function.prototype, 'name', {get: function get() {
        var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
        Object.defineProperty(this, 'name', {value: name});
        return name;
      }});
  }
  var emptyParameters = Object.freeze([]);
  exports.emptyParameters = emptyParameters;
  var Container = (function() {
    function Container(constructionInfo) {
      _classCallCheck(this, Container);
      this.constructionInfo = constructionInfo || new Map();
      this.entries = new Map();
      this.root = this;
    }
    Container.prototype.makeGlobal = function makeGlobal() {
      Container.instance = this;
      return this;
    };
    Container.prototype.registerInstance = function registerInstance(key, instance) {
      this.registerHandler(key, function(x) {
        return instance;
      });
    };
    Container.prototype.registerTransient = function registerTransient(key, fn) {
      fn = fn || key;
      this.registerHandler(key, function(x) {
        return x.invoke(fn);
      });
    };
    Container.prototype.registerSingleton = function registerSingleton(key, fn) {
      var singleton = null;
      fn = fn || key;
      this.registerHandler(key, function(x) {
        return singleton || (singleton = x.invoke(fn));
      });
    };
    Container.prototype.autoRegister = function autoRegister(fn, key) {
      var registration = undefined;
      if (fn === null || fn === undefined) {
        throw new Error(badKeyError);
      }
      if (typeof fn === 'function') {
        registration = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.registration, fn);
        if (registration !== undefined) {
          registration.register(this, key || fn, fn);
        } else {
          this.registerSingleton(key || fn, fn);
        }
      } else {
        this.registerInstance(fn, fn);
      }
    };
    Container.prototype.autoRegisterAll = function autoRegisterAll(fns) {
      var i = fns.length;
      while (i--) {
        this.autoRegister(fns[i]);
      }
    };
    Container.prototype.registerHandler = function registerHandler(key, handler) {
      this._getOrCreateEntry(key).push(handler);
    };
    Container.prototype.unregister = function unregister(key) {
      this.entries['delete'](key);
    };
    Container.prototype.get = function get(key) {
      var entry = undefined;
      if (key === null || key === undefined) {
        throw new Error(badKeyError);
      }
      if (key === Container) {
        return this;
      }
      if (key instanceof Resolver) {
        return key.get(this);
      }
      entry = this.entries.get(key);
      if (entry !== undefined) {
        return entry[0](this);
      }
      if (this.parent) {
        return this.parent.get(key);
      }
      this.autoRegister(key);
      entry = this.entries.get(key);
      return entry[0](this);
    };
    Container.prototype.getAll = function getAll(key) {
      var _this2 = this;
      var entry = undefined;
      if (key === null || key === undefined) {
        throw new Error(badKeyError);
      }
      entry = this.entries.get(key);
      if (entry !== undefined) {
        return entry.map(function(x) {
          return x(_this2);
        });
      }
      if (this.parent) {
        return this.parent.getAll(key);
      }
      return [];
    };
    Container.prototype.hasHandler = function hasHandler(key) {
      var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      if (key === null || key === undefined) {
        throw new Error(badKeyError);
      }
      return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
    };
    Container.prototype.createChild = function createChild() {
      var childContainer = new Container(this.constructionInfo);
      childContainer.parent = this;
      childContainer.root = this.root;
      return childContainer;
    };
    Container.prototype.invoke = function invoke(fn, deps) {
      var info = undefined;
      var i = undefined;
      var ii = undefined;
      var keys = undefined;
      var args = undefined;
      try {
        info = this._getOrCreateConstructionInfo(fn);
        keys = info.keys;
        args = new Array(keys.length);
        for (i = 0, ii = keys.length; i < ii; ++i) {
          args[i] = this.get(keys[i]);
        }
        if (deps !== undefined) {
          args = args.concat(deps);
        }
        return info.activator.invoke(fn, args);
      } catch (e) {
        var activatingText = info && info.activator instanceof ClassActivator ? 'instantiating' : 'invoking';
        var message = 'Error ' + activatingText + ' ' + fn.name + '.';
        if (i < ii) {
          message += ' The argument at index ' + i + ' (key:' + keys[i] + ') could not be satisfied.';
        }
        message += ' Check the inner error for details.';
        throw new _aureliaLogging.AggregateError(message, e, true);
      }
    };
    Container.prototype._getOrCreateEntry = function _getOrCreateEntry(key) {
      var entry = undefined;
      if (key === null || key === undefined) {
        throw new Error('key cannot be null or undefined.  (Are you trying to inject something that doesn\'t exist with DI?)');
      }
      entry = this.entries.get(key);
      if (entry === undefined) {
        entry = [];
        this.entries.set(key, entry);
      }
      return entry;
    };
    Container.prototype._getOrCreateConstructionInfo = function _getOrCreateConstructionInfo(fn) {
      var info = this.constructionInfo.get(fn);
      if (info === undefined) {
        info = this._createConstructionInfo(fn);
        this.constructionInfo.set(fn, info);
      }
      return info;
    };
    Container.prototype._createConstructionInfo = function _createConstructionInfo(fn) {
      var info = {activator: _aureliaMetadata.Metadata.getOwn(_aureliaMetadata.Metadata.instanceActivator, fn) || ClassActivator.instance};
      if (fn.inject !== undefined) {
        if (typeof fn.inject === 'function') {
          info.keys = fn.inject();
        } else {
          info.keys = fn.inject;
        }
        return info;
      }
      info.keys = _aureliaMetadata.Metadata.getOwn(_aureliaMetadata.Metadata.paramTypes, fn) || emptyParameters;
      return info;
    };
    return Container;
  })();
  exports.Container = Container;
  function autoinject(potentialTarget) {
    var deco = function deco(target) {
      target.inject = _aureliaMetadata.Metadata.getOwn(_aureliaMetadata.Metadata.paramTypes, target) || emptyParameters;
    };
    return potentialTarget ? deco(potentialTarget) : deco;
  }
  function inject() {
    for (var _len = arguments.length,
        rest = Array(_len),
        _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }
    return function(target) {
      target.inject = rest;
    };
  }
  function registration(value) {
    return function(target) {
      _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.registration, value, target);
    };
  }
  function transient(key) {
    return registration(new TransientRegistration(key));
  }
  function singleton(keyOrRegisterInChild) {
    var registerInChild = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    return registration(new SingletonRegistration(keyOrRegisterInChild, registerInChild));
  }
  function instanceActivator(value) {
    return function(target) {
      _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.instanceActivator, value, target);
    };
  }
  function factory() {
    return instanceActivator(FactoryActivator.instance);
  }
  _aureliaMetadata.Decorators.configure.simpleDecorator('autoinject', autoinject);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('inject', inject);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('registration', registration);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('transient', transient);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('singleton', singleton);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('instanceActivator', instanceActivator);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('factory', factory);
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("aurelia-dependency-injection", ["github:aurelia/dependency-injection@0.10.1/aurelia-dependency-injection"], function(main) {
  return main;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/event-aggregator@0.8.0/aurelia-event-aggregator", ["exports", "github:aurelia/logging@0.7.0"], function(exports, _aureliaLogging) {
  'use strict';
  exports.__esModule = true;
  exports.includeEventsIn = includeEventsIn;
  exports.configure = configure;
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var logger = _aureliaLogging.getLogger('event-aggregator');
  var Handler = (function() {
    function Handler(messageType, callback) {
      _classCallCheck(this, Handler);
      this.messageType = messageType;
      this.callback = callback;
    }
    Handler.prototype.handle = function handle(message) {
      if (message instanceof this.messageType) {
        this.callback.call(null, message);
      }
    };
    return Handler;
  })();
  var EventAggregator = (function() {
    function EventAggregator() {
      _classCallCheck(this, EventAggregator);
      this.eventLookup = {};
      this.messageHandlers = [];
    }
    EventAggregator.prototype.publish = function publish(event, data) {
      var subscribers = undefined;
      var i = undefined;
      if (typeof event === 'string') {
        subscribers = this.eventLookup[event];
        if (subscribers) {
          subscribers = subscribers.slice();
          i = subscribers.length;
          try {
            while (i--) {
              subscribers[i](data, event);
            }
          } catch (e) {
            logger.error(e);
          }
        }
      } else {
        subscribers = this.messageHandlers.slice();
        i = subscribers.length;
        try {
          while (i--) {
            subscribers[i].handle(event);
          }
        } catch (e) {
          logger.error(e);
        }
      }
    };
    EventAggregator.prototype.subscribe = function subscribe(event, callback) {
      var subscribers = undefined;
      var handler = undefined;
      if (typeof event === 'string') {
        subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
        subscribers.push(callback);
        return function() {
          var idx = subscribers.indexOf(callback);
          if (idx !== -1) {
            subscribers.splice(idx, 1);
          }
        };
      }
      handler = new Handler(event, callback);
      subscribers = this.messageHandlers;
      subscribers.push(handler);
      return function() {
        var idx = subscribers.indexOf(handler);
        if (idx !== -1) {
          subscribers.splice(idx, 1);
        }
      };
    };
    EventAggregator.prototype.subscribeOnce = function subscribeOnce(event, callback) {
      var sub = this.subscribe(event, function(a, b) {
        sub();
        return callback(a, b);
      });
      return sub;
    };
    return EventAggregator;
  })();
  exports.EventAggregator = EventAggregator;
  function includeEventsIn(obj) {
    var ea = new EventAggregator();
    obj.subscribeOnce = function(event, callback) {
      return ea.subscribeOnce(event, callback);
    };
    obj.subscribe = function(event, callback) {
      return ea.subscribe(event, callback);
    };
    obj.publish = function(event, data) {
      ea.publish(event, data);
    };
    return ea;
  }
  function configure(config) {
    config.instance(EventAggregator, includeEventsIn(config.aurelia));
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/event-aggregator@0.8.0", ["github:aurelia/event-aggregator@0.8.0/aurelia-event-aggregator"], function(main) {
  return main;
});

_removeDefine();
})();
System.register("app", ["aurelia-dependency-injection", "github:aurelia/event-aggregator@0.8.0"], function(_export) {
  'use strict';
  var inject,
      EventAggregator,
      App;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  return {
    setters: [function(_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function(_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }],
    execute: function() {
      App = (function() {
        function App(events) {
          _classCallCheck(this, _App);
          events.subscribe('router:navigation:complete', this.navigationComplete);
        }
        _createClass(App, [{
          key: 'configureRouter',
          value: function configureRouter(config, router) {
            config.title = 'Aurelia';
            config.map([{
              route: ['', 'welcome'],
              name: 'welcome',
              moduleId: 'welcome',
              nav: true,
              title: 'Welcome'
            }, {
              route: 'users',
              name: 'users',
              moduleId: 'users',
              nav: true,
              title: 'Github Users'
            }, {
              route: 'child-router',
              name: 'child-router',
              moduleId: 'child-router',
              nav: true,
              title: 'Child Router'
            }]);
            this.router = router;
          }
        }, {
          key: 'navigationComplete',
          value: function navigationComplete(navigationInstruction) {
            Waves.displayEffect();
          }
        }, {
          key: 'attached',
          value: function attached() {
            $(".button-collapse").sideNav({closeOnClick: true});
          }
        }]);
        var _App = App;
        App = inject(EventAggregator)(App) || App;
        return App;
      })();
      _export('App', App);
    }
  };
});

System.registerDynamic("app.html!github:systemjs/plugin-text@0.0.2", [], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = "<template>\r\n    <nav>\r\n        <div class=\"nav-wrapper\">\r\n            <a href=\"#\" class=\"brand-logo waves-effect waves-light\">&nbsp;${router.title}</a>\r\n            <a href=\"#\" data-activates=\"mobile-demo\" class=\"button-collapse\" materialize=\"sidenav\">\r\n                <i class=\"mdi-navigation-menu\"></i>\r\n            </a>\r\n            <ul class=\"right hide-on-med-and-down\">\r\n                <li repeat.for=\"route of router.navigation\" class=\"${route.isActive ? 'active' : ''}\">\r\n                    <a href.bind=\"route.href\" class=\"waves-effect waves-light\">${route.title}</a>\r\n                </li>\r\n            </ul>\r\n            <ul class=\"side-nav\" id=\"mobile-demo\">\r\n                <li repeat.for=\"route of router.navigation\" class=\"${route.isActive ? 'active' : ''}\">\r\n                    <a href.bind=\"route.href\" class=\"waves-effect waves-light\">${route.title}</a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </nav>\r\n    <div class=\"page-host\">\r\n        <router-view></router-view>\r\n    </div>\r\n</template>\r\n";
  global.define = __define;
  return module.exports;
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/path@0.9.0/aurelia-path", ["exports"], function(exports) {
  'use strict';
  exports.__esModule = true;
  exports.relativeToFile = relativeToFile;
  exports.join = join;
  exports.buildQueryString = buildQueryString;
  exports.parseQueryString = parseQueryString;
  function trimDots(ary) {
    for (var i = 0; i < ary.length; ++i) {
      var part = ary[i];
      if (part === '.') {
        ary.splice(i, 1);
        i -= 1;
      } else if (part === '..') {
        if (i === 0 || i === 1 && ary[2] === '..' || ary[i - 1] === '..') {
          continue;
        } else if (i > 0) {
          ary.splice(i - 1, 2);
          i -= 2;
        }
      }
    }
  }
  function relativeToFile(name, file) {
    var fileParts = file && file.split('/');
    var nameParts = name.trim().split('/');
    if (nameParts[0].charAt(0) === '.' && fileParts) {
      var normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
      nameParts.unshift.apply(nameParts, normalizedBaseParts);
    }
    trimDots(nameParts);
    return nameParts.join('/');
  }
  function join(path1, path2) {
    if (!path1) {
      return path2;
    }
    if (!path2) {
      return path1;
    }
    var schemeMatch = path1.match(/^([^/]*?:)\//);
    var scheme = schemeMatch && schemeMatch.length > 0 ? schemeMatch[1] : '';
    path1 = path1.substr(scheme.length);
    var urlPrefix = undefined;
    if (path1.indexOf('///') === 0 && scheme === 'file:') {
      urlPrefix = '///';
    } else if (path1.indexOf('//') === 0) {
      urlPrefix = '//';
    } else if (path1.indexOf('/') === 0) {
      urlPrefix = '/';
    } else {
      urlPrefix = '';
    }
    var trailingSlash = path2.slice(-1) === '/' ? '/' : '';
    var url1 = path1.split('/');
    var url2 = path2.split('/');
    var url3 = [];
    for (var i = 0,
        ii = url1.length; i < ii; ++i) {
      if (url1[i] === '..') {
        url3.pop();
      } else if (url1[i] === '.' || url1[i] === '') {
        continue;
      } else {
        url3.push(url1[i]);
      }
    }
    for (var i = 0,
        ii = url2.length; i < ii; ++i) {
      if (url2[i] === '..') {
        url3.pop();
      } else if (url2[i] === '.' || url2[i] === '') {
        continue;
      } else {
        url3.push(url2[i]);
      }
    }
    return scheme + urlPrefix + url3.join('/') + trailingSlash;
  }
  function buildQueryString(params) {
    var pairs = [];
    var keys = Object.keys(params || {}).sort();
    var encode = encodeURIComponent;
    var encodeKey = function encodeKey(k) {
      return encode(k).replace('%24', '$');
    };
    for (var i = 0,
        len = keys.length; i < len; i++) {
      var key = keys[i];
      var value = params[key];
      if (value === null || value === undefined) {
        continue;
      }
      if (Array.isArray(value)) {
        var arrayKey = encodeKey(key) + '[]';
        for (var j = 0,
            l = value.length; j < l; j++) {
          pairs.push(arrayKey + '=' + encode(value[j]));
        }
      } else {
        pairs.push(encodeKey(key) + '=' + encode(value));
      }
    }
    if (pairs.length === 0) {
      return '';
    }
    return pairs.join('&');
  }
  function parseQueryString(queryString) {
    var queryParams = {};
    if (!queryString || typeof queryString !== 'string') {
      return queryParams;
    }
    var query = queryString;
    if (query.charAt(0) === '?') {
      query = query.substr(1);
    }
    var pairs = query.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      var key = decodeURIComponent(pair[0]);
      var keyLength = key.length;
      var isArray = false;
      var value = undefined;
      if (!key) {
        continue;
      } else if (pair.length === 1) {
        value = true;
      } else {
        if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
          isArray = true;
          key = key.slice(0, keyLength - 2);
          if (!queryParams[key]) {
            queryParams[key] = [];
          }
        }
        value = pair[1] ? decodeURIComponent(pair[1]) : '';
      }
      if (isArray) {
        queryParams[key].push(value);
      } else {
        queryParams[key] = value;
      }
    }
    return queryParams;
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/path@0.9.0", ["github:aurelia/path@0.9.0/aurelia-path"], function(main) {
  return main;
});

_removeDefine();
})();
System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.fw", [], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function($) {
    $.FW = true;
    $.path = $.g;
    return $;
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$", ["github:zloirock/core-js@0.8.4/modules/$.fw"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var global = typeof self != 'undefined' ? self : Function('return this')(),
      core = {},
      defineProperty = Object.defineProperty,
      hasOwnProperty = {}.hasOwnProperty,
      ceil = Math.ceil,
      floor = Math.floor,
      max = Math.max,
      min = Math.min;
  var DESC = !!function() {
    try {
      return defineProperty({}, 'a', {get: function() {
          return 2;
        }}).a == 2;
    } catch (e) {}
  }();
  var hide = createDefiner(1);
  function toInteger(it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  }
  function desc(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  }
  function simpleSet(object, key, value) {
    object[key] = value;
    return object;
  }
  function createDefiner(bitmap) {
    return DESC ? function(object, key, value) {
      return $.setDesc(object, key, desc(bitmap, value));
    } : simpleSet;
  }
  function isObject(it) {
    return it !== null && (typeof it == 'object' || typeof it == 'function');
  }
  function isFunction(it) {
    return typeof it == 'function';
  }
  function assertDefined(it) {
    if (it == undefined)
      throw TypeError("Can't call method on  " + it);
    return it;
  }
  var $ = module.exports = require("github:zloirock/core-js@0.8.4/modules/$.fw")({
    g: global,
    core: core,
    html: global.document && document.documentElement,
    isObject: isObject,
    isFunction: isFunction,
    it: function(it) {
      return it;
    },
    that: function() {
      return this;
    },
    toInteger: toInteger,
    toLength: function(it) {
      return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
    },
    toIndex: function(index, length) {
      index = toInteger(index);
      return index < 0 ? max(index + length, 0) : min(index, length);
    },
    has: function(it, key) {
      return hasOwnProperty.call(it, key);
    },
    create: Object.create,
    getProto: Object.getPrototypeOf,
    DESC: DESC,
    desc: desc,
    getDesc: Object.getOwnPropertyDescriptor,
    setDesc: defineProperty,
    getKeys: Object.keys,
    getNames: Object.getOwnPropertyNames,
    getSymbols: Object.getOwnPropertySymbols,
    assertDefined: assertDefined,
    ES5Object: Object,
    toObject: function(it) {
      return $.ES5Object(assertDefined(it));
    },
    hide: hide,
    def: createDefiner(0),
    set: global.Symbol ? simpleSet : hide,
    mix: function(target, src) {
      for (var key in src)
        hide(target, key, src[key]);
      return target;
    },
    each: [].forEach
  });
  if (typeof __e != 'undefined')
    __e = core;
  if (typeof __g != 'undefined')
    __g = global;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.uid", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var sid = 0;
  function uid(key) {
    return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
  }
  uid.safe = require("github:zloirock/core-js@0.8.4/modules/$").g.Symbol || uid;
  module.exports = uid;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.wks", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.uid"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var global = require("github:zloirock/core-js@0.8.4/modules/$").g,
      store = {};
  module.exports = function(name) {
    return store[name] || (store[name] = global.Symbol && global.Symbol[name] || require("github:zloirock/core-js@0.8.4/modules/$.uid").safe('Symbol.' + name));
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.cof", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.wks"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      TAG = require("github:zloirock/core-js@0.8.4/modules/$.wks")('toStringTag'),
      toString = {}.toString;
  function cof(it) {
    return toString.call(it).slice(8, -1);
  }
  cof.classof = function(it) {
    var O,
        T;
    return it == undefined ? it === undefined ? 'Undefined' : 'Null' : typeof(T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
  };
  cof.set = function(it, tag, stat) {
    if (it && !$.has(it = stat ? it : it.prototype, TAG))
      $.hide(it, TAG, tag);
  };
  module.exports = cof;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.def", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      global = $.g,
      core = $.core,
      isFunction = $.isFunction;
  function ctx(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }
  global.core = core;
  $def.F = 1;
  $def.G = 2;
  $def.S = 4;
  $def.P = 8;
  $def.B = 16;
  $def.W = 32;
  function $def(type, name, source) {
    var key,
        own,
        out,
        exp,
        isGlobal = type & $def.G,
        target = isGlobal ? global : type & $def.S ? global[name] : (global[name] || {}).prototype,
        exports = isGlobal ? core : core[name] || (core[name] = {});
    if (isGlobal)
      source = name;
    for (key in source) {
      own = !(type & $def.F) && target && key in target;
      out = (own ? target : source)[key];
      if (type & $def.B && own)
        exp = ctx(out, global);
      else
        exp = type & $def.P && isFunction(out) ? ctx(Function.call, out) : out;
      if (target && !own) {
        if (isGlobal)
          target[key] = out;
        else
          delete target[key] && $.hide(target, key, out);
      }
      if (exports[key] != out)
        $.hide(exports, key, exp);
    }
  }
  module.exports = $def;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.invoke", [], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = function(fn, args, that) {
    var un = that === undefined;
    switch (args.length) {
      case 0:
        return un ? fn() : fn.call(that);
      case 1:
        return un ? fn(args[0]) : fn.call(that, args[0]);
      case 2:
        return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
      case 3:
        return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
      case 4:
        return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
      case 5:
        return un ? fn(args[0], args[1], args[2], args[3], args[4]) : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
    }
    return fn.apply(that, args);
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.assert", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$");
  function assert(condition, msg1, msg2) {
    if (!condition)
      throw TypeError(msg2 ? msg1 + msg2 : msg1);
  }
  assert.def = $.assertDefined;
  assert.fn = function(it) {
    if (!$.isFunction(it))
      throw TypeError(it + ' is not a function!');
    return it;
  };
  assert.obj = function(it) {
    if (!$.isObject(it))
      throw TypeError(it + ' is not an object!');
    return it;
  };
  assert.inst = function(it, Constructor, name) {
    if (!(it instanceof Constructor))
      throw TypeError(name + ": use the 'new' operator!");
    return it;
  };
  module.exports = assert;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.ctx", ["github:zloirock/core-js@0.8.4/modules/$.assert"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var assertFunction = require("github:zloirock/core-js@0.8.4/modules/$.assert").fn;
  module.exports = function(fn, that, length) {
    assertFunction(fn);
    if (~length && that === undefined)
      return fn;
    switch (length) {
      case 1:
        return function(a) {
          return fn.call(that, a);
        };
      case 2:
        return function(a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function(a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function() {
      return fn.apply(that, arguments);
    };
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.array-methods", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx");
  module.exports = function(TYPE) {
    var IS_MAP = TYPE == 1,
        IS_FILTER = TYPE == 2,
        IS_SOME = TYPE == 3,
        IS_EVERY = TYPE == 4,
        IS_FIND_INDEX = TYPE == 6,
        NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function(callbackfn) {
      var O = Object($.assertDefined(this)),
          self = $.ES5Object(O),
          f = ctx(callbackfn, arguments[1], 3),
          length = $.toLength(self.length),
          index = 0,
          result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined,
          val,
          res;
      for (; length > index; index++)
        if (NO_HOLES || index in self) {
          val = self[index];
          res = f(val, index, O);
          if (TYPE) {
            if (IS_MAP)
              result[index] = res;
            else if (res)
              switch (TYPE) {
                case 3:
                  return true;
                case 5:
                  return val;
                case 6:
                  return index;
                case 2:
                  result.push(val);
              }
            else if (IS_EVERY)
              return false;
          }
        }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
    };
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.array-includes", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$");
  module.exports = function(IS_INCLUDES) {
    return function(el) {
      var O = $.toObject(this),
          length = $.toLength(O.length),
          index = $.toIndex(arguments[1], length),
          value;
      if (IS_INCLUDES && el != el)
        while (length > index) {
          value = O[index++];
          if (value != value)
            return true;
        }
      else
        for (; length > index; index++)
          if (IS_INCLUDES || index in O) {
            if (O[index] === el)
              return IS_INCLUDES || index;
          }
      return !IS_INCLUDES && -1;
    };
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.replacer", [], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  module.exports = function(regExp, replace, isStatic) {
    var replacer = replace === Object(replace) ? function(part) {
      return replace[part];
    } : replace;
    return function(it) {
      return String(isStatic ? it : this).replace(regExp, replacer);
    };
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es5", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.invoke", "github:zloirock/core-js@0.8.4/modules/$.array-methods", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.array-includes", "github:zloirock/core-js@0.8.4/modules/$.replacer"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      invoke = require("github:zloirock/core-js@0.8.4/modules/$.invoke"),
      arrayMethod = require("github:zloirock/core-js@0.8.4/modules/$.array-methods"),
      IE_PROTO = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe('__proto__'),
      assert = require("github:zloirock/core-js@0.8.4/modules/$.assert"),
      assertObject = assert.obj,
      ObjectProto = Object.prototype,
      A = [],
      slice = A.slice,
      indexOf = A.indexOf,
      classof = cof.classof,
      defineProperties = Object.defineProperties,
      has = $.has,
      defineProperty = $.setDesc,
      getOwnDescriptor = $.getDesc,
      isFunction = $.isFunction,
      toObject = $.toObject,
      toLength = $.toLength,
      IE8_DOM_DEFINE = false;
  if (!$.DESC) {
    try {
      IE8_DOM_DEFINE = defineProperty(document.createElement('div'), 'x', {get: function() {
          return 8;
        }}).x == 8;
    } catch (e) {}
    $.setDesc = function(O, P, Attributes) {
      if (IE8_DOM_DEFINE)
        try {
          return defineProperty(O, P, Attributes);
        } catch (e) {}
      if ('get' in Attributes || 'set' in Attributes)
        throw TypeError('Accessors not supported!');
      if ('value' in Attributes)
        assertObject(O)[P] = Attributes.value;
      return O;
    };
    $.getDesc = function(O, P) {
      if (IE8_DOM_DEFINE)
        try {
          return getOwnDescriptor(O, P);
        } catch (e) {}
      if (has(O, P))
        return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
    };
    defineProperties = function(O, Properties) {
      assertObject(O);
      var keys = $.getKeys(Properties),
          length = keys.length,
          i = 0,
          P;
      while (length > i)
        $.setDesc(O, P = keys[i++], Properties[P]);
      return O;
    };
  }
  $def($def.S + $def.F * !$.DESC, 'Object', {
    getOwnPropertyDescriptor: $.getDesc,
    defineProperty: $.setDesc,
    defineProperties: defineProperties
  });
  var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' + 'toLocaleString,toString,valueOf').split(','),
      keys2 = keys1.concat('length', 'prototype'),
      keysLen1 = keys1.length;
  var createDict = function() {
    var iframe = document.createElement('iframe'),
        i = keysLen1,
        gt = '>',
        iframeDocument;
    iframe.style.display = 'none';
    $.html.appendChild(iframe);
    iframe.src = 'javascript:';
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write('<script>document.F=Object</script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--)
      delete createDict.prototype[keys1[i]];
    return createDict();
  };
  function createGetKeys(names, length) {
    return function(object) {
      var O = toObject(object),
          i = 0,
          result = [],
          key;
      for (key in O)
        if (key != IE_PROTO)
          has(O, key) && result.push(key);
      while (length > i)
        if (has(O, key = names[i++])) {
          ~indexOf.call(result, key) || result.push(key);
        }
      return result;
    };
  }
  function isPrimitive(it) {
    return !$.isObject(it);
  }
  function Empty() {}
  $def($def.S, 'Object', {
    getPrototypeOf: $.getProto = $.getProto || function(O) {
      O = Object(assert.def(O));
      if (has(O, IE_PROTO))
        return O[IE_PROTO];
      if (isFunction(O.constructor) && O instanceof O.constructor) {
        return O.constructor.prototype;
      }
      return O instanceof Object ? ObjectProto : null;
    },
    getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
    create: $.create = $.create || function(O, Properties) {
      var result;
      if (O !== null) {
        Empty.prototype = assertObject(O);
        result = new Empty();
        Empty.prototype = null;
        result[IE_PROTO] = O;
      } else
        result = createDict();
      return Properties === undefined ? result : defineProperties(result, Properties);
    },
    keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
    seal: $.it,
    freeze: $.it,
    preventExtensions: $.it,
    isSealed: isPrimitive,
    isFrozen: isPrimitive,
    isExtensible: $.isObject
  });
  $def($def.P, 'Function', {bind: function(that) {
      var fn = assert.fn(this),
          partArgs = slice.call(arguments, 1);
      function bound() {
        var args = partArgs.concat(slice.call(arguments));
        return invoke(fn, args, this instanceof bound ? $.create(fn.prototype) : that);
      }
      if (fn.prototype)
        bound.prototype = fn.prototype;
      return bound;
    }});
  function arrayMethodFix(fn) {
    return function() {
      return fn.apply($.ES5Object(this), arguments);
    };
  }
  if (!(0 in Object('z') && 'z'[0] == 'z')) {
    $.ES5Object = function(it) {
      return cof(it) == 'String' ? it.split('') : Object(it);
    };
  }
  $def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
    slice: arrayMethodFix(slice),
    join: arrayMethodFix(A.join)
  });
  $def($def.S, 'Array', {isArray: function(arg) {
      return cof(arg) == 'Array';
    }});
  function createArrayReduce(isRight) {
    return function(callbackfn, memo) {
      assert.fn(callbackfn);
      var O = toObject(this),
          length = toLength(O.length),
          index = isRight ? length - 1 : 0,
          i = isRight ? -1 : 1;
      if (arguments.length < 2)
        for (; ; ) {
          if (index in O) {
            memo = O[index];
            index += i;
            break;
          }
          index += i;
          assert(isRight ? index >= 0 : length > index, 'Reduce of empty array with no initial value');
        }
      for (; isRight ? index >= 0 : length > index; index += i)
        if (index in O) {
          memo = callbackfn(memo, O[index], index, this);
        }
      return memo;
    };
  }
  $def($def.P, 'Array', {
    forEach: $.each = $.each || arrayMethod(0),
    map: arrayMethod(1),
    filter: arrayMethod(2),
    some: arrayMethod(3),
    every: arrayMethod(4),
    reduce: createArrayReduce(false),
    reduceRight: createArrayReduce(true),
    indexOf: indexOf = indexOf || require("github:zloirock/core-js@0.8.4/modules/$.array-includes")(false),
    lastIndexOf: function(el, fromIndex) {
      var O = toObject(this),
          length = toLength(O.length),
          index = length - 1;
      if (arguments.length > 1)
        index = Math.min(index, $.toInteger(fromIndex));
      if (index < 0)
        index = toLength(length + index);
      for (; index >= 0; index--)
        if (index in O)
          if (O[index] === el)
            return index;
      return -1;
    }
  });
  $def($def.P, 'String', {trim: require("github:zloirock/core-js@0.8.4/modules/$.replacer")(/^\s*([\s\S]*\S)?\s*$/, '$1')});
  $def($def.S, 'Date', {now: function() {
      return +new Date;
    }});
  function lz(num) {
    return num > 9 ? num : '0' + num;
  }
  $def($def.P, 'Date', {toISOString: function() {
      if (!isFinite(this))
        throw RangeError('Invalid time value');
      var d = this,
          y = d.getUTCFullYear(),
          m = d.getUTCMilliseconds(),
          s = y < 0 ? '-' : y > 9999 ? '+' : '';
      return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) + '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) + 'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) + ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
    }});
  if (classof(function() {
    return arguments;
  }()) == 'Object')
    cof.classof = function(it) {
      var tag = classof(it);
      return tag == 'Object' && isFunction(it.callee) ? 'Arguments' : tag;
    };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.keyof", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$");
  module.exports = function(object, el) {
    var O = $.toObject(object),
        keys = $.getKeys(O),
        length = keys.length,
        index = 0,
        key;
    while (length > index)
      if (O[key = keys[index++]] === el)
        return key;
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.symbol", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.keyof", "github:zloirock/core-js@0.8.4/modules/$.wks"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      setTag = require("github:zloirock/core-js@0.8.4/modules/$.cof").set,
      uid = require("github:zloirock/core-js@0.8.4/modules/$.uid"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      keyOf = require("github:zloirock/core-js@0.8.4/modules/$.keyof"),
      has = $.has,
      hide = $.hide,
      getNames = $.getNames,
      toObject = $.toObject,
      Symbol = $.g.Symbol,
      Base = Symbol,
      setter = false,
      TAG = uid.safe('tag'),
      SymbolRegistry = {},
      AllSymbols = {};
  function wrap(tag) {
    var sym = AllSymbols[tag] = $.set($.create(Symbol.prototype), TAG, tag);
    $.DESC && setter && $.setDesc(Object.prototype, tag, {
      configurable: true,
      set: function(value) {
        hide(this, tag, value);
      }
    });
    return sym;
  }
  if (!$.isFunction(Symbol)) {
    Symbol = function Symbol(description) {
      if (this instanceof Symbol)
        throw TypeError('Symbol is not a constructor');
      return wrap(uid(description));
    };
    hide(Symbol.prototype, 'toString', function() {
      return this[TAG];
    });
  }
  $def($def.G + $def.W, {Symbol: Symbol});
  var symbolStatics = {
    'for': function(key) {
      return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = Symbol(key);
    },
    keyFor: function keyFor(key) {
      return keyOf(SymbolRegistry, key);
    },
    pure: uid.safe,
    set: $.set,
    useSetter: function() {
      setter = true;
    },
    useSimple: function() {
      setter = false;
    }
  };
  $.each.call(('hasInstance,isConcatSpreadable,iterator,match,replace,search,' + 'species,split,toPrimitive,toStringTag,unscopables').split(','), function(it) {
    var sym = require("github:zloirock/core-js@0.8.4/modules/$.wks")(it);
    symbolStatics[it] = Symbol === Base ? sym : wrap(sym);
  });
  setter = true;
  $def($def.S, 'Symbol', symbolStatics);
  $def($def.S + $def.F * (Symbol != Base), 'Object', {
    getOwnPropertyNames: function getOwnPropertyNames(it) {
      var names = getNames(toObject(it)),
          result = [],
          key,
          i = 0;
      while (names.length > i)
        has(AllSymbols, key = names[i++]) || result.push(key);
      return result;
    },
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      var names = getNames(toObject(it)),
          result = [],
          key,
          i = 0;
      while (names.length > i)
        has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
      return result;
    }
  });
  setTag(Symbol, 'Symbol');
  setTag(Math, 'Math', true);
  setTag($.g.JSON, 'JSON', true);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.assign", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$");
  module.exports = Object.assign || function assign(target, source) {
    var T = Object($.assertDefined(target)),
        l = arguments.length,
        i = 1;
    while (l > i) {
      var S = $.ES5Object(arguments[i++]),
          keys = $.getKeys(S),
          length = keys.length,
          j = 0,
          key;
      while (length > j)
        T[key = keys[j++]] = S[key];
    }
    return T;
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.object.assign", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.assign"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.S, 'Object', {assign: require("github:zloirock/core-js@0.8.4/modules/$.assign")});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.object.is", ["github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.S, 'Object', {is: function is(x, y) {
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.set-proto", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.ctx"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      assert = require("github:zloirock/core-js@0.8.4/modules/$.assert");
  function check(O, proto) {
    assert.obj(O);
    assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
  }
  module.exports = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? function(buggy, set) {
      try {
        set = require("github:zloirock/core-js@0.8.4/modules/$.ctx")(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
        set({}, []);
      } catch (e) {
        buggy = true;
      }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy)
          O.__proto__ = proto;
        else
          set(O, proto);
        return O;
      };
    }() : undefined),
    check: check
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.object.set-prototype-of", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.set-proto"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.S, 'Object', {setPrototypeOf: require("github:zloirock/core-js@0.8.4/modules/$.set-proto").set});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.object.to-string", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.wks"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      tmp = {};
  tmp[require("github:zloirock/core-js@0.8.4/modules/$.wks")('toStringTag')] = 'z';
  if ($.FW && cof(tmp) != 'z')
    $.hide(Object.prototype, 'toString', function toString() {
      return '[object ' + cof.classof(this) + ']';
    });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.object.statics-accept-primitives", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      isObject = $.isObject,
      toObject = $.toObject;
  function wrapObjectMethod(METHOD, MODE) {
    var fn = ($.core.Object || {})[METHOD] || Object[METHOD],
        f = 0,
        o = {};
    o[METHOD] = MODE == 1 ? function(it) {
      return isObject(it) ? fn(it) : it;
    } : MODE == 2 ? function(it) {
      return isObject(it) ? fn(it) : true;
    } : MODE == 3 ? function(it) {
      return isObject(it) ? fn(it) : false;
    } : MODE == 4 ? function getOwnPropertyDescriptor(it, key) {
      return fn(toObject(it), key);
    } : MODE == 5 ? function getPrototypeOf(it) {
      return fn(Object($.assertDefined(it)));
    } : function(it) {
      return fn(toObject(it));
    };
    try {
      fn('z');
    } catch (e) {
      f = 1;
    }
    $def($def.S + $def.F * f, 'Object', o);
  }
  wrapObjectMethod('freeze', 1);
  wrapObjectMethod('seal', 1);
  wrapObjectMethod('preventExtensions', 1);
  wrapObjectMethod('isFrozen', 2);
  wrapObjectMethod('isSealed', 2);
  wrapObjectMethod('isExtensible', 3);
  wrapObjectMethod('getOwnPropertyDescriptor', 4);
  wrapObjectMethod('getPrototypeOf', 5);
  wrapObjectMethod('keys');
  wrapObjectMethod('getOwnPropertyNames');
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.function.name", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      NAME = 'name',
      setDesc = $.setDesc,
      FunctionProto = Function.prototype;
  NAME in FunctionProto || $.FW && $.DESC && setDesc(FunctionProto, NAME, {
    configurable: true,
    get: function() {
      var match = String(this).match(/^\s*function ([^ (]*)/),
          name = match ? match[1] : '';
      $.has(this, NAME) || setDesc(this, NAME, $.desc(5, name));
      return name;
    },
    set: function(value) {
      $.has(this, NAME) || setDesc(this, NAME, $.desc(0, value));
    }
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.number.constructor", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      isObject = $.isObject,
      isFunction = $.isFunction,
      NUMBER = 'Number',
      Number = $.g[NUMBER],
      Base = Number,
      proto = Number.prototype;
  function toPrimitive(it) {
    var fn,
        val;
    if (isFunction(fn = it.valueOf) && !isObject(val = fn.call(it)))
      return val;
    if (isFunction(fn = it.toString) && !isObject(val = fn.call(it)))
      return val;
    throw TypeError("Can't convert object to number");
  }
  function toNumber(it) {
    if (isObject(it))
      it = toPrimitive(it);
    if (typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48) {
      var binary = false;
      switch (it.charCodeAt(1)) {
        case 66:
        case 98:
          binary = true;
        case 79:
        case 111:
          return parseInt(it.slice(2), binary ? 2 : 8);
      }
    }
    return +it;
  }
  if ($.FW && !(Number('0o1') && Number('0b1'))) {
    Number = function Number(it) {
      return this instanceof Number ? new Base(toNumber(it)) : toNumber(it);
    };
    $.each.call($.DESC ? $.getNames(Base) : ('MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' + 'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), function(key) {
      if ($.has(Base, key) && !$.has(Number, key)) {
        $.setDesc(Number, key, $.getDesc(Base, key));
      }
    });
    Number.prototype = proto;
    proto.constructor = Number;
    $.hide($.g, NUMBER, Number);
  }
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.number.statics", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      abs = Math.abs,
      floor = Math.floor,
      _isFinite = $.g.isFinite,
      MAX_SAFE_INTEGER = 0x1fffffffffffff;
  function isInteger(it) {
    return !$.isObject(it) && _isFinite(it) && floor(it) === it;
  }
  $def($def.S, 'Number', {
    EPSILON: Math.pow(2, -52),
    isFinite: function isFinite(it) {
      return typeof it == 'number' && _isFinite(it);
    },
    isInteger: isInteger,
    isNaN: function isNaN(number) {
      return number != number;
    },
    isSafeInteger: function isSafeInteger(number) {
      return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
    },
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
    MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
    parseFloat: parseFloat,
    parseInt: parseInt
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.math", ["github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var Infinity = 1 / 0,
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      E = Math.E,
      pow = Math.pow,
      abs = Math.abs,
      exp = Math.exp,
      log = Math.log,
      sqrt = Math.sqrt,
      ceil = Math.ceil,
      floor = Math.floor,
      EPSILON = pow(2, -52),
      EPSILON32 = pow(2, -23),
      MAX32 = pow(2, 127) * (2 - EPSILON32),
      MIN32 = pow(2, -126);
  function roundTiesToEven(n) {
    return n + 1 / EPSILON - 1 / EPSILON;
  }
  function sign(x) {
    return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
  }
  function asinh(x) {
    return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
  }
  function expm1(x) {
    return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
  }
  $def($def.S, 'Math', {
    acosh: function acosh(x) {
      return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
    },
    asinh: asinh,
    atanh: function atanh(x) {
      return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
    },
    cbrt: function cbrt(x) {
      return sign(x = +x) * pow(abs(x), 1 / 3);
    },
    clz32: function clz32(x) {
      return (x >>>= 0) ? 31 - floor(log(x + 0.5) * Math.LOG2E) : 32;
    },
    cosh: function cosh(x) {
      return (exp(x = +x) + exp(-x)) / 2;
    },
    expm1: expm1,
    fround: function fround(x) {
      var $abs = abs(x),
          $sign = sign(x),
          a,
          result;
      if ($abs < MIN32)
        return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
      a = (1 + EPSILON32 / EPSILON) * $abs;
      result = a - (a - $abs);
      if (result > MAX32 || result != result)
        return $sign * Infinity;
      return $sign * result;
    },
    hypot: function hypot(value1, value2) {
      var sum = 0,
          len1 = arguments.length,
          len2 = len1,
          args = Array(len1),
          larg = -Infinity,
          arg;
      while (len1--) {
        arg = args[len1] = +arguments[len1];
        if (arg == Infinity || arg == -Infinity)
          return Infinity;
        if (arg > larg)
          larg = arg;
      }
      larg = arg || 1;
      while (len2--)
        sum += pow(args[len2] / larg, 2);
      return larg * sqrt(sum);
    },
    imul: function imul(x, y) {
      var UInt16 = 0xffff,
          xn = +x,
          yn = +y,
          xl = UInt16 & xn,
          yl = UInt16 & yn;
      return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
    },
    log1p: function log1p(x) {
      return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
    },
    log10: function log10(x) {
      return log(x) / Math.LN10;
    },
    log2: function log2(x) {
      return log(x) / Math.LN2;
    },
    sign: sign,
    sinh: function sinh(x) {
      return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
    },
    tanh: function tanh(x) {
      var a = expm1(x = +x),
          b = expm1(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
    },
    trunc: function trunc(it) {
      return (it > 0 ? floor : ceil)(it);
    }
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.string.from-code-point", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      toIndex = require("github:zloirock/core-js@0.8.4/modules/$").toIndex,
      fromCharCode = String.fromCharCode;
  $def($def.S, 'String', {fromCodePoint: function fromCodePoint(x) {
      var res = [],
          len = arguments.length,
          i = 0,
          code;
      while (len > i) {
        code = +arguments[i++];
        if (toIndex(code, 0x10ffff) !== code)
          throw RangeError(code + ' is not a valid code point');
        res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
      }
      return res.join('');
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.string.raw", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.S, 'String', {raw: function raw(callSite) {
      var tpl = $.toObject(callSite.raw),
          len = $.toLength(tpl.length),
          sln = arguments.length,
          res = [],
          i = 0;
      while (len > i) {
        res.push(String(tpl[i++]));
        if (i < sln)
          res.push(String(arguments[i]));
      }
      return res.join('');
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.string-at", ["github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$");
  module.exports = function(TO_STRING) {
    return function(pos) {
      var s = String($.assertDefined(this)),
          i = $.toInteger(pos),
          l = s.length,
          a,
          b;
      if (i < 0 || i >= l)
        return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.iter", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.wks"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      assertObject = require("github:zloirock/core-js@0.8.4/modules/$.assert").obj,
      SYMBOL_ITERATOR = require("github:zloirock/core-js@0.8.4/modules/$.wks")('iterator'),
      FF_ITERATOR = '@@iterator',
      Iterators = {},
      IteratorPrototype = {};
  var BUGGY = 'keys' in [] && !('next' in [].keys());
  setIterator(IteratorPrototype, $.that);
  function setIterator(O, value) {
    $.hide(O, SYMBOL_ITERATOR, value);
    if (FF_ITERATOR in [])
      $.hide(O, FF_ITERATOR, value);
  }
  function defineIterator(Constructor, NAME, value, DEFAULT) {
    var proto = Constructor.prototype,
        iter = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT] || value;
    if ($.FW)
      setIterator(proto, iter);
    if (iter !== value) {
      var iterProto = $.getProto(iter.call(new Constructor));
      cof.set(iterProto, NAME + ' Iterator', true);
      if ($.FW)
        $.has(proto, FF_ITERATOR) && setIterator(iterProto, $.that);
    }
    Iterators[NAME] = iter;
    Iterators[NAME + ' Iterator'] = $.that;
    return iter;
  }
  function getIterator(it) {
    var Symbol = $.g.Symbol,
        ext = it[Symbol && Symbol.iterator || FF_ITERATOR],
        getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];
    return assertObject(getIter.call(it));
  }
  function closeIterator(iterator) {
    var ret = iterator['return'];
    if (ret !== undefined)
      assertObject(ret.call(iterator));
  }
  function stepCall(iterator, fn, value, entries) {
    try {
      return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
    } catch (e) {
      closeIterator(iterator);
      throw e;
    }
  }
  var $iter = module.exports = {
    BUGGY: BUGGY,
    Iterators: Iterators,
    prototype: IteratorPrototype,
    step: function(done, value) {
      return {
        value: value,
        done: !!done
      };
    },
    stepCall: stepCall,
    close: closeIterator,
    is: function(it) {
      var O = Object(it),
          Symbol = $.g.Symbol,
          SYM = Symbol && Symbol.iterator || FF_ITERATOR;
      return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));
    },
    get: getIterator,
    set: setIterator,
    create: function(Constructor, NAME, next, proto) {
      Constructor.prototype = $.create(proto || $iter.prototype, {next: $.desc(1, next)});
      cof.set(Constructor, NAME + ' Iterator');
    },
    define: defineIterator,
    std: function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE) {
      function createIter(kind) {
        return function() {
          return new Constructor(this, kind);
        };
      }
      $iter.create(Constructor, NAME, next);
      var entries = createIter('key+value'),
          values = createIter('value'),
          proto = Base.prototype,
          methods,
          key;
      if (DEFAULT == 'value')
        values = defineIterator(Base, NAME, values, 'values');
      else
        entries = defineIterator(Base, NAME, entries, 'entries');
      if (DEFAULT) {
        methods = {
          entries: entries,
          keys: IS_SET ? values : createIter('key'),
          values: values
        };
        $def($def.P + $def.F * BUGGY, NAME, methods);
        if (FORCE)
          for (key in methods) {
            if (!(key in proto))
              $.hide(proto, key, methods[key]);
          }
      }
    },
    forOf: function(iterable, entries, fn, that) {
      var iterator = getIterator(iterable),
          f = ctx(fn, that, entries ? 2 : 1),
          step;
      while (!(step = iterator.next()).done) {
        if (stepCall(iterator, f, step.value, entries) === false) {
          return closeIterator(iterator);
        }
      }
    }
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.string.iterator", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.string-at", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.iter"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var set = require("github:zloirock/core-js@0.8.4/modules/$").set,
      at = require("github:zloirock/core-js@0.8.4/modules/$.string-at")(true),
      ITER = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe('iter'),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      step = $iter.step;
  $iter.std(String, 'String', function(iterated) {
    set(this, ITER, {
      o: String(iterated),
      i: 0
    });
  }, function() {
    var iter = this[ITER],
        O = iter.o,
        index = iter.i,
        point;
    if (index >= O.length)
      return step(1);
    point = at.call(O, index);
    iter.i += point.length;
    return step(0, point);
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.string.code-point-at", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.string-at"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.P, 'String', {codePointAt: require("github:zloirock/core-js@0.8.4/modules/$.string-at")(false)});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.string.ends-with", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      toLength = $.toLength;
  $def($def.P, 'String', {endsWith: function endsWith(searchString) {
      if (cof(searchString) == 'RegExp')
        throw TypeError();
      var that = String($.assertDefined(this)),
          endPosition = arguments[1],
          len = toLength(that.length),
          end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
      searchString += '';
      return that.slice(end - searchString.length, end) === searchString;
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.string.includes", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.P, 'String', {includes: function includes(searchString) {
      if (cof(searchString) == 'RegExp')
        throw TypeError();
      return !!~String($.assertDefined(this)).indexOf(searchString, arguments[1]);
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.string.repeat", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.P, 'String', {repeat: function repeat(count) {
      var str = String($.assertDefined(this)),
          res = '',
          n = $.toInteger(count);
      if (n < 0 || n == Infinity)
        throw RangeError("Count can't be negative");
      for (; n > 0; (n >>>= 1) && (str += str))
        if (n & 1)
          res += str;
      return res;
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.string.starts-with", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.P, 'String', {startsWith: function startsWith(searchString) {
      if (cof(searchString) == 'RegExp')
        throw TypeError();
      var that = String($.assertDefined(this)),
          index = $.toLength(Math.min(arguments[1], that.length));
      searchString += '';
      return that.slice(index, index + searchString.length) === searchString;
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.iter-detect", ["github:zloirock/core-js@0.8.4/modules/$.wks"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var SYMBOL_ITERATOR = require("github:zloirock/core-js@0.8.4/modules/$.wks")('iterator'),
      SAFE_CLOSING = false;
  try {
    var riter = [7][SYMBOL_ITERATOR]();
    riter['return'] = function() {
      SAFE_CLOSING = true;
    };
    Array.from(riter, function() {
      throw 2;
    });
  } catch (e) {}
  module.exports = function(exec) {
    if (!SAFE_CLOSING)
      return false;
    var safe = false;
    try {
      var arr = [7],
          iter = arr[SYMBOL_ITERATOR]();
      iter.next = function() {
        safe = true;
      };
      arr[SYMBOL_ITERATOR] = function() {
        return iter;
      };
      exec(arr);
    } catch (e) {}
    return safe;
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.array.from", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.iter", "github:zloirock/core-js@0.8.4/modules/$.iter-detect"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      stepCall = $iter.stepCall;
  $def($def.S + $def.F * !require("github:zloirock/core-js@0.8.4/modules/$.iter-detect")(function(iter) {
    Array.from(iter);
  }), 'Array', {from: function from(arrayLike) {
      var O = Object($.assertDefined(arrayLike)),
          mapfn = arguments[1],
          mapping = mapfn !== undefined,
          f = mapping ? ctx(mapfn, arguments[2], 2) : undefined,
          index = 0,
          length,
          result,
          step,
          iterator;
      if ($iter.is(O)) {
        iterator = $iter.get(O);
        result = new (typeof this == 'function' ? this : Array);
        for (; !(step = iterator.next()).done; index++) {
          result[index] = mapping ? stepCall(iterator, f, [step.value, index], true) : step.value;
        }
      } else {
        result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
        for (; length > index; index++) {
          result[index] = mapping ? f(O[index], index) : O[index];
        }
      }
      result.length = index;
      return result;
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.array.of", ["github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.S, 'Array', {of: function of() {
      var index = 0,
          length = arguments.length,
          result = new (typeof this == 'function' ? this : Array)(length);
      while (length > index)
        result[index] = arguments[index++];
      result.length = length;
      return result;
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.unscope", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.wks"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      UNSCOPABLES = require("github:zloirock/core-js@0.8.4/modules/$.wks")('unscopables');
  if ($.FW && !(UNSCOPABLES in []))
    $.hide(Array.prototype, UNSCOPABLES, {});
  module.exports = function(key) {
    if ($.FW)
      [][UNSCOPABLES][key] = true;
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.array.iterator", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.unscope", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.iter"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      setUnscope = require("github:zloirock/core-js@0.8.4/modules/$.unscope"),
      ITER = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe('iter'),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      step = $iter.step,
      Iterators = $iter.Iterators;
  $iter.std(Array, 'Array', function(iterated, kind) {
    $.set(this, ITER, {
      o: $.toObject(iterated),
      i: 0,
      k: kind
    });
  }, function() {
    var iter = this[ITER],
        O = iter.o,
        kind = iter.k,
        index = iter.i++;
    if (!O || index >= O.length) {
      iter.o = undefined;
      return step(1);
    }
    if (kind == 'key')
      return step(0, index);
    if (kind == 'value')
      return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'value');
  Iterators.Arguments = Iterators.Array;
  setUnscope('keys');
  setUnscope('values');
  setUnscope('entries');
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.species", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.wks"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$");
  module.exports = function(C) {
    if ($.DESC && $.FW)
      $.setDesc(C, require("github:zloirock/core-js@0.8.4/modules/$.wks")('species'), {
        configurable: true,
        get: $.that
      });
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.array.species", ["github:zloirock/core-js@0.8.4/modules/$.species"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  require("github:zloirock/core-js@0.8.4/modules/$.species")(Array);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.array.copy-within", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.unscope"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      toIndex = $.toIndex;
  $def($def.P, 'Array', {copyWithin: function copyWithin(target, start) {
      var O = Object($.assertDefined(this)),
          len = $.toLength(O.length),
          to = toIndex(target, len),
          from = toIndex(start, len),
          end = arguments[2],
          fin = end === undefined ? len : toIndex(end, len),
          count = Math.min(fin - from, len - to),
          inc = 1;
      if (from < to && to < from + count) {
        inc = -1;
        from = from + count - 1;
        to = to + count - 1;
      }
      while (count-- > 0) {
        if (from in O)
          O[to] = O[from];
        else
          delete O[to];
        to += inc;
        from += inc;
      }
      return O;
    }});
  require("github:zloirock/core-js@0.8.4/modules/$.unscope")('copyWithin');
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.array.fill", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.unscope"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      toIndex = $.toIndex;
  $def($def.P, 'Array', {fill: function fill(value) {
      var O = Object($.assertDefined(this)),
          length = $.toLength(O.length),
          index = toIndex(arguments[1], length),
          end = arguments[2],
          endPos = end === undefined ? length : toIndex(end, length);
      while (endPos > index)
        O[index++] = value;
      return O;
    }});
  require("github:zloirock/core-js@0.8.4/modules/$.unscope")('fill');
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.array.find", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.array-methods", "github:zloirock/core-js@0.8.4/modules/$.unscope"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.P, 'Array', {find: require("github:zloirock/core-js@0.8.4/modules/$.array-methods")(5)});
  require("github:zloirock/core-js@0.8.4/modules/$.unscope")('find');
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.array.find-index", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.array-methods", "github:zloirock/core-js@0.8.4/modules/$.unscope"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.P, 'Array', {findIndex: require("github:zloirock/core-js@0.8.4/modules/$.array-methods")(6)});
  require("github:zloirock/core-js@0.8.4/modules/$.unscope")('findIndex');
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.regexp", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.replacer", "github:zloirock/core-js@0.8.4/modules/$.species"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      RegExp = $.g.RegExp,
      Base = RegExp,
      proto = RegExp.prototype;
  if ($.FW && $.DESC) {
    if (!function() {
      try {
        return RegExp(/a/g, 'i') == '/a/i';
      } catch (e) {}
    }()) {
      RegExp = function RegExp(pattern, flags) {
        return new Base(cof(pattern) == 'RegExp' && flags !== undefined ? pattern.source : pattern, flags);
      };
      $.each.call($.getNames(Base), function(key) {
        key in RegExp || $.setDesc(RegExp, key, {
          configurable: true,
          get: function() {
            return Base[key];
          },
          set: function(it) {
            Base[key] = it;
          }
        });
      });
      proto.constructor = RegExp;
      RegExp.prototype = proto;
      $.hide($.g, 'RegExp', RegExp);
    }
    if (/./g.flags != 'g')
      $.setDesc(proto, 'flags', {
        configurable: true,
        get: require("github:zloirock/core-js@0.8.4/modules/$.replacer")(/^.*\/(\w*)$/, '$1')
      });
  }
  require("github:zloirock/core-js@0.8.4/modules/$.species")(RegExp);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.task", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.invoke"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      invoke = require("github:zloirock/core-js@0.8.4/modules/$.invoke"),
      global = $.g,
      isFunction = $.isFunction,
      html = $.html,
      document = global.document,
      process = global.process,
      setTask = global.setImmediate,
      clearTask = global.clearImmediate,
      postMessage = global.postMessage,
      addEventListener = global.addEventListener,
      MessageChannel = global.MessageChannel,
      counter = 0,
      queue = {},
      ONREADYSTATECHANGE = 'onreadystatechange',
      defer,
      channel,
      port;
  function run() {
    var id = +this;
    if ($.has(queue, id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  }
  function listner(event) {
    run.call(event.data);
  }
  if (!isFunction(setTask) || !isFunction(clearTask)) {
    setTask = function(fn) {
      var args = [],
          i = 1;
      while (arguments.length > i)
        args.push(arguments[i++]);
      queue[++counter] = function() {
        invoke(isFunction(fn) ? fn : Function(fn), args);
      };
      defer(counter);
      return counter;
    };
    clearTask = function(id) {
      delete queue[id];
    };
    if (cof(process) == 'process') {
      defer = function(id) {
        process.nextTick(ctx(run, id, 1));
      };
    } else if (addEventListener && isFunction(postMessage) && !global.importScripts) {
      defer = function(id) {
        postMessage(id, '*');
      };
      addEventListener('message', listner, false);
    } else if (isFunction(MessageChannel)) {
      channel = new MessageChannel;
      port = channel.port2;
      channel.port1.onmessage = listner;
      defer = ctx(port.postMessage, port, 1);
    } else if (document && ONREADYSTATECHANGE in document.createElement('script')) {
      defer = function(id) {
        html.appendChild(document.createElement('script'))[ONREADYSTATECHANGE] = function() {
          html.removeChild(this);
          run.call(id);
        };
      };
    } else {
      defer = function(id) {
        setTimeout(ctx(run, id, 1), 0);
      };
    }
  }
  module.exports = {
    set: setTask,
    clear: clearTask
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.promise", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.iter", "github:zloirock/core-js@0.8.4/modules/$.wks", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.task", "github:zloirock/core-js@0.8.4/modules/$.species", "github:zloirock/core-js@0.8.4/modules/$.iter-detect"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx"),
      cof = require("github:zloirock/core-js@0.8.4/modules/$.cof"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      assert = require("github:zloirock/core-js@0.8.4/modules/$.assert"),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      SPECIES = require("github:zloirock/core-js@0.8.4/modules/$.wks")('species'),
      RECORD = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe('record'),
      forOf = $iter.forOf,
      PROMISE = 'Promise',
      global = $.g,
      process = global.process,
      asap = process && process.nextTick || require("github:zloirock/core-js@0.8.4/modules/$.task").set,
      P = global[PROMISE],
      Base = P,
      isFunction = $.isFunction,
      isObject = $.isObject,
      assertFunction = assert.fn,
      assertObject = assert.obj,
      test;
  function getConstructor(C) {
    var S = assertObject(C)[SPECIES];
    return S != undefined ? S : C;
  }
  function isThenable(it) {
    var then;
    if (isObject(it))
      then = it.then;
    return isFunction(then) ? then : false;
  }
  function isUnhandled(promise) {
    var record = promise[RECORD],
        chain = record.c,
        i = 0,
        react;
    if (record.h)
      return false;
    while (chain.length > i) {
      react = chain[i++];
      if (react.fail || !isUnhandled(react.P))
        return false;
    }
    return true;
  }
  function notify(record, isReject) {
    var chain = record.c;
    if (isReject || chain.length)
      asap(function() {
        var promise = record.p,
            value = record.v,
            ok = record.s == 1,
            i = 0;
        if (isReject && isUnhandled(promise)) {
          setTimeout(function() {
            if (isUnhandled(promise)) {
              if (cof(process) == 'process') {
                process.emit('unhandledRejection', value, promise);
              } else if (global.console && isFunction(console.error)) {
                console.error('Unhandled promise rejection', value);
              }
            }
          }, 1e3);
        } else
          while (chain.length > i)
            !function(react) {
              var cb = ok ? react.ok : react.fail,
                  ret,
                  then;
              try {
                if (cb) {
                  if (!ok)
                    record.h = true;
                  ret = cb === true ? value : cb(value);
                  if (ret === react.P) {
                    react.rej(TypeError(PROMISE + '-chain cycle'));
                  } else if (then = isThenable(ret)) {
                    then.call(ret, react.res, react.rej);
                  } else
                    react.res(ret);
                } else
                  react.rej(value);
              } catch (err) {
                react.rej(err);
              }
            }(chain[i++]);
        chain.length = 0;
      });
  }
  function $reject(value) {
    var record = this;
    if (record.d)
      return;
    record.d = true;
    record = record.r || record;
    record.v = value;
    record.s = 2;
    notify(record, true);
  }
  function $resolve(value) {
    var record = this,
        then,
        wrapper;
    if (record.d)
      return;
    record.d = true;
    record = record.r || record;
    try {
      if (then = isThenable(value)) {
        wrapper = {
          r: record,
          d: false
        };
        then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
      } else {
        record.v = value;
        record.s = 1;
        notify(record);
      }
    } catch (err) {
      $reject.call(wrapper || {
        r: record,
        d: false
      }, err);
    }
  }
  if (!(isFunction(P) && isFunction(P.resolve) && P.resolve(test = new P(function() {})) == test)) {
    P = function Promise(executor) {
      assertFunction(executor);
      var record = {
        p: assert.inst(this, P, PROMISE),
        c: [],
        s: 0,
        d: false,
        v: undefined,
        h: false
      };
      $.hide(this, RECORD, record);
      try {
        executor(ctx($resolve, record, 1), ctx($reject, record, 1));
      } catch (err) {
        $reject.call(record, err);
      }
    };
    $.mix(P.prototype, {
      then: function then(onFulfilled, onRejected) {
        var S = assertObject(assertObject(this).constructor)[SPECIES];
        var react = {
          ok: isFunction(onFulfilled) ? onFulfilled : true,
          fail: isFunction(onRejected) ? onRejected : false
        };
        var promise = react.P = new (S != undefined ? S : P)(function(res, rej) {
          react.res = assertFunction(res);
          react.rej = assertFunction(rej);
        });
        var record = this[RECORD];
        record.c.push(react);
        record.s && notify(record);
        return promise;
      },
      'catch': function(onRejected) {
        return this.then(undefined, onRejected);
      }
    });
  }
  $def($def.G + $def.W + $def.F * (P != Base), {Promise: P});
  cof.set(P, PROMISE);
  require("github:zloirock/core-js@0.8.4/modules/$.species")(P);
  $def($def.S, PROMISE, {
    reject: function reject(r) {
      return new (getConstructor(this))(function(res, rej) {
        rej(r);
      });
    },
    resolve: function resolve(x) {
      return isObject(x) && RECORD in x && $.getProto(x) === this.prototype ? x : new (getConstructor(this))(function(res) {
        res(x);
      });
    }
  });
  $def($def.S + $def.F * !require("github:zloirock/core-js@0.8.4/modules/$.iter-detect")(function(iter) {
    P.all(iter)['catch'](function() {});
  }), PROMISE, {
    all: function all(iterable) {
      var C = getConstructor(this),
          values = [];
      return new C(function(res, rej) {
        forOf(iterable, false, values.push, values);
        var remaining = values.length,
            results = Array(remaining);
        if (remaining)
          $.each.call(values, function(promise, index) {
            C.resolve(promise).then(function(value) {
              results[index] = value;
              --remaining || res(results);
            }, rej);
          });
        else
          res(results);
      });
    },
    race: function race(iterable) {
      var C = getConstructor(this);
      return new C(function(res, rej) {
        forOf(iterable, false, function(promise) {
          C.resolve(promise).then(res, rej);
        });
      });
    }
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.collection-strong", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.iter"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx"),
      safe = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe,
      assert = require("github:zloirock/core-js@0.8.4/modules/$.assert"),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      has = $.has,
      set = $.set,
      isObject = $.isObject,
      hide = $.hide,
      step = $iter.step,
      isFrozen = Object.isFrozen || $.core.Object.isFrozen,
      ID = safe('id'),
      O1 = safe('O1'),
      LAST = safe('last'),
      FIRST = safe('first'),
      ITER = safe('iter'),
      SIZE = $.DESC ? safe('size') : 'size',
      id = 0;
  function fastKey(it, create) {
    if (!isObject(it))
      return (typeof it == 'string' ? 'S' : 'P') + it;
    if (isFrozen(it))
      return 'F';
    if (!has(it, ID)) {
      if (!create)
        return 'E';
      hide(it, ID, ++id);
    }
    return 'O' + it[ID];
  }
  function getEntry(that, key) {
    var index = fastKey(key),
        entry;
    if (index != 'F')
      return that[O1][index];
    for (entry = that[FIRST]; entry; entry = entry.n) {
      if (entry.k == key)
        return entry;
    }
  }
  module.exports = {
    getConstructor: function(NAME, IS_MAP, ADDER) {
      function C(iterable) {
        var that = assert.inst(this, C, NAME);
        set(that, O1, $.create(null));
        set(that, SIZE, 0);
        set(that, LAST, undefined);
        set(that, FIRST, undefined);
        if (iterable != undefined)
          $iter.forOf(iterable, IS_MAP, that[ADDER], that);
      }
      $.mix(C.prototype, {
        clear: function clear() {
          for (var that = this,
              data = that[O1],
              entry = that[FIRST]; entry; entry = entry.n) {
            entry.r = true;
            if (entry.p)
              entry.p = entry.p.n = undefined;
            delete data[entry.i];
          }
          that[FIRST] = that[LAST] = undefined;
          that[SIZE] = 0;
        },
        'delete': function(key) {
          var that = this,
              entry = getEntry(that, key);
          if (entry) {
            var next = entry.n,
                prev = entry.p;
            delete that[O1][entry.i];
            entry.r = true;
            if (prev)
              prev.n = next;
            if (next)
              next.p = prev;
            if (that[FIRST] == entry)
              that[FIRST] = next;
            if (that[LAST] == entry)
              that[LAST] = prev;
            that[SIZE]--;
          }
          return !!entry;
        },
        forEach: function forEach(callbackfn) {
          var f = ctx(callbackfn, arguments[1], 3),
              entry;
          while (entry = entry ? entry.n : this[FIRST]) {
            f(entry.v, entry.k, this);
            while (entry && entry.r)
              entry = entry.p;
          }
        },
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });
      if ($.DESC)
        $.setDesc(C.prototype, 'size', {get: function() {
            return assert.def(this[SIZE]);
          }});
      return C;
    },
    def: function(that, key, value) {
      var entry = getEntry(that, key),
          prev,
          index;
      if (entry) {
        entry.v = value;
      } else {
        that[LAST] = entry = {
          i: index = fastKey(key, true),
          k: key,
          v: value,
          p: prev = that[LAST],
          n: undefined,
          r: false
        };
        if (!that[FIRST])
          that[FIRST] = entry;
        if (prev)
          prev.n = entry;
        that[SIZE]++;
        if (index != 'F')
          that[O1][index] = entry;
      }
      return that;
    },
    getEntry: getEntry,
    getIterConstructor: function() {
      return function(iterated, kind) {
        set(this, ITER, {
          o: iterated,
          k: kind
        });
      };
    },
    next: function() {
      var iter = this[ITER],
          kind = iter.k,
          entry = iter.l;
      while (entry && entry.r)
        entry = entry.p;
      if (!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])) {
        iter.o = undefined;
        return step(1);
      }
      if (kind == 'key')
        return step(0, entry.k);
      if (kind == 'value')
        return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.collection", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.iter", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.iter-detect", "github:zloirock/core-js@0.8.4/modules/$.cof", "github:zloirock/core-js@0.8.4/modules/$.species"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      assertInstance = require("github:zloirock/core-js@0.8.4/modules/$.assert").inst;
  module.exports = function(NAME, methods, common, IS_MAP, isWeak) {
    var Base = $.g[NAME],
        C = Base,
        ADDER = IS_MAP ? 'set' : 'add',
        proto = C && C.prototype,
        O = {};
    function fixMethod(KEY, CHAIN) {
      var method = proto[KEY];
      if ($.FW)
        proto[KEY] = function(a, b) {
          var result = method.call(this, a === 0 ? 0 : a, b);
          return CHAIN ? this : result;
        };
    }
    if (!$.isFunction(C) || !(isWeak || !$iter.BUGGY && proto.forEach && proto.entries)) {
      C = common.getConstructor(NAME, IS_MAP, ADDER);
      $.mix(C.prototype, methods);
    } else {
      var inst = new C,
          chain = inst[ADDER](isWeak ? {} : -0, 1),
          buggyZero;
      if (!require("github:zloirock/core-js@0.8.4/modules/$.iter-detect")(function(iter) {
        new C(iter);
      })) {
        C = function(iterable) {
          assertInstance(this, C, NAME);
          var that = new Base;
          if (iterable != undefined)
            $iter.forOf(iterable, IS_MAP, that[ADDER], that);
          return that;
        };
        C.prototype = proto;
        if ($.FW)
          proto.constructor = C;
      }
      isWeak || inst.forEach(function(val, key) {
        buggyZero = 1 / key === -Infinity;
      });
      if (buggyZero) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }
      if (buggyZero || chain !== inst)
        fixMethod(ADDER, true);
    }
    require("github:zloirock/core-js@0.8.4/modules/$.cof").set(C, NAME);
    require("github:zloirock/core-js@0.8.4/modules/$.species")(C);
    O[NAME] = C;
    $def($def.G + $def.W + $def.F * (C != Base), O);
    if (!isWeak)
      $iter.std(C, NAME, common.getIterConstructor(), common.next, IS_MAP ? 'key+value' : 'value', !IS_MAP, true);
    return C;
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.map", ["github:zloirock/core-js@0.8.4/modules/$.collection-strong", "github:zloirock/core-js@0.8.4/modules/$.collection"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var strong = require("github:zloirock/core-js@0.8.4/modules/$.collection-strong");
  require("github:zloirock/core-js@0.8.4/modules/$.collection")('Map', {
    get: function get(key) {
      var entry = strong.getEntry(this, key);
      return entry && entry.v;
    },
    set: function set(key, value) {
      return strong.def(this, key === 0 ? 0 : key, value);
    }
  }, strong, true);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.set", ["github:zloirock/core-js@0.8.4/modules/$.collection-strong", "github:zloirock/core-js@0.8.4/modules/$.collection"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var strong = require("github:zloirock/core-js@0.8.4/modules/$.collection-strong");
  require("github:zloirock/core-js@0.8.4/modules/$.collection")('Set', {add: function add(value) {
      return strong.def(this, value = value === 0 ? 0 : value, value);
    }}, strong);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.collection-weak", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.iter", "github:zloirock/core-js@0.8.4/modules/$.array-methods"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      safe = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe,
      assert = require("github:zloirock/core-js@0.8.4/modules/$.assert"),
      forOf = require("github:zloirock/core-js@0.8.4/modules/$.iter").forOf,
      _has = $.has,
      isObject = $.isObject,
      hide = $.hide,
      isFrozen = Object.isFrozen || $.core.Object.isFrozen,
      id = 0,
      ID = safe('id'),
      WEAK = safe('weak'),
      LEAK = safe('leak'),
      method = require("github:zloirock/core-js@0.8.4/modules/$.array-methods"),
      find = method(5),
      findIndex = method(6);
  function findFrozen(store, key) {
    return find.call(store.array, function(it) {
      return it[0] === key;
    });
  }
  function leakStore(that) {
    return that[LEAK] || hide(that, LEAK, {
      array: [],
      get: function(key) {
        var entry = findFrozen(this, key);
        if (entry)
          return entry[1];
      },
      has: function(key) {
        return !!findFrozen(this, key);
      },
      set: function(key, value) {
        var entry = findFrozen(this, key);
        if (entry)
          entry[1] = value;
        else
          this.array.push([key, value]);
      },
      'delete': function(key) {
        var index = findIndex.call(this.array, function(it) {
          return it[0] === key;
        });
        if (~index)
          this.array.splice(index, 1);
        return !!~index;
      }
    })[LEAK];
  }
  module.exports = {
    getConstructor: function(NAME, IS_MAP, ADDER) {
      function C(iterable) {
        $.set(assert.inst(this, C, NAME), ID, id++);
        if (iterable != undefined)
          forOf(iterable, IS_MAP, this[ADDER], this);
      }
      $.mix(C.prototype, {
        'delete': function(key) {
          if (!isObject(key))
            return false;
          if (isFrozen(key))
            return leakStore(this)['delete'](key);
          return _has(key, WEAK) && _has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
        },
        has: function has(key) {
          if (!isObject(key))
            return false;
          if (isFrozen(key))
            return leakStore(this).has(key);
          return _has(key, WEAK) && _has(key[WEAK], this[ID]);
        }
      });
      return C;
    },
    def: function(that, key, value) {
      if (isFrozen(assert.obj(key))) {
        leakStore(that).set(key, value);
      } else {
        _has(key, WEAK) || hide(key, WEAK, {});
        key[WEAK][that[ID]] = value;
      }
      return that;
    },
    leakStore: leakStore,
    WEAK: WEAK,
    ID: ID
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.weak-map", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.collection-weak", "github:zloirock/core-js@0.8.4/modules/$.collection"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      weak = require("github:zloirock/core-js@0.8.4/modules/$.collection-weak"),
      leakStore = weak.leakStore,
      ID = weak.ID,
      WEAK = weak.WEAK,
      has = $.has,
      isObject = $.isObject,
      isFrozen = Object.isFrozen || $.core.Object.isFrozen,
      tmp = {};
  var WeakMap = require("github:zloirock/core-js@0.8.4/modules/$.collection")('WeakMap', {
    get: function get(key) {
      if (isObject(key)) {
        if (isFrozen(key))
          return leakStore(this).get(key);
        if (has(key, WEAK))
          return key[WEAK][this[ID]];
      }
    },
    set: function set(key, value) {
      return weak.def(this, key, value);
    }
  }, weak, true, true);
  if ($.FW && new WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7) {
    $.each.call(['delete', 'has', 'get', 'set'], function(key) {
      var method = WeakMap.prototype[key];
      WeakMap.prototype[key] = function(a, b) {
        if (isObject(a) && isFrozen(a)) {
          var result = leakStore(this)[key](a, b);
          return key == 'set' ? this : result;
        }
        return method.call(this, a, b);
      };
    });
  }
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.weak-set", ["github:zloirock/core-js@0.8.4/modules/$.collection-weak", "github:zloirock/core-js@0.8.4/modules/$.collection"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var weak = require("github:zloirock/core-js@0.8.4/modules/$.collection-weak");
  require("github:zloirock/core-js@0.8.4/modules/$.collection")('WeakSet', {add: function add(value) {
      return weak.def(this, value, true);
    }}, weak, false, true);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.own-keys", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.assert"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      assertObject = require("github:zloirock/core-js@0.8.4/modules/$.assert").obj;
  module.exports = function ownKeys(it) {
    assertObject(it);
    return $.getSymbols ? $.getNames(it).concat($.getSymbols(it)) : $.getNames(it);
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es6.reflect", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.set-proto", "github:zloirock/core-js@0.8.4/modules/$.iter", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.own-keys"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      setProto = require("github:zloirock/core-js@0.8.4/modules/$.set-proto"),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      ITER = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe('iter'),
      step = $iter.step,
      assert = require("github:zloirock/core-js@0.8.4/modules/$.assert"),
      isObject = $.isObject,
      getDesc = $.getDesc,
      setDesc = $.setDesc,
      getProto = $.getProto,
      apply = Function.apply,
      assertObject = assert.obj,
      _isExtensible = Object.isExtensible || $.it;
  function Enumerate(iterated) {
    var keys = [],
        key;
    for (key in iterated)
      keys.push(key);
    $.set(this, ITER, {
      o: iterated,
      a: keys,
      i: 0
    });
  }
  $iter.create(Enumerate, 'Object', function() {
    var iter = this[ITER],
        keys = iter.a,
        key;
    do {
      if (iter.i >= keys.length)
        return step(1);
    } while (!((key = keys[iter.i++]) in iter.o));
    return step(0, key);
  });
  function wrap(fn) {
    return function(it) {
      assertObject(it);
      try {
        fn.apply(undefined, arguments);
        return true;
      } catch (e) {
        return false;
      }
    };
  }
  function get(target, propertyKey) {
    var receiver = arguments.length < 3 ? target : arguments[2],
        desc = getDesc(assertObject(target), propertyKey),
        proto;
    if (desc)
      return $.has(desc, 'value') ? desc.value : desc.get === undefined ? undefined : desc.get.call(receiver);
    return isObject(proto = getProto(target)) ? get(proto, propertyKey, receiver) : undefined;
  }
  function set(target, propertyKey, V) {
    var receiver = arguments.length < 4 ? target : arguments[3],
        ownDesc = getDesc(assertObject(target), propertyKey),
        existingDescriptor,
        proto;
    if (!ownDesc) {
      if (isObject(proto = getProto(target))) {
        return set(proto, propertyKey, V, receiver);
      }
      ownDesc = $.desc(0);
    }
    if ($.has(ownDesc, 'value')) {
      if (ownDesc.writable === false || !isObject(receiver))
        return false;
      existingDescriptor = getDesc(receiver, propertyKey) || $.desc(0);
      existingDescriptor.value = V;
      setDesc(receiver, propertyKey, existingDescriptor);
      return true;
    }
    return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
  }
  var reflect = {
    apply: require("github:zloirock/core-js@0.8.4/modules/$.ctx")(Function.call, apply, 3),
    construct: function construct(target, argumentsList) {
      var proto = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype,
          instance = $.create(isObject(proto) ? proto : Object.prototype),
          result = apply.call(target, instance, argumentsList);
      return isObject(result) ? result : instance;
    },
    defineProperty: wrap(setDesc),
    deleteProperty: function deleteProperty(target, propertyKey) {
      var desc = getDesc(assertObject(target), propertyKey);
      return desc && !desc.configurable ? false : delete target[propertyKey];
    },
    enumerate: function enumerate(target) {
      return new Enumerate(assertObject(target));
    },
    get: get,
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
      return getDesc(assertObject(target), propertyKey);
    },
    getPrototypeOf: function getPrototypeOf(target) {
      return getProto(assertObject(target));
    },
    has: function has(target, propertyKey) {
      return propertyKey in target;
    },
    isExtensible: function isExtensible(target) {
      return !!_isExtensible(assertObject(target));
    },
    ownKeys: require("github:zloirock/core-js@0.8.4/modules/$.own-keys"),
    preventExtensions: wrap(Object.preventExtensions || $.it),
    set: set
  };
  if (setProto)
    reflect.setPrototypeOf = function setPrototypeOf(target, proto) {
      setProto.check(target, proto);
      try {
        setProto.set(target, proto);
        return true;
      } catch (e) {
        return false;
      }
    };
  $def($def.G, {Reflect: {}});
  $def($def.S, 'Reflect', reflect);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es7.array.includes", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.array-includes", "github:zloirock/core-js@0.8.4/modules/$.unscope"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.P, 'Array', {includes: require("github:zloirock/core-js@0.8.4/modules/$.array-includes")(true)});
  require("github:zloirock/core-js@0.8.4/modules/$.unscope")('includes');
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es7.string.at", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.string-at"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.P, 'String', {at: require("github:zloirock/core-js@0.8.4/modules/$.string-at")(true)});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es7.regexp.escape", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.replacer"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.S, 'RegExp', {escape: require("github:zloirock/core-js@0.8.4/modules/$.replacer")(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es7.object.get-own-property-descriptors", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.own-keys"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      ownKeys = require("github:zloirock/core-js@0.8.4/modules/$.own-keys");
  $def($def.S, 'Object', {getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
      var O = $.toObject(object),
          result = {};
      $.each.call(ownKeys(O), function(key) {
        $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));
      });
      return result;
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es7.object.to-array", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  function createObjectToArray(isEntries) {
    return function(object) {
      var O = $.toObject(object),
          keys = $.getKeys(O),
          length = keys.length,
          i = 0,
          result = Array(length),
          key;
      if (isEntries)
        while (length > i)
          result[i] = [key = keys[i++], O[key]];
      else
        while (length > i)
          result[i] = O[keys[i++]];
      return result;
    };
  }
  $def($def.S, 'Object', {
    values: createObjectToArray(false),
    entries: createObjectToArray(true)
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/es7.set.to-json", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.iter"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      forOf = require("github:zloirock/core-js@0.8.4/modules/$.iter").forOf;
  $def($def.P, 'Set', {toJSON: function() {
      var arr = [];
      forOf(this, false, arr.push, arr);
      return arr;
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/js.array.statics", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.ctx"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      $Array = $.core.Array || Array,
      statics = {};
  function setStatics(keys, length) {
    $.each.call(keys.split(','), function(key) {
      if (length == undefined && key in $Array)
        statics[key] = $Array[key];
      else if (key in [])
        statics[key] = require("github:zloirock/core-js@0.8.4/modules/$.ctx")(Function.call, [][key], length);
    });
  }
  setStatics('pop,reverse,shift,keys,values,entries', 1);
  setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
  setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' + 'reduce,reduceRight,copyWithin,fill,turn');
  $def($def.S, 'Array', statics);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/$.partial", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.invoke", "github:zloirock/core-js@0.8.4/modules/$.assert"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      invoke = require("github:zloirock/core-js@0.8.4/modules/$.invoke"),
      assertFunction = require("github:zloirock/core-js@0.8.4/modules/$.assert").fn;
  module.exports = function() {
    var fn = assertFunction(this),
        length = arguments.length,
        pargs = Array(length),
        i = 0,
        _ = $.path._,
        holder = false;
    while (length > i)
      if ((pargs[i] = arguments[i++]) === _)
        holder = true;
    return function() {
      var that = this,
          _length = arguments.length,
          j = 0,
          k = 0,
          args;
      if (!holder && !_length)
        return invoke(fn, pargs, that);
      args = pargs.slice();
      if (holder)
        for (; length > j; j++)
          if (args[j] === _)
            args[j] = arguments[k++];
      while (_length > k)
        args.push(arguments[k++]);
      return invoke(fn, args, that);
    };
  };
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/web.timers", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.invoke", "github:zloirock/core-js@0.8.4/modules/$.partial"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      invoke = require("github:zloirock/core-js@0.8.4/modules/$.invoke"),
      partial = require("github:zloirock/core-js@0.8.4/modules/$.partial"),
      navigator = $.g.navigator,
      MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent);
  function wrap(set) {
    return MSIE ? function(fn, time) {
      return set(invoke(partial, [].slice.call(arguments, 2), $.isFunction(fn) ? fn : Function(fn)), time);
    } : set;
  }
  $def($def.G + $def.B + $def.F * MSIE, {
    setTimeout: wrap($.g.setTimeout),
    setInterval: wrap($.g.setInterval)
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/web.immediate", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.task"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      $task = require("github:zloirock/core-js@0.8.4/modules/$.task");
  $def($def.G + $def.B, {
    setImmediate: $task.set,
    clearImmediate: $task.clear
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/web.dom.iterable", ["github:zloirock/core-js@0.8.4/modules/es6.array.iterator", "github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.iter", "github:zloirock/core-js@0.8.4/modules/$.wks"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  require("github:zloirock/core-js@0.8.4/modules/es6.array.iterator");
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      Iterators = require("github:zloirock/core-js@0.8.4/modules/$.iter").Iterators,
      ITERATOR = require("github:zloirock/core-js@0.8.4/modules/$.wks")('iterator'),
      ArrayValues = Iterators.Array,
      NodeList = $.g.NodeList;
  if ($.FW && NodeList && !(ITERATOR in NodeList.prototype)) {
    $.hide(NodeList.prototype, ITERATOR, ArrayValues);
  }
  Iterators.NodeList = ArrayValues;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/shim", ["github:zloirock/core-js@0.8.4/modules/es5", "github:zloirock/core-js@0.8.4/modules/es6.symbol", "github:zloirock/core-js@0.8.4/modules/es6.object.assign", "github:zloirock/core-js@0.8.4/modules/es6.object.is", "github:zloirock/core-js@0.8.4/modules/es6.object.set-prototype-of", "github:zloirock/core-js@0.8.4/modules/es6.object.to-string", "github:zloirock/core-js@0.8.4/modules/es6.object.statics-accept-primitives", "github:zloirock/core-js@0.8.4/modules/es6.function.name", "github:zloirock/core-js@0.8.4/modules/es6.number.constructor", "github:zloirock/core-js@0.8.4/modules/es6.number.statics", "github:zloirock/core-js@0.8.4/modules/es6.math", "github:zloirock/core-js@0.8.4/modules/es6.string.from-code-point", "github:zloirock/core-js@0.8.4/modules/es6.string.raw", "github:zloirock/core-js@0.8.4/modules/es6.string.iterator", "github:zloirock/core-js@0.8.4/modules/es6.string.code-point-at", "github:zloirock/core-js@0.8.4/modules/es6.string.ends-with", "github:zloirock/core-js@0.8.4/modules/es6.string.includes", "github:zloirock/core-js@0.8.4/modules/es6.string.repeat", "github:zloirock/core-js@0.8.4/modules/es6.string.starts-with", "github:zloirock/core-js@0.8.4/modules/es6.array.from", "github:zloirock/core-js@0.8.4/modules/es6.array.of", "github:zloirock/core-js@0.8.4/modules/es6.array.iterator", "github:zloirock/core-js@0.8.4/modules/es6.array.species", "github:zloirock/core-js@0.8.4/modules/es6.array.copy-within", "github:zloirock/core-js@0.8.4/modules/es6.array.fill", "github:zloirock/core-js@0.8.4/modules/es6.array.find", "github:zloirock/core-js@0.8.4/modules/es6.array.find-index", "github:zloirock/core-js@0.8.4/modules/es6.regexp", "github:zloirock/core-js@0.8.4/modules/es6.promise", "github:zloirock/core-js@0.8.4/modules/es6.map", "github:zloirock/core-js@0.8.4/modules/es6.set", "github:zloirock/core-js@0.8.4/modules/es6.weak-map", "github:zloirock/core-js@0.8.4/modules/es6.weak-set", "github:zloirock/core-js@0.8.4/modules/es6.reflect", "github:zloirock/core-js@0.8.4/modules/es7.array.includes", "github:zloirock/core-js@0.8.4/modules/es7.string.at", "github:zloirock/core-js@0.8.4/modules/es7.regexp.escape", "github:zloirock/core-js@0.8.4/modules/es7.object.get-own-property-descriptors", "github:zloirock/core-js@0.8.4/modules/es7.object.to-array", "github:zloirock/core-js@0.8.4/modules/es7.set.to-json", "github:zloirock/core-js@0.8.4/modules/js.array.statics", "github:zloirock/core-js@0.8.4/modules/web.timers", "github:zloirock/core-js@0.8.4/modules/web.immediate", "github:zloirock/core-js@0.8.4/modules/web.dom.iterable", "github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  require("github:zloirock/core-js@0.8.4/modules/es5");
  require("github:zloirock/core-js@0.8.4/modules/es6.symbol");
  require("github:zloirock/core-js@0.8.4/modules/es6.object.assign");
  require("github:zloirock/core-js@0.8.4/modules/es6.object.is");
  require("github:zloirock/core-js@0.8.4/modules/es6.object.set-prototype-of");
  require("github:zloirock/core-js@0.8.4/modules/es6.object.to-string");
  require("github:zloirock/core-js@0.8.4/modules/es6.object.statics-accept-primitives");
  require("github:zloirock/core-js@0.8.4/modules/es6.function.name");
  require("github:zloirock/core-js@0.8.4/modules/es6.number.constructor");
  require("github:zloirock/core-js@0.8.4/modules/es6.number.statics");
  require("github:zloirock/core-js@0.8.4/modules/es6.math");
  require("github:zloirock/core-js@0.8.4/modules/es6.string.from-code-point");
  require("github:zloirock/core-js@0.8.4/modules/es6.string.raw");
  require("github:zloirock/core-js@0.8.4/modules/es6.string.iterator");
  require("github:zloirock/core-js@0.8.4/modules/es6.string.code-point-at");
  require("github:zloirock/core-js@0.8.4/modules/es6.string.ends-with");
  require("github:zloirock/core-js@0.8.4/modules/es6.string.includes");
  require("github:zloirock/core-js@0.8.4/modules/es6.string.repeat");
  require("github:zloirock/core-js@0.8.4/modules/es6.string.starts-with");
  require("github:zloirock/core-js@0.8.4/modules/es6.array.from");
  require("github:zloirock/core-js@0.8.4/modules/es6.array.of");
  require("github:zloirock/core-js@0.8.4/modules/es6.array.iterator");
  require("github:zloirock/core-js@0.8.4/modules/es6.array.species");
  require("github:zloirock/core-js@0.8.4/modules/es6.array.copy-within");
  require("github:zloirock/core-js@0.8.4/modules/es6.array.fill");
  require("github:zloirock/core-js@0.8.4/modules/es6.array.find");
  require("github:zloirock/core-js@0.8.4/modules/es6.array.find-index");
  require("github:zloirock/core-js@0.8.4/modules/es6.regexp");
  require("github:zloirock/core-js@0.8.4/modules/es6.promise");
  require("github:zloirock/core-js@0.8.4/modules/es6.map");
  require("github:zloirock/core-js@0.8.4/modules/es6.set");
  require("github:zloirock/core-js@0.8.4/modules/es6.weak-map");
  require("github:zloirock/core-js@0.8.4/modules/es6.weak-set");
  require("github:zloirock/core-js@0.8.4/modules/es6.reflect");
  require("github:zloirock/core-js@0.8.4/modules/es7.array.includes");
  require("github:zloirock/core-js@0.8.4/modules/es7.string.at");
  require("github:zloirock/core-js@0.8.4/modules/es7.regexp.escape");
  require("github:zloirock/core-js@0.8.4/modules/es7.object.get-own-property-descriptors");
  require("github:zloirock/core-js@0.8.4/modules/es7.object.to-array");
  require("github:zloirock/core-js@0.8.4/modules/es7.set.to-json");
  require("github:zloirock/core-js@0.8.4/modules/js.array.statics");
  require("github:zloirock/core-js@0.8.4/modules/web.timers");
  require("github:zloirock/core-js@0.8.4/modules/web.immediate");
  require("github:zloirock/core-js@0.8.4/modules/web.dom.iterable");
  module.exports = require("github:zloirock/core-js@0.8.4/modules/$").core;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.dict", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.assign", "github:zloirock/core-js@0.8.4/modules/$.keyof", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.iter"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      assign = require("github:zloirock/core-js@0.8.4/modules/$.assign"),
      keyOf = require("github:zloirock/core-js@0.8.4/modules/$.keyof"),
      ITER = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe('iter'),
      assert = require("github:zloirock/core-js@0.8.4/modules/$.assert"),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      step = $iter.step,
      getKeys = $.getKeys,
      toObject = $.toObject,
      has = $.has;
  function Dict(iterable) {
    var dict = $.create(null);
    if (iterable != undefined) {
      if ($iter.is(iterable)) {
        $iter.forOf(iterable, true, function(key, value) {
          dict[key] = value;
        });
      } else
        assign(dict, iterable);
    }
    return dict;
  }
  Dict.prototype = null;
  function DictIterator(iterated, kind) {
    $.set(this, ITER, {
      o: toObject(iterated),
      a: getKeys(iterated),
      i: 0,
      k: kind
    });
  }
  $iter.create(DictIterator, 'Dict', function() {
    var iter = this[ITER],
        O = iter.o,
        keys = iter.a,
        kind = iter.k,
        key;
    do {
      if (iter.i >= keys.length) {
        iter.o = undefined;
        return step(1);
      }
    } while (!has(O, key = keys[iter.i++]));
    if (kind == 'key')
      return step(0, key);
    if (kind == 'value')
      return step(0, O[key]);
    return step(0, [key, O[key]]);
  });
  function createDictIter(kind) {
    return function(it) {
      return new DictIterator(it, kind);
    };
  }
  function generic(A, B) {
    return typeof A == 'function' ? A : B;
  }
  function createDictMethod(TYPE) {
    var IS_MAP = TYPE == 1,
        IS_EVERY = TYPE == 4;
    return function(object, callbackfn, that) {
      var f = ctx(callbackfn, that, 3),
          O = toObject(object),
          result = IS_MAP || TYPE == 7 || TYPE == 2 ? new (generic(this, Dict)) : undefined,
          key,
          val,
          res;
      for (key in O)
        if (has(O, key)) {
          val = O[key];
          res = f(val, key, object);
          if (TYPE) {
            if (IS_MAP)
              result[key] = res;
            else if (res)
              switch (TYPE) {
                case 2:
                  result[key] = val;
                  break;
                case 3:
                  return true;
                case 5:
                  return val;
                case 6:
                  return key;
                case 7:
                  result[res[0]] = res[1];
              }
            else if (IS_EVERY)
              return false;
          }
        }
      return TYPE == 3 || IS_EVERY ? IS_EVERY : result;
    };
  }
  function createDictReduce(IS_TURN) {
    return function(object, mapfn, init) {
      assert.fn(mapfn);
      var O = toObject(object),
          keys = getKeys(O),
          length = keys.length,
          i = 0,
          memo,
          key,
          result;
      if (IS_TURN) {
        memo = init == undefined ? new (generic(this, Dict)) : Object(init);
      } else if (arguments.length < 3) {
        assert(length, 'Reduce of empty object with no initial value');
        memo = O[keys[i++]];
      } else
        memo = Object(init);
      while (length > i)
        if (has(O, key = keys[i++])) {
          result = mapfn(memo, O[key], key, object);
          if (IS_TURN) {
            if (result === false)
              break;
          } else
            memo = result;
        }
      return memo;
    };
  }
  var findKey = createDictMethod(6);
  $def($def.G + $def.F, {Dict: $.mix(Dict, {
      keys: createDictIter('key'),
      values: createDictIter('value'),
      entries: createDictIter('key+value'),
      forEach: createDictMethod(0),
      map: createDictMethod(1),
      filter: createDictMethod(2),
      some: createDictMethod(3),
      every: createDictMethod(4),
      find: createDictMethod(5),
      findKey: findKey,
      mapPairs: createDictMethod(7),
      reduce: createDictReduce(false),
      turn: createDictReduce(true),
      keyOf: keyOf,
      includes: function(object, el) {
        return (el == el ? keyOf(object, el) : findKey(object, function(it) {
          return it != it;
        })) !== undefined;
      },
      has: has,
      get: function(object, key) {
        if (has(object, key))
          return object[key];
      },
      set: $.def,
      isDict: function(it) {
        return $.isObject(it) && $.getProto(it) === Dict.prototype;
      }
    })});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.iter-helpers", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.iter"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var core = require("github:zloirock/core-js@0.8.4/modules/$").core,
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter");
  core.isIterable = $iter.is;
  core.getIterator = $iter.get;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.$for", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.iter"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx"),
      safe = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe,
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      ENTRIES = safe('entries'),
      FN = safe('fn'),
      ITER = safe('iter'),
      forOf = $iter.forOf,
      stepCall = $iter.stepCall,
      getIterator = $iter.get,
      setIterator = $iter.set,
      createIterator = $iter.create;
  function $for(iterable, entries) {
    if (!(this instanceof $for))
      return new $for(iterable, entries);
    this[ITER] = getIterator(iterable);
    this[ENTRIES] = !!entries;
  }
  createIterator($for, 'Wrapper', function() {
    return this[ITER].next();
  });
  var $forProto = $for.prototype;
  setIterator($forProto, function() {
    return this[ITER];
  });
  function createChainIterator(next) {
    function Iterator(iter, fn, that) {
      this[ITER] = getIterator(iter);
      this[ENTRIES] = iter[ENTRIES];
      this[FN] = ctx(fn, that, iter[ENTRIES] ? 2 : 1);
    }
    createIterator(Iterator, 'Chain', next, $forProto);
    setIterator(Iterator.prototype, $.that);
    return Iterator;
  }
  var MapIter = createChainIterator(function() {
    var step = this[ITER].next();
    return step.done ? step : $iter.step(0, stepCall(this[ITER], this[FN], step.value, this[ENTRIES]));
  });
  var FilterIter = createChainIterator(function() {
    for (; ; ) {
      var step = this[ITER].next();
      if (step.done || stepCall(this[ITER], this[FN], step.value, this[ENTRIES]))
        return step;
    }
  });
  $.mix($forProto, {
    of: function(fn, that) {
      forOf(this, this[ENTRIES], fn, that);
    },
    array: function(fn, that) {
      var result = [];
      forOf(fn != undefined ? this.map(fn, that) : this, false, result.push, result);
      return result;
    },
    filter: function(fn, that) {
      return new FilterIter(this, fn, that);
    },
    map: function(fn, that) {
      return new MapIter(this, fn, that);
    }
  });
  $for.isIterable = $iter.is;
  $for.getIterator = getIterator;
  $def($def.G + $def.F, {$for: $for});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.delay", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.partial"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      partial = require("github:zloirock/core-js@0.8.4/modules/$.partial");
  $def($def.G + $def.F, {delay: function(time) {
      return new ($.core.Promise || $.g.Promise)(function(resolve) {
        setTimeout(partial.call(resolve, true), time);
      });
    }});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.binding", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.ctx", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.invoke", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.partial"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ctx = require("github:zloirock/core-js@0.8.4/modules/$.ctx"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      invoke = require("github:zloirock/core-js@0.8.4/modules/$.invoke"),
      hide = $.hide,
      assertFunction = require("github:zloirock/core-js@0.8.4/modules/$.assert").fn,
      _ = $.DESC ? require("github:zloirock/core-js@0.8.4/modules/$.uid")('tie') : 'toLocaleString',
      toLocaleString = {}.toLocaleString;
  $.core._ = $.path._ = $.path._ || {};
  $def($def.P + $def.F, 'Function', {
    part: require("github:zloirock/core-js@0.8.4/modules/$.partial"),
    only: function(numberArguments, that) {
      var fn = assertFunction(this),
          n = $.toLength(numberArguments),
          isThat = arguments.length > 1;
      return function() {
        var length = Math.min(n, arguments.length),
            args = Array(length),
            i = 0;
        while (length > i)
          args[i] = arguments[i++];
        return invoke(fn, args, isThat ? that : this);
      };
    }
  });
  function tie(key) {
    var that = this,
        bound = {};
    return hide(that, _, function(key) {
      if (key === undefined || !(key in that))
        return toLocaleString.call(that);
      return $.has(bound, key) ? bound[key] : bound[key] = ctx(that[key], that, -1);
    })[_](key);
  }
  hide($.path._, 'toString', function() {
    return _;
  });
  hide(Object.prototype, _, tie);
  $.DESC || hide(Array.prototype, _, tie);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.object", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.own-keys", "github:zloirock/core-js@0.8.4/modules/$.cof"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      ownKeys = require("github:zloirock/core-js@0.8.4/modules/$.own-keys");
  function define(target, mixin) {
    var keys = ownKeys($.toObject(mixin)),
        length = keys.length,
        i = 0,
        key;
    while (length > i)
      $.setDesc(target, key = keys[i++], $.getDesc(mixin, key));
    return target;
  }
  $def($def.S + $def.F, 'Object', {
    isObject: $.isObject,
    classof: require("github:zloirock/core-js@0.8.4/modules/$.cof").classof,
    define: define,
    make: function(proto, mixin) {
      return define($.create(proto), mixin);
    }
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.array.turn", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.assert", "github:zloirock/core-js@0.8.4/modules/$.unscope"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      assertFunction = require("github:zloirock/core-js@0.8.4/modules/$.assert").fn;
  $def($def.P + $def.F, 'Array', {turn: function(fn, target) {
      assertFunction(fn);
      var memo = target == undefined ? [] : Object(target),
          O = $.ES5Object(this),
          length = $.toLength(O.length),
          index = 0;
      while (length > index)
        if (fn(memo, O[index], index++, this) === false)
          break;
      return memo;
    }});
  require("github:zloirock/core-js@0.8.4/modules/$.unscope")('turn');
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.number.iterator", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.uid", "github:zloirock/core-js@0.8.4/modules/$.iter"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      ITER = require("github:zloirock/core-js@0.8.4/modules/$.uid").safe('iter'),
      $iter = require("github:zloirock/core-js@0.8.4/modules/$.iter"),
      step = $iter.step,
      NUMBER = 'Number';
  function NumberIterator(iterated) {
    $.set(this, ITER, {
      l: $.toLength(iterated),
      i: 0
    });
  }
  $iter.create(NumberIterator, NUMBER, function() {
    var iter = this[ITER],
        i = iter.i++;
    return i < iter.l ? step(0, i) : step(1);
  });
  $iter.define(Number, NUMBER, function() {
    return new NumberIterator(this);
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.number.math", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.invoke"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  'use strict';
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      invoke = require("github:zloirock/core-js@0.8.4/modules/$.invoke"),
      methods = {};
  methods.random = function(lim) {
    var a = +this,
        b = lim == undefined ? 0 : +lim,
        m = Math.min(a, b);
    return Math.random() * (Math.max(a, b) - m) + m;
  };
  if ($.FW)
    $.each.call(('round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' + 'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc').split(','), function(key) {
      var fn = Math[key];
      if (fn)
        methods[key] = function() {
          var args = [+this],
              i = 0;
          while (arguments.length > i)
            args.push(arguments[i++]);
          return invoke(fn, args);
        };
    });
  $def($def.P + $def.F, 'Number', methods);
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.string.escape-html", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.replacer"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      replacer = require("github:zloirock/core-js@0.8.4/modules/$.replacer");
  var escapeHTMLDict = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  },
      unescapeHTMLDict = {},
      key;
  for (key in escapeHTMLDict)
    unescapeHTMLDict[escapeHTMLDict[key]] = key;
  $def($def.P + $def.F, 'String', {
    escapeHTML: replacer(/[&<>"']/g, escapeHTMLDict),
    unescapeHTML: replacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
  });
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.date", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      core = $.core,
      formatRegExp = /\b\w\w?\b/g,
      flexioRegExp = /:(.*)\|(.*)$/,
      locales = {},
      current = 'en',
      SECONDS = 'Seconds',
      MINUTES = 'Minutes',
      HOURS = 'Hours',
      DATE = 'Date',
      MONTH = 'Month',
      YEAR = 'FullYear';
  function lz(num) {
    return num > 9 ? num : '0' + num;
  }
  function createFormat(prefix) {
    return function(template, locale) {
      var that = this,
          dict = locales[$.has(locales, locale) ? locale : current];
      function get(unit) {
        return that[prefix + unit]();
      }
      return String(template).replace(formatRegExp, function(part) {
        switch (part) {
          case 's':
            return get(SECONDS);
          case 'ss':
            return lz(get(SECONDS));
          case 'm':
            return get(MINUTES);
          case 'mm':
            return lz(get(MINUTES));
          case 'h':
            return get(HOURS);
          case 'hh':
            return lz(get(HOURS));
          case 'D':
            return get(DATE);
          case 'DD':
            return lz(get(DATE));
          case 'W':
            return dict[0][get('Day')];
          case 'N':
            return get(MONTH) + 1;
          case 'NN':
            return lz(get(MONTH) + 1);
          case 'M':
            return dict[2][get(MONTH)];
          case 'MM':
            return dict[1][get(MONTH)];
          case 'Y':
            return get(YEAR);
          case 'YY':
            return lz(get(YEAR) % 100);
        }
        return part;
      });
    };
  }
  function addLocale(lang, locale) {
    function split(index) {
      var result = [];
      $.each.call(locale.months.split(','), function(it) {
        result.push(it.replace(flexioRegExp, '$' + index));
      });
      return result;
    }
    locales[lang] = [locale.weekdays.split(','), split(1), split(2)];
    return core;
  }
  $def($def.P + $def.F, DATE, {
    format: createFormat('get'),
    formatUTC: createFormat('getUTC')
  });
  addLocale(current, {
    weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
    months: 'January,February,March,April,May,June,July,August,September,October,November,December'
  });
  addLocale('ru', {
    weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
    months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,' + 'Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
  });
  core.locale = function(locale) {
    return $.has(locales, locale) ? current = locale : current;
  };
  core.addLocale = addLocale;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.global", ["github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $def = require("github:zloirock/core-js@0.8.4/modules/$.def");
  $def($def.G + $def.F, {global: require("github:zloirock/core-js@0.8.4/modules/$").g});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/modules/core.log", ["github:zloirock/core-js@0.8.4/modules/$", "github:zloirock/core-js@0.8.4/modules/$.def", "github:zloirock/core-js@0.8.4/modules/$.assign"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var $ = require("github:zloirock/core-js@0.8.4/modules/$"),
      $def = require("github:zloirock/core-js@0.8.4/modules/$.def"),
      log = {},
      enabled = true;
  $.each.call(('assert,clear,count,debug,dir,dirxml,error,exception,' + 'group,groupCollapsed,groupEnd,info,isIndependentlyComposed,log,' + 'markTimeline,profile,profileEnd,table,time,timeEnd,timeline,' + 'timelineEnd,timeStamp,trace,warn').split(','), function(key) {
    log[key] = function() {
      if (enabled && $.g.console && $.isFunction(console[key])) {
        return Function.apply.call(console[key], console, arguments);
      }
    };
  });
  $def($def.G + $def.F, {log: require("github:zloirock/core-js@0.8.4/modules/$.assign")(log.log, log, {
      enable: function() {
        enabled = true;
      },
      disable: function() {
        enabled = false;
      }
    })});
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4/index", ["github:zloirock/core-js@0.8.4/shim", "github:zloirock/core-js@0.8.4/modules/core.dict", "github:zloirock/core-js@0.8.4/modules/core.iter-helpers", "github:zloirock/core-js@0.8.4/modules/core.$for", "github:zloirock/core-js@0.8.4/modules/core.delay", "github:zloirock/core-js@0.8.4/modules/core.binding", "github:zloirock/core-js@0.8.4/modules/core.object", "github:zloirock/core-js@0.8.4/modules/core.array.turn", "github:zloirock/core-js@0.8.4/modules/core.number.iterator", "github:zloirock/core-js@0.8.4/modules/core.number.math", "github:zloirock/core-js@0.8.4/modules/core.string.escape-html", "github:zloirock/core-js@0.8.4/modules/core.date", "github:zloirock/core-js@0.8.4/modules/core.global", "github:zloirock/core-js@0.8.4/modules/core.log", "github:zloirock/core-js@0.8.4/modules/$"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  require("github:zloirock/core-js@0.8.4/shim");
  require("github:zloirock/core-js@0.8.4/modules/core.dict");
  require("github:zloirock/core-js@0.8.4/modules/core.iter-helpers");
  require("github:zloirock/core-js@0.8.4/modules/core.$for");
  require("github:zloirock/core-js@0.8.4/modules/core.delay");
  require("github:zloirock/core-js@0.8.4/modules/core.binding");
  require("github:zloirock/core-js@0.8.4/modules/core.object");
  require("github:zloirock/core-js@0.8.4/modules/core.array.turn");
  require("github:zloirock/core-js@0.8.4/modules/core.number.iterator");
  require("github:zloirock/core-js@0.8.4/modules/core.number.math");
  require("github:zloirock/core-js@0.8.4/modules/core.string.escape-html");
  require("github:zloirock/core-js@0.8.4/modules/core.date");
  require("github:zloirock/core-js@0.8.4/modules/core.global");
  require("github:zloirock/core-js@0.8.4/modules/core.log");
  module.exports = require("github:zloirock/core-js@0.8.4/modules/$").core;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("github:zloirock/core-js@0.8.4", ["github:zloirock/core-js@0.8.4/index"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:zloirock/core-js@0.8.4/index");
  global.define = __define;
  return module.exports;
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/loader@0.9.0/aurelia-loader", ["exports", "github:zloirock/core-js@0.8.4", "github:aurelia/path@0.9.0", "github:aurelia/metadata@0.8.0"], function(exports, _coreJs, _aureliaPath, _aureliaMetadata) {
  'use strict';
  exports.__esModule = true;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var TemplateDependency = function TemplateDependency(src, name) {
    _classCallCheck(this, TemplateDependency);
    this.src = src;
    this.name = name;
  };
  exports.TemplateDependency = TemplateDependency;
  var TemplateRegistryEntry = (function() {
    function TemplateRegistryEntry(address) {
      _classCallCheck(this, TemplateRegistryEntry);
      this.address = address;
      this.template = null;
      this.dependencies = null;
      this.resources = null;
      this.factory = null;
    }
    TemplateRegistryEntry.prototype.setTemplate = function setTemplate(template) {
      var address = this.address;
      var useResources = undefined;
      var current = undefined;
      var src = undefined;
      this.template = template;
      useResources = template.content.querySelectorAll('require');
      this.dependencies = new Array(useResources.length);
      if (useResources.length === 0) {
        return;
      }
      for (var i = 0,
          ii = useResources.length; i < ii; ++i) {
        current = useResources[i];
        src = current.getAttribute('from');
        if (!src) {
          throw new Error('<require> element in ' + address + ' has no "from" attribute.');
        }
        this.dependencies[i] = new TemplateDependency(_aureliaPath.relativeToFile(src, address), current.getAttribute('as'));
        if (current.parentNode) {
          current.parentNode.removeChild(current);
        }
      }
    };
    TemplateRegistryEntry.prototype.addDependency = function addDependency(src, name) {
      if (typeof src === 'string') {
        this.dependencies.push(new TemplateDependency(_aureliaPath.relativeToFile(src, this.address), name));
      } else if (typeof src === 'function') {
        var origin = _aureliaMetadata.Origin.get(src);
        this.dependencies.push(new TemplateDependency(origin.moduleId, name));
      }
    };
    TemplateRegistryEntry.prototype.setResources = function setResources(resources) {
      this.resources = resources;
    };
    TemplateRegistryEntry.prototype.setFactory = function setFactory(factory) {
      this.factory = factory;
    };
    _createClass(TemplateRegistryEntry, [{
      key: 'templateIsLoaded',
      get: function get() {
        return this.template !== null;
      }
    }, {
      key: 'isReady',
      get: function get() {
        return this.factory !== null;
      }
    }]);
    return TemplateRegistryEntry;
  })();
  exports.TemplateRegistryEntry = TemplateRegistryEntry;
  var Loader = (function() {
    function Loader() {
      _classCallCheck(this, Loader);
      this.templateRegistry = {};
    }
    Loader.prototype.loadModule = function loadModule(id) {
      throw new Error('Loaders must implement loadModule(id).');
    };
    Loader.prototype.loadAllModules = function loadAllModules(ids) {
      throw new Error('Loader must implement loadAllModules(ids).');
    };
    Loader.prototype.loadTemplate = function loadTemplate(url) {
      throw new Error('Loader must implement loadTemplate(url).');
    };
    Loader.prototype.loadText = function loadText(url) {
      throw new Error('Loader must implement loadText(url).');
    };
    Loader.prototype.applyPluginToUrl = function applyPluginToUrl(url, pluginName) {
      throw new Error('Loader must implement applyPluginToUrl(url, pluginName).');
    };
    Loader.prototype.addPlugin = function addPlugin(pluginName, implementation) {
      throw new Error('Loader must implement addPlugin(pluginName, implementation).');
    };
    Loader.prototype.getOrCreateTemplateRegistryEntry = function getOrCreateTemplateRegistryEntry(id) {
      var entry = this.templateRegistry[id];
      if (entry === undefined) {
        this.templateRegistry[id] = entry = new TemplateRegistryEntry(id);
      }
      return entry;
    };
    return Loader;
  })();
  exports.Loader = Loader;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/loader@0.9.0", ["github:aurelia/loader@0.9.0/aurelia-loader"], function(main) {
  return main;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/task-queue@0.7.0/aurelia-task-queue", ["exports"], function(exports) {
  'use strict';
  exports.__esModule = true;
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var hasSetImmediate = typeof setImmediate === 'function';
  function makeRequestFlushFromMutationObserver(flush) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function requestFlush() {
      toggle = -toggle;
      node.data = toggle;
    };
  }
  function makeRequestFlushFromTimer(flush) {
    return function requestFlush() {
      var timeoutHandle = setTimeout(handleFlushTimer, 0);
      var intervalHandle = setInterval(handleFlushTimer, 50);
      function handleFlushTimer() {
        clearTimeout(timeoutHandle);
        clearInterval(intervalHandle);
        flush();
      }
    };
  }
  var TaskQueue = (function() {
    function TaskQueue() {
      var _this = this;
      _classCallCheck(this, TaskQueue);
      this.microTaskQueue = [];
      this.microTaskQueueCapacity = 1024;
      this.taskQueue = [];
      if (typeof BrowserMutationObserver === 'function') {
        this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(function() {
          return _this.flushMicroTaskQueue();
        });
      } else {
        this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(function() {
          return _this.flushMicroTaskQueue();
        });
      }
      this.requestFlushTaskQueue = makeRequestFlushFromTimer(function() {
        return _this.flushTaskQueue();
      });
    }
    TaskQueue.prototype.queueMicroTask = function queueMicroTask(task) {
      if (this.microTaskQueue.length < 1) {
        this.requestFlushMicroTaskQueue();
      }
      this.microTaskQueue.push(task);
    };
    TaskQueue.prototype.queueTask = function queueTask(task) {
      if (this.taskQueue.length < 1) {
        this.requestFlushTaskQueue();
      }
      this.taskQueue.push(task);
    };
    TaskQueue.prototype.flushTaskQueue = function flushTaskQueue() {
      var queue = this.taskQueue;
      var index = 0;
      var task = undefined;
      this.taskQueue = [];
      try {
        while (index < queue.length) {
          task = queue[index];
          task.call();
          index++;
        }
      } catch (error) {
        this.onError(error, task);
      }
    };
    TaskQueue.prototype.flushMicroTaskQueue = function flushMicroTaskQueue() {
      var queue = this.microTaskQueue;
      var capacity = this.microTaskQueueCapacity;
      var index = 0;
      var task = undefined;
      try {
        while (index < queue.length) {
          task = queue[index];
          task.call();
          index++;
          if (index > capacity) {
            for (var scan = 0; scan < index; scan++) {
              queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
          }
        }
      } catch (error) {
        this.onError(error, task);
      }
      queue.length = 0;
    };
    TaskQueue.prototype.onError = function onError(error, task) {
      if ('onError' in task) {
        task.onError(error);
      } else if (hasSetImmediate) {
        setImmediate(function() {
          throw error;
        });
      } else {
        setTimeout(function() {
          throw error;
        }, 0);
      }
    };
    return TaskQueue;
  })();
  exports.TaskQueue = TaskQueue;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/task-queue@0.7.0", ["github:aurelia/task-queue@0.7.0/aurelia-task-queue"], function(main) {
  return main;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/dependency-injection@0.10.1", ["github:aurelia/dependency-injection@0.10.1/aurelia-dependency-injection"], function(main) {
  return main;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/binding@0.9.1/aurelia-binding", ["exports", "npm:core-js@0.9.18", "github:aurelia/task-queue@0.7.0", "github:aurelia/dependency-injection@0.10.1", "github:aurelia/metadata@0.8.0"], function(exports, _coreJs, _aureliaTaskQueue, _aureliaDependencyInjection, _aureliaMetadata) {
  'use strict';
  exports.__esModule = true;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.calcSplices = calcSplices;
  exports.projectArraySplices = projectArraySplices;
  exports.getChangeRecords = getChangeRecords;
  exports.getArrayObserver = _getArrayObserver;
  exports.getMapObserver = _getMapObserver;
  exports.hasDeclaredDependencies = hasDeclaredDependencies;
  exports.declarePropertyDependencies = declarePropertyDependencies;
  exports.isStandardSvgAttribute = isStandardSvgAttribute;
  exports.valueConverter = valueConverter;
  exports.computedFrom = computedFrom;
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var AccessKeyedObserver = (function() {
    function AccessKeyedObserver(objectInfo, keyInfo, observerLocator, evaluate) {
      var _this = this;
      _classCallCheck(this, AccessKeyedObserver);
      this.objectInfo = objectInfo;
      this.keyInfo = keyInfo;
      this.evaluate = evaluate;
      this.observerLocator = observerLocator;
      if (keyInfo.observer) {
        this.disposeKey = keyInfo.observer.subscribe(function(newValue) {
          return _this.objectOrKeyChanged(undefined, newValue);
        });
      }
      if (objectInfo.observer) {
        this.disposeObject = objectInfo.observer.subscribe(function(newValue) {
          return _this.objectOrKeyChanged(newValue);
        });
      }
      this.updatePropertySubscription(objectInfo.value, keyInfo.value);
    }
    AccessKeyedObserver.prototype.updatePropertySubscription = function updatePropertySubscription(object, key) {
      var _this2 = this;
      if (this.disposeProperty) {
        this.disposeProperty();
        this.disposeProperty = null;
      }
      if (object instanceof Object) {
        this.disposeProperty = this.observerLocator.getObserver(object, key).subscribe(function() {
          return _this2.notify();
        });
      }
    };
    AccessKeyedObserver.prototype.objectOrKeyChanged = function objectOrKeyChanged(object, key) {
      var oo = undefined;
      var ko = undefined;
      object = object || ((oo = this.objectInfo.observer) && oo.getValue ? oo.getValue() : this.objectInfo.value);
      key = key || ((ko = this.keyInfo.observer) && ko.getValue ? ko.getValue() : this.keyInfo.value);
      this.updatePropertySubscription(object, key);
      this.notify();
    };
    AccessKeyedObserver.prototype.subscribe = function subscribe(callback) {
      var that = this;
      that.callback = callback;
      return function() {
        that.callback = null;
      };
    };
    AccessKeyedObserver.prototype.notify = function notify() {
      var callback = this.callback;
      if (callback) {
        callback(this.evaluate());
      }
    };
    AccessKeyedObserver.prototype.dispose = function dispose() {
      this.objectInfo = null;
      this.keyInfo = null;
      this.evaluate = null;
      this.observerLocator = null;
      if (this.disposeObject) {
        this.disposeObject();
      }
      if (this.disposeKey) {
        this.disposeKey();
      }
      if (this.disposeProperty) {
        this.disposeProperty();
      }
    };
    return AccessKeyedObserver;
  })();
  exports.AccessKeyedObserver = AccessKeyedObserver;
  function isIndex(s) {
    return +s === s >>> 0;
  }
  function toNumber(s) {
    return +s;
  }
  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }
  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;
  function ArraySplice() {}
  ArraySplice.prototype = {
    calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);
      var i,
          j,
          north,
          west;
      for (i = 0; i < rowCount; ++i) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }
      for (j = 0; j < columnCount; ++j) {
        distances[0][j] = j;
      }
      for (i = 1; i < rowCount; ++i) {
        for (j = 1; j < columnCount; ++j) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
            distances[i][j] = distances[i - 1][j - 1];
          else {
            north = distances[i - 1][j] + 1;
            west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }
      return distances;
    },
    spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];
        var min;
        if (west < north)
          min = west < northWest ? west : northWest;
        else
          min = north < northWest ? north : northWest;
        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }
      edits.reverse();
      return edits;
    },
    calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;
      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0)
        prefixCount = this.sharedPrefix(current, old, minLength);
      if (currentEnd == current.length && oldEnd == old.length)
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);
      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;
      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
        return [];
      if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd)
          splice.removed.push(old[oldStart++]);
        return [splice];
      } else if (oldStart == oldEnd)
        return [newSplice(currentStart, [], currentEnd - currentStart)];
      var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
      var splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; ++i) {
        switch (ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }
            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice)
              splice = newSplice(index, [], 0);
            splice.addedCount++;
            index++;
            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice)
              splice = newSplice(index, [], 0);
            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice)
              splice = newSplice(index, [], 0);
            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }
      if (splice) {
        splices.push(splice);
      }
      return splices;
    },
    sharedPrefix: function sharedPrefix(current, old, searchLength) {
      for (var i = 0; i < searchLength; ++i)
        if (!this.equals(current[i], old[i]))
          return i;
      return searchLength;
    },
    sharedSuffix: function sharedSuffix(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2]))
        count++;
      return count;
    },
    calculateSplices: function calculateSplices(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
    },
    equals: function equals(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };
  var arraySplice = new ArraySplice();
  function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd);
  }
  function intersect(start1, end1, start2, end2) {
    if (end1 < start2 || end2 < start1)
      return -1;
    if (end1 == start2 || end2 == start1)
      return 0;
    if (start1 < start2) {
      if (end1 < end2)
        return end1 - start2;
      else
        return end2 - start2;
    } else {
      if (end2 < end1)
        return end2 - start1;
      else
        return end1 - start1;
    }
  }
  function mergeSplice(splices, index, removed, addedCount) {
    var splice = newSplice(index, removed, addedCount);
    var inserted = false;
    var insertionOffset = 0;
    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;
      if (inserted)
        continue;
      var intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);
      if (intersectCount >= 0) {
        splices.splice(i, 1);
        i--;
        insertionOffset -= current.addedCount - current.removed.length;
        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length + current.removed.length - intersectCount;
        if (!splice.addedCount && !deleteCount) {
          inserted = true;
        } else {
          var removed = current.removed;
          if (splice.index < current.index) {
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }
          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }
          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        inserted = true;
        splices.splice(i, 0, splice);
        i++;
        var offset = splice.addedCount - splice.removed.length;
        current.index += offset;
        insertionOffset += offset;
      }
    }
    if (!inserted)
      splices.push(splice);
  }
  function createInitialSplices(array, changeRecords) {
    var splices = [];
    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch (record.type) {
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], record.type === 'delete' ? 0 : 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
          break;
      }
    }
    return splices;
  }
  function projectArraySplices(array, changeRecords) {
    var splices = [];
    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);
        return;
      }
      ;
      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
    });
    return splices;
  }
  var hasObjectObserve = (function detectObjectObserve() {
    if (typeof Object.observe !== 'function') {
      return false;
    }
    var records = [];
    function callback(recs) {
      records = recs;
    }
    var test = {};
    Object.observe(test, callback);
    test.id = 1;
    test.id = 2;
    delete test.id;
    Object.deliverChangeRecords(callback);
    if (records.length !== 3)
      return false;
    if (records[0].type != 'add' || records[1].type != 'update' || records[2].type != 'delete') {
      return false;
    }
    Object.unobserve(test, callback);
    return true;
  })();
  exports.hasObjectObserve = hasObjectObserve;
  var hasArrayObserve = (function detectArrayObserve() {
    if (typeof Array.observe !== 'function') {
      return false;
    }
    var records = [];
    function callback(recs) {
      records = recs;
    }
    var arr = [];
    Array.observe(arr, callback);
    arr.push(1, 2);
    arr.length = 0;
    Object.deliverChangeRecords(callback);
    if (records.length !== 2)
      return false;
    if (records[0].type != 'splice' || records[1].type != 'splice') {
      return false;
    }
    Array.unobserve(arr, callback);
    return true;
  })();
  exports.hasArrayObserve = hasArrayObserve;
  function newRecord(type, object, key, oldValue) {
    return {
      type: type,
      object: object,
      key: key,
      oldValue: oldValue
    };
  }
  function getChangeRecords(map) {
    var entries = [];
    for (var _iterator = map.keys(),
        _isArray = Array.isArray(_iterator),
        _i = 0,
        _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ; ) {
      var _ref;
      if (_isArray) {
        if (_i >= _iterator.length)
          break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done)
          break;
        _ref = _i.value;
      }
      var key = _ref;
      entries.push(newRecord('added', map, key));
    }
    return entries;
  }
  var ModifyCollectionObserver = (function() {
    function ModifyCollectionObserver(taskQueue, collection) {
      _classCallCheck(this, ModifyCollectionObserver);
      this.taskQueue = taskQueue;
      this.queued = false;
      this.callbacks = [];
      this.changeRecords = [];
      this.oldCollection = null;
      this.collection = collection;
      this.lengthPropertyName = collection instanceof Map ? 'size' : 'length';
    }
    ModifyCollectionObserver.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.push(callback);
      return function() {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };
    ModifyCollectionObserver.prototype.addChangeRecord = function addChangeRecord(changeRecord) {
      if (this.callbacks.length === 0 && !this.lengthObserver) {
        return;
      }
      this.changeRecords.push(changeRecord);
      if (!this.queued) {
        this.queued = true;
        this.taskQueue.queueMicroTask(this);
      }
    };
    ModifyCollectionObserver.prototype.reset = function reset(oldCollection) {
      if (!this.callbacks.length) {
        return;
      }
      this.oldCollection = oldCollection;
      if (!this.queued) {
        this.queued = true;
        this.taskQueue.queueMicroTask(this);
      }
    };
    ModifyCollectionObserver.prototype.getLengthObserver = function getLengthObserver() {
      return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.collection));
    };
    ModifyCollectionObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          changeRecords = this.changeRecords,
          oldCollection = this.oldCollection,
          records;
      this.queued = false;
      this.changeRecords = [];
      this.oldCollection = null;
      if (i) {
        if (oldCollection) {
          if (this.collection instanceof Map) {
            records = getChangeRecords(oldCollection);
          } else {
            records = calcSplices(this.collection, 0, this.collection.length, oldCollection, 0, oldCollection.length);
          }
        } else {
          if (this.collection instanceof Map) {
            records = changeRecords;
          } else {
            records = projectArraySplices(this.collection, changeRecords);
          }
        }
        while (i--) {
          callbacks[i](records);
        }
      }
      if (this.lengthObserver) {
        this.lengthObserver.call(this.collection[this.lengthPropertyName]);
      }
    };
    return ModifyCollectionObserver;
  })();
  exports.ModifyCollectionObserver = ModifyCollectionObserver;
  var CollectionLengthObserver = (function() {
    function CollectionLengthObserver(collection) {
      _classCallCheck(this, CollectionLengthObserver);
      this.collection = collection;
      this.callbacks = [];
      this.lengthPropertyName = collection instanceof Map ? 'size' : 'length';
      this.currentValue = collection[this.lengthPropertyName];
    }
    CollectionLengthObserver.prototype.getValue = function getValue() {
      return this.collection[this.lengthPropertyName];
    };
    CollectionLengthObserver.prototype.setValue = function setValue(newValue) {
      this.collection[this.lengthPropertyName] = newValue;
    };
    CollectionLengthObserver.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.push(callback);
      return function() {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };
    CollectionLengthObserver.prototype.call = function call(newValue) {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.currentValue;
      while (i--) {
        callbacks[i](newValue, oldValue);
      }
      this.currentValue = newValue;
    };
    return CollectionLengthObserver;
  })();
  exports.CollectionLengthObserver = CollectionLengthObserver;
  var arrayProto = Array.prototype;
  function _getArrayObserver(taskQueue, array) {
    if (hasArrayObserve) {
      return new ArrayObserveObserver(array);
    } else {
      return ModifyArrayObserver.create(taskQueue, array);
    }
  }
  var ModifyArrayObserver = (function(_ModifyCollectionObserver) {
    _inherits(ModifyArrayObserver, _ModifyCollectionObserver);
    function ModifyArrayObserver(taskQueue, array) {
      _classCallCheck(this, ModifyArrayObserver);
      _ModifyCollectionObserver.call(this, taskQueue, array);
    }
    ModifyArrayObserver.create = function create(taskQueue, array) {
      var observer = new ModifyArrayObserver(taskQueue, array);
      array['pop'] = function() {
        var methodCallResult = arrayProto['pop'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'delete',
          object: array,
          name: array.length,
          oldValue: methodCallResult
        });
        return methodCallResult;
      };
      array['push'] = function() {
        var methodCallResult = arrayProto['push'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'splice',
          object: array,
          index: array.length - arguments.length,
          removed: [],
          addedCount: arguments.length
        });
        return methodCallResult;
      };
      array['reverse'] = function() {
        var oldArray = array.slice();
        var methodCallResult = arrayProto['reverse'].apply(array, arguments);
        observer.reset(oldArray);
        return methodCallResult;
      };
      array['shift'] = function() {
        var methodCallResult = arrayProto['shift'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'delete',
          object: array,
          name: 0,
          oldValue: methodCallResult
        });
        return methodCallResult;
      };
      array['sort'] = function() {
        var oldArray = array.slice();
        var methodCallResult = arrayProto['sort'].apply(array, arguments);
        observer.reset(oldArray);
        return methodCallResult;
      };
      array['splice'] = function() {
        var methodCallResult = arrayProto['splice'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'splice',
          object: array,
          index: arguments[0],
          removed: methodCallResult,
          addedCount: arguments.length > 2 ? arguments.length - 2 : 0
        });
        return methodCallResult;
      };
      array['unshift'] = function() {
        var methodCallResult = arrayProto['unshift'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'splice',
          object: array,
          index: 0,
          removed: [],
          addedCount: arguments.length
        });
        return methodCallResult;
      };
      return observer;
    };
    return ModifyArrayObserver;
  })(ModifyCollectionObserver);
  var ArrayObserveObserver = (function() {
    function ArrayObserveObserver(array) {
      _classCallCheck(this, ArrayObserveObserver);
      this.array = array;
      this.callbacks = [];
    }
    ArrayObserveObserver.prototype.subscribe = function subscribe(callback) {
      var _this3 = this;
      var callbacks = this.callbacks;
      if (callbacks.length === 0) {
        this.handler = this.handleChanges.bind(this);
        Array.observe(this.array, this.handler);
      }
      callbacks.push(callback);
      return function() {
        callbacks.splice(callbacks.indexOf(callback), 1);
        if (callbacks.length === 0) {
          Array.unobserve(_this3.array, _this3.handler);
        }
      };
    };
    ArrayObserveObserver.prototype.getLengthObserver = function getLengthObserver() {
      return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.array));
    };
    ArrayObserveObserver.prototype.handleChanges = function handleChanges(changeRecords) {
      var callbacks = this.callbacks,
          i = callbacks.length,
          splices;
      if (i) {
        splices = projectArraySplices(this.array, changeRecords);
        while (i--) {
          callbacks[i](splices);
        }
      }
      if (this.lengthObserver) {
        this.lengthObserver.call(this.array.length);
      }
    };
    return ArrayObserveObserver;
  })();
  var PathObserver = (function() {
    function PathObserver(leftObserver, getRightObserver, value) {
      var _this4 = this;
      _classCallCheck(this, PathObserver);
      this.leftObserver = leftObserver;
      this.disposeLeft = leftObserver.subscribe(function(newValue) {
        var newRightValue = _this4.updateRight(getRightObserver(newValue));
        _this4.notify(newRightValue);
      });
      this.updateRight(getRightObserver(value));
    }
    PathObserver.prototype.updateRight = function updateRight(observer) {
      var _this5 = this;
      this.rightObserver = observer;
      if (this.disposeRight) {
        this.disposeRight();
      }
      if (!observer) {
        return null;
      }
      this.disposeRight = observer.subscribe(function(newValue) {
        return _this5.notify(newValue);
      });
      return observer.getValue();
    };
    PathObserver.prototype.subscribe = function subscribe(callback) {
      var that = this;
      that.callback = callback;
      return function() {
        that.callback = null;
      };
    };
    PathObserver.prototype.notify = function notify(newValue) {
      var callback = this.callback;
      if (callback) {
        callback(newValue);
      }
    };
    PathObserver.prototype.dispose = function dispose() {
      if (this.disposeLeft) {
        this.disposeLeft();
      }
      if (this.disposeRight) {
        this.disposeRight();
      }
    };
    return PathObserver;
  })();
  exports.PathObserver = PathObserver;
  var CompositeObserver = (function() {
    function CompositeObserver(observers, evaluate) {
      var _this6 = this;
      _classCallCheck(this, CompositeObserver);
      this.subscriptions = new Array(observers.length);
      this.evaluate = evaluate;
      for (var i = 0,
          ii = observers.length; i < ii; i++) {
        this.subscriptions[i] = observers[i].subscribe(function(newValue) {
          _this6.notify(_this6.evaluate());
        });
      }
    }
    CompositeObserver.prototype.subscribe = function subscribe(callback) {
      var that = this;
      that.callback = callback;
      return function() {
        that.callback = null;
      };
    };
    CompositeObserver.prototype.notify = function notify(newValue) {
      var callback = this.callback;
      if (callback) {
        callback(newValue);
      }
    };
    CompositeObserver.prototype.dispose = function dispose() {
      var subscriptions = this.subscriptions;
      var i = subscriptions.length;
      while (i--) {
        subscriptions[i]();
      }
    };
    return CompositeObserver;
  })();
  exports.CompositeObserver = CompositeObserver;
  var Expression = (function() {
    function Expression() {
      _classCallCheck(this, Expression);
      this.isChain = false;
      this.isAssignable = false;
    }
    Expression.prototype.evaluate = function evaluate(scope, valueConverters, args) {
      throw new Error('Cannot evaluate ' + this);
    };
    Expression.prototype.assign = function assign(scope, value, valueConverters) {
      throw new Error('Cannot assign to ' + this);
    };
    Expression.prototype.toString = function toString() {
      return Unparser.unparse(this);
    };
    return Expression;
  })();
  exports.Expression = Expression;
  var Chain = (function(_Expression) {
    _inherits(Chain, _Expression);
    function Chain(expressions) {
      _classCallCheck(this, Chain);
      _Expression.call(this);
      this.expressions = expressions;
      this.isChain = true;
    }
    Chain.prototype.evaluate = function evaluate(scope, valueConverters) {
      var result,
          expressions = this.expressions,
          length = expressions.length,
          i,
          last;
      for (i = 0; i < length; ++i) {
        last = expressions[i].evaluate(scope, valueConverters);
        if (last !== null) {
          result = last;
        }
      }
      return result;
    };
    Chain.prototype.accept = function accept(visitor) {
      visitor.visitChain(this);
    };
    return Chain;
  })(Expression);
  exports.Chain = Chain;
  var ValueConverter = (function(_Expression2) {
    _inherits(ValueConverter, _Expression2);
    function ValueConverter(expression, name, args, allArgs) {
      _classCallCheck(this, ValueConverter);
      _Expression2.call(this);
      this.expression = expression;
      this.name = name;
      this.args = args;
      this.allArgs = allArgs;
    }
    ValueConverter.prototype.evaluate = function evaluate(scope, valueConverters) {
      var converter = valueConverters(this.name);
      if (!converter) {
        throw new Error('No ValueConverter named "' + this.name + '" was found!');
      }
      if ('toView' in converter) {
        return converter.toView.apply(converter, evalList(scope, this.allArgs, valueConverters));
      }
      return this.allArgs[0].evaluate(scope, valueConverters);
    };
    ValueConverter.prototype.assign = function assign(scope, value, valueConverters) {
      var converter = valueConverters(this.name);
      if (!converter) {
        throw new Error('No ValueConverter named "' + this.name + '" was found!');
      }
      if ('fromView' in converter) {
        value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, valueConverters)));
      }
      return this.allArgs[0].assign(scope, value, valueConverters);
    };
    ValueConverter.prototype.accept = function accept(visitor) {
      visitor.visitValueConverter(this);
    };
    ValueConverter.prototype.connect = function connect(binding, scope) {
      var _this7 = this;
      var observer,
          childObservers = [],
          i,
          ii,
          exp,
          expInfo;
      for (i = 0, ii = this.allArgs.length; i < ii; ++i) {
        exp = this.allArgs[i];
        expInfo = exp.connect(binding, scope);
        if (expInfo.observer) {
          childObservers.push(expInfo.observer);
        }
      }
      if (childObservers.length) {
        observer = new CompositeObserver(childObservers, function() {
          return _this7.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };
    return ValueConverter;
  })(Expression);
  exports.ValueConverter = ValueConverter;
  var Assign = (function(_Expression3) {
    _inherits(Assign, _Expression3);
    function Assign(target, value) {
      _classCallCheck(this, Assign);
      _Expression3.call(this);
      this.target = target;
      this.value = value;
    }
    Assign.prototype.evaluate = function evaluate(scope, valueConverters) {
      return this.target.assign(scope, this.value.evaluate(scope, valueConverters));
    };
    Assign.prototype.accept = function accept(vistor) {
      vistor.visitAssign(this);
    };
    Assign.prototype.connect = function connect(binding, scope) {
      return {value: this.evaluate(scope, binding.valueConverterLookupFunction)};
    };
    return Assign;
  })(Expression);
  exports.Assign = Assign;
  var Conditional = (function(_Expression4) {
    _inherits(Conditional, _Expression4);
    function Conditional(condition, yes, no) {
      _classCallCheck(this, Conditional);
      _Expression4.call(this);
      this.condition = condition;
      this.yes = yes;
      this.no = no;
    }
    Conditional.prototype.evaluate = function evaluate(scope, valueConverters) {
      return !!this.condition.evaluate(scope) ? this.yes.evaluate(scope) : this.no.evaluate(scope);
    };
    Conditional.prototype.accept = function accept(visitor) {
      visitor.visitConditional(this);
    };
    Conditional.prototype.connect = function connect(binding, scope) {
      var _this8 = this;
      var conditionInfo = this.condition.connect(binding, scope),
          yesInfo = this.yes.connect(binding, scope),
          noInfo = this.no.connect(binding, scope),
          childObservers = [],
          observer;
      if (conditionInfo.observer) {
        childObservers.push(conditionInfo.observer);
      }
      if (yesInfo.observer) {
        childObservers.push(yesInfo.observer);
      }
      if (noInfo.observer) {
        childObservers.push(noInfo.observer);
      }
      if (childObservers.length) {
        observer = new CompositeObserver(childObservers, function() {
          return _this8.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: !!conditionInfo.value ? yesInfo.value : noInfo.value,
        observer: observer
      };
    };
    return Conditional;
  })(Expression);
  exports.Conditional = Conditional;
  var AccessScope = (function(_Expression5) {
    _inherits(AccessScope, _Expression5);
    function AccessScope(name) {
      _classCallCheck(this, AccessScope);
      _Expression5.call(this);
      this.name = name;
      this.isAssignable = true;
    }
    AccessScope.prototype.evaluate = function evaluate(scope, valueConverters) {
      return scope[this.name];
    };
    AccessScope.prototype.assign = function assign(scope, value) {
      return scope[this.name] = value;
    };
    AccessScope.prototype.accept = function accept(visitor) {
      visitor.visitAccessScope(this);
    };
    AccessScope.prototype.connect = function connect(binding, scope) {
      var observer = binding.getObserver(scope, this.name);
      return {
        value: observer.getValue(),
        observer: observer
      };
    };
    return AccessScope;
  })(Expression);
  exports.AccessScope = AccessScope;
  var AccessMember = (function(_Expression6) {
    _inherits(AccessMember, _Expression6);
    function AccessMember(object, name) {
      _classCallCheck(this, AccessMember);
      _Expression6.call(this);
      this.object = object;
      this.name = name;
      this.isAssignable = true;
    }
    AccessMember.prototype.evaluate = function evaluate(scope, valueConverters) {
      var instance = this.object.evaluate(scope, valueConverters);
      return instance === null || instance === undefined ? instance : instance[this.name];
    };
    AccessMember.prototype.assign = function assign(scope, value) {
      var instance = this.object.evaluate(scope);
      if (instance === null || instance === undefined) {
        instance = {};
        this.object.assign(scope, instance);
      }
      return instance[this.name] = value;
    };
    AccessMember.prototype.accept = function accept(visitor) {
      visitor.visitAccessMember(this);
    };
    AccessMember.prototype.connect = function connect(binding, scope) {
      var _this9 = this;
      var info = this.object.connect(binding, scope),
          objectInstance = info.value,
          objectObserver = info.observer,
          observer;
      if (objectObserver) {
        observer = new PathObserver(objectObserver, function(value) {
          if (value == null || value == undefined) {
            return value;
          }
          return binding.getObserver(value, _this9.name);
        }, objectInstance);
      } else {
        observer = binding.getObserver(objectInstance, this.name);
      }
      return {
        value: objectInstance == null ? null : objectInstance[this.name],
        observer: observer
      };
    };
    return AccessMember;
  })(Expression);
  exports.AccessMember = AccessMember;
  var AccessKeyed = (function(_Expression7) {
    _inherits(AccessKeyed, _Expression7);
    function AccessKeyed(object, key) {
      _classCallCheck(this, AccessKeyed);
      _Expression7.call(this);
      this.object = object;
      this.key = key;
      this.isAssignable = true;
    }
    AccessKeyed.prototype.evaluate = function evaluate(scope, valueConverters) {
      var instance = this.object.evaluate(scope, valueConverters);
      var lookup = this.key.evaluate(scope, valueConverters);
      return getKeyed(instance, lookup);
    };
    AccessKeyed.prototype.assign = function assign(scope, value) {
      var instance = this.object.evaluate(scope);
      var lookup = this.key.evaluate(scope);
      return setKeyed(instance, lookup, value);
    };
    AccessKeyed.prototype.accept = function accept(visitor) {
      visitor.visitAccessKeyed(this);
    };
    AccessKeyed.prototype.connect = function connect(binding, scope) {
      var _this10 = this;
      var objectInfo = this.object.connect(binding, scope),
          keyInfo = this.key.connect(binding, scope),
          observer = new AccessKeyedObserver(objectInfo, keyInfo, binding.observerLocator, function() {
            return _this10.evaluate(scope, binding.valueConverterLookupFunction);
          });
      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };
    return AccessKeyed;
  })(Expression);
  exports.AccessKeyed = AccessKeyed;
  var CallScope = (function(_Expression8) {
    _inherits(CallScope, _Expression8);
    function CallScope(name, args) {
      _classCallCheck(this, CallScope);
      _Expression8.call(this);
      this.name = name;
      this.args = args;
    }
    CallScope.prototype.evaluate = function evaluate(scope, valueConverters, args) {
      args = args || evalList(scope, this.args, valueConverters);
      return ensureFunctionFromMap(scope, this.name).apply(scope, args);
    };
    CallScope.prototype.accept = function accept(visitor) {
      visitor.visitCallScope(this);
    };
    CallScope.prototype.connect = function connect(binding, scope) {
      var _this11 = this;
      var observer,
          childObservers = [],
          i,
          ii,
          exp,
          expInfo;
      for (i = 0, ii = this.args.length; i < ii; ++i) {
        exp = this.args[i];
        expInfo = exp.connect(binding, scope);
        if (expInfo.observer) {
          childObservers.push(expInfo.observer);
        }
      }
      if (childObservers.length) {
        observer = new CompositeObserver(childObservers, function() {
          return _this11.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };
    return CallScope;
  })(Expression);
  exports.CallScope = CallScope;
  var CallMember = (function(_Expression9) {
    _inherits(CallMember, _Expression9);
    function CallMember(object, name, args) {
      _classCallCheck(this, CallMember);
      _Expression9.call(this);
      this.object = object;
      this.name = name;
      this.args = args;
    }
    CallMember.prototype.evaluate = function evaluate(scope, valueConverters, args) {
      var instance = this.object.evaluate(scope, valueConverters);
      args = args || evalList(scope, this.args, valueConverters);
      return ensureFunctionFromMap(instance, this.name).apply(instance, args);
    };
    CallMember.prototype.accept = function accept(visitor) {
      visitor.visitCallMember(this);
    };
    CallMember.prototype.connect = function connect(binding, scope) {
      var _this12 = this;
      var observer,
          objectInfo = this.object.connect(binding, scope),
          childObservers = [],
          i,
          ii,
          exp,
          expInfo;
      if (objectInfo.observer) {
        childObservers.push(objectInfo.observer);
      }
      for (i = 0, ii = this.args.length; i < ii; ++i) {
        exp = this.args[i];
        expInfo = exp.connect(binding, scope);
        if (expInfo.observer) {
          childObservers.push(expInfo.observer);
        }
      }
      if (childObservers.length) {
        observer = new CompositeObserver(childObservers, function() {
          return _this12.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };
    return CallMember;
  })(Expression);
  exports.CallMember = CallMember;
  var CallFunction = (function(_Expression10) {
    _inherits(CallFunction, _Expression10);
    function CallFunction(func, args) {
      _classCallCheck(this, CallFunction);
      _Expression10.call(this);
      this.func = func;
      this.args = args;
    }
    CallFunction.prototype.evaluate = function evaluate(scope, valueConverters, args) {
      var func = this.func.evaluate(scope, valueConverters);
      if (typeof func !== 'function') {
        throw new Error(this.func + ' is not a function');
      } else {
        return func.apply(null, args || evalList(scope, this.args, valueConverters));
      }
    };
    CallFunction.prototype.accept = function accept(visitor) {
      visitor.visitCallFunction(this);
    };
    CallFunction.prototype.connect = function connect(binding, scope) {
      var _this13 = this;
      var observer,
          funcInfo = this.func.connect(binding, scope),
          childObservers = [],
          i,
          ii,
          exp,
          expInfo;
      if (funcInfo.observer) {
        childObservers.push(funcInfo.observer);
      }
      for (i = 0, ii = this.args.length; i < ii; ++i) {
        exp = this.args[i];
        expInfo = exp.connect(binding, scope);
        if (expInfo.observer) {
          childObservers.push(expInfo.observer);
        }
      }
      if (childObservers.length) {
        observer = new CompositeObserver(childObservers, function() {
          return _this13.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };
    return CallFunction;
  })(Expression);
  exports.CallFunction = CallFunction;
  var Binary = (function(_Expression11) {
    _inherits(Binary, _Expression11);
    function Binary(operation, left, right) {
      _classCallCheck(this, Binary);
      _Expression11.call(this);
      this.operation = operation;
      this.left = left;
      this.right = right;
    }
    Binary.prototype.evaluate = function evaluate(scope, valueConverters) {
      var left = this.left.evaluate(scope);
      switch (this.operation) {
        case '&&':
          return left && this.right.evaluate(scope);
        case '||':
          return left || this.right.evaluate(scope);
      }
      var right = this.right.evaluate(scope);
      switch (this.operation) {
        case '==':
          return left == right;
        case '===':
          return left === right;
        case '!=':
          return left != right;
        case '!==':
          return left !== right;
      }
      if (left === null || right === null) {
        switch (this.operation) {
          case '+':
            if (left != null)
              return left;
            if (right != null)
              return right;
            return 0;
          case '-':
            if (left != null)
              return left;
            if (right != null)
              return 0 - right;
            return 0;
        }
        return null;
      }
      switch (this.operation) {
        case '+':
          return autoConvertAdd(left, right);
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
        case '%':
          return left % right;
        case '<':
          return left < right;
        case '>':
          return left > right;
        case '<=':
          return left <= right;
        case '>=':
          return left >= right;
        case '^':
          return left ^ right;
        case '&':
          return left & right;
      }
      throw new Error('Internal error [' + this.operation + '] not handled');
    };
    Binary.prototype.accept = function accept(visitor) {
      visitor.visitBinary(this);
    };
    Binary.prototype.connect = function connect(binding, scope) {
      var _this14 = this;
      var leftInfo = this.left.connect(binding, scope),
          rightInfo = this.right.connect(binding, scope),
          childObservers = [],
          observer;
      if (leftInfo.observer) {
        childObservers.push(leftInfo.observer);
      }
      if (rightInfo.observer) {
        childObservers.push(rightInfo.observer);
      }
      if (childObservers.length) {
        observer = new CompositeObserver(childObservers, function() {
          return _this14.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };
    return Binary;
  })(Expression);
  exports.Binary = Binary;
  var PrefixNot = (function(_Expression12) {
    _inherits(PrefixNot, _Expression12);
    function PrefixNot(operation, expression) {
      _classCallCheck(this, PrefixNot);
      _Expression12.call(this);
      this.operation = operation;
      this.expression = expression;
    }
    PrefixNot.prototype.evaluate = function evaluate(scope, valueConverters) {
      return !this.expression.evaluate(scope);
    };
    PrefixNot.prototype.accept = function accept(visitor) {
      visitor.visitPrefix(this);
    };
    PrefixNot.prototype.connect = function connect(binding, scope) {
      var _this15 = this;
      var info = this.expression.connect(binding, scope),
          observer;
      if (info.observer) {
        observer = new CompositeObserver([info.observer], function() {
          return _this15.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: !info.value,
        observer: observer
      };
    };
    return PrefixNot;
  })(Expression);
  exports.PrefixNot = PrefixNot;
  var LiteralPrimitive = (function(_Expression13) {
    _inherits(LiteralPrimitive, _Expression13);
    function LiteralPrimitive(value) {
      _classCallCheck(this, LiteralPrimitive);
      _Expression13.call(this);
      this.value = value;
    }
    LiteralPrimitive.prototype.evaluate = function evaluate(scope, valueConverters) {
      return this.value;
    };
    LiteralPrimitive.prototype.accept = function accept(visitor) {
      visitor.visitLiteralPrimitive(this);
    };
    LiteralPrimitive.prototype.connect = function connect(binding, scope) {
      return {value: this.value};
    };
    return LiteralPrimitive;
  })(Expression);
  exports.LiteralPrimitive = LiteralPrimitive;
  var LiteralString = (function(_Expression14) {
    _inherits(LiteralString, _Expression14);
    function LiteralString(value) {
      _classCallCheck(this, LiteralString);
      _Expression14.call(this);
      this.value = value;
    }
    LiteralString.prototype.evaluate = function evaluate(scope, valueConverters) {
      return this.value;
    };
    LiteralString.prototype.accept = function accept(visitor) {
      visitor.visitLiteralString(this);
    };
    LiteralString.prototype.connect = function connect(binding, scope) {
      return {value: this.value};
    };
    return LiteralString;
  })(Expression);
  exports.LiteralString = LiteralString;
  var LiteralArray = (function(_Expression15) {
    _inherits(LiteralArray, _Expression15);
    function LiteralArray(elements) {
      _classCallCheck(this, LiteralArray);
      _Expression15.call(this);
      this.elements = elements;
    }
    LiteralArray.prototype.evaluate = function evaluate(scope, valueConverters) {
      var elements = this.elements,
          length = elements.length,
          result = [],
          i;
      for (i = 0; i < length; ++i) {
        result[i] = elements[i].evaluate(scope, valueConverters);
      }
      return result;
    };
    LiteralArray.prototype.accept = function accept(visitor) {
      visitor.visitLiteralArray(this);
    };
    LiteralArray.prototype.connect = function connect(binding, scope) {
      var _this16 = this;
      var observer,
          childObservers = [],
          results = [],
          i,
          ii,
          exp,
          expInfo;
      for (i = 0, ii = this.elements.length; i < ii; ++i) {
        exp = this.elements[i];
        expInfo = exp.connect(binding, scope);
        if (expInfo.observer) {
          childObservers.push(expInfo.observer);
        }
        results[i] = expInfo.value;
      }
      if (childObservers.length) {
        observer = new CompositeObserver(childObservers, function() {
          return _this16.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: results,
        observer: observer
      };
    };
    return LiteralArray;
  })(Expression);
  exports.LiteralArray = LiteralArray;
  var LiteralObject = (function(_Expression16) {
    _inherits(LiteralObject, _Expression16);
    function LiteralObject(keys, values) {
      _classCallCheck(this, LiteralObject);
      _Expression16.call(this);
      this.keys = keys;
      this.values = values;
    }
    LiteralObject.prototype.evaluate = function evaluate(scope, valueConverters) {
      var instance = {},
          keys = this.keys,
          values = this.values,
          length = keys.length,
          i;
      for (i = 0; i < length; ++i) {
        instance[keys[i]] = values[i].evaluate(scope, valueConverters);
      }
      return instance;
    };
    LiteralObject.prototype.accept = function accept(visitor) {
      visitor.visitLiteralObject(this);
    };
    LiteralObject.prototype.connect = function connect(binding, scope) {
      var _this17 = this;
      var observer,
          childObservers = [],
          instance = {},
          keys = this.keys,
          values = this.values,
          length = keys.length,
          i,
          valueInfo;
      for (i = 0; i < length; ++i) {
        valueInfo = values[i].connect(binding, scope);
        if (valueInfo.observer) {
          childObservers.push(valueInfo.observer);
        }
        instance[keys[i]] = valueInfo.value;
      }
      if (childObservers.length) {
        observer = new CompositeObserver(childObservers, function() {
          return _this17.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }
      return {
        value: instance,
        observer: observer
      };
    };
    return LiteralObject;
  })(Expression);
  exports.LiteralObject = LiteralObject;
  var Unparser = (function() {
    function Unparser(buffer) {
      _classCallCheck(this, Unparser);
      this.buffer = buffer;
    }
    Unparser.unparse = function unparse(expression) {
      var buffer = [],
          visitor = new Unparser(buffer);
      expression.accept(visitor);
      return buffer.join('');
    };
    Unparser.prototype.write = function write(text) {
      this.buffer.push(text);
    };
    Unparser.prototype.writeArgs = function writeArgs(args) {
      var i,
          length;
      this.write('(');
      for (i = 0, length = args.length; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }
        args[i].accept(this);
      }
      this.write(')');
    };
    Unparser.prototype.visitChain = function visitChain(chain) {
      var expressions = chain.expressions,
          length = expressions.length,
          i;
      for (i = 0; i < length; ++i) {
        if (i !== 0) {
          this.write(';');
        }
        expressions[i].accept(this);
      }
    };
    Unparser.prototype.visitValueConverter = function visitValueConverter(converter) {
      var args = converter.args,
          length = args.length,
          i;
      this.write('(');
      converter.expression.accept(this);
      this.write('|' + converter.name);
      for (i = 0; i < length; ++i) {
        this.write(' :');
        args[i].accept(this);
      }
      this.write(')');
    };
    Unparser.prototype.visitAssign = function visitAssign(assign) {
      assign.target.accept(this);
      this.write('=');
      assign.value.accept(this);
    };
    Unparser.prototype.visitConditional = function visitConditional(conditional) {
      conditional.condition.accept(this);
      this.write('?');
      conditional.yes.accept(this);
      this.write(':');
      conditional.no.accept(this);
    };
    Unparser.prototype.visitAccessScope = function visitAccessScope(access) {
      this.write(access.name);
    };
    Unparser.prototype.visitAccessMember = function visitAccessMember(access) {
      access.object.accept(this);
      this.write('.' + access.name);
    };
    Unparser.prototype.visitAccessKeyed = function visitAccessKeyed(access) {
      access.object.accept(this);
      this.write('[');
      access.key.accept(this);
      this.write(']');
    };
    Unparser.prototype.visitCallScope = function visitCallScope(call) {
      this.write(call.name);
      this.writeArgs(call.args);
    };
    Unparser.prototype.visitCallFunction = function visitCallFunction(call) {
      call.func.accept(this);
      this.writeArgs(call.args);
    };
    Unparser.prototype.visitCallMember = function visitCallMember(call) {
      call.object.accept(this);
      this.write('.' + call.name);
      this.writeArgs(call.args);
    };
    Unparser.prototype.visitPrefix = function visitPrefix(prefix) {
      this.write('(' + prefix.operation);
      prefix.expression.accept(this);
      this.write(')');
    };
    Unparser.prototype.visitBinary = function visitBinary(binary) {
      this.write('(');
      binary.left.accept(this);
      this.write(binary.operation);
      binary.right.accept(this);
      this.write(')');
    };
    Unparser.prototype.visitLiteralPrimitive = function visitLiteralPrimitive(literal) {
      this.write('' + literal.value);
    };
    Unparser.prototype.visitLiteralArray = function visitLiteralArray(literal) {
      var elements = literal.elements,
          length = elements.length,
          i;
      this.write('[');
      for (i = 0; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }
        elements[i].accept(this);
      }
      this.write(']');
    };
    Unparser.prototype.visitLiteralObject = function visitLiteralObject(literal) {
      var keys = literal.keys,
          values = literal.values,
          length = keys.length,
          i;
      this.write('{');
      for (i = 0; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }
        this.write('\'' + keys[i] + '\':');
        values[i].accept(this);
      }
      this.write('}');
    };
    Unparser.prototype.visitLiteralString = function visitLiteralString(literal) {
      var escaped = literal.value.replace(/'/g, "\'");
      this.write('\'' + escaped + '\'');
    };
    return Unparser;
  })();
  exports.Unparser = Unparser;
  var evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];
  function evalList(scope, list, valueConverters) {
    var length = list.length,
        cacheLength,
        i;
    for (cacheLength = evalListCache.length; cacheLength <= length; ++cacheLength) {
      evalListCache.push([]);
    }
    var result = evalListCache[length];
    for (i = 0; i < length; ++i) {
      result[i] = list[i].evaluate(scope, valueConverters);
    }
    return result;
  }
  function autoConvertAdd(a, b) {
    if (a != null && b != null) {
      if (typeof a == 'string' && typeof b != 'string') {
        return a + b.toString();
      }
      if (typeof a != 'string' && typeof b == 'string') {
        return a.toString() + b;
      }
      return a + b;
    }
    if (a != null) {
      return a;
    }
    if (b != null) {
      return b;
    }
    return 0;
  }
  function ensureFunctionFromMap(obj, name) {
    var func = obj[name];
    if (typeof func === 'function') {
      return func;
    }
    if (func === null) {
      throw new Error('Undefined function ' + name);
    } else {
      throw new Error(name + ' is not a function');
    }
  }
  function getKeyed(obj, key) {
    if (Array.isArray(obj)) {
      return obj[parseInt(key)];
    } else if (obj) {
      return obj[key];
    } else if (obj === null) {
      throw new Error('Accessing null object');
    } else {
      return obj[key];
    }
  }
  function setKeyed(obj, key, value) {
    if (Array.isArray(obj)) {
      var index = parseInt(key);
      if (obj.length <= index) {
        obj.length = index + 1;
      }
      obj[index] = value;
    } else {
      obj[key] = value;
    }
    return value;
  }
  var bindingMode = {
    oneTime: 0,
    oneWay: 1,
    twoWay: 2
  };
  exports.bindingMode = bindingMode;
  var Token = (function() {
    function Token(index, text) {
      _classCallCheck(this, Token);
      this.index = index;
      this.text = text;
    }
    Token.prototype.withOp = function withOp(op) {
      this.opKey = op;
      return this;
    };
    Token.prototype.withGetterSetter = function withGetterSetter(key) {
      this.key = key;
      return this;
    };
    Token.prototype.withValue = function withValue(value) {
      this.value = value;
      return this;
    };
    Token.prototype.toString = function toString() {
      return 'Token(' + this.text + ')';
    };
    return Token;
  })();
  exports.Token = Token;
  var Lexer = (function() {
    function Lexer() {
      _classCallCheck(this, Lexer);
    }
    Lexer.prototype.lex = function lex(text) {
      var scanner = new Scanner(text);
      var tokens = [];
      var token = scanner.scanToken();
      while (token) {
        tokens.push(token);
        token = scanner.scanToken();
      }
      return tokens;
    };
    return Lexer;
  })();
  exports.Lexer = Lexer;
  var Scanner = (function() {
    function Scanner(input) {
      _classCallCheck(this, Scanner);
      this.input = input;
      this.length = input.length;
      this.peek = 0;
      this.index = -1;
      this.advance();
    }
    Scanner.prototype.scanToken = function scanToken() {
      while (this.peek <= $SPACE) {
        if (++this.index >= this.length) {
          this.peek = $EOF;
          return null;
        } else {
          this.peek = this.input.charCodeAt(this.index);
        }
      }
      if (isIdentifierStart(this.peek)) {
        return this.scanIdentifier();
      }
      if (isDigit(this.peek)) {
        return this.scanNumber(this.index);
      }
      var start = this.index;
      switch (this.peek) {
        case $PERIOD:
          this.advance();
          return isDigit(this.peek) ? this.scanNumber(start) : new Token(start, '.');
        case $LPAREN:
        case $RPAREN:
        case $LBRACE:
        case $RBRACE:
        case $LBRACKET:
        case $RBRACKET:
        case $COMMA:
        case $COLON:
        case $SEMICOLON:
          return this.scanCharacter(start, String.fromCharCode(this.peek));
        case $SQ:
        case $DQ:
          return this.scanString();
        case $PLUS:
        case $MINUS:
        case $STAR:
        case $SLASH:
        case $PERCENT:
        case $CARET:
        case $QUESTION:
          return this.scanOperator(start, String.fromCharCode(this.peek));
        case $LT:
        case $GT:
        case $BANG:
        case $EQ:
          return this.scanComplexOperator(start, $EQ, String.fromCharCode(this.peek), '=');
        case $AMPERSAND:
          return this.scanComplexOperator(start, $AMPERSAND, '&', '&');
        case $BAR:
          return this.scanComplexOperator(start, $BAR, '|', '|');
        case $NBSP:
          while (isWhitespace(this.peek)) {
            this.advance();
          }
          return this.scanToken();
      }
      var character = String.fromCharCode(this.peek);
      this.error('Unexpected character [' + character + ']');
      return null;
    };
    Scanner.prototype.scanCharacter = function scanCharacter(start, text) {
      assert(this.peek === text.charCodeAt(0));
      this.advance();
      return new Token(start, text);
    };
    Scanner.prototype.scanOperator = function scanOperator(start, text) {
      assert(this.peek === text.charCodeAt(0));
      assert(OPERATORS.indexOf(text) !== -1);
      this.advance();
      return new Token(start, text).withOp(text);
    };
    Scanner.prototype.scanComplexOperator = function scanComplexOperator(start, code, one, two) {
      assert(this.peek === one.charCodeAt(0));
      this.advance();
      var text = one;
      if (this.peek === code) {
        this.advance();
        text += two;
      }
      if (this.peek === code) {
        this.advance();
        text += two;
      }
      assert(OPERATORS.indexOf(text) != -1);
      return new Token(start, text).withOp(text);
    };
    Scanner.prototype.scanIdentifier = function scanIdentifier() {
      assert(isIdentifierStart(this.peek));
      var start = this.index;
      this.advance();
      while (isIdentifierPart(this.peek)) {
        this.advance();
      }
      var text = this.input.substring(start, this.index);
      var result = new Token(start, text);
      if (OPERATORS.indexOf(text) !== -1) {
        result.withOp(text);
      } else {
        result.withGetterSetter(text);
      }
      return result;
    };
    Scanner.prototype.scanNumber = function scanNumber(start) {
      assert(isDigit(this.peek));
      var simple = this.index === start;
      this.advance();
      while (true) {
        if (isDigit(this.peek)) {} else if (this.peek === $PERIOD) {
          simple = false;
        } else if (isExponentStart(this.peek)) {
          this.advance();
          if (isExponentSign(this.peek)) {
            this.advance();
          }
          if (!isDigit(this.peek)) {
            this.error('Invalid exponent', -1);
          }
          simple = false;
        } else {
          break;
        }
        this.advance();
      }
      var text = this.input.substring(start, this.index);
      var value = simple ? parseInt(text) : parseFloat(text);
      return new Token(start, text).withValue(value);
    };
    Scanner.prototype.scanString = function scanString() {
      assert(this.peek === $SQ || this.peek === $DQ);
      var start = this.index;
      var quote = this.peek;
      this.advance();
      var buffer;
      var marker = this.index;
      while (this.peek !== quote) {
        if (this.peek === $BACKSLASH) {
          if (buffer === null) {
            buffer = [];
          }
          buffer.push(this.input.substring(marker, this.index));
          this.advance();
          var unescaped;
          if (this.peek === $u) {
            var hex = this.input.substring(this.index + 1, this.index + 5);
            if (!/[A-Z0-9]{4}/.test(hex)) {
              this.error('Invalid unicode escape [\\u' + hex + ']');
            }
            unescaped = parseInt(hex, 16);
            for (var i = 0; i < 5; ++i) {
              this.advance();
            }
          } else {
            unescaped = decodeURIComponent(this.peek);
            this.advance();
          }
          buffer.push(String.fromCharCode(unescaped));
          marker = this.index;
        } else if (this.peek === $EOF) {
          this.error('Unterminated quote');
        } else {
          this.advance();
        }
      }
      var last = this.input.substring(marker, this.index);
      this.advance();
      var text = this.input.substring(start, this.index);
      var unescaped = last;
      if (buffer != null) {
        buffer.push(last);
        unescaped = buffer.join('');
      }
      return new Token(start, text).withValue(unescaped);
    };
    Scanner.prototype.advance = function advance() {
      if (++this.index >= this.length) {
        this.peek = $EOF;
      } else {
        this.peek = this.input.charCodeAt(this.index);
      }
    };
    Scanner.prototype.error = function error(message) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var position = this.index + offset;
      throw new Error('Lexer Error: ' + message + ' at column ' + position + ' in expression [' + this.input + ']');
    };
    return Scanner;
  })();
  exports.Scanner = Scanner;
  var OPERATORS = ['undefined', 'null', 'true', 'false', '+', '-', '*', '/', '%', '^', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '&', '|', '!', '?'];
  var $EOF = 0;
  var $TAB = 9;
  var $LF = 10;
  var $VTAB = 11;
  var $FF = 12;
  var $CR = 13;
  var $SPACE = 32;
  var $BANG = 33;
  var $DQ = 34;
  var $$ = 36;
  var $PERCENT = 37;
  var $AMPERSAND = 38;
  var $SQ = 39;
  var $LPAREN = 40;
  var $RPAREN = 41;
  var $STAR = 42;
  var $PLUS = 43;
  var $COMMA = 44;
  var $MINUS = 45;
  var $PERIOD = 46;
  var $SLASH = 47;
  var $COLON = 58;
  var $SEMICOLON = 59;
  var $LT = 60;
  var $EQ = 61;
  var $GT = 62;
  var $QUESTION = 63;
  var $0 = 48;
  var $9 = 57;
  var $A = 65;
  var $E = 69;
  var $Z = 90;
  var $LBRACKET = 91;
  var $BACKSLASH = 92;
  var $RBRACKET = 93;
  var $CARET = 94;
  var $_ = 95;
  var $a = 97;
  var $e = 101;
  var $f = 102;
  var $n = 110;
  var $r = 114;
  var $t = 116;
  var $u = 117;
  var $v = 118;
  var $z = 122;
  var $LBRACE = 123;
  var $BAR = 124;
  var $RBRACE = 125;
  var $NBSP = 160;
  function isWhitespace(code) {
    return code >= $TAB && code <= $SPACE || code === $NBSP;
  }
  function isIdentifierStart(code) {
    return $a <= code && code <= $z || $A <= code && code <= $Z || code === $_ || code === $$;
  }
  function isIdentifierPart(code) {
    return $a <= code && code <= $z || $A <= code && code <= $Z || $0 <= code && code <= $9 || code === $_ || code === $$;
  }
  function isDigit(code) {
    return $0 <= code && code <= $9;
  }
  function isExponentStart(code) {
    return code === $e || code === $E;
  }
  function isExponentSign(code) {
    return code === $MINUS || code === $PLUS;
  }
  function unescape(code) {
    switch (code) {
      case $n:
        return $LF;
      case $f:
        return $FF;
      case $r:
        return $CR;
      case $t:
        return $TAB;
      case $v:
        return $VTAB;
      default:
        return code;
    }
  }
  function assert(condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }
  var EOF = new Token(-1, null);
  var Parser = (function() {
    function Parser() {
      _classCallCheck(this, Parser);
      this.cache = {};
      this.lexer = new Lexer();
    }
    Parser.prototype.parse = function parse(input) {
      input = input || '';
      return this.cache[input] || (this.cache[input] = new ParserImplementation(this.lexer, input).parseChain());
    };
    return Parser;
  })();
  exports.Parser = Parser;
  var ParserImplementation = (function() {
    function ParserImplementation(lexer, input) {
      _classCallCheck(this, ParserImplementation);
      this.index = 0;
      this.input = input;
      this.tokens = lexer.lex(input);
    }
    ParserImplementation.prototype.parseChain = function parseChain() {
      var isChain = false,
          expressions = [];
      while (this.optional(';')) {
        isChain = true;
      }
      while (this.index < this.tokens.length) {
        if (this.peek.text === ')' || this.peek.text === '}' || this.peek.text === ']') {
          this.error('Unconsumed token ' + this.peek.text);
        }
        var expr = this.parseValueConverter();
        expressions.push(expr);
        while (this.optional(';')) {
          isChain = true;
        }
        if (isChain && expr instanceof ValueConverter) {
          this.error('cannot have a value converter in a chain');
        }
      }
      return expressions.length === 1 ? expressions[0] : new Chain(expressions);
    };
    ParserImplementation.prototype.parseValueConverter = function parseValueConverter() {
      var result = this.parseExpression();
      while (this.optional('|')) {
        var name = this.peek.text,
            args = [];
        this.advance();
        while (this.optional(':')) {
          args.push(this.parseExpression());
        }
        result = new ValueConverter(result, name, args, [result].concat(args));
      }
      return result;
    };
    ParserImplementation.prototype.parseExpression = function parseExpression() {
      var start = this.peek.index,
          result = this.parseConditional();
      while (this.peek.text === '=') {
        if (!result.isAssignable) {
          var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
          var expression = this.input.substring(start, end);
          this.error('Expression ' + expression + ' is not assignable');
        }
        this.expect('=');
        result = new Assign(result, this.parseConditional());
      }
      return result;
    };
    ParserImplementation.prototype.parseConditional = function parseConditional() {
      var start = this.peek.index,
          result = this.parseLogicalOr();
      if (this.optional('?')) {
        var yes = this.parseExpression();
        if (!this.optional(':')) {
          var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
          var expression = this.input.substring(start, end);
          this.error('Conditional expression ' + expression + ' requires all 3 expressions');
        }
        var no = this.parseExpression();
        result = new Conditional(result, yes, no);
      }
      return result;
    };
    ParserImplementation.prototype.parseLogicalOr = function parseLogicalOr() {
      var result = this.parseLogicalAnd();
      while (this.optional('||')) {
        result = new Binary('||', result, this.parseLogicalAnd());
      }
      return result;
    };
    ParserImplementation.prototype.parseLogicalAnd = function parseLogicalAnd() {
      var result = this.parseEquality();
      while (this.optional('&&')) {
        result = new Binary('&&', result, this.parseEquality());
      }
      return result;
    };
    ParserImplementation.prototype.parseEquality = function parseEquality() {
      var result = this.parseRelational();
      while (true) {
        if (this.optional('==')) {
          result = new Binary('==', result, this.parseRelational());
        } else if (this.optional('!=')) {
          result = new Binary('!=', result, this.parseRelational());
        } else if (this.optional('===')) {
          result = new Binary('===', result, this.parseRelational());
        } else if (this.optional('!==')) {
          result = new Binary('!==', result, this.parseRelational());
        } else {
          return result;
        }
      }
    };
    ParserImplementation.prototype.parseRelational = function parseRelational() {
      var result = this.parseAdditive();
      while (true) {
        if (this.optional('<')) {
          result = new Binary('<', result, this.parseAdditive());
        } else if (this.optional('>')) {
          result = new Binary('>', result, this.parseAdditive());
        } else if (this.optional('<=')) {
          result = new Binary('<=', result, this.parseAdditive());
        } else if (this.optional('>=')) {
          result = new Binary('>=', result, this.parseAdditive());
        } else {
          return result;
        }
      }
    };
    ParserImplementation.prototype.parseAdditive = function parseAdditive() {
      var result = this.parseMultiplicative();
      while (true) {
        if (this.optional('+')) {
          result = new Binary('+', result, this.parseMultiplicative());
        } else if (this.optional('-')) {
          result = new Binary('-', result, this.parseMultiplicative());
        } else {
          return result;
        }
      }
    };
    ParserImplementation.prototype.parseMultiplicative = function parseMultiplicative() {
      var result = this.parsePrefix();
      while (true) {
        if (this.optional('*')) {
          result = new Binary('*', result, this.parsePrefix());
        } else if (this.optional('%')) {
          result = new Binary('%', result, this.parsePrefix());
        } else if (this.optional('/')) {
          result = new Binary('/', result, this.parsePrefix());
        } else {
          return result;
        }
      }
    };
    ParserImplementation.prototype.parsePrefix = function parsePrefix() {
      if (this.optional('+')) {
        return this.parsePrefix();
      } else if (this.optional('-')) {
        return new Binary('-', new LiteralPrimitive(0), this.parsePrefix());
      } else if (this.optional('!')) {
        return new PrefixNot('!', this.parsePrefix());
      } else {
        return this.parseAccessOrCallMember();
      }
    };
    ParserImplementation.prototype.parseAccessOrCallMember = function parseAccessOrCallMember() {
      var result = this.parsePrimary();
      while (true) {
        if (this.optional('.')) {
          var name = this.peek.text;
          this.advance();
          if (this.optional('(')) {
            var args = this.parseExpressionList(')');
            this.expect(')');
            result = new CallMember(result, name, args);
          } else {
            result = new AccessMember(result, name);
          }
        } else if (this.optional('[')) {
          var key = this.parseExpression();
          this.expect(']');
          result = new AccessKeyed(result, key);
        } else if (this.optional('(')) {
          var args = this.parseExpressionList(')');
          this.expect(')');
          result = new CallFunction(result, args);
        } else {
          return result;
        }
      }
    };
    ParserImplementation.prototype.parsePrimary = function parsePrimary() {
      if (this.optional('(')) {
        var result = this.parseExpression();
        this.expect(')');
        return result;
      } else if (this.optional('null') || this.optional('undefined')) {
        return new LiteralPrimitive(null);
      } else if (this.optional('true')) {
        return new LiteralPrimitive(true);
      } else if (this.optional('false')) {
        return new LiteralPrimitive(false);
      } else if (this.optional('[')) {
        var elements = this.parseExpressionList(']');
        this.expect(']');
        return new LiteralArray(elements);
      } else if (this.peek.text == '{') {
        return this.parseObject();
      } else if (this.peek.key != null) {
        return this.parseAccessOrCallScope();
      } else if (this.peek.value != null) {
        var value = this.peek.value;
        this.advance();
        return isNaN(value) ? new LiteralString(value) : new LiteralPrimitive(value);
      } else if (this.index >= this.tokens.length) {
        throw new Error('Unexpected end of expression: ' + this.input);
      } else {
        this.error('Unexpected token ' + this.peek.text);
      }
    };
    ParserImplementation.prototype.parseAccessOrCallScope = function parseAccessOrCallScope() {
      var name = this.peek.key;
      this.advance();
      if (!this.optional('(')) {
        return new AccessScope(name);
      }
      var args = this.parseExpressionList(')');
      this.expect(')');
      return new CallScope(name, args);
    };
    ParserImplementation.prototype.parseObject = function parseObject() {
      var keys = [],
          values = [];
      this.expect('{');
      if (this.peek.text !== '}') {
        do {
          var value = this.peek.value;
          keys.push(typeof value === 'string' ? value : this.peek.text);
          this.advance();
          this.expect(':');
          values.push(this.parseExpression());
        } while (this.optional(','));
      }
      this.expect('}');
      return new LiteralObject(keys, values);
    };
    ParserImplementation.prototype.parseExpressionList = function parseExpressionList(terminator) {
      var result = [];
      if (this.peek.text != terminator) {
        do {
          result.push(this.parseExpression());
        } while (this.optional(','));
      }
      return result;
    };
    ParserImplementation.prototype.optional = function optional(text) {
      if (this.peek.text === text) {
        this.advance();
        return true;
      }
      return false;
    };
    ParserImplementation.prototype.expect = function expect(text) {
      if (this.peek.text === text) {
        this.advance();
      } else {
        this.error('Missing expected ' + text);
      }
    };
    ParserImplementation.prototype.advance = function advance() {
      this.index++;
    };
    ParserImplementation.prototype.error = function error(message) {
      var location = this.index < this.tokens.length ? 'at column ' + (this.tokens[this.index].index + 1) + ' in' : 'at the end of the expression';
      throw new Error('Parser Error: ' + message + ' ' + location + ' [' + this.input + ']');
    };
    _createClass(ParserImplementation, [{
      key: 'peek',
      get: function get() {
        return this.index < this.tokens.length ? this.tokens[this.index] : EOF;
      }
    }]);
    return ParserImplementation;
  })();
  exports.ParserImplementation = ParserImplementation;
  var mapProto = Map.prototype;
  function _getMapObserver(taskQueue, map) {
    return ModifyMapObserver.create(taskQueue, map);
  }
  var ModifyMapObserver = (function(_ModifyCollectionObserver2) {
    _inherits(ModifyMapObserver, _ModifyCollectionObserver2);
    function ModifyMapObserver(taskQueue, map) {
      _classCallCheck(this, ModifyMapObserver);
      _ModifyCollectionObserver2.call(this, taskQueue, map);
    }
    ModifyMapObserver.create = function create(taskQueue, map) {
      var observer = new ModifyMapObserver(taskQueue, map);
      map['set'] = function() {
        var oldValue = map.get(arguments[0]);
        var type = oldValue ? 'update' : 'add';
        var methodCallResult = mapProto['set'].apply(map, arguments);
        observer.addChangeRecord({
          type: type,
          object: map,
          key: arguments[0],
          oldValue: oldValue
        });
        return methodCallResult;
      };
      map['delete'] = function() {
        var oldValue = map.get(arguments[0]);
        var methodCallResult = mapProto['delete'].apply(map, arguments);
        observer.addChangeRecord({
          type: 'delete',
          object: map,
          key: arguments[0],
          oldValue: oldValue
        });
        return methodCallResult;
      };
      map['clear'] = function() {
        var methodCallResult = mapProto['clear'].apply(map, arguments);
        observer.addChangeRecord({
          type: 'clear',
          object: map
        });
        return methodCallResult;
      };
      return observer;
    };
    return ModifyMapObserver;
  })(ModifyCollectionObserver);
  function findOriginalEventTarget(event) {
    return event.originalTarget || event.path && event.path[0] || event.deepPath && event.deepPath[0] || event.target || event.srcElement;
  }
  function handleDelegatedEvent(event) {
    event = event || window.event;
    var target = findOriginalEventTarget(event),
        callback;
    while (target && !callback) {
      if (target.delegatedCallbacks) {
        callback = target.delegatedCallbacks[event.type];
      }
      if (!callback) {
        target = target.parentNode;
      }
    }
    if (callback) {
      callback(event);
    }
  }
  var DelegateHandlerEntry = (function() {
    function DelegateHandlerEntry(eventName) {
      _classCallCheck(this, DelegateHandlerEntry);
      this.eventName = eventName;
      this.count = 0;
    }
    DelegateHandlerEntry.prototype.increment = function increment() {
      this.count++;
      if (this.count === 1) {
        document.addEventListener(this.eventName, handleDelegatedEvent, false);
      }
    };
    DelegateHandlerEntry.prototype.decrement = function decrement() {
      this.count--;
      if (this.count === 0) {
        document.removeEventListener(this.eventName, handleDelegatedEvent);
      }
    };
    return DelegateHandlerEntry;
  })();
  var DefaultEventStrategy = (function() {
    function DefaultEventStrategy() {
      _classCallCheck(this, DefaultEventStrategy);
    }
    DefaultEventStrategy.prototype.subscribe = function subscribe(target, targetEvent, callback, delegate) {
      if (delegate) {
        var _ret = (function() {
          var delegatedHandlers = document.delegatedHandlers || (document.delegatedHandlers = {}),
              handlerEntry = delegatedHandlers[targetEvent] || (delegatedHandlers[targetEvent] = new DelegateHandlerEntry(targetEvent)),
              delegatedCallbacks = target.delegatedCallbacks || (target.delegatedCallbacks = {});
          handlerEntry.increment();
          delegatedCallbacks[targetEvent] = callback;
          return {v: function() {
              handlerEntry.decrement();
              delegatedCallbacks[targetEvent] = null;
            }};
        })();
        if (typeof _ret === 'object')
          return _ret.v;
      } else {
        target.addEventListener(targetEvent, callback, false);
        return function() {
          target.removeEventListener(targetEvent, callback);
        };
      }
    };
    return DefaultEventStrategy;
  })();
  var EventManager = (function() {
    function EventManager() {
      _classCallCheck(this, EventManager);
      this.elementHandlerLookup = {};
      this.eventStrategyLookup = {};
      this.registerElementConfig({
        tagName: 'input',
        properties: {
          value: ['change', 'input'],
          checked: ['change', 'input'],
          files: ['change', 'input']
        }
      });
      this.registerElementConfig({
        tagName: 'textarea',
        properties: {value: ['change', 'input']}
      });
      this.registerElementConfig({
        tagName: 'select',
        properties: {value: ['change']}
      });
      this.registerElementConfig({
        tagName: 'content editable',
        properties: {value: ['change', 'input', 'blur', 'keyup', 'paste']}
      });
      this.registerElementConfig({
        tagName: 'scrollable element',
        properties: {
          scrollTop: ['scroll'],
          scrollLeft: ['scroll']
        }
      });
      this.defaultEventStrategy = new DefaultEventStrategy();
    }
    EventManager.prototype.registerElementConfig = function registerElementConfig(config) {
      var tagName = config.tagName.toLowerCase(),
          properties = config.properties,
          propertyName;
      this.elementHandlerLookup[tagName] = {};
      for (propertyName in properties) {
        if (properties.hasOwnProperty(propertyName)) {
          this.registerElementPropertyConfig(tagName, propertyName, properties[propertyName]);
        }
      }
    };
    EventManager.prototype.registerElementPropertyConfig = function registerElementPropertyConfig(tagName, propertyName, events) {
      this.elementHandlerLookup[tagName][propertyName] = {subscribe: function subscribe(target, callback) {
          events.forEach(function(changeEvent) {
            target.addEventListener(changeEvent, callback, false);
          });
          return function() {
            events.forEach(function(changeEvent) {
              target.removeEventListener(changeEvent, callback);
            });
          };
        }};
    };
    EventManager.prototype.registerElementHandler = function registerElementHandler(tagName, handler) {
      this.elementHandlerLookup[tagName.toLowerCase()] = handler;
    };
    EventManager.prototype.registerEventStrategy = function registerEventStrategy(eventName, strategy) {
      this.eventStrategyLookup[eventName] = strategy;
    };
    EventManager.prototype.getElementHandler = function getElementHandler(target, propertyName) {
      var tagName,
          lookup = this.elementHandlerLookup;
      if (target.tagName) {
        tagName = target.tagName.toLowerCase();
        if (lookup[tagName] && lookup[tagName][propertyName]) {
          return lookup[tagName][propertyName];
        }
        if (propertyName === 'textContent' || propertyName === 'innerHTML') {
          return lookup['content editable']['value'];
        }
        if (propertyName === 'scrollTop' || propertyName === 'scrollLeft') {
          return lookup['scrollable element'][propertyName];
        }
      }
      return null;
    };
    EventManager.prototype.addEventListener = function addEventListener(target, targetEvent, callback, delegate) {
      return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callback, delegate);
    };
    return EventManager;
  })();
  exports.EventManager = EventManager;
  var DirtyChecker = (function() {
    function DirtyChecker() {
      _classCallCheck(this, DirtyChecker);
      this.tracked = [];
      this.checkDelay = 120;
    }
    DirtyChecker.prototype.addProperty = function addProperty(property) {
      var tracked = this.tracked;
      tracked.push(property);
      if (tracked.length === 1) {
        this.scheduleDirtyCheck();
      }
    };
    DirtyChecker.prototype.removeProperty = function removeProperty(property) {
      var tracked = this.tracked;
      tracked.splice(tracked.indexOf(property), 1);
    };
    DirtyChecker.prototype.scheduleDirtyCheck = function scheduleDirtyCheck() {
      var _this18 = this;
      setTimeout(function() {
        return _this18.check();
      }, this.checkDelay);
    };
    DirtyChecker.prototype.check = function check() {
      var tracked = this.tracked,
          i = tracked.length;
      while (i--) {
        var current = tracked[i];
        if (current.isDirty()) {
          current.call();
        }
      }
      if (tracked.length) {
        this.scheduleDirtyCheck();
      }
    };
    return DirtyChecker;
  })();
  exports.DirtyChecker = DirtyChecker;
  var DirtyCheckProperty = (function() {
    function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
      _classCallCheck(this, DirtyCheckProperty);
      this.dirtyChecker = dirtyChecker;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.isSVG = obj instanceof SVGElement;
    }
    DirtyCheckProperty.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };
    DirtyCheckProperty.prototype.setValue = function setValue(newValue) {
      if (this.isSVG) {
        this.obj.setAttributeNS(null, this.propertyName, newValue);
      } else {
        this.obj[this.propertyName] = newValue;
      }
    };
    DirtyCheckProperty.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.getValue();
      while (i--) {
        callbacks[i](newValue, oldValue);
      }
      this.oldValue = newValue;
    };
    DirtyCheckProperty.prototype.isDirty = function isDirty() {
      return this.oldValue !== this.getValue();
    };
    DirtyCheckProperty.prototype.beginTracking = function beginTracking() {
      this.tracking = true;
      this.oldValue = this.newValue = this.getValue();
      this.dirtyChecker.addProperty(this);
    };
    DirtyCheckProperty.prototype.endTracking = function endTracking() {
      this.tracking = false;
      this.dirtyChecker.removeProperty(this);
    };
    DirtyCheckProperty.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks,
          that = this;
      callbacks.push(callback);
      if (!this.tracking) {
        this.beginTracking();
      }
      return function() {
        callbacks.splice(callbacks.indexOf(callback), 1);
        if (callbacks.length === 0) {
          that.endTracking();
        }
      };
    };
    return DirtyCheckProperty;
  })();
  exports.DirtyCheckProperty = DirtyCheckProperty;
  var SetterObserver = (function() {
    function SetterObserver(taskQueue, obj, propertyName) {
      _classCallCheck(this, SetterObserver);
      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.queued = false;
      this.observing = false;
    }
    SetterObserver.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };
    SetterObserver.prototype.setValue = function setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    };
    SetterObserver.prototype.getterValue = function getterValue() {
      return this.currentValue;
    };
    SetterObserver.prototype.setterValue = function setterValue(newValue) {
      var oldValue = this.currentValue;
      if (oldValue !== newValue) {
        if (!this.queued) {
          this.oldValue = oldValue;
          this.queued = true;
          this.taskQueue.queueMicroTask(this);
        }
        this.currentValue = newValue;
      }
    };
    SetterObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.currentValue;
      this.queued = false;
      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };
    SetterObserver.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.push(callback);
      if (!this.observing) {
        this.convertProperty();
      }
      return function() {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };
    SetterObserver.prototype.convertProperty = function convertProperty() {
      this.observing = true;
      this.currentValue = this.obj[this.propertyName];
      this.setValue = this.setterValue;
      this.getValue = this.getterValue;
      try {
        Object.defineProperty(this.obj, this.propertyName, {
          configurable: true,
          enumerable: true,
          get: this.getValue.bind(this),
          set: this.setValue.bind(this)
        });
      } catch (_) {}
    };
    return SetterObserver;
  })();
  exports.SetterObserver = SetterObserver;
  var OoPropertyObserver = (function() {
    function OoPropertyObserver(obj, propertyName, subscribe) {
      _classCallCheck(this, OoPropertyObserver);
      this.obj = obj;
      this.propertyName = propertyName;
      this.subscribe = subscribe;
    }
    OoPropertyObserver.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };
    OoPropertyObserver.prototype.setValue = function setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    };
    return OoPropertyObserver;
  })();
  exports.OoPropertyObserver = OoPropertyObserver;
  var OoObjectObserver = (function() {
    function OoObjectObserver(obj, observerLocator) {
      _classCallCheck(this, OoObjectObserver);
      this.obj = obj;
      this.observerLocator = observerLocator;
      this.observers = {};
      this.callbacks = {};
      this.callbackCount = 0;
    }
    OoObjectObserver.prototype.subscribe = function subscribe(propertyName, callback) {
      if (this.callbacks[propertyName]) {
        this.callbacks[propertyName].push(callback);
      } else {
        this.callbacks[propertyName] = [callback];
        this.callbacks[propertyName].oldValue = this.obj[propertyName];
      }
      if (this.callbackCount === 0) {
        this.handler = this.handleChanges.bind(this);
        try {
          Object.observe(this.obj, this.handler, ['update', 'add']);
        } catch (_) {}
      }
      this.callbackCount++;
      return this.unsubscribe.bind(this, propertyName, callback);
    };
    OoObjectObserver.prototype.unsubscribe = function unsubscribe(propertyName, callback) {
      var callbacks = this.callbacks[propertyName],
          index = callbacks.indexOf(callback);
      if (index === -1) {
        return;
      }
      callbacks.splice(index, 1);
      if (callbacks.length === 0) {
        callbacks.oldValue = null;
        this.callbacks[propertyName] = null;
      }
      this.callbackCount--;
      if (this.callbackCount === 0) {
        try {
          Object.unobserve(this.obj, this.handler);
        } catch (_) {}
      }
    };
    OoObjectObserver.prototype.getObserver = function getObserver(propertyName, descriptor) {
      var propertyObserver = this.observers[propertyName];
      if (!propertyObserver) {
        if (descriptor) {
          propertyObserver = this.observers[propertyName] = new OoPropertyObserver(this.obj, propertyName, this.subscribe.bind(this, propertyName));
        } else {
          propertyObserver = this.observers[propertyName] = new UndefinedPropertyObserver(this, this.obj, propertyName);
        }
      }
      return propertyObserver;
    };
    OoObjectObserver.prototype.handleChanges = function handleChanges(changes) {
      var properties = {},
          i,
          ii,
          change,
          propertyName,
          oldValue,
          newValue,
          callbacks;
      for (i = 0, ii = changes.length; i < ii; i++) {
        change = changes[i];
        properties[change.name] = change;
      }
      for (name in properties) {
        callbacks = this.callbacks[name];
        if (!callbacks) {
          continue;
        }
        change = properties[name];
        newValue = change.object[name];
        oldValue = change.oldValue;
        for (i = 0, ii = callbacks.length; i < ii; i++) {
          callbacks[i](newValue, oldValue);
        }
      }
    };
    return OoObjectObserver;
  })();
  exports.OoObjectObserver = OoObjectObserver;
  var UndefinedPropertyObserver = (function() {
    function UndefinedPropertyObserver(owner, obj, propertyName) {
      _classCallCheck(this, UndefinedPropertyObserver);
      this.owner = owner;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbackMap = new Map();
    }
    UndefinedPropertyObserver.prototype.getValue = function getValue() {
      if (this.actual) {
        return this.actual.getValue();
      }
      return this.obj[this.propertyName];
    };
    UndefinedPropertyObserver.prototype.setValue = function setValue(newValue) {
      if (this.actual) {
        this.actual.setValue(newValue);
        return;
      }
      this.obj[this.propertyName] = newValue;
      this.trigger(newValue, undefined);
    };
    UndefinedPropertyObserver.prototype.trigger = function trigger(newValue, oldValue) {
      var callback;
      if (this.subscription) {
        this.subscription();
      }
      this.getObserver();
      for (var _iterator2 = this.callbackMap.keys(),
          _isArray2 = Array.isArray(_iterator2),
          _i2 = 0,
          _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ; ) {
        if (_isArray2) {
          if (_i2 >= _iterator2.length)
            break;
          callback = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done)
            break;
          callback = _i2.value;
        }
        callback(newValue, oldValue);
      }
    };
    UndefinedPropertyObserver.prototype.getObserver = function getObserver() {
      var callback,
          observerLocator;
      if (!Object.getOwnPropertyDescriptor(this.obj, this.propertyName)) {
        return;
      }
      observerLocator = this.owner.observerLocator;
      delete this.owner.observers[this.propertyName];
      delete observerLocator.getOrCreateObserversLookup(this.obj, observerLocator)[this.propertyName];
      this.actual = observerLocator.getObserver(this.obj, this.propertyName);
      for (var _iterator3 = this.callbackMap.keys(),
          _isArray3 = Array.isArray(_iterator3),
          _i3 = 0,
          _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator](); ; ) {
        if (_isArray3) {
          if (_i3 >= _iterator3.length)
            break;
          callback = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done)
            break;
          callback = _i3.value;
        }
        this.callbackMap.set(callback, this.actual.subscribe(callback));
      }
    };
    UndefinedPropertyObserver.prototype.subscribe = function subscribe(callback) {
      var _this19 = this;
      if (!this.actual) {
        this.getObserver();
      }
      if (this.actual) {
        return this.actual.subscribe(callback);
      }
      if (!this.subscription) {
        this.subscription = this.owner.subscribe(this.propertyName, this.trigger.bind(this));
      }
      this.callbackMap.set(callback, null);
      return function() {
        var actualDispose = _this19.callbackMap.get(callback);
        if (actualDispose)
          actualDispose();
        _this19.callbackMap['delete'](callback);
      };
    };
    return UndefinedPropertyObserver;
  })();
  exports.UndefinedPropertyObserver = UndefinedPropertyObserver;
  var XLinkAttributeObserver = (function() {
    function XLinkAttributeObserver(element, propertyName, attributeName) {
      _classCallCheck(this, XLinkAttributeObserver);
      this.element = element;
      this.propertyName = propertyName;
      this.attributeName = attributeName;
    }
    XLinkAttributeObserver.prototype.getValue = function getValue() {
      return this.element.getAttributeNS('http://www.w3.org/1999/xlink', this.attributeName);
    };
    XLinkAttributeObserver.prototype.setValue = function setValue(newValue) {
      return this.element.setAttributeNS('http://www.w3.org/1999/xlink', this.attributeName, newValue);
    };
    XLinkAttributeObserver.prototype.subscribe = function subscribe(callback) {
      throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
    };
    return XLinkAttributeObserver;
  })();
  exports.XLinkAttributeObserver = XLinkAttributeObserver;
  var DataAttributeObserver = (function() {
    function DataAttributeObserver(element, propertyName) {
      _classCallCheck(this, DataAttributeObserver);
      this.element = element;
      this.propertyName = propertyName;
    }
    DataAttributeObserver.prototype.getValue = function getValue() {
      return this.element.getAttribute(this.propertyName);
    };
    DataAttributeObserver.prototype.setValue = function setValue(newValue) {
      return this.element.setAttribute(this.propertyName, newValue);
    };
    DataAttributeObserver.prototype.subscribe = function subscribe(callback) {
      throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
    };
    return DataAttributeObserver;
  })();
  exports.DataAttributeObserver = DataAttributeObserver;
  var StyleObserver = (function() {
    function StyleObserver(element, propertyName) {
      _classCallCheck(this, StyleObserver);
      this.element = element;
      this.propertyName = propertyName;
    }
    StyleObserver.prototype.getValue = function getValue() {
      return this.element.style.cssText;
    };
    StyleObserver.prototype.setValue = function setValue(newValue) {
      if (newValue instanceof Object) {
        newValue = this.flattenCss(newValue);
      }
      this.element.style.cssText = newValue;
    };
    StyleObserver.prototype.subscribe = function subscribe(callback) {
      throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "' + this.propertyName + '" property is not supported.');
    };
    StyleObserver.prototype.flattenCss = function flattenCss(object) {
      var s = '';
      for (var propertyName in object) {
        if (object.hasOwnProperty(propertyName)) {
          s += propertyName + ': ' + object[propertyName] + '; ';
        }
      }
      return s;
    };
    return StyleObserver;
  })();
  exports.StyleObserver = StyleObserver;
  var ValueAttributeObserver = (function() {
    function ValueAttributeObserver(element, propertyName, handler) {
      _classCallCheck(this, ValueAttributeObserver);
      this.element = element;
      this.propertyName = propertyName;
      this.handler = handler;
      this.callbacks = [];
    }
    ValueAttributeObserver.prototype.getValue = function getValue() {
      return this.element[this.propertyName];
    };
    ValueAttributeObserver.prototype.setValue = function setValue(newValue) {
      this.element[this.propertyName] = newValue === undefined || newValue === null ? '' : newValue;
      this.call();
    };
    ValueAttributeObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.getValue();
      while (i--) {
        callbacks[i](newValue, oldValue);
      }
      this.oldValue = newValue;
    };
    ValueAttributeObserver.prototype.subscribe = function subscribe(callback) {
      var that = this;
      if (!this.disposeHandler) {
        this.oldValue = this.getValue();
        this.disposeHandler = this.handler.subscribe(this.element, this.call.bind(this));
      }
      this.callbacks.push(callback);
      return this.unsubscribe.bind(this, callback);
    };
    ValueAttributeObserver.prototype.unsubscribe = function unsubscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.splice(callbacks.indexOf(callback), 1);
      if (callbacks.length === 0) {
        this.disposeHandler();
        this.disposeHandler = null;
      }
    };
    return ValueAttributeObserver;
  })();
  exports.ValueAttributeObserver = ValueAttributeObserver;
  var SelectValueObserver = (function() {
    function SelectValueObserver(element, handler, observerLocator) {
      _classCallCheck(this, SelectValueObserver);
      this.element = element;
      this.handler = handler;
      this.observerLocator = observerLocator;
    }
    SelectValueObserver.prototype.getValue = function getValue() {
      return this.value;
    };
    SelectValueObserver.prototype.setValue = function setValue(newValue) {
      var _this20 = this;
      if (newValue !== null && newValue !== undefined && this.element.multiple && !Array.isArray(newValue)) {
        throw new Error('Only null or Array instances can be bound to a multi-select.');
      }
      if (this.value === newValue) {
        return;
      }
      if (this.arraySubscription) {
        this.arraySubscription();
        this.arraySubscription = null;
      }
      if (Array.isArray(newValue)) {
        this.arraySubscription = this.observerLocator.getArrayObserver(newValue).subscribe(this.synchronizeOptions.bind(this));
      }
      this.value = newValue;
      this.synchronizeOptions();
      if (this.element.options.length > 0 && !this.initialSync) {
        this.initialSync = true;
        this.observerLocator.taskQueue.queueMicroTask({call: function call() {
            return _this20.synchronizeOptions();
          }});
      }
    };
    SelectValueObserver.prototype.synchronizeOptions = function synchronizeOptions() {
      var value = this.value,
          i,
          options,
          option,
          optionValue,
          clear,
          isArray;
      if (value === null || value === undefined) {
        clear = true;
      } else if (Array.isArray(value)) {
        isArray = true;
      }
      options = this.element.options;
      i = options.length;
      while (i--) {
        option = options.item(i);
        if (clear) {
          option.selected = false;
          continue;
        }
        optionValue = option.hasOwnProperty('model') ? option.model : option.value;
        if (isArray) {
          option.selected = value.indexOf(optionValue) !== -1;
          continue;
        }
        option.selected = value === optionValue;
      }
    };
    SelectValueObserver.prototype.synchronizeValue = function synchronizeValue() {
      var options = this.element.options,
          option,
          i,
          ii,
          count = 0,
          value = [];
      for (i = 0, ii = options.length; i < ii; i++) {
        option = options.item(i);
        if (!option.selected) {
          continue;
        }
        value[count] = option.hasOwnProperty('model') ? option.model : option.value;
        count++;
      }
      if (!this.element.multiple) {
        if (count === 0) {
          value = null;
        } else {
          value = value[0];
        }
      }
      this.oldValue = this.value;
      this.value = value;
      this.call();
    };
    SelectValueObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.value;
      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };
    SelectValueObserver.prototype.subscribe = function subscribe(callback) {
      if (!this.callbacks) {
        this.callbacks = [];
        this.disposeHandler = this.handler.subscribe(this.element, this.synchronizeValue.bind(this, false));
      }
      this.callbacks.push(callback);
      return this.unsubscribe.bind(this, callback);
    };
    SelectValueObserver.prototype.unsubscribe = function unsubscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.splice(callbacks.indexOf(callback), 1);
      if (callbacks.length === 0) {
        this.disposeHandler();
        this.disposeHandler = null;
        this.callbacks = null;
      }
    };
    SelectValueObserver.prototype.bind = function bind() {
      var _this21 = this;
      this.domObserver = new MutationObserver(function() {
        _this21.synchronizeOptions();
        _this21.synchronizeValue();
      });
      this.domObserver.observe(this.element, {
        childList: true,
        subtree: true
      });
    };
    SelectValueObserver.prototype.unbind = function unbind() {
      this.domObserver.disconnect();
      this.domObserver = null;
      if (this.arraySubscription) {
        this.arraySubscription();
        this.arraySubscription = null;
      }
    };
    return SelectValueObserver;
  })();
  exports.SelectValueObserver = SelectValueObserver;
  var CheckedObserver = (function() {
    function CheckedObserver(element, handler, observerLocator) {
      _classCallCheck(this, CheckedObserver);
      this.element = element;
      this.handler = handler;
      this.observerLocator = observerLocator;
    }
    CheckedObserver.prototype.getValue = function getValue() {
      return this.value;
    };
    CheckedObserver.prototype.setValue = function setValue(newValue) {
      var _this22 = this;
      if (this.value === newValue) {
        return;
      }
      if (this.arraySubscription) {
        this.arraySubscription();
        this.arraySubscription = null;
      }
      if (this.element.type === 'checkbox' && Array.isArray(newValue)) {
        this.arraySubscription = this.observerLocator.getArrayObserver(newValue).subscribe(this.synchronizeElement.bind(this));
      }
      this.value = newValue;
      this.synchronizeElement();
      if (!this.element.hasOwnProperty('model') && !this.initialSync) {
        this.initialSync = true;
        this.observerLocator.taskQueue.queueMicroTask({call: function call() {
            return _this22.synchronizeElement();
          }});
      }
    };
    CheckedObserver.prototype.synchronizeElement = function synchronizeElement() {
      var value = this.value,
          element = this.element,
          elementValue = element.hasOwnProperty('model') ? element.model : element.value,
          isRadio = element.type === 'radio';
      element.checked = isRadio && value === elementValue || !isRadio && value === true || !isRadio && Array.isArray(value) && value.indexOf(elementValue) !== -1;
    };
    CheckedObserver.prototype.synchronizeValue = function synchronizeValue() {
      var value = this.value,
          element = this.element,
          elementValue = element.hasOwnProperty('model') ? element.model : element.value,
          index;
      if (element.type === 'checkbox') {
        if (Array.isArray(value)) {
          index = value.indexOf(elementValue);
          if (element.checked && index === -1) {
            value.push(elementValue);
          } else if (!element.checked && index !== -1) {
            value.splice(index, 1);
          }
          return;
        } else {
          value = element.checked;
        }
      } else if (element.checked) {
        value = elementValue;
      } else {
        return;
      }
      this.oldValue = this.value;
      this.value = value;
      this.call();
    };
    CheckedObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.value;
      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };
    CheckedObserver.prototype.subscribe = function subscribe(callback) {
      if (!this.callbacks) {
        this.callbacks = [];
        this.disposeHandler = this.handler.subscribe(this.element, this.synchronizeValue.bind(this, false));
      }
      this.callbacks.push(callback);
      return this.unsubscribe.bind(this, callback);
    };
    CheckedObserver.prototype.unsubscribe = function unsubscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.splice(callbacks.indexOf(callback), 1);
      if (callbacks.length === 0) {
        this.disposeHandler();
        this.disposeHandler = null;
        this.callbacks = null;
      }
    };
    CheckedObserver.prototype.unbind = function unbind() {
      if (this.arraySubscription) {
        this.arraySubscription();
        this.arraySubscription = null;
      }
    };
    return CheckedObserver;
  })();
  exports.CheckedObserver = CheckedObserver;
  var ClassObserver = (function() {
    function ClassObserver(element) {
      _classCallCheck(this, ClassObserver);
      this.element = element;
      this.doNotCache = true;
      this.value = '';
      this.version = 0;
    }
    ClassObserver.prototype.getValue = function getValue() {
      return this.value;
    };
    ClassObserver.prototype.setValue = function setValue(newValue) {
      var nameIndex = this.nameIndex || {},
          version = this.version,
          names,
          name,
          i;
      if (newValue !== null && newValue !== undefined && newValue.length) {
        names = newValue.split(' ');
        i = names.length;
        while (i--) {
          name = names[i];
          if (name === '') {
            continue;
          }
          nameIndex[name] = version;
          this.element.classList.add(name);
        }
      }
      this.value = newValue;
      this.nameIndex = nameIndex;
      this.version += 1;
      if (version === 0) {
        return;
      }
      version -= 1;
      for (name in nameIndex) {
        if (!nameIndex.hasOwnProperty(name) || nameIndex[name] !== version) {
          continue;
        }
        this.element.classList.remove(name);
      }
    };
    ClassObserver.prototype.subscribe = function subscribe(callback) {
      throw new Error('Observation of a "' + this.element.nodeName + '" element\'s "class" property is not supported.');
    };
    return ClassObserver;
  })();
  exports.ClassObserver = ClassObserver;
  var ComputedPropertyObserver = (function() {
    function ComputedPropertyObserver(obj, propertyName, descriptor, observerLocator) {
      _classCallCheck(this, ComputedPropertyObserver);
      this.obj = obj;
      this.propertyName = propertyName;
      this.descriptor = descriptor;
      this.observerLocator = observerLocator;
      this.callbacks = [];
    }
    ComputedPropertyObserver.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };
    ComputedPropertyObserver.prototype.setValue = function setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    };
    ComputedPropertyObserver.prototype.trigger = function trigger(newValue, oldValue) {
      var callbacks = this.callbacks,
          i = callbacks.length;
      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };
    ComputedPropertyObserver.prototype.evaluate = function evaluate() {
      var newValue = this.getValue();
      if (this.oldValue === newValue)
        return;
      this.trigger(newValue, this.oldValue);
      this.oldValue = newValue;
    };
    ComputedPropertyObserver.prototype.subscribe = function subscribe(callback) {
      var _this23 = this;
      var dependencies,
          i,
          ii;
      this.callbacks.push(callback);
      if (this.oldValue === undefined) {
        this.oldValue = this.getValue();
        this.subscriptions = [];
        dependencies = this.descriptor.get.dependencies;
        for (i = 0, ii = dependencies.length; i < ii; i++) {
          this.subscriptions.push(this.observerLocator.getObserver(this.obj, dependencies[i]).subscribe(function() {
            return _this23.evaluate();
          }));
        }
      }
      return function() {
        _this23.callbacks.splice(_this23.callbacks.indexOf(callback), 1);
        if (_this23.callbacks.length > 0)
          return;
        while (_this23.subscriptions.length) {
          _this23.subscriptions.pop()();
        }
        _this23.oldValue = undefined;
      };
    };
    return ComputedPropertyObserver;
  })();
  exports.ComputedPropertyObserver = ComputedPropertyObserver;
  function hasDeclaredDependencies(descriptor) {
    return descriptor && descriptor.get && descriptor.get.dependencies && descriptor.get.dependencies.length > 0;
  }
  function declarePropertyDependencies(ctor, propertyName, dependencies) {
    var descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, propertyName);
    descriptor.get.dependencies = dependencies;
  }
  var elements = {
    a: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'target', 'transform', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    altGlyph: ['class', 'dx', 'dy', 'externalResourcesRequired', 'format', 'glyphRef', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    altGlyphDef: ['id', 'xml:base', 'xml:lang', 'xml:space'],
    altGlyphItem: ['id', 'xml:base', 'xml:lang', 'xml:space'],
    animate: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    animateColor: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    animateMotion: ['accumulate', 'additive', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keyPoints', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'origin', 'path', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'rotate', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    animateTransform: ['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'type', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    circle: ['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'r', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    clipPath: ['class', 'clipPathUnits', 'externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    'color-profile': ['id', 'local', 'name', 'rendering-intent', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    cursor: ['externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    defs: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    desc: ['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space'],
    ellipse: ['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    feBlend: ['class', 'height', 'id', 'in', 'in2', 'mode', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feColorMatrix: ['class', 'height', 'id', 'in', 'result', 'style', 'type', 'values', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feComponentTransfer: ['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feComposite: ['class', 'height', 'id', 'in', 'in2', 'k1', 'k2', 'k3', 'k4', 'operator', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feConvolveMatrix: ['bias', 'class', 'divisor', 'edgeMode', 'height', 'id', 'in', 'kernelMatrix', 'kernelUnitLength', 'order', 'preserveAlpha', 'result', 'style', 'targetX', 'targetY', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feDiffuseLighting: ['class', 'diffuseConstant', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feDisplacementMap: ['class', 'height', 'id', 'in', 'in2', 'result', 'scale', 'style', 'width', 'x', 'xChannelSelector', 'xml:base', 'xml:lang', 'xml:space', 'y', 'yChannelSelector'],
    feDistantLight: ['azimuth', 'elevation', 'id', 'xml:base', 'xml:lang', 'xml:space'],
    feFlood: ['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feFuncA: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    feFuncB: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    feFuncG: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    feFuncR: ['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    feGaussianBlur: ['class', 'height', 'id', 'in', 'result', 'stdDeviation', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feImage: ['class', 'externalResourcesRequired', 'height', 'id', 'preserveAspectRatio', 'result', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feMerge: ['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feMergeNode: ['id', 'xml:base', 'xml:lang', 'xml:space'],
    feMorphology: ['class', 'height', 'id', 'in', 'operator', 'radius', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feOffset: ['class', 'dx', 'dy', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    fePointLight: ['id', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z'],
    feSpecularLighting: ['class', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'specularConstant', 'specularExponent', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feSpotLight: ['id', 'limitingConeAngle', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'specularExponent', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z'],
    feTile: ['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    feTurbulence: ['baseFrequency', 'class', 'height', 'id', 'numOctaves', 'result', 'seed', 'stitchTiles', 'style', 'type', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    filter: ['class', 'externalResourcesRequired', 'filterRes', 'filterUnits', 'height', 'id', 'primitiveUnits', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    font: ['class', 'externalResourcesRequired', 'horiz-adv-x', 'horiz-origin-x', 'horiz-origin-y', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face': ['accent-height', 'alphabetic', 'ascent', 'bbox', 'cap-height', 'descent', 'font-family', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'hanging', 'id', 'ideographic', 'mathematical', 'overline-position', 'overline-thickness', 'panose-1', 'slope', 'stemh', 'stemv', 'strikethrough-position', 'strikethrough-thickness', 'underline-position', 'underline-thickness', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'widths', 'x-height', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face-format': ['id', 'string', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face-name': ['id', 'name', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face-src': ['id', 'xml:base', 'xml:lang', 'xml:space'],
    'font-face-uri': ['id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    foreignObject: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    g: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    glyph: ['arabic-form', 'class', 'd', 'glyph-name', 'horiz-adv-x', 'id', 'lang', 'orientation', 'style', 'unicode', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
    glyphRef: ['class', 'dx', 'dy', 'format', 'glyphRef', 'id', 'style', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    hkern: ['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space'],
    image: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    line: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'x1', 'x2', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2'],
    linearGradient: ['class', 'externalResourcesRequired', 'gradientTransform', 'gradientUnits', 'id', 'spreadMethod', 'style', 'x1', 'x2', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2'],
    marker: ['class', 'externalResourcesRequired', 'id', 'markerHeight', 'markerUnits', 'markerWidth', 'orient', 'preserveAspectRatio', 'refX', 'refY', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space'],
    mask: ['class', 'externalResourcesRequired', 'height', 'id', 'maskContentUnits', 'maskUnits', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    metadata: ['id', 'xml:base', 'xml:lang', 'xml:space'],
    'missing-glyph': ['class', 'd', 'horiz-adv-x', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space'],
    mpath: ['externalResourcesRequired', 'id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    path: ['class', 'd', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'pathLength', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    pattern: ['class', 'externalResourcesRequired', 'height', 'id', 'patternContentUnits', 'patternTransform', 'patternUnits', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    polygon: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    polyline: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    radialGradient: ['class', 'cx', 'cy', 'externalResourcesRequired', 'fx', 'fy', 'gradientTransform', 'gradientUnits', 'id', 'r', 'spreadMethod', 'style', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    rect: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    script: ['externalResourcesRequired', 'id', 'type', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    set: ['attributeName', 'attributeType', 'begin', 'dur', 'end', 'externalResourcesRequired', 'fill', 'id', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    stop: ['class', 'id', 'offset', 'style', 'xml:base', 'xml:lang', 'xml:space'],
    style: ['id', 'media', 'title', 'type', 'xml:base', 'xml:lang', 'xml:space'],
    svg: ['baseProfile', 'class', 'contentScriptType', 'contentStyleType', 'externalResourcesRequired', 'height', 'id', 'onabort', 'onactivate', 'onclick', 'onerror', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onresize', 'onscroll', 'onunload', 'onzoom', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'version', 'viewBox', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'zoomAndPan'],
    'switch': ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space'],
    symbol: ['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space'],
    text: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'transform', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    textPath: ['class', 'externalResourcesRequired', 'id', 'lengthAdjust', 'method', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'spacing', 'startOffset', 'style', 'systemLanguage', 'textLength', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space'],
    title: ['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space'],
    tref: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    tspan: ['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    use: ['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y'],
    view: ['externalResourcesRequired', 'id', 'preserveAspectRatio', 'viewBox', 'viewTarget', 'xml:base', 'xml:lang', 'xml:space', 'zoomAndPan'],
    vkern: ['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space']
  };
  exports.elements = elements;
  var presentationElements = {
    'a': true,
    'altGlyph': true,
    'animate': true,
    'animateColor': true,
    'circle': true,
    'clipPath': true,
    'defs': true,
    'ellipse': true,
    'feBlend': true,
    'feColorMatrix': true,
    'feComponentTransfer': true,
    'feComposite': true,
    'feConvolveMatrix': true,
    'feDiffuseLighting': true,
    'feDisplacementMap': true,
    'feFlood': true,
    'feGaussianBlur': true,
    'feImage': true,
    'feMerge': true,
    'feMorphology': true,
    'feOffset': true,
    'feSpecularLighting': true,
    'feTile': true,
    'feTurbulence': true,
    'filter': true,
    'font': true,
    'foreignObject': true,
    'g': true,
    'glyph': true,
    'glyphRef': true,
    'image': true,
    'line': true,
    'linearGradient': true,
    'marker': true,
    'mask': true,
    'missing-glyph': true,
    'path': true,
    'pattern': true,
    'polygon': true,
    'polyline': true,
    'radialGradient': true,
    'rect': true,
    'stop': true,
    'svg': true,
    'switch': true,
    'symbol': true,
    'text': true,
    'textPath': true,
    'tref': true,
    'tspan': true,
    'use': true
  };
  exports.presentationElements = presentationElements;
  var presentationAttributes = {
    'alignment-baseline': true,
    'baseline-shift': true,
    'clip-path': true,
    'clip-rule': true,
    'clip': true,
    'color-interpolation-filters': true,
    'color-interpolation': true,
    'color-profile': true,
    'color-rendering': true,
    'color': true,
    'cursor': true,
    'direction': true,
    'display': true,
    'dominant-baseline': true,
    'enable-background': true,
    'fill-opacity': true,
    'fill-rule': true,
    'fill': true,
    'filter': true,
    'flood-color': true,
    'flood-opacity': true,
    'font-family': true,
    'font-size-adjust': true,
    'font-size': true,
    'font-stretch': true,
    'font-style': true,
    'font-variant': true,
    'font-weight': true,
    'glyph-orientation-horizontal': true,
    'glyph-orientation-vertical': true,
    'image-rendering': true,
    'kerning': true,
    'letter-spacing': true,
    'lighting-color': true,
    'marker-end': true,
    'marker-mid': true,
    'marker-start': true,
    'mask': true,
    'opacity': true,
    'overflow': true,
    'pointer-events': true,
    'shape-rendering': true,
    'stop-color': true,
    'stop-opacity': true,
    'stroke-dasharray': true,
    'stroke-dashoffset': true,
    'stroke-linecap': true,
    'stroke-linejoin': true,
    'stroke-miterlimit': true,
    'stroke-opacity': true,
    'stroke-width': true,
    'stroke': true,
    'text-anchor': true,
    'text-decoration': true,
    'text-rendering': true,
    'unicode-bidi': true,
    'visibility': true,
    'word-spacing': true,
    'writing-mode': true
  };
  exports.presentationAttributes = presentationAttributes;
  function isStandardSvgAttribute(nodeName, attributeName) {
    return presentationElements[nodeName] && presentationAttributes[attributeName] || elements[nodeName] && elements[nodeName].indexOf(attributeName) !== -1;
  }
  function createElement(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
  }
  if (createElement('<svg><altGlyph /></svg>').firstElementChild.nodeName === 'altglyph') {
    elements.altglyph = elements.altGlyph;
    delete elements.altGlyph;
    elements.altglyphdef = elements.altGlyphDef;
    delete elements.altGlyphDef;
    elements.altglyphitem = elements.altGlyphItem;
    delete elements.altGlyphItem;
    elements.glyphref = elements.glyphRef;
    delete elements.glyphRef;
  }
  if (typeof Object.getPropertyDescriptor !== 'function') {
    Object.getPropertyDescriptor = function(subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (typeof pd === 'undefined' && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };
  }
  function createObserverLookup(obj, observerLocator) {
    var value = new OoObjectObserver(obj, observerLocator);
    try {
      Object.defineProperty(obj, "__observer__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}
    return value;
  }
  var ObserverLocator = (function() {
    ObserverLocator.inject = function inject() {
      return [_aureliaTaskQueue.TaskQueue, EventManager, DirtyChecker, _aureliaDependencyInjection.All.of(ObjectObservationAdapter)];
    };
    function ObserverLocator(taskQueue, eventManager, dirtyChecker, observationAdapters) {
      _classCallCheck(this, ObserverLocator);
      this.taskQueue = taskQueue;
      this.eventManager = eventManager;
      this.dirtyChecker = dirtyChecker;
      this.observationAdapters = observationAdapters;
    }
    ObserverLocator.prototype.getObserver = function getObserver(obj, propertyName) {
      var observersLookup = obj.__observers__,
          observer;
      if (observersLookup && propertyName in observersLookup) {
        return observersLookup[propertyName];
      }
      observer = this.createPropertyObserver(obj, propertyName);
      if (!observer.doNotCache) {
        if (observersLookup === undefined) {
          observersLookup = this.getOrCreateObserversLookup(obj);
        }
        observersLookup[propertyName] = observer;
      }
      return observer;
    };
    ObserverLocator.prototype.getOrCreateObserversLookup = function getOrCreateObserversLookup(obj) {
      return obj.__observers__ || this.createObserversLookup(obj);
    };
    ObserverLocator.prototype.createObserversLookup = function createObserversLookup(obj) {
      var value = {};
      try {
        Object.defineProperty(obj, "__observers__", {
          enumerable: false,
          configurable: false,
          writable: false,
          value: value
        });
      } catch (_) {}
      return value;
    };
    ObserverLocator.prototype.getObservationAdapter = function getObservationAdapter(obj, propertyName, descriptor) {
      var i,
          ii,
          observationAdapter;
      for (i = 0, ii = this.observationAdapters.length; i < ii; i++) {
        observationAdapter = this.observationAdapters[i];
        if (observationAdapter.handlesProperty(obj, propertyName, descriptor))
          return observationAdapter;
      }
      return null;
    };
    ObserverLocator.prototype.createPropertyObserver = function createPropertyObserver(obj, propertyName) {
      var observerLookup,
          descriptor,
          handler,
          observationAdapter,
          xlinkResult;
      if (obj instanceof Element) {
        if (propertyName === 'class') {
          return new ClassObserver(obj);
        }
        if (propertyName === 'style' || propertyName === 'css') {
          return new StyleObserver(obj, propertyName);
        }
        handler = this.eventManager.getElementHandler(obj, propertyName);
        if (propertyName === 'value' && obj.tagName.toLowerCase() === 'select') {
          return new SelectValueObserver(obj, handler, this);
        }
        if (propertyName === 'checked' && obj.tagName.toLowerCase() === 'input') {
          return new CheckedObserver(obj, handler, this);
        }
        if (handler) {
          return new ValueAttributeObserver(obj, propertyName, handler);
        }
        xlinkResult = /^xlink:(.+)$/.exec(propertyName);
        if (xlinkResult) {
          return new XLinkAttributeObserver(obj, propertyName, xlinkResult[1]);
        }
        if (/^\w+:|^data-|^aria-/.test(propertyName) || obj instanceof SVGElement && isStandardSvgAttribute(obj.nodeName, propertyName)) {
          return new DataAttributeObserver(obj, propertyName);
        }
      }
      descriptor = Object.getPropertyDescriptor(obj, propertyName);
      if (hasDeclaredDependencies(descriptor)) {
        return new ComputedPropertyObserver(obj, propertyName, descriptor, this);
      }
      var existingGetterOrSetter = undefined;
      if (descriptor && (existingGetterOrSetter = descriptor.get || descriptor.set)) {
        if (existingGetterOrSetter.getObserver) {
          return existingGetterOrSetter.getObserver(obj);
        }
        observationAdapter = this.getObservationAdapter(obj, propertyName, descriptor);
        if (observationAdapter)
          return observationAdapter.getObserver(obj, propertyName, descriptor);
        return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
      }
      if (hasObjectObserve) {
        observerLookup = obj.__observer__ || createObserverLookup(obj, this);
        return observerLookup.getObserver(propertyName, descriptor);
      }
      if (obj instanceof Array) {
        if (propertyName === 'length') {
          return this.getArrayObserver(obj).getLengthObserver();
        } else {
          return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
        }
      } else if (obj instanceof Map) {
        if (propertyName === 'size') {
          return this.getMapObserver(obj).getLengthObserver();
        } else {
          return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
        }
      }
      return new SetterObserver(this.taskQueue, obj, propertyName);
    };
    ObserverLocator.prototype.getArrayObserver = function getArrayObserver(array) {
      if ('__array_observer__' in array) {
        return array.__array_observer__;
      }
      return array.__array_observer__ = _getArrayObserver(this.taskQueue, array);
    };
    ObserverLocator.prototype.getMapObserver = function getMapObserver(map) {
      if ('__map_observer__' in map) {
        return map.__map_observer__;
      }
      return map.__map_observer__ = _getMapObserver(this.taskQueue, map);
    };
    return ObserverLocator;
  })();
  exports.ObserverLocator = ObserverLocator;
  var ObjectObservationAdapter = (function() {
    function ObjectObservationAdapter() {
      _classCallCheck(this, ObjectObservationAdapter);
    }
    ObjectObservationAdapter.prototype.handlesProperty = function handlesProperty(object, propertyName, descriptor) {
      throw new Error('BindingAdapters must implement handlesProperty(object, propertyName).');
    };
    ObjectObservationAdapter.prototype.getObserver = function getObserver(object, propertyName, descriptor) {
      throw new Error('BindingAdapters must implement createObserver(object, propertyName).');
    };
    return ObjectObservationAdapter;
  })();
  exports.ObjectObservationAdapter = ObjectObservationAdapter;
  var BindingExpression = (function() {
    function BindingExpression(observerLocator, targetProperty, sourceExpression, mode, valueConverterLookupFunction, attribute) {
      _classCallCheck(this, BindingExpression);
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.mode = mode;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
      this.attribute = attribute;
      this.discrete = false;
    }
    BindingExpression.prototype.createBinding = function createBinding(target) {
      return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
    };
    BindingExpression.create = function create(targetProperty, sourceExpression) {
      var mode = arguments.length <= 2 || arguments[2] === undefined ? bindingMode.oneWay : arguments[2];
      var parser = _aureliaDependencyInjection.Container.instance.get(Parser),
          observerLocator = _aureliaDependencyInjection.Container.instance.get(ObserverLocator);
      return new BindingExpression(observerLocator, targetProperty, parser.parse(sourceExpression), mode);
    };
    return BindingExpression;
  })();
  exports.BindingExpression = BindingExpression;
  var Binding = (function() {
    function Binding(observerLocator, sourceExpression, target, targetProperty, mode, valueConverterLookupFunction) {
      _classCallCheck(this, Binding);
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.mode = mode;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }
    Binding.prototype.getObserver = function getObserver(obj, propertyName) {
      return this.observerLocator.getObserver(obj, propertyName);
    };
    Binding.prototype.bind = function bind(source) {
      var _this24 = this;
      var targetProperty = this.targetProperty,
          info;
      if ('bind' in targetProperty) {
        targetProperty.bind();
      }
      if (this.mode == bindingMode.oneWay || this.mode == bindingMode.twoWay) {
        if (this._disposeObserver) {
          if (this.source === source) {
            return;
          }
          this.unbind();
        }
        info = this.sourceExpression.connect(this, source);
        if (info.observer) {
          this._disposeObserver = info.observer.subscribe(function(newValue) {
            var existing = targetProperty.getValue();
            if (newValue !== existing) {
              targetProperty.setValue(newValue);
            }
          });
        }
        targetProperty.setValue(info.value);
        if (this.mode == bindingMode.twoWay) {
          this._disposeListener = targetProperty.subscribe(function(newValue) {
            _this24.sourceExpression.assign(source, newValue, _this24.valueConverterLookupFunction);
          });
        }
        this.source = source;
      } else {
        var value = this.sourceExpression.evaluate(source, this.valueConverterLookupFunction);
        targetProperty.setValue(value);
      }
    };
    Binding.prototype.unbind = function unbind() {
      if ('unbind' in this.targetProperty) {
        this.targetProperty.unbind();
      }
      if (this._disposeObserver) {
        this._disposeObserver();
        this._disposeObserver = null;
      }
      if (this._disposeListener) {
        this._disposeListener();
        this._disposeListener = null;
      }
    };
    return Binding;
  })();
  var CallExpression = (function() {
    function CallExpression(observerLocator, targetProperty, sourceExpression, valueConverterLookupFunction) {
      _classCallCheck(this, CallExpression);
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }
    CallExpression.prototype.createBinding = function createBinding(target) {
      return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.valueConverterLookupFunction);
    };
    return CallExpression;
  })();
  exports.CallExpression = CallExpression;
  var Call = (function() {
    function Call(observerLocator, sourceExpression, target, targetProperty, valueConverterLookupFunction) {
      _classCallCheck(this, Call);
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }
    Call.prototype.bind = function bind(source) {
      var _this25 = this;
      if (this.source) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.source = source;
      this.targetProperty.setValue(function($event) {
        var result,
            temp = source.$event;
        source.$event = $event;
        result = _this25.sourceExpression.evaluate(source, _this25.valueConverterLookupFunction);
        source.$event = temp;
        return result;
      });
    };
    Call.prototype.unbind = function unbind() {
      if (this.source) {
        this.targetProperty.setValue(null);
        this.source = null;
      }
    };
    return Call;
  })();
  if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
    (function(view) {
      "use strict";
      if (!('Element' in view))
        return;
      var classListProp = "classList",
          protoProp = "prototype",
          elemCtrProto = view.Element[protoProp],
          objCtr = Object,
          strTrim = String[protoProp].trim || function() {
            return this.replace(/^\s+|\s+$/g, "");
          },
          arrIndexOf = Array[protoProp].indexOf || function(item) {
            var i = 0,
                len = this.length;
            for (; i < len; i++) {
              if (i in this && this[i] === item) {
                return i;
              }
            }
            return -1;
          },
          DOMEx = function DOMEx(type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
          },
          checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
            if (token === "") {
              throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
            }
            if (/\s/.test(token)) {
              throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
            }
            return arrIndexOf.call(classList, token);
          },
          ClassList = function ClassList(elem) {
            var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                i = 0,
                len = classes.length;
            for (; i < len; i++) {
              this.push(classes[i]);
            }
            this._updateClassName = function() {
              elem.setAttribute("class", this.toString());
            };
          },
          classListProto = ClassList[protoProp] = [],
          classListGetter = function classListGetter() {
            return new ClassList(this);
          };
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function(i) {
        return this[i] || null;
      };
      classListProto.contains = function(token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function() {
        var tokens = arguments,
            i = 0,
            l = tokens.length,
            token,
            updated = false;
        do {
          token = tokens[i] + "";
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function() {
        var tokens = arguments,
            i = 0,
            l = tokens.length,
            token,
            updated = false,
            index;
        do {
          token = tokens[i] + "";
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function(token, force) {
        token += "";
        var result = this.contains(token),
            method = result ? force !== true && "remove" : force !== false && "add";
        if (method) {
          this[method](token);
        }
        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function() {
        return this.join(" ");
      };
      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) {
          if (ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
    })(self);
  } else {
    (function() {
      "use strict";
      var testElement = document.createElement("_");
      testElement.classList.add("c1", "c2");
      if (!testElement.classList.contains("c2")) {
        var createMethod = function createMethod(method) {
          var original = DOMTokenList.prototype[method];
          DOMTokenList.prototype[method] = function(token) {
            var i,
                len = arguments.length;
            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };
        createMethod('add');
        createMethod('remove');
      }
      testElement.classList.toggle("c3", false);
      if (testElement.classList.contains("c3")) {
        var _toggle = DOMTokenList.prototype.toggle;
        DOMTokenList.prototype.toggle = function(token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };
      }
      testElement = null;
    })();
  }
  function camelCase(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
  var ValueConverterResource = (function() {
    function ValueConverterResource(name) {
      _classCallCheck(this, ValueConverterResource);
      this.name = name;
    }
    ValueConverterResource.convention = function convention(name) {
      if (name.endsWith('ValueConverter')) {
        return new ValueConverterResource(camelCase(name.substring(0, name.length - 14)));
      }
    };
    ValueConverterResource.prototype.analyze = function analyze(container, target) {
      this.instance = container.get(target);
    };
    ValueConverterResource.prototype.register = function register(registry, name) {
      registry.registerValueConverter(name || this.name, this.instance);
    };
    ValueConverterResource.prototype.load = function load(container, target) {
      return Promise.resolve(this);
    };
    return ValueConverterResource;
  })();
  exports.ValueConverterResource = ValueConverterResource;
  function valueConverter(nameOrTarget) {
    if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
      return function(target) {
        _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, new ValueConverterResource(nameOrTarget), target);
      };
    }
    _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, new ValueConverterResource(), nameOrTarget);
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('valueConverter', valueConverter);
  function computedFrom() {
    for (var _len = arguments.length,
        rest = Array(_len),
        _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }
    return function(target, key, descriptor) {
      descriptor.get.dependencies = rest;
      return descriptor;
    };
  }
  var ListenerExpression = (function() {
    function ListenerExpression(eventManager, targetEvent, sourceExpression, delegate, preventDefault) {
      _classCallCheck(this, ListenerExpression);
      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.sourceExpression = sourceExpression;
      this.delegate = delegate;
      this.discrete = true;
      this.preventDefault = preventDefault;
    }
    ListenerExpression.prototype.createBinding = function createBinding(target) {
      return new Listener(this.eventManager, this.targetEvent, this.delegate, this.sourceExpression, target, this.preventDefault);
    };
    return ListenerExpression;
  })();
  exports.ListenerExpression = ListenerExpression;
  var Listener = (function() {
    function Listener(eventManager, targetEvent, delegate, sourceExpression, target, preventDefault) {
      _classCallCheck(this, Listener);
      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.delegate = delegate;
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.preventDefault = preventDefault;
    }
    Listener.prototype.bind = function bind(source) {
      var _this26 = this;
      if (this._disposeListener) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.source = source;
      this._disposeListener = this.eventManager.addEventListener(this.target, this.targetEvent, function(event) {
        var prevEvent = source.$event;
        source.$event = event;
        var result = _this26.sourceExpression.evaluate(source);
        source.$event = prevEvent;
        if (result !== true && _this26.preventDefault) {
          event.preventDefault();
        }
        return result;
      }, this.delegate);
    };
    Listener.prototype.unbind = function unbind() {
      if (this._disposeListener) {
        this._disposeListener();
        this._disposeListener = null;
      }
    };
    return Listener;
  })();
  var NameExpression = (function() {
    function NameExpression(name, mode) {
      _classCallCheck(this, NameExpression);
      this.property = name;
      this.discrete = true;
      this.mode = mode;
    }
    NameExpression.prototype.createBinding = function createBinding(target) {
      return new NameBinder(this.property, target, this.mode);
    };
    return NameExpression;
  })();
  exports.NameExpression = NameExpression;
  var NameBinder = (function() {
    function NameBinder(property, target, mode) {
      _classCallCheck(this, NameBinder);
      this.property = property;
      switch (mode) {
        case 'element':
          this.target = target;
          break;
        case 'view-model':
          this.target = target.primaryBehavior.bindingContext;
          break;
        default:
          this.target = target[mode];
          if (this.target === undefined) {
            throw new Error('Attempted to reference "' + mode + '", but it was not found on the target element.');
          } else {
            this.target = this.target.bindingContext || this.target;
          }
          break;
      }
    }
    NameBinder.prototype.bind = function bind(source) {
      if (this.source) {
        if (this.source === source) {
          return;
        }
        this.unbind();
      }
      this.source = source;
      source[this.property] = this.target;
    };
    NameBinder.prototype.unbind = function unbind() {
      if (this.source) {
        this.source[this.property] = null;
        this.source = null;
      }
    };
    return NameBinder;
  })();
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/binding@0.9.1", ["github:aurelia/binding@0.9.1/aurelia-binding"], function(main) {
  return main;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/templating@0.15.3/aurelia-templating", ["exports", "npm:core-js@0.9.18", "github:aurelia/logging@0.7.0", "github:aurelia/metadata@0.8.0", "github:aurelia/path@0.9.0", "github:aurelia/loader@0.9.0", "github:aurelia/binding@0.9.1", "github:aurelia/dependency-injection@0.10.1", "github:aurelia/task-queue@0.7.0"], function(exports, _coreJs, _aureliaLogging, _aureliaMetadata, _aureliaPath, _aureliaLoader, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue) {
  'use strict';
  exports.__esModule = true;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.nextElementSibling = nextElementSibling;
  exports.createTemplateFromMarkup = createTemplateFromMarkup;
  exports.replaceNode = replaceNode;
  exports.removeNode = removeNode;
  exports.injectStyles = injectStyles;
  exports.hyphenate = hyphenate;
  exports.resource = resource;
  exports.behavior = behavior;
  exports.customElement = customElement;
  exports.customAttribute = customAttribute;
  exports.templateController = templateController;
  exports.bindable = bindable;
  exports.dynamicOptions = dynamicOptions;
  exports.sync = sync;
  exports.useShadowDOM = useShadowDOM;
  exports.skipContentProcessing = skipContentProcessing;
  exports.processContent = processContent;
  exports.containerless = containerless;
  exports.viewStrategy = viewStrategy;
  exports.useView = useView;
  exports.inlineView = inlineView;
  exports.noView = noView;
  exports.elementConfig = elementConfig;
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }});
    if (superClass)
      Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var needsTemplateFixup = !('content' in document.createElement('template'));
  var shadowPoly = window.ShadowDOMPolyfill || null;
  var DOMBoundary = 'aurelia-dom-boundary';
  exports.DOMBoundary = DOMBoundary;
  var hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;
  exports.hasShadowDOM = hasShadowDOM;
  function nextElementSibling(element) {
    if (element.nextElementSibling) {
      return element.nextElementSibling;
    }
    do {
      element = element.nextSibling;
    } while (element && element.nodeType !== 1);
    return element;
  }
  function createTemplateFromMarkup(markup) {
    var parser = document.createElement('div');
    parser.innerHTML = markup;
    var temp = parser.firstElementChild;
    if (needsTemplateFixup) {
      temp.content = document.createDocumentFragment();
      while (temp.firstChild) {
        temp.content.appendChild(temp.firstChild);
      }
    }
    return temp;
  }
  function replaceNode(newNode, node, parentNode) {
    if (node.parentNode) {
      node.parentNode.replaceChild(newNode, node);
    } else if (shadowPoly) {
      shadowPoly.unwrap(parentNode).replaceChild(shadowPoly.unwrap(newNode), shadowPoly.unwrap(node));
    } else {
      parentNode.replaceChild(newNode, node);
    }
  }
  function removeNode(node, parentNode) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else if (shadowPoly) {
      shadowPoly.unwrap(parentNode).removeChild(shadowPoly.unwrap(node));
    } else {
      parentNode.removeChild(node);
    }
  }
  function injectStyles(styles, destination, prepend) {
    var node = document.createElement('style');
    node.innerHTML = styles;
    node.type = 'text/css';
    destination = destination || document.head;
    if (prepend && destination.childNodes.length > 0) {
      destination.insertBefore(node, destination.childNodes[0]);
    } else {
      destination.appendChild(node);
    }
    return node;
  }
  var animationEvent = {
    enterBegin: 'animation:enter:begin',
    enterActive: 'animation:enter:active',
    enterDone: 'animation:enter:done',
    enterTimeout: 'animation:enter:timeout',
    leaveBegin: 'animation:leave:begin',
    leaveActive: 'animation:leave:active',
    leaveDone: 'animation:leave:done',
    leaveTimeout: 'animation:leave:timeout',
    staggerNext: 'animation:stagger:next',
    removeClassBegin: 'animation:remove-class:begin',
    removeClassActive: 'animation:remove-class:active',
    removeClassDone: 'animation:remove-class:done',
    removeClassTimeout: 'animation:remove-class:timeout',
    addClassBegin: 'animation:add-class:begin',
    addClassActive: 'animation:add-class:active',
    addClassDone: 'animation:add-class:done',
    addClassTimeout: 'animation:add-class:timeout',
    animateBegin: 'animation:animate:begin',
    animateActive: 'animation:animate:active',
    animateDone: 'animation:animate:done',
    animateTimeout: 'animation:animate:timeout',
    sequenceBegin: 'animation:sequence:begin',
    sequenceDone: 'animation:sequence:done'
  };
  exports.animationEvent = animationEvent;
  var Animator = (function() {
    function Animator() {
      _classCallCheck(this, Animator);
    }
    Animator.configureDefault = function configureDefault(container, animatorInstance) {
      container.registerInstance(Animator, Animator.instance = animatorInstance || new Animator());
    };
    Animator.prototype.move = function move() {
      return Promise.resolve(false);
    };
    Animator.prototype.enter = function enter(element) {
      return Promise.resolve(false);
    };
    Animator.prototype.leave = function leave(element) {
      return Promise.resolve(false);
    };
    Animator.prototype.removeClass = function removeClass(element, className) {
      return Promise.resolve(false);
    };
    Animator.prototype.addClass = function addClass(element, className) {
      return Promise.resolve(false);
    };
    Animator.prototype.animate = function animate(element, className, options) {
      return Promise.resolve(false);
    };
    Animator.prototype.runSequence = function runSequence(sequence) {};
    Animator.prototype.registerEffect = function registerEffect(effectName, properties) {};
    Animator.prototype.unregisterEffect = function unregisterEffect(effectName) {};
    return Animator;
  })();
  exports.Animator = Animator;
  var capitalMatcher = /([A-Z])/g;
  function addHyphenAndLower(char) {
    return "-" + char.toLowerCase();
  }
  function hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }
  var ResourceLoadContext = (function() {
    function ResourceLoadContext() {
      _classCallCheck(this, ResourceLoadContext);
      this.dependencies = {};
    }
    ResourceLoadContext.prototype.addDependency = function addDependency(url) {
      this.dependencies[url] = true;
    };
    ResourceLoadContext.prototype.doesNotHaveDependency = function doesNotHaveDependency(url) {
      return !(url in this.dependencies);
    };
    return ResourceLoadContext;
  })();
  exports.ResourceLoadContext = ResourceLoadContext;
  var ViewCompileInstruction = (function() {
    _createClass(ViewCompileInstruction, null, [{
      key: 'normal',
      value: new ViewCompileInstruction(),
      enumerable: true
    }]);
    function ViewCompileInstruction() {
      var targetShadowDOM = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      var compileSurrogate = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      _classCallCheck(this, ViewCompileInstruction);
      this.targetShadowDOM = targetShadowDOM;
      this.compileSurrogate = compileSurrogate;
      this.associatedModuleId = null;
    }
    return ViewCompileInstruction;
  })();
  exports.ViewCompileInstruction = ViewCompileInstruction;
  var BehaviorInstruction = (function() {
    BehaviorInstruction.element = function element(node, type) {
      var instruction = new BehaviorInstruction(true);
      instruction.type = type;
      instruction.attributes = {};
      instruction.anchorIsContainer = !(node.hasAttribute('containerless') || type.containerless);
      instruction.initiatedByBehavior = true;
      return instruction;
    };
    BehaviorInstruction.attribute = function attribute(attrName, type) {
      var instruction = new BehaviorInstruction(true);
      instruction.attrName = attrName;
      instruction.type = type || null;
      instruction.attributes = {};
      return instruction;
    };
    BehaviorInstruction.dynamic = function dynamic(host, bindingContext, viewFactory) {
      var instruction = new BehaviorInstruction(true);
      instruction.host = host;
      instruction.bindingContext = bindingContext;
      instruction.viewFactory = viewFactory;
      return instruction;
    };
    _createClass(BehaviorInstruction, null, [{
      key: 'normal',
      value: new BehaviorInstruction(),
      enumerable: true
    }, {
      key: 'contentSelector',
      value: new BehaviorInstruction(true),
      enumerable: true
    }]);
    function BehaviorInstruction() {
      var suppressBind = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
      _classCallCheck(this, BehaviorInstruction);
      this.suppressBind = suppressBind;
      this.initiatedByBehavior = false;
      this.systemControlled = false;
      this.enhance = false;
      this.partReplacements = null;
      this.viewFactory = null;
      this.originalAttrName = null;
      this.skipContentProcessing = false;
      this.contentFactory = null;
      this.bindingContext = null;
      this.anchorIsContainer = false;
      this.host = null;
      this.attributes = null;
      this.type = null;
      this.attrName = null;
    }
    return BehaviorInstruction;
  })();
  exports.BehaviorInstruction = BehaviorInstruction;
  var TargetInstruction = (function() {
    TargetInstruction.contentSelector = function contentSelector(node, parentInjectorId) {
      var instruction = new TargetInstruction();
      instruction.parentInjectorId = parentInjectorId;
      instruction.contentSelector = true;
      instruction.selector = node.getAttribute('select');
      instruction.suppressBind = true;
      return instruction;
    };
    TargetInstruction.contentExpression = function contentExpression(expression) {
      var instruction = new TargetInstruction();
      instruction.contentExpression = expression;
      return instruction;
    };
    TargetInstruction.lifting = function lifting(parentInjectorId, liftingInstruction) {
      var instruction = new TargetInstruction();
      instruction.parentInjectorId = parentInjectorId;
      instruction.expressions = TargetInstruction.noExpressions;
      instruction.behaviorInstructions = [liftingInstruction];
      instruction.viewFactory = liftingInstruction.viewFactory;
      instruction.providers = [liftingInstruction.type.target];
      return instruction;
    };
    TargetInstruction.normal = function normal(injectorId, parentInjectorId, providers, behaviorInstructions, expressions, elementInstruction) {
      var instruction = new TargetInstruction();
      instruction.injectorId = injectorId;
      instruction.parentInjectorId = parentInjectorId;
      instruction.providers = providers;
      instruction.behaviorInstructions = behaviorInstructions;
      instruction.expressions = expressions;
      instruction.anchorIsContainer = elementInstruction ? elementInstruction.anchorIsContainer : true;
      instruction.elementInstruction = elementInstruction;
      return instruction;
    };
    TargetInstruction.surrogate = function surrogate(providers, behaviorInstructions, expressions, values) {
      var instruction = new TargetInstruction();
      instruction.expressions = expressions;
      instruction.behaviorInstructions = behaviorInstructions;
      instruction.providers = providers;
      instruction.values = values;
      return instruction;
    };
    _createClass(TargetInstruction, null, [{
      key: 'noExpressions',
      value: Object.freeze([]),
      enumerable: true
    }]);
    function TargetInstruction() {
      _classCallCheck(this, TargetInstruction);
      this.injectorId = null;
      this.parentInjectorId = null;
      this.contentSelector = false;
      this.selector = null;
      this.suppressBind = false;
      this.contentExpression = null;
      this.expressions = null;
      this.behaviorInstructions = null;
      this.providers = null;
      this.viewFactory = null;
      this.anchorIsContainer = false;
      this.elementInstruction = null;
      this.values = null;
    }
    return TargetInstruction;
  })();
  exports.TargetInstruction = TargetInstruction;
  var ViewStrategy = (function() {
    function ViewStrategy() {
      _classCallCheck(this, ViewStrategy);
    }
    ViewStrategy.prototype.makeRelativeTo = function makeRelativeTo(baseUrl) {};
    ViewStrategy.normalize = function normalize(value) {
      if (typeof value === 'string') {
        value = new UseViewStrategy(value);
      }
      if (value && !(value instanceof ViewStrategy)) {
        throw new Error('The view must be a string or an instance of ViewStrategy.');
      }
      return value;
    };
    ViewStrategy.getDefault = function getDefault(target) {
      var strategy,
          annotation;
      if (typeof target !== 'function') {
        target = target.constructor;
      }
      annotation = _aureliaMetadata.Origin.get(target);
      strategy = _aureliaMetadata.Metadata.get(ViewStrategy.metadataKey, target);
      if (!strategy) {
        if (!annotation) {
          throw new Error('Cannot determinte default view strategy for object.', target);
        }
        strategy = new ConventionalViewStrategy(annotation.moduleId);
      } else if (annotation) {
        strategy.moduleId = annotation.moduleId;
      }
      return strategy;
    };
    _createClass(ViewStrategy, null, [{
      key: 'metadataKey',
      value: 'aurelia:view-strategy',
      enumerable: true
    }]);
    return ViewStrategy;
  })();
  exports.ViewStrategy = ViewStrategy;
  var UseViewStrategy = (function(_ViewStrategy) {
    _inherits(UseViewStrategy, _ViewStrategy);
    function UseViewStrategy(path) {
      _classCallCheck(this, UseViewStrategy);
      _ViewStrategy.call(this);
      this.path = path;
    }
    UseViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext) {
      if (!this.absolutePath && this.moduleId) {
        this.absolutePath = _aureliaPath.relativeToFile(this.path, this.moduleId);
      }
      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(this.absolutePath || this.path, compileInstruction, loadContext);
    };
    UseViewStrategy.prototype.makeRelativeTo = function makeRelativeTo(file) {
      this.absolutePath = _aureliaPath.relativeToFile(this.path, file);
    };
    return UseViewStrategy;
  })(ViewStrategy);
  exports.UseViewStrategy = UseViewStrategy;
  var ConventionalViewStrategy = (function(_ViewStrategy2) {
    _inherits(ConventionalViewStrategy, _ViewStrategy2);
    function ConventionalViewStrategy(moduleId) {
      _classCallCheck(this, ConventionalViewStrategy);
      _ViewStrategy2.call(this);
      this.moduleId = moduleId;
      this.viewUrl = ConventionalViewStrategy.convertModuleIdToViewUrl(moduleId);
    }
    ConventionalViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext) {
      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(this.viewUrl, compileInstruction, loadContext);
    };
    ConventionalViewStrategy.convertModuleIdToViewUrl = function convertModuleIdToViewUrl(moduleId) {
      var id = moduleId.endsWith('.js') || moduleId.endsWith('.ts') ? moduleId.substring(0, moduleId.length - 3) : moduleId;
      return id + '.html';
    };
    return ConventionalViewStrategy;
  })(ViewStrategy);
  exports.ConventionalViewStrategy = ConventionalViewStrategy;
  var NoViewStrategy = (function(_ViewStrategy3) {
    _inherits(NoViewStrategy, _ViewStrategy3);
    function NoViewStrategy() {
      _classCallCheck(this, NoViewStrategy);
      _ViewStrategy3.apply(this, arguments);
    }
    NoViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext) {
      return Promise.resolve(null);
    };
    return NoViewStrategy;
  })(ViewStrategy);
  exports.NoViewStrategy = NoViewStrategy;
  var TemplateRegistryViewStrategy = (function(_ViewStrategy4) {
    _inherits(TemplateRegistryViewStrategy, _ViewStrategy4);
    function TemplateRegistryViewStrategy(moduleId, entry) {
      _classCallCheck(this, TemplateRegistryViewStrategy);
      _ViewStrategy4.call(this);
      this.moduleId = moduleId;
      this.entry = entry;
    }
    TemplateRegistryViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext) {
      var entry = this.entry;
      if (entry.isReady) {
        return Promise.resolve(entry.factory);
      }
      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(entry, compileInstruction, loadContext);
    };
    return TemplateRegistryViewStrategy;
  })(ViewStrategy);
  exports.TemplateRegistryViewStrategy = TemplateRegistryViewStrategy;
  var InlineViewStrategy = (function(_ViewStrategy5) {
    _inherits(InlineViewStrategy, _ViewStrategy5);
    function InlineViewStrategy(markup, dependencies, dependencyBaseUrl) {
      _classCallCheck(this, InlineViewStrategy);
      _ViewStrategy5.call(this);
      this.markup = markup;
      this.dependencies = dependencies || null;
      this.dependencyBaseUrl = dependencyBaseUrl || '';
    }
    InlineViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, compileInstruction, loadContext) {
      var entry = this.entry,
          dependencies = this.dependencies;
      if (entry && entry.isReady) {
        return Promise.resolve(entry.factory);
      }
      this.entry = entry = new _aureliaLoader.TemplateRegistryEntry(this.moduleId || this.dependencyBaseUrl);
      entry.setTemplate(createTemplateFromMarkup(this.markup));
      if (dependencies !== null) {
        for (var i = 0,
            ii = dependencies.length; i < ii; ++i) {
          var current = dependencies[i];
          if (typeof current === 'string' || typeof current === 'function') {
            entry.addDependency(current);
          } else {
            entry.addDependency(current.from, current.as);
          }
        }
      }
      compileInstruction.associatedModuleId = this.moduleId;
      return viewEngine.loadViewFactory(entry, compileInstruction, loadContext);
    };
    return InlineViewStrategy;
  })(ViewStrategy);
  exports.InlineViewStrategy = InlineViewStrategy;
  var BindingLanguage = (function() {
    function BindingLanguage() {
      _classCallCheck(this, BindingLanguage);
    }
    BindingLanguage.prototype.inspectAttribute = function inspectAttribute(resources, attrName, attrValue) {
      throw new Error('A BindingLanguage must implement inspectAttribute(...)');
    };
    BindingLanguage.prototype.createAttributeInstruction = function createAttributeInstruction(resources, element, info, existingInstruction) {
      throw new Error('A BindingLanguage must implement createAttributeInstruction(...)');
    };
    BindingLanguage.prototype.parseText = function parseText(resources, value) {
      throw new Error('A BindingLanguage must implement parseText(...)');
    };
    return BindingLanguage;
  })();
  exports.BindingLanguage = BindingLanguage;
  function register(lookup, name, resource, type) {
    if (!name) {
      return;
    }
    var existing = lookup[name];
    if (existing) {
      if (existing !== resource) {
        throw new Error('Attempted to register ' + type + ' when one with the same name already exists. Name: ' + name + '.');
      }
      return;
    }
    lookup[name] = resource;
  }
  var ViewResources = (function() {
    function ViewResources(parent, viewUrl) {
      _classCallCheck(this, ViewResources);
      this.parent = parent || null;
      this.hasParent = this.parent !== null;
      this.viewUrl = viewUrl || '';
      this.valueConverterLookupFunction = this.getValueConverter.bind(this);
      this.attributes = {};
      this.elements = {};
      this.valueConverters = {};
      this.attributeMap = {};
      this.bindingLanguage = null;
      this.hook1 = null;
      this.hook2 = null;
      this.hook3 = null;
      this.additionalHooks = null;
    }
    ViewResources.prototype.onBeforeCompile = function onBeforeCompile(content, resources, instruction) {
      if (this.hasParent) {
        this.parent.onBeforeCompile(content, resources, instruction);
      }
      if (this.hook1 !== null) {
        this.hook1.beforeCompile(content, resources, instruction);
        if (this.hook2 !== null) {
          this.hook2.beforeCompile(content, resources, instruction);
          if (this.hook3 !== null) {
            this.hook3.beforeCompile(content, resources, instruction);
            if (this.additionalHooks !== null) {
              var hooks = this.additionalHooks;
              for (var i = 0,
                  _length = hooks.length; i < _length; ++i) {
                hooks[i].beforeCompile(content, resources, instruction);
              }
            }
          }
        }
      }
    };
    ViewResources.prototype.onAfterCompile = function onAfterCompile(viewFactory) {
      if (this.hasParent) {
        this.parent.onAfterCompile(viewFactory);
      }
      if (this.hook1 !== null) {
        this.hook1.afterCompile(viewFactory);
        if (this.hook2 !== null) {
          this.hook2.afterCompile(viewFactory);
          if (this.hook3 !== null) {
            this.hook3.afterCompile(viewFactory);
            if (this.additionalHooks !== null) {
              var hooks = this.additionalHooks;
              for (var i = 0,
                  _length2 = hooks.length; i < _length2; ++i) {
                hooks[i].afterCompile(viewFactory);
              }
            }
          }
        }
      }
    };
    ViewResources.prototype.onBeforeCreate = function onBeforeCreate(viewFactory, container, content, instruction, bindingContext) {
      if (this.hasParent) {
        this.parent.onBeforeCreate(viewFactory, container, content, instruction, bindingContext);
      }
      if (this.hook1 !== null) {
        this.hook1.beforeCreate(viewFactory, container, content, instruction, bindingContext);
        if (this.hook2 !== null) {
          this.hook2.beforeCreate(viewFactory, container, content, instruction, bindingContext);
          if (this.hook3 !== null) {
            this.hook3.beforeCreate(viewFactory, container, content, instruction, bindingContext);
            if (this.additionalHooks !== null) {
              var hooks = this.additionalHooks;
              for (var i = 0,
                  _length3 = hooks.length; i < _length3; ++i) {
                hooks[i].beforeCreate(viewFactory, container, content, instruction, bindingContext);
              }
            }
          }
        }
      }
    };
    ViewResources.prototype.onAfterCreate = function onAfterCreate(view) {
      if (this.hasParent) {
        this.parent.onAfterCreate(view);
      }
      if (this.hook1 !== null) {
        this.hook1.afterCreate(view);
        if (this.hook2 !== null) {
          this.hook2.afterCreate(view);
          if (this.hook3 !== null) {
            this.hook3.afterCreate(view);
            if (this.additionalHooks !== null) {
              var hooks = this.additionalHooks;
              for (var i = 0,
                  _length4 = hooks.length; i < _length4; ++i) {
                hooks[i].afterCreate(view);
              }
            }
          }
        }
      }
    };
    ViewResources.prototype.registerViewEngineHooks = function registerViewEngineHooks(hooks) {
      if (hooks.beforeCompile === undefined)
        hooks.beforeCompile = _aureliaMetadata.Metadata.noop;
      if (hooks.afterCompile === undefined)
        hooks.afterCompile = _aureliaMetadata.Metadata.noop;
      if (hooks.beforeCreate === undefined)
        hooks.beforeCreate = _aureliaMetadata.Metadata.noop;
      if (hooks.afterCreate === undefined)
        hooks.afterCreate = _aureliaMetadata.Metadata.noop;
      if (this.hook1 === null)
        this.hook1 = hooks;
      else if (this.hook2 === null)
        this.hook2 = hooks;
      else if (this.hook3 === null)
        this.hook3 = hooks;
      else {
        if (this.additionalHooks === null) {
          this.additionalHooks = [];
        }
        this.additionalHooks.push(hooks);
      }
    };
    ViewResources.prototype.getBindingLanguage = function getBindingLanguage(bindingLanguageFallback) {
      return this.bindingLanguage || (this.bindingLanguage = bindingLanguageFallback);
    };
    ViewResources.prototype.patchInParent = function patchInParent(newParent) {
      var originalParent = this.parent;
      this.parent = newParent || null;
      this.hasParent = this.parent !== null;
      if (newParent.parent === null) {
        newParent.parent = originalParent;
        newParent.hasParent = originalParent !== null;
      }
    };
    ViewResources.prototype.relativeToView = function relativeToView(path) {
      return _aureliaPath.relativeToFile(path, this.viewUrl);
    };
    ViewResources.prototype.registerElement = function registerElement(tagName, behavior) {
      register(this.elements, tagName, behavior, 'an Element');
    };
    ViewResources.prototype.getElement = function getElement(tagName) {
      return this.elements[tagName] || (this.hasParent ? this.parent.getElement(tagName) : null);
    };
    ViewResources.prototype.mapAttribute = function mapAttribute(attribute) {
      return this.attributeMap[attribute] || (this.hasParent ? this.parent.mapAttribute(attribute) : null);
    };
    ViewResources.prototype.registerAttribute = function registerAttribute(attribute, behavior, knownAttribute) {
      this.attributeMap[attribute] = knownAttribute;
      register(this.attributes, attribute, behavior, 'an Attribute');
    };
    ViewResources.prototype.getAttribute = function getAttribute(attribute) {
      return this.attributes[attribute] || (this.hasParent ? this.parent.getAttribute(attribute) : null);
    };
    ViewResources.prototype.registerValueConverter = function registerValueConverter(name, valueConverter) {
      register(this.valueConverters, name, valueConverter, 'a ValueConverter');
    };
    ViewResources.prototype.getValueConverter = function getValueConverter(name) {
      return this.valueConverters[name] || (this.hasParent ? this.parent.getValueConverter(name) : null);
    };
    return ViewResources;
  })();
  exports.ViewResources = ViewResources;
  var View = (function() {
    function View(viewFactory, container, fragment, behaviors, bindings, children, systemControlled, contentSelectors) {
      _classCallCheck(this, View);
      this.viewFactory = viewFactory;
      this.container = container;
      this.fragment = fragment;
      this.behaviors = behaviors;
      this.bindings = bindings;
      this.children = children;
      this.systemControlled = systemControlled;
      this.contentSelectors = contentSelectors;
      this.firstChild = fragment.firstChild;
      this.lastChild = fragment.lastChild;
      this.isBound = false;
      this.isAttached = false;
      this.fromCache = false;
    }
    View.prototype.returnToCache = function returnToCache() {
      this.viewFactory.returnViewToCache(this);
    };
    View.prototype.created = function created() {
      var i,
          ii,
          behaviors = this.behaviors;
      for (i = 0, ii = behaviors.length; i < ii; ++i) {
        behaviors[i].created(this);
      }
    };
    View.prototype.bind = function bind(bindingContext, systemUpdate) {
      var context,
          behaviors,
          bindings,
          children,
          i,
          ii;
      if (systemUpdate && !this.systemControlled) {
        context = this.bindingContext || bindingContext;
      } else {
        context = bindingContext || this.bindingContext;
      }
      if (this.isBound) {
        if (this.bindingContext === context) {
          return;
        }
        this.unbind();
      }
      this.isBound = true;
      this.bindingContext = context;
      if (this.owner) {
        this.owner.bind(context);
      }
      bindings = this.bindings;
      for (i = 0, ii = bindings.length; i < ii; ++i) {
        bindings[i].bind(context);
      }
      behaviors = this.behaviors;
      for (i = 0, ii = behaviors.length; i < ii; ++i) {
        behaviors[i].bind(context);
      }
      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].bind(context, true);
      }
    };
    View.prototype.addBinding = function addBinding(binding) {
      this.bindings.push(binding);
      if (this.isBound) {
        binding.bind(this.bindingContext);
      }
    };
    View.prototype.unbind = function unbind() {
      var behaviors,
          bindings,
          children,
          i,
          ii;
      if (this.isBound) {
        this.isBound = false;
        if (this.owner) {
          this.owner.unbind();
        }
        bindings = this.bindings;
        for (i = 0, ii = bindings.length; i < ii; ++i) {
          bindings[i].unbind();
        }
        behaviors = this.behaviors;
        for (i = 0, ii = behaviors.length; i < ii; ++i) {
          behaviors[i].unbind();
        }
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].unbind();
        }
      }
    };
    View.prototype.insertNodesBefore = function insertNodesBefore(refNode) {
      var parent = refNode.parentNode;
      parent.insertBefore(this.fragment, refNode);
    };
    View.prototype.appendNodesTo = function appendNodesTo(parent) {
      parent.appendChild(this.fragment);
    };
    View.prototype.removeNodes = function removeNodes() {
      var start = this.firstChild,
          end = this.lastChild,
          fragment = this.fragment,
          next;
      var current = start,
          loop = true,
          nodes = [];
      while (loop) {
        if (current === end) {
          loop = false;
        }
        next = current.nextSibling;
        this.fragment.appendChild(current);
        current = next;
      }
    };
    View.prototype.attached = function attached() {
      var behaviors,
          children,
          i,
          ii;
      if (this.isAttached) {
        return;
      }
      this.isAttached = true;
      if (this.owner) {
        this.owner.attached();
      }
      behaviors = this.behaviors;
      for (i = 0, ii = behaviors.length; i < ii; ++i) {
        behaviors[i].attached();
      }
      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].attached();
      }
    };
    View.prototype.detached = function detached() {
      var behaviors,
          children,
          i,
          ii;
      if (this.isAttached) {
        this.isAttached = false;
        if (this.owner) {
          this.owner.detached();
        }
        behaviors = this.behaviors;
        for (i = 0, ii = behaviors.length; i < ii; ++i) {
          behaviors[i].detached();
        }
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].detached();
        }
      }
    };
    return View;
  })();
  exports.View = View;
  if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
  }
  var placeholder = [];
  function findInsertionPoint(groups, index) {
    var insertionPoint;
    while (!insertionPoint && index >= 0) {
      insertionPoint = groups[index][0];
      index--;
    }
    return insertionPoint;
  }
  var ContentSelector = (function() {
    ContentSelector.applySelectors = function applySelectors(view, contentSelectors, callback) {
      var currentChild = view.fragment.firstChild,
          contentMap = new Map(),
          nextSibling,
          i,
          ii,
          contentSelector;
      while (currentChild) {
        nextSibling = currentChild.nextSibling;
        if (currentChild.viewSlot) {
          var viewSlotSelectors = contentSelectors.map(function(x) {
            return x.copyForViewSlot();
          });
          currentChild.viewSlot.installContentSelectors(viewSlotSelectors);
        } else {
          for (i = 0, ii = contentSelectors.length; i < ii; i++) {
            contentSelector = contentSelectors[i];
            if (contentSelector.matches(currentChild)) {
              var elements = contentMap.get(contentSelector);
              if (!elements) {
                elements = [];
                contentMap.set(contentSelector, elements);
              }
              elements.push(currentChild);
              break;
            }
          }
        }
        currentChild = nextSibling;
      }
      for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
        contentSelector = contentSelectors[i];
        callback(contentSelector, contentMap.get(contentSelector) || placeholder);
      }
    };
    function ContentSelector(anchor, selector) {
      _classCallCheck(this, ContentSelector);
      this.anchor = anchor;
      this.selector = selector;
      this.all = !this.selector;
      this.groups = [];
    }
    ContentSelector.prototype.copyForViewSlot = function copyForViewSlot() {
      return new ContentSelector(this.anchor, this.selector);
    };
    ContentSelector.prototype.matches = function matches(node) {
      return this.all || node.nodeType === 1 && node.matches(this.selector);
    };
    ContentSelector.prototype.add = function add(group) {
      var anchor = this.anchor,
          parent = anchor.parentNode,
          i,
          ii;
      for (i = 0, ii = group.length; i < ii; ++i) {
        parent.insertBefore(group[i], anchor);
      }
      this.groups.push(group);
    };
    ContentSelector.prototype.insert = function insert(index, group) {
      if (group.length) {
        var anchor = findInsertionPoint(this.groups, index) || this.anchor,
            parent = anchor.parentNode,
            i,
            ii;
        for (i = 0, ii = group.length; i < ii; ++i) {
          parent.insertBefore(group[i], anchor);
        }
      }
      this.groups.splice(index, 0, group);
    };
    ContentSelector.prototype.removeAt = function removeAt(index, fragment) {
      var group = this.groups[index],
          i,
          ii;
      for (i = 0, ii = group.length; i < ii; ++i) {
        fragment.appendChild(group[i]);
      }
      this.groups.splice(index, 1);
    };
    return ContentSelector;
  })();
  exports.ContentSelector = ContentSelector;
  function getAnimatableElement(view) {
    var firstChild = view.firstChild;
    if (firstChild !== null && firstChild !== undefined && firstChild.nodeType === 8) {
      var element = nextElementSibling(firstChild);
      if (element !== null && element !== undefined && element.nodeType === 1 && element.classList.contains('au-animate')) {
        return element;
      }
    }
    return null;
  }
  var ViewSlot = (function() {
    function ViewSlot(anchor, anchorIsContainer, bindingContext) {
      var animator = arguments.length <= 3 || arguments[3] === undefined ? Animator.instance : arguments[3];
      _classCallCheck(this, ViewSlot);
      this.anchor = anchor;
      this.viewAddMethod = anchorIsContainer ? 'appendNodesTo' : 'insertNodesBefore';
      this.bindingContext = bindingContext;
      this.animator = animator;
      this.children = [];
      this.isBound = false;
      this.isAttached = false;
      this.contentSelectors = null;
      anchor.viewSlot = this;
    }
    ViewSlot.prototype.transformChildNodesIntoView = function transformChildNodesIntoView() {
      var parent = this.anchor;
      this.children.push({
        fragment: parent,
        firstChild: parent.firstChild,
        lastChild: parent.lastChild,
        returnToCache: function returnToCache() {},
        removeNodes: function removeNodes() {
          var last;
          while (last = parent.lastChild) {
            parent.removeChild(last);
          }
        },
        created: function created() {},
        bind: function bind() {},
        unbind: function unbind() {},
        attached: function attached() {},
        detached: function detached() {}
      });
    };
    ViewSlot.prototype.bind = function bind(bindingContext) {
      var i,
          ii,
          children;
      if (this.isBound) {
        if (this.bindingContext === bindingContext) {
          return;
        }
        this.unbind();
      }
      this.isBound = true;
      this.bindingContext = bindingContext = bindingContext || this.bindingContext;
      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].bind(bindingContext, true);
      }
    };
    ViewSlot.prototype.unbind = function unbind() {
      var i,
          ii,
          children = this.children;
      this.isBound = false;
      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].unbind();
      }
    };
    ViewSlot.prototype.add = function add(view) {
      view[this.viewAddMethod](this.anchor);
      this.children.push(view);
      if (this.isAttached) {
        view.attached();
        var animatableElement = getAnimatableElement(view);
        if (animatableElement !== null) {
          return this.animator.enter(animatableElement);
        }
      }
    };
    ViewSlot.prototype.insert = function insert(index, view) {
      var children = this.children,
          length = children.length;
      if (index === 0 && length === 0 || index >= length) {
        return this.add(view);
      } else {
        view.insertNodesBefore(children[index].firstChild);
        children.splice(index, 0, view);
        if (this.isAttached) {
          view.attached();
          var animatableElement = getAnimatableElement(view);
          if (animatableElement !== null) {
            return this.animator.enter(animatableElement);
          }
        }
      }
    };
    ViewSlot.prototype.remove = function remove(view, returnToCache, skipAnimation) {
      return this.removeAt(this.children.indexOf(view), returnToCache, skipAnimation);
    };
    ViewSlot.prototype.removeAt = function removeAt(index, returnToCache, skipAnimation) {
      var _this = this;
      var view = this.children[index];
      var removeAction = function removeAction() {
        view.removeNodes();
        _this.children.splice(index, 1);
        if (_this.isAttached) {
          view.detached();
        }
        if (returnToCache) {
          view.returnToCache();
        }
        return view;
      };
      if (!skipAnimation) {
        var animatableElement = getAnimatableElement(view);
        if (animatableElement !== null) {
          return this.animator.leave(animatableElement).then(function() {
            return removeAction();
          });
        }
      }
      return removeAction();
    };
    ViewSlot.prototype.removeAll = function removeAll(returnToCache, skipAnimation) {
      var _this2 = this;
      var children = this.children,
          ii = children.length,
          i;
      var rmPromises = [];
      children.forEach(function(child) {
        if (skipAnimation) {
          child.removeNodes();
          return;
        }
        var animatableElement = getAnimatableElement(child);
        if (animatableElement !== null) {
          rmPromises.push(_this2.animator.leave(animatableElement).then(function() {
            return child.removeNodes();
          }));
        } else {
          child.removeNodes();
        }
      });
      var removeAction = function removeAction() {
        if (_this2.isAttached) {
          for (i = 0; i < ii; ++i) {
            children[i].detached();
          }
        }
        if (returnToCache) {
          for (i = 0; i < ii; ++i) {
            children[i].returnToCache();
          }
        }
        _this2.children = [];
      };
      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function() {
          return removeAction();
        });
      } else {
        removeAction();
      }
    };
    ViewSlot.prototype.swap = function swap(view, returnToCache) {
      var _this3 = this;
      var removeResponse = this.removeAll(returnToCache);
      if (removeResponse instanceof Promise) {
        return removeResponse.then(function() {
          return _this3.add(view);
        });
      } else {
        return this.add(view);
      }
    };
    ViewSlot.prototype.attached = function attached() {
      var i,
          ii,
          children,
          child;
      if (this.isAttached) {
        return;
      }
      this.isAttached = true;
      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        child = children[i];
        child.attached();
        var element = child.firstChild ? nextElementSibling(child.firstChild) : null;
        if (child.firstChild && child.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains('au-animate')) {
          this.animator.enter(element);
        }
      }
    };
    ViewSlot.prototype.detached = function detached() {
      var i,
          ii,
          children;
      if (this.isAttached) {
        this.isAttached = false;
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].detached();
        }
      }
    };
    ViewSlot.prototype.installContentSelectors = function installContentSelectors(contentSelectors) {
      this.contentSelectors = contentSelectors;
      this.add = this._contentSelectorAdd;
      this.insert = this._contentSelectorInsert;
      this.remove = this._contentSelectorRemove;
      this.removeAt = this._contentSelectorRemoveAt;
      this.removeAll = this._contentSelectorRemoveAll;
    };
    ViewSlot.prototype._contentSelectorAdd = function _contentSelectorAdd(view) {
      ContentSelector.applySelectors(view, this.contentSelectors, function(contentSelector, group) {
        return contentSelector.add(group);
      });
      this.children.push(view);
      if (this.isAttached) {
        view.attached();
      }
    };
    ViewSlot.prototype._contentSelectorInsert = function _contentSelectorInsert(index, view) {
      if (index === 0 && !this.children.length || index >= this.children.length) {
        this.add(view);
      } else {
        ContentSelector.applySelectors(view, this.contentSelectors, function(contentSelector, group) {
          return contentSelector.insert(index, group);
        });
        this.children.splice(index, 0, view);
        if (this.isAttached) {
          view.attached();
        }
      }
    };
    ViewSlot.prototype._contentSelectorRemove = function _contentSelectorRemove(view) {
      var index = this.children.indexOf(view),
          contentSelectors = this.contentSelectors,
          i,
          ii;
      for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
        contentSelectors[i].removeAt(index, view.fragment);
      }
      this.children.splice(index, 1);
      if (this.isAttached) {
        view.detached();
      }
    };
    ViewSlot.prototype._contentSelectorRemoveAt = function _contentSelectorRemoveAt(index) {
      var view = this.children[index],
          contentSelectors = this.contentSelectors,
          i,
          ii;
      for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
        contentSelectors[i].removeAt(index, view.fragment);
      }
      this.children.splice(index, 1);
      if (this.isAttached) {
        view.detached();
      }
      return view;
    };
    ViewSlot.prototype._contentSelectorRemoveAll = function _contentSelectorRemoveAll() {
      var children = this.children,
          contentSelectors = this.contentSelectors,
          ii = children.length,
          jj = contentSelectors.length,
          i,
          j,
          view;
      for (i = 0; i < ii; ++i) {
        view = children[i];
        for (j = 0; j < jj; ++j) {
          contentSelectors[j].removeAt(0, view.fragment);
        }
      }
      if (this.isAttached) {
        for (i = 0; i < ii; ++i) {
          children[i].detached();
        }
      }
      this.children = [];
    };
    return ViewSlot;
  })();
  exports.ViewSlot = ViewSlot;
  function elementContainerGet(key) {
    if (key === Element) {
      return this.element;
    }
    if (key === BoundViewFactory) {
      if (this.boundViewFactory) {
        return this.boundViewFactory;
      }
      var factory = this.instruction.viewFactory,
          partReplacements = this.partReplacements;
      if (partReplacements) {
        factory = partReplacements[factory.part] || factory;
      }
      return this.boundViewFactory = new BoundViewFactory(this, factory, this.bindingContext, partReplacements);
    }
    if (key === ViewSlot) {
      if (this.viewSlot === undefined) {
        this.viewSlot = new ViewSlot(this.element, this.instruction.anchorIsContainer, this.bindingContext);
        this.children.push(this.viewSlot);
      }
      return this.viewSlot;
    }
    if (key === ViewResources) {
      return this.viewResources;
    }
    if (key === TargetInstruction) {
      return this.instruction;
    }
    return this.superGet(key);
  }
  function createElementContainer(parent, element, instruction, bindingContext, children, partReplacements, resources) {
    var container = parent.createChild(),
        providers,
        i;
    container.element = element;
    container.instruction = instruction;
    container.bindingContext = bindingContext;
    container.children = children;
    container.viewResources = resources;
    container.partReplacements = partReplacements;
    providers = instruction.providers;
    i = providers.length;
    while (i--) {
      container.registerSingleton(providers[i]);
    }
    container.superGet = container.get;
    container.get = elementContainerGet;
    return container;
  }
  function makeElementIntoAnchor(element, elementInstruction) {
    var anchor = document.createComment('anchor');
    if (elementInstruction) {
      anchor.hasAttribute = function(name) {
        return element.hasAttribute(name);
      };
      anchor.getAttribute = function(name) {
        return element.getAttribute(name);
      };
      anchor.setAttribute = function(name, value) {
        element.setAttribute(name, value);
      };
    }
    element.parentNode.replaceChild(anchor, element);
    return anchor;
  }
  function applyInstructions(containers, bindingContext, element, instruction, behaviors, bindings, children, contentSelectors, partReplacements, resources) {
    var behaviorInstructions = instruction.behaviorInstructions,
        expressions = instruction.expressions,
        elementContainer,
        i,
        ii,
        current,
        instance;
    if (instruction.contentExpression) {
      bindings.push(instruction.contentExpression.createBinding(element.nextSibling));
      element.parentNode.removeChild(element);
      return;
    }
    if (instruction.contentSelector) {
      var commentAnchor = document.createComment('anchor');
      element.parentNode.replaceChild(commentAnchor, element);
      contentSelectors.push(new ContentSelector(commentAnchor, instruction.selector));
      return;
    }
    if (behaviorInstructions.length) {
      if (!instruction.anchorIsContainer) {
        element = makeElementIntoAnchor(element, instruction.elementInstruction);
      }
      containers[instruction.injectorId] = elementContainer = createElementContainer(containers[instruction.parentInjectorId], element, instruction, bindingContext, children, partReplacements, resources);
      for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
        current = behaviorInstructions[i];
        instance = current.type.create(elementContainer, current, element, bindings, current.partReplacements);
        if (instance.contentView) {
          children.push(instance.contentView);
        }
        behaviors.push(instance);
      }
    }
    for (i = 0, ii = expressions.length; i < ii; ++i) {
      bindings.push(expressions[i].createBinding(element));
    }
  }
  function styleStringToObject(style, target) {
    var attributes = style.split(';'),
        firstIndexOfColon,
        i,
        current,
        key,
        value;
    target = target || {};
    for (i = 0; i < attributes.length; i++) {
      current = attributes[i];
      firstIndexOfColon = current.indexOf(":");
      key = current.substring(0, firstIndexOfColon).trim();
      value = current.substring(firstIndexOfColon + 1).trim();
      target[key] = value;
    }
    return target;
  }
  function styleObjectToString(obj) {
    var result = '';
    for (var key in obj) {
      result += key + ':' + obj[key] + ';';
    }
    return result;
  }
  function applySurrogateInstruction(container, element, instruction, behaviors, bindings, children) {
    var behaviorInstructions = instruction.behaviorInstructions,
        expressions = instruction.expressions,
        providers = instruction.providers,
        values = instruction.values,
        i = undefined,
        ii = undefined,
        current = undefined,
        instance = undefined,
        currentAttributeValue = undefined,
        styleParts = undefined;
    i = providers.length;
    while (i--) {
      container.registerSingleton(providers[i]);
    }
    for (var key in values) {
      currentAttributeValue = element.getAttribute(key);
      if (currentAttributeValue) {
        if (key === 'class') {
          element.setAttribute('class', currentAttributeValue + ' ' + values[key]);
        } else if (key === 'style') {
          var styleObject = styleStringToObject(values[key]);
          styleStringToObject(currentAttributeValue, styleObject);
          element.setAttribute('style', styleObjectToString(styleObject));
        }
      } else {
        element.setAttribute(key, values[key]);
      }
    }
    if (behaviorInstructions.length) {
      for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
        current = behaviorInstructions[i];
        instance = current.type.create(container, current, element, bindings, current.partReplacements);
        if (instance.contentView) {
          children.push(instance.contentView);
        }
        behaviors.push(instance);
      }
    }
    for (i = 0, ii = expressions.length; i < ii; ++i) {
      bindings.push(expressions[i].createBinding(element));
    }
  }
  var BoundViewFactory = (function() {
    function BoundViewFactory(parentContainer, viewFactory, bindingContext, partReplacements) {
      _classCallCheck(this, BoundViewFactory);
      this.parentContainer = parentContainer;
      this.viewFactory = viewFactory;
      this.bindingContext = bindingContext;
      this.factoryCreateInstruction = {partReplacements: partReplacements};
    }
    BoundViewFactory.prototype.create = function create(bindingContext) {
      var childContainer = this.parentContainer.createChild(),
          context = bindingContext || this.bindingContext;
      this.factoryCreateInstruction.systemControlled = !bindingContext;
      return this.viewFactory.create(childContainer, context, this.factoryCreateInstruction);
    };
    BoundViewFactory.prototype.setCacheSize = function setCacheSize(size, doNotOverrideIfAlreadySet) {
      this.viewFactory.setCacheSize(size, doNotOverrideIfAlreadySet);
    };
    BoundViewFactory.prototype.getCachedView = function getCachedView() {
      return this.viewFactory.getCachedView();
    };
    BoundViewFactory.prototype.returnViewToCache = function returnViewToCache(view) {
      this.viewFactory.returnViewToCache(view);
    };
    _createClass(BoundViewFactory, [{
      key: 'isCaching',
      get: function get() {
        return this.viewFactory.isCaching;
      }
    }]);
    return BoundViewFactory;
  })();
  exports.BoundViewFactory = BoundViewFactory;
  var ViewFactory = (function() {
    function ViewFactory(template, instructions, resources) {
      _classCallCheck(this, ViewFactory);
      this.template = template;
      this.instructions = instructions;
      this.resources = resources;
      this.cacheSize = -1;
      this.cache = null;
      this.isCaching = false;
    }
    ViewFactory.prototype.setCacheSize = function setCacheSize(size, doNotOverrideIfAlreadySet) {
      if (size) {
        if (size === '*') {
          size = Number.MAX_VALUE;
        } else if (typeof size === "string") {
          size = parseInt(size);
        }
      }
      if (this.cacheSize === -1 || !doNotOverrideIfAlreadySet) {
        this.cacheSize = size;
      }
      if (this.cacheSize > 0) {
        this.cache = [];
      } else {
        this.cache = null;
      }
      this.isCaching = this.cacheSize > 0;
    };
    ViewFactory.prototype.getCachedView = function getCachedView() {
      return this.cache !== null ? this.cache.pop() || null : null;
    };
    ViewFactory.prototype.returnViewToCache = function returnViewToCache(view) {
      if (view.isAttached) {
        view.detached();
      }
      if (view.isBound) {
        view.unbind();
      }
      if (this.cache !== null && this.cache.length < this.cacheSize) {
        view.fromCache = true;
        this.cache.push(view);
      }
    };
    ViewFactory.prototype.create = function create(container, bindingContext, createInstruction, element) {
      createInstruction = createInstruction || BehaviorInstruction.normal;
      element = element || null;
      var cachedView = this.getCachedView();
      if (cachedView !== null) {
        if (!createInstruction.suppressBind) {
          cachedView.bind(bindingContext);
        }
        return cachedView;
      }
      var fragment = createInstruction.enhance ? this.template : this.template.cloneNode(true),
          instructables = fragment.querySelectorAll('.au-target'),
          instructions = this.instructions,
          resources = this.resources,
          behaviors = [],
          bindings = [],
          children = [],
          contentSelectors = [],
          containers = {root: container},
          partReplacements = createInstruction.partReplacements,
          i = undefined,
          ii = undefined,
          view = undefined,
          instructable = undefined,
          instruction = undefined;
      this.resources.onBeforeCreate(this, container, fragment, createInstruction, bindingContext);
      if (element !== null && this.surrogateInstruction !== null) {
        applySurrogateInstruction(container, element, this.surrogateInstruction, behaviors, bindings, children);
      }
      for (i = 0, ii = instructables.length; i < ii; ++i) {
        instructable = instructables[i];
        instruction = instructions[instructable.getAttribute('au-target-id')];
        applyInstructions(containers, bindingContext, instructable, instruction, behaviors, bindings, children, contentSelectors, partReplacements, resources);
      }
      view = new View(this, container, fragment, behaviors, bindings, children, createInstruction.systemControlled, contentSelectors);
      if (!createInstruction.initiatedByBehavior) {
        view.created();
      }
      this.resources.onAfterCreate(view);
      if (!createInstruction.suppressBind) {
        view.bind(bindingContext);
      }
      return view;
    };
    return ViewFactory;
  })();
  exports.ViewFactory = ViewFactory;
  var nextInjectorId = 0;
  function getNextInjectorId() {
    return ++nextInjectorId;
  }
  function configureProperties(instruction, resources) {
    var type = instruction.type,
        attrName = instruction.attrName,
        attributes = instruction.attributes,
        property,
        key,
        value;
    var knownAttribute = resources.mapAttribute(attrName);
    if (knownAttribute && attrName in attributes && knownAttribute !== attrName) {
      attributes[knownAttribute] = attributes[attrName];
      delete attributes[attrName];
    }
    for (key in attributes) {
      value = attributes[key];
      if (value !== null && typeof value === 'object') {
        property = type.attributes[key];
        if (property !== undefined) {
          value.targetProperty = property.name;
        } else {
          value.targetProperty = key;
        }
      }
    }
  }
  var lastAUTargetID = 0;
  function getNextAUTargetID() {
    return (++lastAUTargetID).toString();
  }
  function makeIntoInstructionTarget(element) {
    var value = element.getAttribute('class'),
        auTargetID = getNextAUTargetID();
    element.setAttribute('class', value ? value += ' au-target' : 'au-target');
    element.setAttribute('au-target-id', auTargetID);
    return auTargetID;
  }
  var ViewCompiler = (function() {
    function ViewCompiler(bindingLanguage, resources) {
      _classCallCheck(this, _ViewCompiler);
      this.bindingLanguage = bindingLanguage;
      this.resources = resources;
    }
    ViewCompiler.prototype.compile = function compile(source, resources, compileInstruction) {
      resources = resources || this.resources;
      compileInstruction = compileInstruction || ViewCompileInstruction.normal;
      source = typeof source === 'string' ? createTemplateFromMarkup(source) : source;
      var content = undefined,
          part = undefined,
          cacheSize = undefined;
      if (source.content) {
        part = source.getAttribute('part');
        cacheSize = source.getAttribute('view-cache');
        content = document.adoptNode(source.content, true);
      } else {
        content = source;
      }
      compileInstruction.targetShadowDOM = compileInstruction.targetShadowDOM && hasShadowDOM;
      resources.onBeforeCompile(content, resources, compileInstruction);
      var instructions = {};
      this.compileNode(content, resources, instructions, source, 'root', !compileInstruction.targetShadowDOM);
      content.insertBefore(document.createComment('<view>'), content.firstChild);
      content.appendChild(document.createComment('</view>'));
      var factory = new ViewFactory(content, instructions, resources);
      factory.surrogateInstruction = compileInstruction.compileSurrogate ? this.compileSurrogate(source, resources) : null;
      factory.part = part;
      if (cacheSize) {
        factory.setCacheSize(cacheSize);
      }
      resources.onAfterCompile(factory);
      return factory;
    };
    ViewCompiler.prototype.compileNode = function compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
      switch (node.nodeType) {
        case 1:
          return this.compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
        case 3:
          var expression = resources.getBindingLanguage(this.bindingLanguage).parseText(resources, node.wholeText);
          if (expression) {
            var marker = document.createElement('au-marker'),
                auTargetID = makeIntoInstructionTarget(marker);
            (node.parentNode || parentNode).insertBefore(marker, node);
            node.textContent = ' ';
            instructions[auTargetID] = TargetInstruction.contentExpression(expression);
            while (node.nextSibling && node.nextSibling.nodeType === 3) {
              (node.parentNode || parentNode).removeChild(node.nextSibling);
            }
          } else {
            while (node.nextSibling && node.nextSibling.nodeType === 3) {
              node = node.nextSibling;
            }
          }
          return node.nextSibling;
        case 11:
          var currentChild = node.firstChild;
          while (currentChild) {
            currentChild = this.compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
          }
          break;
      }
      return node.nextSibling;
    };
    ViewCompiler.prototype.compileSurrogate = function compileSurrogate(node, resources) {
      var attributes = node.attributes,
          bindingLanguage = resources.getBindingLanguage(this.bindingLanguage),
          knownAttribute = undefined,
          property = undefined,
          instruction = undefined,
          i = undefined,
          ii = undefined,
          attr = undefined,
          attrName = undefined,
          attrValue = undefined,
          info = undefined,
          type = undefined,
          expressions = [],
          expression = undefined,
          behaviorInstructions = [],
          values = {},
          hasValues = false,
          providers = [];
      for (i = 0, ii = attributes.length; i < ii; ++i) {
        attr = attributes[i];
        attrName = attr.name;
        attrValue = attr.value;
        info = bindingLanguage.inspectAttribute(resources, attrName, attrValue);
        type = resources.getAttribute(info.attrName);
        if (type) {
          knownAttribute = resources.mapAttribute(info.attrName);
          if (knownAttribute) {
            property = type.attributes[knownAttribute];
            if (property) {
              info.defaultBindingMode = property.defaultBindingMode;
              if (!info.command && !info.expression) {
                info.command = property.hasOptions ? 'options' : null;
              }
            }
          }
        }
        instruction = bindingLanguage.createAttributeInstruction(resources, node, info);
        if (instruction) {
          if (instruction.alteredAttr) {
            type = resources.getAttribute(instruction.attrName);
          }
          if (instruction.discrete) {
            expressions.push(instruction);
          } else {
            if (type) {
              instruction.type = type;
              configureProperties(instruction, resources);
              if (type.liftsContent) {
                throw new Error('You cannot place a template controller on a surrogate element.');
              } else {
                behaviorInstructions.push(instruction);
              }
            } else {
              expressions.push(instruction.attributes[instruction.attrName]);
            }
          }
        } else {
          if (type) {
            instruction = BehaviorInstruction.attribute(attrName, type);
            instruction.attributes[resources.mapAttribute(attrName)] = attrValue;
            if (type.liftsContent) {
              throw new Error('You cannot place a template controller on a surrogate element.');
            } else {
              behaviorInstructions.push(instruction);
            }
          } else if (attrName !== 'id' && attrName !== 'part' && attrName !== 'replace-part') {
            hasValues = true;
            values[attrName] = attrValue;
          }
        }
      }
      if (expressions.length || behaviorInstructions.length || hasValues) {
        for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
          instruction = behaviorInstructions[i];
          instruction.type.compile(this, resources, node, instruction);
          providers.push(instruction.type.target);
        }
        for (i = 0, ii = expressions.length; i < ii; ++i) {
          expression = expressions[i];
          if (expression.attrToRemove !== undefined) {
            node.removeAttribute(expression.attrToRemove);
          }
        }
        return TargetInstruction.surrogate(providers, behaviorInstructions, expressions, values);
      }
      return null;
    };
    ViewCompiler.prototype.compileElement = function compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
      var tagName = node.tagName.toLowerCase(),
          attributes = node.attributes,
          expressions = [],
          expression,
          behaviorInstructions = [],
          providers = [],
          bindingLanguage = resources.getBindingLanguage(this.bindingLanguage),
          liftingInstruction,
          viewFactory,
          type,
          elementInstruction,
          elementProperty,
          i,
          ii,
          attr,
          attrName,
          attrValue,
          instruction,
          info,
          property,
          knownAttribute,
          auTargetID,
          injectorId;
      if (tagName === 'content') {
        if (targetLightDOM) {
          auTargetID = makeIntoInstructionTarget(node);
          instructions[auTargetID] = TargetInstruction.contentSelector(node, parentInjectorId);
        }
        return node.nextSibling;
      } else if (tagName === 'template') {
        viewFactory = this.compile(node, resources);
        viewFactory.part = node.getAttribute('part');
      } else {
        type = resources.getElement(tagName);
        if (type) {
          elementInstruction = BehaviorInstruction.element(node, type);
          behaviorInstructions.push(elementInstruction);
        }
      }
      for (i = 0, ii = attributes.length; i < ii; ++i) {
        attr = attributes[i];
        attrName = attr.name;
        attrValue = attr.value;
        info = bindingLanguage.inspectAttribute(resources, attrName, attrValue);
        type = resources.getAttribute(info.attrName);
        elementProperty = null;
        if (type) {
          knownAttribute = resources.mapAttribute(info.attrName);
          if (knownAttribute) {
            property = type.attributes[knownAttribute];
            if (property) {
              info.defaultBindingMode = property.defaultBindingMode;
              if (!info.command && !info.expression) {
                info.command = property.hasOptions ? 'options' : null;
              }
            }
          }
        } else if (elementInstruction) {
          elementProperty = elementInstruction.type.attributes[info.attrName];
          if (elementProperty) {
            info.defaultBindingMode = elementProperty.defaultBindingMode;
          }
        }
        if (elementProperty) {
          instruction = bindingLanguage.createAttributeInstruction(resources, node, info, elementInstruction);
        } else {
          instruction = bindingLanguage.createAttributeInstruction(resources, node, info);
        }
        if (instruction) {
          if (instruction.alteredAttr) {
            type = resources.getAttribute(instruction.attrName);
          }
          if (instruction.discrete) {
            expressions.push(instruction);
          } else {
            if (type) {
              instruction.type = type;
              configureProperties(instruction, resources);
              if (type.liftsContent) {
                instruction.originalAttrName = attrName;
                liftingInstruction = instruction;
                break;
              } else {
                behaviorInstructions.push(instruction);
              }
            } else if (elementProperty) {
              elementInstruction.attributes[info.attrName].targetProperty = elementProperty.name;
            } else {
              expressions.push(instruction.attributes[instruction.attrName]);
            }
          }
        } else {
          if (type) {
            instruction = BehaviorInstruction.attribute(attrName, type);
            instruction.attributes[resources.mapAttribute(attrName)] = attrValue;
            if (type.liftsContent) {
              instruction.originalAttrName = attrName;
              liftingInstruction = instruction;
              break;
            } else {
              behaviorInstructions.push(instruction);
            }
          } else if (elementProperty) {
            elementInstruction.attributes[attrName] = attrValue;
          }
        }
      }
      if (liftingInstruction) {
        liftingInstruction.viewFactory = viewFactory;
        node = liftingInstruction.type.compile(this, resources, node, liftingInstruction, parentNode);
        auTargetID = makeIntoInstructionTarget(node);
        instructions[auTargetID] = TargetInstruction.lifting(parentInjectorId, liftingInstruction);
      } else {
        if (expressions.length || behaviorInstructions.length) {
          injectorId = behaviorInstructions.length ? getNextInjectorId() : false;
          for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
            instruction = behaviorInstructions[i];
            instruction.type.compile(this, resources, node, instruction, parentNode);
            providers.push(instruction.type.target);
          }
          for (i = 0, ii = expressions.length; i < ii; ++i) {
            expression = expressions[i];
            if (expression.attrToRemove !== undefined) {
              node.removeAttribute(expression.attrToRemove);
            }
          }
          auTargetID = makeIntoInstructionTarget(node);
          instructions[auTargetID] = TargetInstruction.normal(injectorId, parentInjectorId, providers, behaviorInstructions, expressions, elementInstruction);
        }
        if (elementInstruction && elementInstruction.skipContentProcessing) {
          return node.nextSibling;
        }
        var currentChild = node.firstChild;
        while (currentChild) {
          currentChild = this.compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
        }
      }
      return node.nextSibling;
    };
    var _ViewCompiler = ViewCompiler;
    ViewCompiler = _aureliaDependencyInjection.inject(BindingLanguage, ViewResources)(ViewCompiler) || ViewCompiler;
    return ViewCompiler;
  })();
  exports.ViewCompiler = ViewCompiler;
  var logger = _aureliaLogging.getLogger('templating');
  function ensureRegistryEntry(loader, urlOrRegistryEntry) {
    if (urlOrRegistryEntry instanceof _aureliaLoader.TemplateRegistryEntry) {
      return Promise.resolve(urlOrRegistryEntry);
    }
    return loader.loadTemplate(urlOrRegistryEntry);
  }
  var ProxyViewFactory = (function() {
    function ProxyViewFactory(promise) {
      var _this4 = this;
      _classCallCheck(this, ProxyViewFactory);
      promise.then(function(x) {
        return _this4.absorb(x);
      });
    }
    ProxyViewFactory.prototype.absorb = function absorb(factory) {
      this.create = factory.create.bind(factory);
    };
    return ProxyViewFactory;
  })();
  var ViewEngine = (function() {
    ViewEngine.inject = function inject() {
      return [_aureliaLoader.Loader, _aureliaDependencyInjection.Container, ViewCompiler, ModuleAnalyzer, ViewResources];
    };
    function ViewEngine(loader, container, viewCompiler, moduleAnalyzer, appResources) {
      _classCallCheck(this, ViewEngine);
      this.loader = loader;
      this.container = container;
      this.viewCompiler = viewCompiler;
      this.moduleAnalyzer = moduleAnalyzer;
      this.appResources = appResources;
      this._pluginMap = {};
    }
    ViewEngine.prototype.addResourcePlugin = function addResourcePlugin(extension, implementation) {
      var name = extension.replace('.', '') + '-resource-plugin';
      this._pluginMap[extension] = name;
      this.loader.addPlugin(name, implementation);
    };
    ViewEngine.prototype.enhance = function enhance(container, element, resources, bindingContext) {
      var instructions = {};
      this.viewCompiler.compileNode(element, resources, instructions, element.parentNode, 'root', true);
      var factory = new ViewFactory(element, instructions, resources);
      return factory.create(container, bindingContext, {enhance: true});
    };
    ViewEngine.prototype.loadViewFactory = function loadViewFactory(urlOrRegistryEntry, compileInstruction, loadContext) {
      var _this5 = this;
      loadContext = loadContext || new ResourceLoadContext();
      return ensureRegistryEntry(this.loader, urlOrRegistryEntry).then(function(viewRegistryEntry) {
        if (viewRegistryEntry.onReady) {
          if (loadContext.doesNotHaveDependency(urlOrRegistryEntry)) {
            loadContext.addDependency(urlOrRegistryEntry);
            return viewRegistryEntry.onReady;
          }
          return Promise.resolve(new ProxyViewFactory(viewRegistryEntry.onReady));
        }
        loadContext.addDependency(urlOrRegistryEntry);
        return viewRegistryEntry.onReady = _this5.loadTemplateResources(viewRegistryEntry, compileInstruction, loadContext).then(function(resources) {
          viewRegistryEntry.setResources(resources);
          var viewFactory = _this5.viewCompiler.compile(viewRegistryEntry.template, resources, compileInstruction);
          viewRegistryEntry.setFactory(viewFactory);
          return viewFactory;
        });
      });
    };
    ViewEngine.prototype.loadTemplateResources = function loadTemplateResources(viewRegistryEntry, compileInstruction, loadContext) {
      var resources = new ViewResources(this.appResources, viewRegistryEntry.address),
          dependencies = viewRegistryEntry.dependencies,
          importIds,
          names;
      compileInstruction = compileInstruction || ViewCompileInstruction.normal;
      if (dependencies.length === 0 && !compileInstruction.associatedModuleId) {
        return Promise.resolve(resources);
      }
      importIds = dependencies.map(function(x) {
        return x.src;
      });
      names = dependencies.map(function(x) {
        return x.name;
      });
      logger.debug('importing resources for ' + viewRegistryEntry.address, importIds);
      return this.importViewResources(importIds, names, resources, compileInstruction, loadContext);
    };
    ViewEngine.prototype.importViewModelResource = function importViewModelResource(moduleImport, moduleMember) {
      var _this6 = this;
      return this.loader.loadModule(moduleImport).then(function(viewModelModule) {
        var normalizedId = _aureliaMetadata.Origin.get(viewModelModule).moduleId,
            resourceModule = _this6.moduleAnalyzer.analyze(normalizedId, viewModelModule, moduleMember);
        if (!resourceModule.mainResource) {
          throw new Error('No view model found in module "' + moduleImport + '".');
        }
        resourceModule.analyze(_this6.container);
        return resourceModule.mainResource;
      });
    };
    ViewEngine.prototype.importViewResources = function importViewResources(moduleIds, names, resources, compileInstruction, loadContext) {
      var _this7 = this;
      loadContext = loadContext || new ResourceLoadContext();
      compileInstruction = compileInstruction || ViewCompileInstruction.normal;
      moduleIds = moduleIds.map(function(x) {
        return _this7._applyLoaderPlugin(x);
      });
      return this.loader.loadAllModules(moduleIds).then(function(imports) {
        var i,
            ii,
            analysis,
            normalizedId,
            current,
            associatedModule,
            container = _this7.container,
            moduleAnalyzer = _this7.moduleAnalyzer,
            allAnalysis = new Array(imports.length);
        for (i = 0, ii = imports.length; i < ii; ++i) {
          current = imports[i];
          normalizedId = _aureliaMetadata.Origin.get(current).moduleId;
          analysis = moduleAnalyzer.analyze(normalizedId, current);
          analysis.analyze(container);
          analysis.register(resources, names[i]);
          allAnalysis[i] = analysis;
        }
        if (compileInstruction.associatedModuleId) {
          associatedModule = moduleAnalyzer.getAnalysis(compileInstruction.associatedModuleId);
          if (associatedModule) {
            associatedModule.register(resources);
          }
        }
        for (i = 0, ii = allAnalysis.length; i < ii; ++i) {
          allAnalysis[i] = allAnalysis[i].load(container, loadContext);
        }
        return Promise.all(allAnalysis).then(function() {
          return resources;
        });
      });
    };
    ViewEngine.prototype._applyLoaderPlugin = function _applyLoaderPlugin(id) {
      var index = id.lastIndexOf('.');
      if (index !== -1) {
        var ext = id.substring(index);
        var pluginName = this._pluginMap[ext];
        if (pluginName === undefined) {
          return id;
        }
        return this.loader.applyPluginToUrl(id, pluginName);
      }
      return id;
    };
    return ViewEngine;
  })();
  exports.ViewEngine = ViewEngine;
  var BehaviorInstance = (function() {
    function BehaviorInstance(behavior, bindingContext, instruction) {
      _classCallCheck(this, BehaviorInstance);
      this.behavior = behavior;
      this.bindingContext = bindingContext;
      this.isAttached = false;
      var observerLookup = behavior.observerLocator.getOrCreateObserversLookup(bindingContext),
          handlesBind = behavior.handlesBind,
          attributes = instruction.attributes,
          boundProperties = this.boundProperties = [],
          properties = behavior.properties,
          i,
          ii;
      behavior.ensurePropertiesDefined(bindingContext, observerLookup);
      for (i = 0, ii = properties.length; i < ii; ++i) {
        properties[i].initialize(bindingContext, observerLookup, attributes, handlesBind, boundProperties);
      }
    }
    BehaviorInstance.createForUnitTest = function createForUnitTest(type, attributes, bindingContext) {
      var description = ResourceDescription.get(type);
      description.analyze(_aureliaDependencyInjection.Container.instance);
      var behaviorContext = _aureliaDependencyInjection.Container.instance.get(type);
      var behaviorInstance = new BehaviorInstance(description.metadata, behaviorContext, {attributes: attributes || {}});
      behaviorInstance.bind(bindingContext || {});
      return behaviorContext;
    };
    BehaviorInstance.prototype.created = function created(context) {
      if (this.behavior.handlesCreated) {
        this.bindingContext.created(context);
      }
    };
    BehaviorInstance.prototype.bind = function bind(context) {
      var skipSelfSubscriber = this.behavior.handlesBind,
          boundProperties = this.boundProperties,
          i,
          ii,
          x,
          observer,
          selfSubscriber;
      for (i = 0, ii = boundProperties.length; i < ii; ++i) {
        x = boundProperties[i];
        observer = x.observer;
        selfSubscriber = observer.selfSubscriber;
        observer.publishing = false;
        if (skipSelfSubscriber) {
          observer.selfSubscriber = null;
        }
        x.binding.bind(context);
        observer.call();
        observer.publishing = true;
        observer.selfSubscriber = selfSubscriber;
      }
      if (skipSelfSubscriber) {
        this.bindingContext.bind(context);
      }
      if (this.view) {
        this.view.bind(this.bindingContext);
      }
    };
    BehaviorInstance.prototype.unbind = function unbind() {
      var boundProperties = this.boundProperties,
          i,
          ii;
      if (this.view) {
        this.view.unbind();
      }
      if (this.behavior.handlesUnbind) {
        this.bindingContext.unbind();
      }
      for (i = 0, ii = boundProperties.length; i < ii; ++i) {
        boundProperties[i].binding.unbind();
      }
    };
    BehaviorInstance.prototype.attached = function attached() {
      if (this.isAttached) {
        return;
      }
      this.isAttached = true;
      if (this.behavior.handlesAttached) {
        this.bindingContext.attached();
      }
      if (this.view) {
        this.view.attached();
      }
    };
    BehaviorInstance.prototype.detached = function detached() {
      if (this.isAttached) {
        this.isAttached = false;
        if (this.view) {
          this.view.detached();
        }
        if (this.behavior.handlesDetached) {
          this.bindingContext.detached();
        }
      }
    };
    return BehaviorInstance;
  })();
  exports.BehaviorInstance = BehaviorInstance;
  function getObserver(behavior, instance, name) {
    var lookup = instance.__observers__;
    if (lookup === undefined) {
      lookup = behavior.observerLocator.getOrCreateObserversLookup(instance);
      behavior.ensurePropertiesDefined(instance, lookup);
    }
    return lookup[name];
  }
  var BindableProperty = (function() {
    function BindableProperty(nameOrConfig) {
      _classCallCheck(this, BindableProperty);
      if (typeof nameOrConfig === 'string') {
        this.name = nameOrConfig;
      } else {
        Object.assign(this, nameOrConfig);
      }
      this.attribute = this.attribute || hyphenate(this.name);
      this.defaultBindingMode = this.defaultBindingMode || _aureliaBinding.bindingMode.oneWay;
      this.changeHandler = this.changeHandler || null;
      this.owner = null;
    }
    BindableProperty.prototype.registerWith = function registerWith(target, behavior, descriptor) {
      behavior.properties.push(this);
      behavior.attributes[this.attribute] = this;
      this.owner = behavior;
      if (descriptor) {
        this.descriptor = descriptor;
        return this.configureDescriptor(behavior, descriptor);
      }
    };
    BindableProperty.prototype.configureDescriptor = function configureDescriptor(behavior, descriptor) {
      var name = this.name;
      descriptor.configurable = true;
      descriptor.enumerable = true;
      if ('initializer' in descriptor) {
        this.defaultValue = descriptor.initializer;
        delete descriptor.initializer;
        delete descriptor.writable;
      }
      if ('value' in descriptor) {
        this.defaultValue = descriptor.value;
        delete descriptor.value;
        delete descriptor.writable;
      }
      descriptor.get = function() {
        return getObserver(behavior, this, name).getValue();
      };
      descriptor.set = function(value) {
        getObserver(behavior, this, name).setValue(value);
      };
      descriptor.get.getObserver = function(obj) {
        return getObserver(behavior, obj, name);
      };
      return descriptor;
    };
    BindableProperty.prototype.defineOn = function defineOn(target, behavior) {
      var name = this.name,
          handlerName;
      if (this.changeHandler === null) {
        handlerName = name + 'Changed';
        if (handlerName in target.prototype) {
          this.changeHandler = handlerName;
        }
      }
      if (!this.descriptor) {
        Object.defineProperty(target.prototype, name, this.configureDescriptor(behavior, {}));
      }
    };
    BindableProperty.prototype.createObserver = function createObserver(bindingContext) {
      var selfSubscriber = null,
          defaultValue = this.defaultValue,
          changeHandlerName = this.changeHandler,
          name = this.name,
          initialValue;
      if (this.hasOptions) {
        return;
      }
      if (changeHandlerName in bindingContext) {
        if ('propertyChanged' in bindingContext) {
          selfSubscriber = function(newValue, oldValue) {
            bindingContext[changeHandlerName](newValue, oldValue);
            bindingContext.propertyChanged(name, newValue, oldValue);
          };
        } else {
          selfSubscriber = function(newValue, oldValue) {
            return bindingContext[changeHandlerName](newValue, oldValue);
          };
        }
      } else if ('propertyChanged' in bindingContext) {
        selfSubscriber = function(newValue, oldValue) {
          return bindingContext.propertyChanged(name, newValue, oldValue);
        };
      } else if (changeHandlerName !== null) {
        throw new Error('Change handler ' + changeHandlerName + ' was specified but not delcared on the class.');
      }
      if (defaultValue !== undefined) {
        initialValue = typeof defaultValue === 'function' ? defaultValue.call(bindingContext) : defaultValue;
      }
      return new BehaviorPropertyObserver(this.owner.taskQueue, bindingContext, this.name, selfSubscriber, initialValue);
    };
    BindableProperty.prototype.initialize = function initialize(bindingContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
      var selfSubscriber,
          observer,
          attribute,
          defaultValue = this.defaultValue;
      if (this.isDynamic) {
        for (var key in attributes) {
          this.createDynamicProperty(bindingContext, observerLookup, behaviorHandlesBind, key, attributes[key], boundProperties);
        }
      } else if (!this.hasOptions) {
        observer = observerLookup[this.name];
        if (attributes !== null) {
          selfSubscriber = observer.selfSubscriber;
          attribute = attributes[this.attribute];
          if (behaviorHandlesBind) {
            observer.selfSubscriber = null;
          }
          if (typeof attribute === 'string') {
            bindingContext[this.name] = attribute;
            observer.call();
          } else if (attribute) {
            boundProperties.push({
              observer: observer,
              binding: attribute.createBinding(bindingContext)
            });
          } else if (defaultValue !== undefined) {
            observer.call();
          }
          observer.selfSubscriber = selfSubscriber;
        }
        observer.publishing = true;
      }
    };
    BindableProperty.prototype.createDynamicProperty = function createDynamicProperty(bindingContext, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
      var changeHandlerName = name + 'Changed',
          selfSubscriber = null,
          observer,
          info;
      if (changeHandlerName in bindingContext) {
        if ('propertyChanged' in bindingContext) {
          selfSubscriber = function(newValue, oldValue) {
            bindingContext[changeHandlerName](newValue, oldValue);
            bindingContext.propertyChanged(name, newValue, oldValue);
          };
        } else {
          selfSubscriber = function(newValue, oldValue) {
            return bindingContext[changeHandlerName](newValue, oldValue);
          };
        }
      } else if ('propertyChanged' in bindingContext) {
        selfSubscriber = function(newValue, oldValue) {
          return bindingContext.propertyChanged(name, newValue, oldValue);
        };
      }
      observer = observerLookup[name] = new BehaviorPropertyObserver(this.owner.taskQueue, bindingContext, name, selfSubscriber);
      Object.defineProperty(bindingContext, name, {
        configurable: true,
        enumerable: true,
        get: observer.getValue.bind(observer),
        set: observer.setValue.bind(observer)
      });
      if (behaviorHandlesBind) {
        observer.selfSubscriber = null;
      }
      if (typeof attribute === 'string') {
        bindingContext[name] = attribute;
        observer.call();
      } else if (attribute) {
        info = {
          observer: observer,
          binding: attribute.createBinding(bindingContext)
        };
        boundProperties.push(info);
      }
      observer.publishing = true;
      observer.selfSubscriber = selfSubscriber;
    };
    return BindableProperty;
  })();
  exports.BindableProperty = BindableProperty;
  var BehaviorPropertyObserver = (function() {
    function BehaviorPropertyObserver(taskQueue, obj, propertyName, selfSubscriber, initialValue) {
      _classCallCheck(this, BehaviorPropertyObserver);
      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.notqueued = true;
      this.publishing = false;
      this.selfSubscriber = selfSubscriber;
      this.currentValue = this.oldValue = initialValue;
    }
    BehaviorPropertyObserver.prototype.getValue = function getValue() {
      return this.currentValue;
    };
    BehaviorPropertyObserver.prototype.setValue = function setValue(newValue) {
      var oldValue = this.currentValue;
      if (oldValue !== newValue) {
        if (this.publishing && this.notqueued) {
          this.notqueued = false;
          this.taskQueue.queueMicroTask(this);
        }
        this.oldValue = oldValue;
        this.currentValue = newValue;
      }
    };
    BehaviorPropertyObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.currentValue;
      this.notqueued = true;
      if (newValue !== oldValue) {
        if (this.selfSubscriber !== null) {
          this.selfSubscriber(newValue, oldValue);
        }
        while (i--) {
          callbacks[i](newValue, oldValue);
        }
        this.oldValue = newValue;
      }
    };
    BehaviorPropertyObserver.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.push(callback);
      return function() {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };
    return BehaviorPropertyObserver;
  })();
  var contentSelectorViewCreateInstruction = {
    suppressBind: true,
    enhance: false
  };
  function doProcessContent() {
    return true;
  }
  var HtmlBehaviorResource = (function() {
    function HtmlBehaviorResource() {
      _classCallCheck(this, HtmlBehaviorResource);
      this.elementName = null;
      this.attributeName = null;
      this.attributeDefaultBindingMode = undefined;
      this.liftsContent = false;
      this.targetShadowDOM = false;
      this.processContent = doProcessContent;
      this.usesShadowDOM = false;
      this.childBindings = null;
      this.hasDynamicOptions = false;
      this.containerless = false;
      this.properties = [];
      this.attributes = {};
    }
    HtmlBehaviorResource.convention = function convention(name, existing) {
      var behavior;
      if (name.endsWith('CustomAttribute')) {
        behavior = existing || new HtmlBehaviorResource();
        behavior.attributeName = hyphenate(name.substring(0, name.length - 15));
      }
      if (name.endsWith('CustomElement')) {
        behavior = existing || new HtmlBehaviorResource();
        behavior.elementName = hyphenate(name.substring(0, name.length - 13));
      }
      return behavior;
    };
    HtmlBehaviorResource.prototype.addChildBinding = function addChildBinding(behavior) {
      if (this.childBindings === null) {
        this.childBindings = [];
      }
      this.childBindings.push(behavior);
    };
    HtmlBehaviorResource.prototype.analyze = function analyze(container, target) {
      var proto = target.prototype,
          properties = this.properties,
          attributeName = this.attributeName,
          attributeDefaultBindingMode = this.attributeDefaultBindingMode,
          i,
          ii,
          current;
      this.observerLocator = container.get(_aureliaBinding.ObserverLocator);
      this.taskQueue = container.get(_aureliaTaskQueue.TaskQueue);
      this.target = target;
      this.usesShadowDOM = this.targetShadowDOM && hasShadowDOM;
      this.handlesCreated = 'created' in proto;
      this.handlesBind = 'bind' in proto;
      this.handlesUnbind = 'unbind' in proto;
      this.handlesAttached = 'attached' in proto;
      this.handlesDetached = 'detached' in proto;
      this.htmlName = this.elementName || this.attributeName;
      this.apiName = this.htmlName.replace(/-([a-z])/g, function(m, w) {
        return w.toUpperCase();
      });
      if (attributeName !== null) {
        if (properties.length === 0) {
          new BindableProperty({
            name: 'value',
            changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
            attribute: attributeName,
            defaultBindingMode: attributeDefaultBindingMode
          }).registerWith(target, this);
        }
        current = properties[0];
        if (properties.length === 1 && current.name === 'value') {
          current.isDynamic = current.hasOptions = this.hasDynamicOptions;
          current.defineOn(target, this);
        } else {
          for (i = 0, ii = properties.length; i < ii; ++i) {
            properties[i].defineOn(target, this);
          }
          current = new BindableProperty({
            name: 'value',
            changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
            attribute: attributeName,
            defaultBindingMode: attributeDefaultBindingMode
          });
          current.hasOptions = true;
          current.registerWith(target, this);
        }
      } else {
        for (i = 0, ii = properties.length; i < ii; ++i) {
          properties[i].defineOn(target, this);
        }
      }
    };
    HtmlBehaviorResource.prototype.load = function load(container, target, viewStrategy, transientView, loadContext) {
      var _this8 = this;
      var options;
      if (this.elementName !== null) {
        viewStrategy = viewStrategy || this.viewStrategy || ViewStrategy.getDefault(target);
        options = new ViewCompileInstruction(this.targetShadowDOM, true);
        if (!viewStrategy.moduleId) {
          viewStrategy.moduleId = _aureliaMetadata.Origin.get(target).moduleId;
        }
        return viewStrategy.loadViewFactory(container.get(ViewEngine), options, loadContext).then(function(viewFactory) {
          if (!transientView || !_this8.viewFactory) {
            _this8.viewFactory = viewFactory;
          }
          return viewFactory;
        });
      }
      return Promise.resolve(this);
    };
    HtmlBehaviorResource.prototype.register = function register(registry, name) {
      if (this.attributeName !== null) {
        registry.registerAttribute(name || this.attributeName, this, this.attributeName);
      }
      if (this.elementName !== null) {
        registry.registerElement(name || this.elementName, this);
      }
    };
    HtmlBehaviorResource.prototype.compile = function compile(compiler, resources, node, instruction, parentNode) {
      if (this.liftsContent) {
        if (!instruction.viewFactory) {
          var template = document.createElement('template'),
              fragment = document.createDocumentFragment(),
              cacheSize = node.getAttribute('view-cache'),
              part = node.getAttribute('part');
          node.removeAttribute(instruction.originalAttrName);
          replaceNode(template, node, parentNode);
          fragment.appendChild(node);
          instruction.viewFactory = compiler.compile(fragment, resources);
          if (part) {
            instruction.viewFactory.part = part;
            node.removeAttribute('part');
          }
          if (cacheSize) {
            instruction.viewFactory.setCacheSize(cacheSize);
            node.removeAttribute('view-cache');
          }
          node = template;
        }
      } else if (this.elementName !== null) {
        var partReplacements = instruction.partReplacements = {};
        if (this.processContent(compiler, resources, node, instruction) && node.hasChildNodes()) {
          if (this.usesShadowDOM) {
            var currentChild = node.firstChild,
                nextSibling,
                toReplace;
            while (currentChild) {
              nextSibling = currentChild.nextSibling;
              if (currentChild.tagName === 'TEMPLATE' && (toReplace = currentChild.getAttribute('replace-part'))) {
                partReplacements[toReplace] = compiler.compile(currentChild, resources);
                removeNode(currentChild, parentNode);
              }
              currentChild = nextSibling;
            }
            instruction.skipContentProcessing = false;
          } else {
            var fragment = document.createDocumentFragment(),
                currentChild = node.firstChild,
                nextSibling;
            while (currentChild) {
              nextSibling = currentChild.nextSibling;
              if (currentChild.tagName === 'TEMPLATE' && (toReplace = currentChild.getAttribute('replace-part'))) {
                partReplacements[toReplace] = compiler.compile(currentChild, resources);
                removeNode(currentChild, parentNode);
              } else {
                fragment.appendChild(currentChild);
              }
              currentChild = nextSibling;
            }
            instruction.contentFactory = compiler.compile(fragment, resources);
            instruction.skipContentProcessing = true;
          }
        } else {
          instruction.skipContentProcessing = true;
        }
      }
      return node;
    };
    HtmlBehaviorResource.prototype.create = function create(container, instruction, element, bindings) {
      var host = undefined;
      instruction = instruction || BehaviorInstruction.normal;
      element = element || null;
      bindings = bindings || null;
      if (this.elementName !== null && element) {
        if (this.usesShadowDOM) {
          host = element.createShadowRoot();
          container.registerInstance(DOMBoundary, host);
        } else {
          host = element;
          if (this.targetShadowDOM) {
            container.registerInstance(DOMBoundary, host);
          }
        }
      }
      var bindingContext = instruction.bindingContext || container.get(this.target),
          behaviorInstance = new BehaviorInstance(this, bindingContext, instruction),
          childBindings = this.childBindings,
          viewFactory = undefined;
      if (this.liftsContent) {
        element.primaryBehavior = behaviorInstance;
      } else if (this.elementName !== null) {
        viewFactory = instruction.viewFactory || this.viewFactory;
        container.viewModel = bindingContext;
        if (viewFactory) {
          behaviorInstance.view = viewFactory.create(container, bindingContext, instruction, element);
        }
        if (element) {
          element.primaryBehavior = behaviorInstance;
          if (behaviorInstance.view) {
            if (!this.usesShadowDOM) {
              if (instruction.contentFactory) {
                var contentView = instruction.contentFactory.create(container, null, contentSelectorViewCreateInstruction);
                ContentSelector.applySelectors(contentView, behaviorInstance.view.contentSelectors, function(contentSelector, group) {
                  return contentSelector.add(group);
                });
                behaviorInstance.contentView = contentView;
              }
            }
            if (instruction.anchorIsContainer) {
              if (childBindings !== null) {
                for (var i = 0,
                    ii = childBindings.length; i < ii; ++i) {
                  behaviorInstance.view.addBinding(childBindings[i].create(host, bindingContext));
                }
              }
              behaviorInstance.view.appendNodesTo(host);
            } else {
              behaviorInstance.view.insertNodesBefore(host);
            }
          } else if (childBindings !== null) {
            for (var i = 0,
                ii = childBindings.length; i < ii; ++i) {
              bindings.push(childBindings[i].create(element, bindingContext));
            }
          }
        } else if (behaviorInstance.view) {
          behaviorInstance.view.owner = behaviorInstance;
          if (childBindings !== null) {
            for (var i = 0,
                ii = childBindings.length; i < ii; ++i) {
              behaviorInstance.view.addBinding(childBindings[i].create(instruction.host, bindingContext));
            }
          }
        } else if (childBindings !== null) {
          for (var i = 0,
              ii = childBindings.length; i < ii; ++i) {
            bindings.push(childBindings[i].create(instruction.host, bindingContext));
          }
        }
      } else if (childBindings !== null) {
        for (var i = 0,
            ii = childBindings.length; i < ii; ++i) {
          bindings.push(childBindings[i].create(element, bindingContext));
        }
      }
      if (element) {
        if (!(this.apiName in element)) {
          element[this.apiName] = bindingContext;
        }
        if (!(this.htmlName in element)) {
          element[this.htmlName] = behaviorInstance;
        }
      }
      if (instruction.initiatedByBehavior && viewFactory) {
        behaviorInstance.view.created();
      }
      return behaviorInstance;
    };
    HtmlBehaviorResource.prototype.ensurePropertiesDefined = function ensurePropertiesDefined(instance, lookup) {
      var properties,
          i,
          ii,
          observer;
      if ('__propertiesDefined__' in lookup) {
        return;
      }
      lookup.__propertiesDefined__ = true;
      properties = this.properties;
      for (i = 0, ii = properties.length; i < ii; ++i) {
        observer = properties[i].createObserver(instance);
        if (observer !== undefined) {
          lookup[observer.propertyName] = observer;
        }
      }
    };
    return HtmlBehaviorResource;
  })();
  exports.HtmlBehaviorResource = HtmlBehaviorResource;
  var ResourceModule = (function() {
    function ResourceModule(moduleId) {
      _classCallCheck(this, ResourceModule);
      this.id = moduleId;
      this.moduleInstance = null;
      this.mainResource = null;
      this.resources = null;
      this.viewStrategy = null;
      this.isAnalyzed = false;
    }
    ResourceModule.prototype.analyze = function analyze(container) {
      var current = this.mainResource,
          resources = this.resources,
          viewStrategy = this.viewStrategy,
          i,
          ii;
      if (this.isAnalyzed) {
        return;
      }
      this.isAnalyzed = true;
      if (current) {
        current.metadata.viewStrategy = viewStrategy;
        current.analyze(container);
      }
      for (i = 0, ii = resources.length; i < ii; ++i) {
        current = resources[i];
        current.metadata.viewStrategy = viewStrategy;
        current.analyze(container);
      }
    };
    ResourceModule.prototype.register = function register(registry, name) {
      var i,
          ii,
          resources = this.resources;
      if (this.mainResource) {
        this.mainResource.register(registry, name);
        name = null;
      }
      for (i = 0, ii = resources.length; i < ii; ++i) {
        resources[i].register(registry, name);
        name = null;
      }
    };
    ResourceModule.prototype.load = function load(container, loadContext) {
      if (this.onLoaded) {
        return this.onLoaded;
      }
      var current = this.mainResource,
          resources = this.resources,
          i,
          ii,
          loads = [];
      if (current) {
        loads.push(current.load(container, loadContext));
      }
      for (i = 0, ii = resources.length; i < ii; ++i) {
        loads.push(resources[i].load(container, loadContext));
      }
      this.onLoaded = Promise.all(loads);
      return this.onLoaded;
    };
    return ResourceModule;
  })();
  exports.ResourceModule = ResourceModule;
  var ResourceDescription = (function() {
    function ResourceDescription(key, exportedValue, resourceTypeMeta) {
      _classCallCheck(this, ResourceDescription);
      if (!resourceTypeMeta) {
        resourceTypeMeta = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.resource, exportedValue);
        if (!resourceTypeMeta) {
          resourceTypeMeta = new HtmlBehaviorResource();
          resourceTypeMeta.elementName = hyphenate(key);
          _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, resourceTypeMeta, exportedValue);
        }
      }
      if (resourceTypeMeta instanceof HtmlBehaviorResource) {
        if (resourceTypeMeta.elementName === undefined) {
          resourceTypeMeta.elementName = hyphenate(key);
        } else if (resourceTypeMeta.attributeName === undefined) {
          resourceTypeMeta.attributeName = hyphenate(key);
        } else if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
          HtmlBehaviorResource.convention(key, resourceTypeMeta);
        }
      } else if (!resourceTypeMeta.name) {
        resourceTypeMeta.name = hyphenate(key);
      }
      this.metadata = resourceTypeMeta;
      this.value = exportedValue;
    }
    ResourceDescription.prototype.analyze = function analyze(container) {
      var metadata = this.metadata,
          value = this.value;
      if ('analyze' in metadata) {
        metadata.analyze(container, value);
      }
    };
    ResourceDescription.prototype.register = function register(registry, name) {
      this.metadata.register(registry, name);
    };
    ResourceDescription.prototype.load = function load(container, loadContext) {
      var metadata = this.metadata,
          value = this.value;
      if ('load' in metadata) {
        return metadata.load(container, value, null, null, loadContext);
      }
    };
    ResourceDescription.get = function get(resource) {
      var key = arguments.length <= 1 || arguments[1] === undefined ? 'custom-resource' : arguments[1];
      var resourceTypeMeta = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.resource, resource),
          resourceDescription;
      if (resourceTypeMeta) {
        if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
          HtmlBehaviorResource.convention(key, resourceTypeMeta);
        }
        if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
          resourceTypeMeta.elementName = hyphenate(key);
        }
        resourceDescription = new ResourceDescription(key, resource, resourceTypeMeta);
      } else {
        if (resourceTypeMeta = HtmlBehaviorResource.convention(key)) {
          resourceDescription = new ResourceDescription(key, resource, resourceTypeMeta);
          _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, resourceTypeMeta, resource);
        } else if (resourceTypeMeta = _aureliaBinding.ValueConverterResource.convention(key)) {
          resourceDescription = new ResourceDescription(key, resource, resourceTypeMeta);
          _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, resourceTypeMeta, resource);
        }
      }
      return resourceDescription;
    };
    return ResourceDescription;
  })();
  exports.ResourceDescription = ResourceDescription;
  var ModuleAnalyzer = (function() {
    function ModuleAnalyzer() {
      _classCallCheck(this, ModuleAnalyzer);
      this.cache = {};
    }
    ModuleAnalyzer.prototype.getAnalysis = function getAnalysis(moduleId) {
      return this.cache[moduleId];
    };
    ModuleAnalyzer.prototype.analyze = function analyze(moduleId, moduleInstance, viewModelMember) {
      var mainResource,
          fallbackValue,
          fallbackKey,
          resourceTypeMeta,
          key,
          exportedValue,
          resources = [],
          conventional,
          viewStrategy,
          resourceModule;
      resourceModule = this.cache[moduleId];
      if (resourceModule) {
        return resourceModule;
      }
      resourceModule = new ResourceModule(moduleId);
      this.cache[moduleId] = resourceModule;
      if (typeof moduleInstance === 'function') {
        moduleInstance = {'default': moduleInstance};
      }
      if (viewModelMember) {
        mainResource = new ResourceDescription(viewModelMember, moduleInstance[viewModelMember]);
      }
      for (key in moduleInstance) {
        exportedValue = moduleInstance[key];
        if (key === viewModelMember || typeof exportedValue !== 'function') {
          continue;
        }
        resourceTypeMeta = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.resource, exportedValue);
        if (resourceTypeMeta) {
          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            HtmlBehaviorResource.convention(key, resourceTypeMeta);
          }
          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            resourceTypeMeta.elementName = hyphenate(key);
          }
          if (!mainResource && resourceTypeMeta instanceof HtmlBehaviorResource && resourceTypeMeta.elementName !== null) {
            mainResource = new ResourceDescription(key, exportedValue, resourceTypeMeta);
          } else {
            resources.push(new ResourceDescription(key, exportedValue, resourceTypeMeta));
          }
        } else if (exportedValue instanceof ViewStrategy) {
          viewStrategy = exportedValue;
        } else if (exportedValue instanceof _aureliaLoader.TemplateRegistryEntry) {
          viewStrategy = new TemplateRegistryViewStrategy(moduleId, exportedValue);
        } else {
          if (conventional = HtmlBehaviorResource.convention(key)) {
            if (conventional.elementName !== null && !mainResource) {
              mainResource = new ResourceDescription(key, exportedValue, conventional);
            } else {
              resources.push(new ResourceDescription(key, exportedValue, conventional));
            }
            _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, conventional, exportedValue);
          } else if (conventional = _aureliaBinding.ValueConverterResource.convention(key)) {
            resources.push(new ResourceDescription(key, exportedValue, conventional));
            _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, conventional, exportedValue);
          } else if (!fallbackValue) {
            fallbackValue = exportedValue;
            fallbackKey = key;
          }
        }
      }
      if (!mainResource && fallbackValue) {
        mainResource = new ResourceDescription(fallbackKey, fallbackValue);
      }
      resourceModule.moduleInstance = moduleInstance;
      resourceModule.mainResource = mainResource;
      resourceModule.resources = resources;
      resourceModule.viewStrategy = viewStrategy;
      return resourceModule;
    };
    return ModuleAnalyzer;
  })();
  exports.ModuleAnalyzer = ModuleAnalyzer;
  var noMutations = [];
  var ChildObserver = (function() {
    function ChildObserver(config) {
      _classCallCheck(this, ChildObserver);
      this.name = config.name;
      this.changeHandler = config.changeHandler || this.name + 'Changed';
      this.selector = config.selector;
    }
    ChildObserver.prototype.create = function create(target, behavior) {
      return new ChildObserverBinder(this.selector, target, this.name, behavior, this.changeHandler);
    };
    return ChildObserver;
  })();
  exports.ChildObserver = ChildObserver;
  var ChildObserverBinder = (function() {
    function ChildObserverBinder(selector, target, property, behavior, changeHandler) {
      _classCallCheck(this, ChildObserverBinder);
      this.selector = selector;
      this.target = target;
      this.property = property;
      this.behavior = behavior;
      this.changeHandler = changeHandler in behavior ? changeHandler : null;
      this.observer = new MutationObserver(this.onChange.bind(this));
    }
    ChildObserverBinder.prototype.bind = function bind(source) {
      var items,
          results,
          i,
          ii,
          node,
          behavior = this.behavior;
      this.observer.observe(this.target, {
        childList: true,
        subtree: true
      });
      items = behavior[this.property];
      if (!items) {
        items = behavior[this.property] = [];
      } else {
        items.length = 0;
      }
      results = this.target.querySelectorAll(this.selector);
      for (i = 0, ii = results.length; i < ii; ++i) {
        node = results[i];
        items.push(node.primaryBehavior ? node.primaryBehavior.bindingContext : node);
      }
      if (this.changeHandler !== null) {
        this.behavior[this.changeHandler](noMutations);
      }
    };
    ChildObserverBinder.prototype.unbind = function unbind() {
      this.observer.disconnect();
    };
    ChildObserverBinder.prototype.onChange = function onChange(mutations) {
      var items = this.behavior[this.property],
          selector = this.selector;
      mutations.forEach(function(record) {
        var added = record.addedNodes,
            removed = record.removedNodes,
            prev = record.previousSibling,
            i,
            ii,
            primary,
            index,
            node;
        for (i = 0, ii = removed.length; i < ii; ++i) {
          node = removed[i];
          if (node.nodeType === 1 && node.matches(selector)) {
            primary = node.primaryBehavior ? node.primaryBehavior.bindingContext : node;
            index = items.indexOf(primary);
            if (index != -1) {
              items.splice(index, 1);
            }
          }
        }
        for (i = 0, ii = added.length; i < ii; ++i) {
          node = added[i];
          if (node.nodeType === 1 && node.matches(selector)) {
            primary = node.primaryBehavior ? node.primaryBehavior.bindingContext : node;
            index = 0;
            while (prev) {
              if (prev.nodeType === 1 && prev.matches(selector)) {
                index++;
              }
              prev = prev.previousSibling;
            }
            items.splice(index, 0, primary);
          }
        }
      });
      if (this.changeHandler !== null) {
        this.behavior[this.changeHandler](mutations);
      }
    };
    return ChildObserverBinder;
  })();
  exports.ChildObserverBinder = ChildObserverBinder;
  var CompositionEngine = (function() {
    CompositionEngine.inject = function inject() {
      return [ViewEngine];
    };
    function CompositionEngine(viewEngine) {
      _classCallCheck(this, CompositionEngine);
      this.viewEngine = viewEngine;
    }
    CompositionEngine.prototype.activate = function activate(instruction) {
      if (instruction.skipActivation || typeof instruction.viewModel.activate !== 'function') {
        return Promise.resolve();
      }
      return instruction.viewModel.activate(instruction.model) || Promise.resolve();
    };
    CompositionEngine.prototype.createBehaviorAndSwap = function createBehaviorAndSwap(instruction) {
      var _this9 = this;
      var removeResponse = instruction.viewSlot.removeAll(true);
      if (removeResponse instanceof Promise) {
        return removeResponse.then(function() {
          return _this9.createBehavior(instruction).then(function(behavior) {
            if (instruction.currentBehavior) {
              instruction.currentBehavior.unbind();
            }
            behavior.view.bind(behavior.bindingContext);
            instruction.viewSlot.add(behavior.view);
            return behavior;
          });
        });
      } else {
        return this.createBehavior(instruction).then(function(behavior) {
          if (instruction.currentBehavior) {
            instruction.currentBehavior.unbind();
          }
          behavior.view.bind(behavior.bindingContext);
          instruction.viewSlot.add(behavior.view);
          return behavior;
        });
      }
    };
    CompositionEngine.prototype.createBehavior = function createBehavior(instruction) {
      var childContainer = instruction.childContainer,
          viewModelResource = instruction.viewModelResource,
          viewModel = instruction.viewModel,
          metadata;
      return this.activate(instruction).then(function() {
        var doneLoading,
            viewStrategyFromViewModel,
            origin;
        if ('getViewStrategy' in viewModel && !instruction.view) {
          viewStrategyFromViewModel = true;
          instruction.view = ViewStrategy.normalize(viewModel.getViewStrategy());
        }
        if (instruction.view) {
          if (viewStrategyFromViewModel) {
            origin = _aureliaMetadata.Origin.get(viewModel.constructor);
            if (origin) {
              instruction.view.makeRelativeTo(origin.moduleId);
            }
          } else if (instruction.viewResources) {
            instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
          }
        }
        if (viewModelResource) {
          metadata = viewModelResource.metadata;
          doneLoading = metadata.load(childContainer, viewModelResource.value, instruction.view, true);
        } else {
          metadata = new HtmlBehaviorResource();
          metadata.elementName = 'dynamic-element';
          metadata.analyze(instruction.container || childContainer, viewModel.constructor);
          doneLoading = metadata.load(childContainer, viewModel.constructor, instruction.view, true).then(function(viewFactory) {
            return viewFactory;
          });
        }
        return doneLoading.then(function(viewFactory) {
          return metadata.create(childContainer, BehaviorInstruction.dynamic(instruction.host, viewModel, viewFactory));
        });
      });
    };
    CompositionEngine.prototype.createViewModel = function createViewModel(instruction) {
      var childContainer = instruction.childContainer || instruction.container.createChild();
      instruction.viewModel = instruction.viewResources ? instruction.viewResources.relativeToView(instruction.viewModel) : instruction.viewModel;
      return this.viewEngine.importViewModelResource(instruction.viewModel).then(function(viewModelResource) {
        childContainer.autoRegister(viewModelResource.value);
        if (instruction.host) {
          childContainer.registerInstance(Element, instruction.host);
        }
        instruction.viewModel = childContainer.viewModel = childContainer.get(viewModelResource.value);
        instruction.viewModelResource = viewModelResource;
        return instruction;
      });
    };
    CompositionEngine.prototype.compose = function compose(instruction) {
      var _this10 = this;
      instruction.childContainer = instruction.childContainer || instruction.container.createChild();
      instruction.view = ViewStrategy.normalize(instruction.view);
      if (instruction.viewModel) {
        if (typeof instruction.viewModel === 'string') {
          return this.createViewModel(instruction).then(function(instruction) {
            return _this10.createBehaviorAndSwap(instruction);
          });
        } else {
          return this.createBehaviorAndSwap(instruction);
        }
      } else if (instruction.view) {
        if (instruction.viewResources) {
          instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
        }
        return instruction.view.loadViewFactory(this.viewEngine, new ViewCompileInstruction()).then(function(viewFactory) {
          var removeResponse = instruction.viewSlot.removeAll(true);
          if (removeResponse instanceof Promise) {
            return removeResponse.then(function() {
              var result = viewFactory.create(instruction.childContainer, instruction.bindingContext);
              instruction.viewSlot.add(result);
              return result;
            });
          } else {
            var result = viewFactory.create(instruction.childContainer, instruction.bindingContext);
            instruction.viewSlot.add(result);
            return result;
          }
        });
      } else if (instruction.viewSlot) {
        instruction.viewSlot.removeAll();
        return Promise.resolve(null);
      }
    };
    return CompositionEngine;
  })();
  exports.CompositionEngine = CompositionEngine;
  var ElementConfigResource = (function() {
    function ElementConfigResource() {
      _classCallCheck(this, ElementConfigResource);
    }
    ElementConfigResource.prototype.load = function load(container, target) {
      var config = new target(),
          eventManager = container.get(_aureliaBinding.EventManager);
      eventManager.registerElementConfig(config);
      return Promise.resolve(this);
    };
    ElementConfigResource.prototype.register = function register() {};
    return ElementConfigResource;
  })();
  exports.ElementConfigResource = ElementConfigResource;
  function validateBehaviorName(name, type) {
    if (/[A-Z]/.test(name)) {
      throw new Error('\'' + name + '\' is not a valid ' + type + ' name.  Upper-case letters are not allowed because the DOM is not case-sensitive.');
    }
  }
  function resource(instance) {
    return function(target) {
      _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, instance, target);
    };
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('resource', resource);
  function behavior(override) {
    return function(target) {
      if (override instanceof HtmlBehaviorResource) {
        _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, override, target);
      } else {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
        Object.assign(resource, override);
      }
    };
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('behavior', behavior);
  function customElement(name) {
    validateBehaviorName(name, 'custom element');
    return function(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
      resource.elementName = name;
    };
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('customElement', customElement);
  function customAttribute(name, defaultBindingMode) {
    validateBehaviorName(name, 'custom attribute');
    return function(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
      resource.attributeName = name;
      resource.attributeDefaultBindingMode = defaultBindingMode;
    };
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('customAttribute', customAttribute);
  function templateController(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
      resource.liftsContent = true;
    };
    return target ? deco(target) : deco;
  }
  _aureliaMetadata.Decorators.configure.simpleDecorator('templateController', templateController);
  function bindable(nameOrConfigOrTarget, key, descriptor) {
    var deco = function deco(target, key, descriptor) {
      var actualTarget = key ? target.constructor : target,
          resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, actualTarget),
          prop;
      if (key) {
        nameOrConfigOrTarget = nameOrConfigOrTarget || {};
        nameOrConfigOrTarget.name = key;
      }
      prop = new BindableProperty(nameOrConfigOrTarget);
      return prop.registerWith(actualTarget, resource, descriptor);
    };
    if (!nameOrConfigOrTarget) {
      return deco;
    }
    if (key) {
      var target = nameOrConfigOrTarget;
      nameOrConfigOrTarget = null;
      return deco(target, key, descriptor);
    }
    return deco;
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('bindable', bindable);
  function dynamicOptions(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
      resource.hasDynamicOptions = true;
    };
    return target ? deco(target) : deco;
  }
  _aureliaMetadata.Decorators.configure.simpleDecorator('dynamicOptions', dynamicOptions);
  function sync(selectorOrConfig) {
    return function(target, key, descriptor) {
      var actualTarget = key ? target.constructor : target,
          resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, actualTarget);
      if (typeof selectorOrConfig === 'string') {
        selectorOrConfig = {
          selector: selectorOrConfig,
          name: key
        };
      }
      resource.addChildBinding(new ChildObserver(selectorOrConfig));
    };
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('sync', sync);
  function useShadowDOM(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
      resource.targetShadowDOM = true;
    };
    return target ? deco(target) : deco;
  }
  _aureliaMetadata.Decorators.configure.simpleDecorator('useShadowDOM', useShadowDOM);
  function doNotProcessContent() {
    return false;
  }
  function skipContentProcessing(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
      resource.processContent = doNotProcessContent;
      console.warn('The @skipContentProcessing decorator is deprecated and will be removed in a future release. Please use @processContent(false) instead.');
    };
    return target ? deco(target) : deco;
  }
  _aureliaMetadata.Decorators.configure.simpleDecorator('skipContentProcessing', skipContentProcessing);
  function processContent(processor) {
    return function(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
      resource.processContent = processor || doNotProcessContent;
    };
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('processContent', processContent);
  function containerless(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, HtmlBehaviorResource, target);
      resource.containerless = true;
    };
    return target ? deco(target) : deco;
  }
  _aureliaMetadata.Decorators.configure.simpleDecorator('containerless', containerless);
  function viewStrategy(strategy) {
    return function(target) {
      _aureliaMetadata.Metadata.define(ViewStrategy.metadataKey, strategy, target);
    };
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('viewStrategy', useView);
  function useView(path) {
    return viewStrategy(new UseViewStrategy(path));
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('useView', useView);
  function inlineView(markup, dependencies, dependencyBaseUrl) {
    return viewStrategy(new InlineViewStrategy(markup, dependencies, dependencyBaseUrl));
  }
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('inlineView', inlineView);
  function noView(target) {
    var deco = function deco(target) {
      _aureliaMetadata.Metadata.define(ViewStrategy.metadataKey, new NoViewStrategy(), target);
    };
    return target ? deco(target) : deco;
  }
  _aureliaMetadata.Decorators.configure.simpleDecorator('noView', noView);
  function elementConfig(target) {
    var deco = function deco(target) {
      _aureliaMetadata.Metadata.define(_aureliaMetadata.Metadata.resource, new ElementConfigResource(), target);
    };
    return target ? deco(target) : deco;
  }
  _aureliaMetadata.Decorators.configure.simpleDecorator('elementConfig', elementConfig);
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/templating@0.15.3", ["github:aurelia/templating@0.15.3/aurelia-templating"], function(main) {
  return main;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/framework@0.16.0/aurelia-framework", ["exports", "npm:core-js@0.9.18", "github:aurelia/logging@0.7.0", "github:aurelia/templating@0.15.3", "github:aurelia/path@0.9.0", "github:aurelia/dependency-injection@0.10.1", "github:aurelia/loader@0.9.0", "github:aurelia/binding@0.9.1", "github:aurelia/metadata@0.8.0", "github:aurelia/task-queue@0.7.0"], function(exports, _coreJs, _aureliaLogging, _aureliaTemplating, _aureliaPath, _aureliaDependencyInjection, _aureliaLoader, _aureliaBinding, _aureliaMetadata, _aureliaTaskQueue) {
  'use strict';
  exports.__esModule = true;
  function _interopExportWildcard(obj, defaults) {
    var newObj = defaults({}, obj);
    delete newObj['default'];
    return newObj;
  }
  function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = Object.getOwnPropertyDescriptor(defaults, key);
      if (value && value.configurable && obj[key] === undefined) {
        Object.defineProperty(obj, key, value);
      }
    }
    return obj;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  var logger = _aureliaLogging.getLogger('aurelia');
  function runTasks(config, tasks) {
    var current = undefined;
    var next = function next() {
      if (current = tasks.shift()) {
        return Promise.resolve(current(config)).then(next);
      }
      return Promise.resolve();
    };
    return next();
  }
  function loadPlugin(config, loader, info) {
    logger.debug('Loading plugin ' + info.moduleId + '.');
    config.resourcesRelativeTo = info.resourcesRelativeTo;
    return loader.loadModule(info.moduleId).then(function(m) {
      if ('configure' in m) {
        return Promise.resolve(m.configure(config, info.config || {})).then(function() {
          config.resourcesRelativeTo = null;
          logger.debug('Configured plugin ' + info.moduleId + '.');
        });
      }
      config.resourcesRelativeTo = null;
      logger.debug('Loaded plugin ' + info.moduleId + '.');
    });
  }
  function loadResources(container, resourcesToLoad, appResources) {
    var viewEngine = container.get(_aureliaTemplating.ViewEngine);
    var importIds = Object.keys(resourcesToLoad);
    var names = new Array(importIds.length);
    for (var i = 0,
        ii = importIds.length; i < ii; ++i) {
      names[i] = resourcesToLoad[importIds[i]];
    }
    return viewEngine.importViewResources(importIds, names, appResources);
  }
  function assertProcessed(plugins) {
    if (plugins.processed) {
      throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
    }
  }
  var FrameworkConfiguration = (function() {
    function FrameworkConfiguration(aurelia) {
      var _this = this;
      _classCallCheck(this, FrameworkConfiguration);
      this.aurelia = aurelia;
      this.container = aurelia.container;
      this.info = [];
      this.processed = false;
      this.preTasks = [];
      this.postTasks = [];
      this.resourcesToLoad = {};
      this.preTask(function() {
        return System.normalize('aurelia-bootstrapper').then(function(bootstrapperName) {
          return _this.bootstrapperName = bootstrapperName;
        });
      });
      this.postTask(function() {
        return loadResources(aurelia.container, _this.resourcesToLoad, aurelia.resources);
      });
    }
    FrameworkConfiguration.prototype.instance = function instance(type, _instance) {
      this.container.registerInstance(type, _instance);
      return this;
    };
    FrameworkConfiguration.prototype.singleton = function singleton(type, implementation) {
      this.container.registerSingleton(type, implementation);
      return this;
    };
    FrameworkConfiguration.prototype.transient = function transient(type, implementation) {
      this.container.registerTransient(type, implementation);
      return this;
    };
    FrameworkConfiguration.prototype.preTask = function preTask(task) {
      assertProcessed(this);
      this.preTasks.push(task);
      return this;
    };
    FrameworkConfiguration.prototype.postTask = function postTask(task) {
      assertProcessed(this);
      this.postTasks.push(task);
      return this;
    };
    FrameworkConfiguration.prototype.feature = function feature(plugin, config) {
      plugin = plugin.endsWith('.js') || plugin.endsWith('.ts') ? plugin.substring(0, plugin.length - 3) : plugin;
      return this.plugin({
        moduleId: plugin + '/index',
        resourcesRelativeTo: plugin,
        config: config || {}
      });
    };
    FrameworkConfiguration.prototype.globalResources = function globalResources(resources) {
      assertProcessed(this);
      var toAdd = Array.isArray(resources) ? resources : arguments;
      var resource = undefined;
      var path = undefined;
      var resourcesRelativeTo = this.resourcesRelativeTo || '';
      for (var i = 0,
          ii = toAdd.length; i < ii; ++i) {
        resource = toAdd[i];
        if (typeof resource !== 'string') {
          throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
        }
        path = _aureliaPath.join(resourcesRelativeTo, resource);
        this.resourcesToLoad[path] = this.resourcesToLoad[path];
      }
      return this;
    };
    FrameworkConfiguration.prototype.globalName = function globalName(resourcePath, newName) {
      assertProcessed(this);
      this.resourcesToLoad[resourcePath] = newName;
      return this;
    };
    FrameworkConfiguration.prototype.plugin = function plugin(_plugin, config) {
      assertProcessed(this);
      if (typeof _plugin === 'string') {
        _plugin = _plugin.endsWith('.js') || _plugin.endsWith('.ts') ? _plugin.substring(0, _plugin.length - 3) : _plugin;
        return this.plugin({
          moduleId: _plugin,
          resourcesRelativeTo: _plugin,
          config: config || {}
        });
      }
      this.info.push(_plugin);
      return this;
    };
    FrameworkConfiguration.prototype._addNormalizedPlugin = function _addNormalizedPlugin(name, config) {
      var _this2 = this;
      var plugin = {
        moduleId: name,
        resourcesRelativeTo: name,
        config: config || {}
      };
      this.plugin(plugin);
      this.preTask(function() {
        return System.normalize(name, _this2.bootstrapperName).then(function(normalizedName) {
          normalizedName = normalizedName.endsWith('.js') || normalizedName.endsWith('.ts') ? normalizedName.substring(0, normalizedName.length - 3) : normalizedName;
          plugin.moduleId = normalizedName;
          plugin.resourcesRelativeTo = normalizedName;
          System.map[name] = normalizedName;
        });
      });
      return this;
    };
    FrameworkConfiguration.prototype.defaultBindingLanguage = function defaultBindingLanguage() {
      return this._addNormalizedPlugin('aurelia-templating-binding');
    };
    FrameworkConfiguration.prototype.router = function router() {
      return this._addNormalizedPlugin('aurelia-templating-router');
    };
    FrameworkConfiguration.prototype.history = function history() {
      return this._addNormalizedPlugin('aurelia-history-browser');
    };
    FrameworkConfiguration.prototype.defaultResources = function defaultResources() {
      return this._addNormalizedPlugin('aurelia-templating-resources');
    };
    FrameworkConfiguration.prototype.eventAggregator = function eventAggregator() {
      return this._addNormalizedPlugin('aurelia-event-aggregator');
    };
    FrameworkConfiguration.prototype.standardConfiguration = function standardConfiguration() {
      return this.defaultBindingLanguage().defaultResources().history().router().eventAggregator();
    };
    FrameworkConfiguration.prototype.developmentLogging = function developmentLogging() {
      var _this3 = this;
      this.preTask(function() {
        return System.normalize('aurelia-logging-console', _this3.bootstrapperName).then(function(name) {
          return _this3.aurelia.loader.loadModule(name).then(function(m) {
            _aureliaLogging.addAppender(new m.ConsoleAppender());
            _aureliaLogging.setLevel(_aureliaLogging.logLevel.debug);
          });
        });
      });
      return this;
    };
    FrameworkConfiguration.prototype.apply = function apply() {
      var _this4 = this;
      if (this.processed) {
        return Promise.resolve();
      }
      return runTasks(this, this.preTasks).then(function() {
        var loader = _this4.aurelia.loader;
        var info = _this4.info;
        var current = undefined;
        var next = function next() {
          if (current = info.shift()) {
            return loadPlugin(_this4, loader, current).then(next);
          }
          _this4.processed = true;
          return Promise.resolve();
        };
        return next().then(function() {
          return runTasks(_this4, _this4.postTasks);
        });
      });
    };
    return FrameworkConfiguration;
  })();
  exports.FrameworkConfiguration = FrameworkConfiguration;
  if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
    var _CustomEvent = function _CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    _CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = _CustomEvent;
  }
  function preventActionlessFormSubmit() {
    document.body.addEventListener('submit', function(evt) {
      var target = evt.target;
      var action = target.action;
      if (target.tagName.toLowerCase() === 'form' && !action) {
        evt.preventDefault();
      }
    });
  }
  var Aurelia = (function() {
    function Aurelia(loader, container, resources) {
      _classCallCheck(this, Aurelia);
      this.loader = loader || new window.AureliaLoader();
      this.container = container || new _aureliaDependencyInjection.Container();
      this.resources = resources || new _aureliaTemplating.ViewResources();
      this.use = new FrameworkConfiguration(this);
      this.logger = _aureliaLogging.getLogger('aurelia');
      this.hostConfigured = false;
      this.host = null;
      this.use.instance(Aurelia, this);
      this.use.instance(_aureliaLoader.Loader, this.loader);
      this.use.instance(_aureliaTemplating.ViewResources, this.resources);
      this.container.makeGlobal();
    }
    Aurelia.prototype.start = function start() {
      var _this5 = this;
      if (this.started) {
        return Promise.resolve(this);
      }
      this.started = true;
      this.logger.info('Aurelia Starting');
      return this.use.apply().then(function() {
        preventActionlessFormSubmit();
        if (!_this5.container.hasHandler(_aureliaTemplating.BindingLanguage)) {
          var message = 'You must configure Aurelia with a BindingLanguage implementation.';
          _this5.logger.error(message);
          throw new Error(message);
        }
        if (!_this5.container.hasHandler(_aureliaTemplating.Animator)) {
          _aureliaTemplating.Animator.configureDefault(_this5.container);
        }
        _this5.logger.info('Aurelia Started');
        var evt = new window.CustomEvent('aurelia-started', {
          bubbles: true,
          cancelable: true
        });
        document.dispatchEvent(evt);
        return _this5;
      });
    };
    Aurelia.prototype.enhance = function enhance() {
      var _this6 = this;
      var bindingContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var applicationHost = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      this._configureHost(applicationHost);
      return new Promise(function(resolve) {
        var viewEngine = _this6.container.get(_aureliaTemplating.ViewEngine);
        _this6.root = viewEngine.enhance(_this6.container, _this6.host, _this6.resources, bindingContext);
        _this6.root.attached();
        _this6._onAureliaComposed();
        return _this6;
      });
    };
    Aurelia.prototype.setRoot = function setRoot() {
      var _this7 = this;
      var root = arguments.length <= 0 || arguments[0] === undefined ? 'app' : arguments[0];
      var applicationHost = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var compositionEngine = undefined;
      var instruction = {};
      this._configureHost(applicationHost);
      compositionEngine = this.container.get(_aureliaTemplating.CompositionEngine);
      instruction.viewModel = root;
      instruction.container = instruction.childContainer = this.container;
      instruction.viewSlot = this.hostSlot;
      instruction.host = this.host;
      return compositionEngine.compose(instruction).then(function(r) {
        _this7.root = r;
        instruction.viewSlot.attached();
        _this7._onAureliaComposed();
        return _this7;
      });
    };
    Aurelia.prototype._configureHost = function _configureHost(applicationHost) {
      if (this.hostConfigured) {
        return;
      }
      applicationHost = applicationHost || this.host;
      if (!applicationHost || typeof applicationHost === 'string') {
        this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
      } else {
        this.host = applicationHost;
      }
      this.hostConfigured = true;
      this.host.aurelia = this;
      this.hostSlot = new _aureliaTemplating.ViewSlot(this.host, true);
      this.hostSlot.transformChildNodesIntoView();
      this.container.registerInstance(_aureliaTemplating.DOMBoundary, this.host);
    };
    Aurelia.prototype._onAureliaComposed = function _onAureliaComposed() {
      var evt = new window.CustomEvent('aurelia-composed', {
        bubbles: true,
        cancelable: true
      });
      setTimeout(function() {
        return document.dispatchEvent(evt);
      }, 1);
    };
    return Aurelia;
  })();
  exports.Aurelia = Aurelia;
  _defaults(exports, _interopExportWildcard(_aureliaDependencyInjection, _defaults));
  _defaults(exports, _interopExportWildcard(_aureliaBinding, _defaults));
  _defaults(exports, _interopExportWildcard(_aureliaMetadata, _defaults));
  _defaults(exports, _interopExportWildcard(_aureliaTemplating, _defaults));
  _defaults(exports, _interopExportWildcard(_aureliaLoader, _defaults));
  _defaults(exports, _interopExportWildcard(_aureliaTaskQueue, _defaults));
  _defaults(exports, _interopExportWildcard(_aureliaPath, _defaults));
  var LogManager = _aureliaLogging;
  exports.LogManager = LogManager;
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/framework@0.16.0", ["github:aurelia/framework@0.16.0/aurelia-framework"], function(main) {
  return main;
});

_removeDefine();
})();
System.register("blur-image", ["github:aurelia/framework@0.16.0"], function(_export) {
  "use strict";
  var inject,
      BlurImageCustomAttribute,
      mul_table,
      shg_table,
      BLUR_RADIUS;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function stackBlurCanvasRGBA(canvas, top_x, top_y, width, height, radius) {
    if (isNaN(radius) || radius < 1)
      return;
    radius |= 0;
    var context = canvas.getContext("2d");
    var imageData;
    try {
      imageData = context.getImageData(top_x, top_y, width, height);
    } catch (e) {
      throw new Error("unable to access image data: " + e);
    }
    var pixels = imageData.data;
    var x,
        y,
        i,
        p,
        yp,
        yi,
        yw,
        r_sum,
        g_sum,
        b_sum,
        a_sum,
        r_out_sum,
        g_out_sum,
        b_out_sum,
        a_out_sum,
        r_in_sum,
        g_in_sum,
        b_in_sum,
        a_in_sum,
        pr,
        pg,
        pb,
        pa,
        rbs;
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    var stackStart = new BlurStack();
    var stack = stackStart;
    for (i = 1; i < div; i++) {
      stack = stack.next = new BlurStack();
      if (i == radiusPlus1)
        var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    yw = yi = 0;
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    for (y = 0; y < height; y++) {
      r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
      r_out_sum = radiusPlus1 * (pr = pixels[yi]);
      g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
      b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
      a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
      r_sum += sumFactor * pr;
      g_sum += sumFactor * pg;
      b_sum += sumFactor * pb;
      a_sum += sumFactor * pa;
      stack = stackStart;
      for (i = 0; i < radiusPlus1; i++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      }
      for (i = 1; i < radiusPlus1; i++) {
        p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
        r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
        g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
        b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
        a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
        r_in_sum += pr;
        g_in_sum += pg;
        b_in_sum += pb;
        a_in_sum += pa;
        stack = stack.next;
      }
      stackIn = stackStart;
      stackOut = stackEnd;
      for (x = 0; x < width; x++) {
        pixels[yi + 3] = pa = a_sum * mul_sum >> shg_sum;
        if (pa != 0) {
          pa = 255 / pa;
          pixels[yi] = (r_sum * mul_sum >> shg_sum) * pa;
          pixels[yi + 1] = (g_sum * mul_sum >> shg_sum) * pa;
          pixels[yi + 2] = (b_sum * mul_sum >> shg_sum) * pa;
        } else {
          pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
        }
        r_sum -= r_out_sum;
        g_sum -= g_out_sum;
        b_sum -= b_out_sum;
        a_sum -= a_out_sum;
        r_out_sum -= stackIn.r;
        g_out_sum -= stackIn.g;
        b_out_sum -= stackIn.b;
        a_out_sum -= stackIn.a;
        p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
        r_in_sum += stackIn.r = pixels[p];
        g_in_sum += stackIn.g = pixels[p + 1];
        b_in_sum += stackIn.b = pixels[p + 2];
        a_in_sum += stackIn.a = pixels[p + 3];
        r_sum += r_in_sum;
        g_sum += g_in_sum;
        b_sum += b_in_sum;
        a_sum += a_in_sum;
        stackIn = stackIn.next;
        r_out_sum += pr = stackOut.r;
        g_out_sum += pg = stackOut.g;
        b_out_sum += pb = stackOut.b;
        a_out_sum += pa = stackOut.a;
        r_in_sum -= pr;
        g_in_sum -= pg;
        b_in_sum -= pb;
        a_in_sum -= pa;
        stackOut = stackOut.next;
        yi += 4;
      }
      yw += width;
    }
    for (x = 0; x < width; x++) {
      g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
      yi = x << 2;
      r_out_sum = radiusPlus1 * (pr = pixels[yi]);
      g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
      b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
      a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
      r_sum += sumFactor * pr;
      g_sum += sumFactor * pg;
      b_sum += sumFactor * pb;
      a_sum += sumFactor * pa;
      stack = stackStart;
      for (i = 0; i < radiusPlus1; i++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      }
      yp = width;
      for (i = 1; i <= radius; i++) {
        yi = yp + x << 2;
        r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
        g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
        b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
        a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
        r_in_sum += pr;
        g_in_sum += pg;
        b_in_sum += pb;
        a_in_sum += pa;
        stack = stack.next;
        if (i < heightMinus1) {
          yp += width;
        }
      }
      yi = x;
      stackIn = stackStart;
      stackOut = stackEnd;
      for (y = 0; y < height; y++) {
        p = yi << 2;
        pixels[p + 3] = pa = a_sum * mul_sum >> shg_sum;
        if (pa > 0) {
          pa = 255 / pa;
          pixels[p] = (r_sum * mul_sum >> shg_sum) * pa;
          pixels[p + 1] = (g_sum * mul_sum >> shg_sum) * pa;
          pixels[p + 2] = (b_sum * mul_sum >> shg_sum) * pa;
        } else {
          pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
        }
        r_sum -= r_out_sum;
        g_sum -= g_out_sum;
        b_sum -= b_out_sum;
        a_sum -= a_out_sum;
        r_out_sum -= stackIn.r;
        g_out_sum -= stackIn.g;
        b_out_sum -= stackIn.b;
        a_out_sum -= stackIn.a;
        p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
        r_sum += r_in_sum += stackIn.r = pixels[p];
        g_sum += g_in_sum += stackIn.g = pixels[p + 1];
        b_sum += b_in_sum += stackIn.b = pixels[p + 2];
        a_sum += a_in_sum += stackIn.a = pixels[p + 3];
        stackIn = stackIn.next;
        r_out_sum += pr = stackOut.r;
        g_out_sum += pg = stackOut.g;
        b_out_sum += pb = stackOut.b;
        a_out_sum += pa = stackOut.a;
        r_in_sum -= pr;
        g_in_sum -= pg;
        b_in_sum -= pb;
        a_in_sum -= pa;
        stackOut = stackOut.next;
        yi += width;
      }
    }
    context.putImageData(imageData, top_x, top_y);
  }
  function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  }
  function drawBlur(canvas, image) {
    var w = canvas.width;
    var h = canvas.height;
    var canvasContext = canvas.getContext('2d');
    canvasContext.drawImage(image, 0, 0, w, h);
    stackBlurCanvasRGBA(canvas, 0, 0, w, h, BLUR_RADIUS);
  }
  return {
    setters: [function(_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }],
    execute: function() {
      BlurImageCustomAttribute = (function() {
        function BlurImageCustomAttribute(element) {
          _classCallCheck(this, _BlurImageCustomAttribute);
          this.element = element;
        }
        _createClass(BlurImageCustomAttribute, [{
          key: "valueChanged",
          value: function valueChanged(newImage) {
            var _this = this;
            if (newImage.complete) {
              drawBlur(this.element, newImage);
            } else {
              newImage.onload = function() {
                return drawBlur(_this.element, newImage);
              };
            }
          }
        }]);
        var _BlurImageCustomAttribute = BlurImageCustomAttribute;
        BlurImageCustomAttribute = inject(Element)(BlurImageCustomAttribute) || BlurImageCustomAttribute;
        return BlurImageCustomAttribute;
      })();
      _export("BlurImageCustomAttribute", BlurImageCustomAttribute);
      mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
      shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
      BLUR_RADIUS = 40;
      ;
    }
  };
});

System.register("child-router", [], function(_export) {
  'use strict';
  var ChildRouter;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  return {
    setters: [],
    execute: function() {
      ChildRouter = (function() {
        function ChildRouter() {
          _classCallCheck(this, ChildRouter);
          this.heading = 'Child Router';
        }
        _createClass(ChildRouter, [{
          key: 'configureRouter',
          value: function configureRouter(config, router) {
            config.map([{
              route: ['', 'welcome'],
              name: 'welcome',
              moduleId: 'welcome',
              nav: true,
              title: 'Welcome'
            }, {
              route: 'users',
              name: 'users',
              moduleId: 'users',
              nav: true,
              title: 'Github Users'
            }, {
              route: 'child-router',
              name: 'child-router',
              moduleId: 'child-router',
              nav: true,
              title: 'Child Router'
            }]);
            this.router = router;
          }
        }]);
        return ChildRouter;
      })();
      _export('ChildRouter', ChildRouter);
    }
  };
});

System.registerDynamic("child-router.html!github:systemjs/plugin-text@0.0.2", [], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = "<template>\n  <section class=\"au-animate\">\n    <h2>${heading}</h2>\n    <div>\n      <div class=\"col-md-2\">\n        <ul class=\"well nav nav-pills nav-stacked\">\n          <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n            <a href.bind=\"row.href\">${row.title}</a>\n          </li>\n        </ul>\n      </div>\n      <div class=\"col-md-10\" style=\"padding: 0\">\n        <router-view></router-view>\n      </div>\n    </div>\n  </section>\n</template>\n";
  global.define = __define;
  return module.exports;
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ? factory(global, true) : function(w) {
      if (!w.document) {
        throw new Error("jQuery requires a window with a document");
      }
      return factory(w);
    };
  } else {
    factory(global);
  }
}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  var arr = [];
  var slice = arr.slice;
  var concat = arr.concat;
  var push = arr.push;
  var indexOf = arr.indexOf;
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  var support = {};
  var document = window.document,
      version = "2.1.4",
      jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
      },
      rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      rmsPrefix = /^-ms-/,
      rdashAlpha = /-([\da-z])/gi,
      fcamelCase = function(all, letter) {
        return letter.toUpperCase();
      };
  jQuery.fn = jQuery.prototype = {
    jquery: version,
    constructor: jQuery,
    selector: "",
    length: 0,
    toArray: function() {
      return slice.call(this);
    },
    get: function(num) {
      return num != null ? (num < 0 ? this[num + this.length] : this[num]) : slice.call(this);
    },
    pushStack: function(elems) {
      var ret = jQuery.merge(this.constructor(), elems);
      ret.prevObject = this;
      ret.context = this.context;
      return ret;
    },
    each: function(callback, args) {
      return jQuery.each(this, callback, args);
    },
    map: function(callback) {
      return this.pushStack(jQuery.map(this, function(elem, i) {
        return callback.call(elem, i, elem);
      }));
    },
    slice: function() {
      return this.pushStack(slice.apply(this, arguments));
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    eq: function(i) {
      var len = this.length,
          j = +i + (i < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },
    end: function() {
      return this.prevObject || this.constructor(null);
    },
    push: push,
    sort: arr.sort,
    splice: arr.splice
  };
  jQuery.extend = jQuery.fn.extend = function() {
    var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];
            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }
            target[name] = jQuery.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  jQuery.extend({
    expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
    isReady: true,
    error: function(msg) {
      throw new Error(msg);
    },
    noop: function() {},
    isFunction: function(obj) {
      return jQuery.type(obj) === "function";
    },
    isArray: Array.isArray,
    isWindow: function(obj) {
      return obj != null && obj === obj.window;
    },
    isNumeric: function(obj) {
      return !jQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
    },
    isPlainObject: function(obj) {
      if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
        return false;
      }
      if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
      return true;
    },
    isEmptyObject: function(obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    },
    type: function(obj) {
      if (obj == null) {
        return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
    },
    globalEval: function(code) {
      var script,
          indirect = eval;
      code = jQuery.trim(code);
      if (code) {
        if (code.indexOf("use strict") === 1) {
          script = document.createElement("script");
          script.text = code;
          document.head.appendChild(script).parentNode.removeChild(script);
        } else {
          indirect(code);
        }
      }
    },
    camelCase: function(string) {
      return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
    },
    nodeName: function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    each: function(obj, callback, args) {
      var value,
          i = 0,
          length = obj.length,
          isArray = isArraylike(obj);
      if (args) {
        if (isArray) {
          for (; i < length; i++) {
            value = callback.apply(obj[i], args);
            if (value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            value = callback.apply(obj[i], args);
            if (value === false) {
              break;
            }
          }
        }
      } else {
        if (isArray) {
          for (; i < length; i++) {
            value = callback.call(obj[i], i, obj[i]);
            if (value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            value = callback.call(obj[i], i, obj[i]);
            if (value === false) {
              break;
            }
          }
        }
      }
      return obj;
    },
    trim: function(text) {
      return text == null ? "" : (text + "").replace(rtrim, "");
    },
    makeArray: function(arr, results) {
      var ret = results || [];
      if (arr != null) {
        if (isArraylike(Object(arr))) {
          jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
        } else {
          push.call(ret, arr);
        }
      }
      return ret;
    },
    inArray: function(elem, arr, i) {
      return arr == null ? -1 : indexOf.call(arr, elem, i);
    },
    merge: function(first, second) {
      var len = +second.length,
          j = 0,
          i = first.length;
      for (; j < len; j++) {
        first[i++] = second[j];
      }
      first.length = i;
      return first;
    },
    grep: function(elems, callback, invert) {
      var callbackInverse,
          matches = [],
          i = 0,
          length = elems.length,
          callbackExpect = !invert;
      for (; i < length; i++) {
        callbackInverse = !callback(elems[i], i);
        if (callbackInverse !== callbackExpect) {
          matches.push(elems[i]);
        }
      }
      return matches;
    },
    map: function(elems, callback, arg) {
      var value,
          i = 0,
          length = elems.length,
          isArray = isArraylike(elems),
          ret = [];
      if (isArray) {
        for (; i < length; i++) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      }
      return concat.apply([], ret);
    },
    guid: 1,
    proxy: function(fn, context) {
      var tmp,
          args,
          proxy;
      if (typeof context === "string") {
        tmp = fn[context];
        context = fn;
        fn = tmp;
      }
      if (!jQuery.isFunction(fn)) {
        return undefined;
      }
      args = slice.call(arguments, 2);
      proxy = function() {
        return fn.apply(context || this, args.concat(slice.call(arguments)));
      };
      proxy.guid = fn.guid = fn.guid || jQuery.guid++;
      return proxy;
    },
    now: Date.now,
    support: support
  });
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });
  function isArraylike(obj) {
    var length = "length" in obj && obj.length,
        type = jQuery.type(obj);
    if (type === "function" || jQuery.isWindow(obj)) {
      return false;
    }
    if (obj.nodeType === 1 && length) {
      return true;
    }
    return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
  }
  var Sizzle = (function(window) {
    var i,
        support,
        Expr,
        getText,
        isXML,
        tokenize,
        compile,
        select,
        outermostContext,
        sortInput,
        hasDuplicate,
        setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,
        expando = "sizzle" + 1 * new Date(),
        preferredDoc = window.document,
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        sortOrder = function(a, b) {
          if (a === b) {
            hasDuplicate = true;
          }
          return 0;
        },
        MAX_NEGATIVE = 1 << 31,
        hasOwn = ({}).hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        indexOf = function(list, elem) {
          var i = 0,
              len = list.length;
          for (; i < len; i++) {
            if (list[i] === elem) {
              return i;
            }
          }
          return -1;
        },
        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        whitespace = "[\\x20\\t\\r\\n\\f]",
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        identifier = characterEncoding.replace("w", "w#"),
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
        pseudos = ":(" + characterEncoding + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + ".*" + ")\\)|)",
        rwhitespace = new RegExp(whitespace + "+", "g"),
        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
        rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
        rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
        rpseudo = new RegExp(pseudos),
        ridentifier = new RegExp("^" + identifier + "$"),
        matchExpr = {
          "ID": new RegExp("^#(" + characterEncoding + ")"),
          "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
          "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
          "ATTR": new RegExp("^" + attributes),
          "PSEUDO": new RegExp("^" + pseudos),
          "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
          "bool": new RegExp("^(?:" + booleans + ")$", "i"),
          "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        },
        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,
        rnative = /^[^{]+\{\s*\[native \w/,
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        rsibling = /[+~]/,
        rescape = /'|\\/g,
        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
        funescape = function(_, escaped, escapedWhitespace) {
          var high = "0x" + escaped - 0x10000;
          return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
        },
        unloadHandler = function() {
          setDocument();
        };
    try {
      push.apply((arr = slice.call(preferredDoc.childNodes)), preferredDoc.childNodes);
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
      push = {apply: arr.length ? function(target, els) {
          push_native.apply(target, slice.call(els));
        } : function(target, els) {
          var j = target.length,
              i = 0;
          while ((target[j++] = els[i++])) {}
          target.length = j - 1;
        }};
    }
    function Sizzle(selector, context, results, seed) {
      var match,
          elem,
          m,
          nodeType,
          i,
          groups,
          old,
          nid,
          newContext,
          newSelector;
      if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
        setDocument(context);
      }
      context = context || document;
      results = results || [];
      nodeType = context.nodeType;
      if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
        return results;
      }
      if (!seed && documentIsHTML) {
        if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
          if ((m = match[1])) {
            if (nodeType === 9) {
              elem = context.getElementById(m);
              if (elem && elem.parentNode) {
                if (elem.id === m) {
                  results.push(elem);
                  return results;
                }
              } else {
                return results;
              }
            } else {
              if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                results.push(elem);
                return results;
              }
            }
          } else if (match[2]) {
            push.apply(results, context.getElementsByTagName(selector));
            return results;
          } else if ((m = match[3]) && support.getElementsByClassName) {
            push.apply(results, context.getElementsByClassName(m));
            return results;
          }
        }
        if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
          nid = old = expando;
          newContext = context;
          newSelector = nodeType !== 1 && selector;
          if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
            groups = tokenize(selector);
            if ((old = context.getAttribute("id"))) {
              nid = old.replace(rescape, "\\$&");
            } else {
              context.setAttribute("id", nid);
            }
            nid = "[id='" + nid + "'] ";
            i = groups.length;
            while (i--) {
              groups[i] = nid + toSelector(groups[i]);
            }
            newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
            newSelector = groups.join(",");
          }
          if (newSelector) {
            try {
              push.apply(results, newContext.querySelectorAll(newSelector));
              return results;
            } catch (qsaError) {} finally {
              if (!old) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }
      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    function createCache() {
      var keys = [];
      function cache(key, value) {
        if (keys.push(key + " ") > Expr.cacheLength) {
          delete cache[keys.shift()];
        }
        return (cache[key + " "] = value);
      }
      return cache;
    }
    function markFunction(fn) {
      fn[expando] = true;
      return fn;
    }
    function assert(fn) {
      var div = document.createElement("div");
      try {
        return !!fn(div);
      } catch (e) {
        return false;
      } finally {
        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
        div = null;
      }
    }
    function addHandle(attrs, handler) {
      var arr = attrs.split("|"),
          i = attrs.length;
      while (i--) {
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    function siblingCheck(a, b) {
      var cur = b && a,
          diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
      if (diff) {
        return diff;
      }
      if (cur) {
        while ((cur = cur.nextSibling)) {
          if (cur === b) {
            return -1;
          }
        }
      }
      return a ? 1 : -1;
    }
    function createInputPseudo(type) {
      return function(elem) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
      };
    }
    function createButtonPseudo(type) {
      return function(elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
      };
    }
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        argument = +argument;
        return markFunction(function(seed, matches) {
          var j,
              matchIndexes = fn([], seed.length, argument),
              i = matchIndexes.length;
          while (i--) {
            if (seed[(j = matchIndexes[i])]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    function testContext(context) {
      return context && typeof context.getElementsByTagName !== "undefined" && context;
    }
    support = Sizzle.support = {};
    isXML = Sizzle.isXML = function(elem) {
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    setDocument = Sizzle.setDocument = function(node) {
      var hasCompare,
          parent,
          doc = node ? node.ownerDocument || node : preferredDoc;
      if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
        return document;
      }
      document = doc;
      docElem = doc.documentElement;
      parent = doc.defaultView;
      if (parent && parent !== parent.top) {
        if (parent.addEventListener) {
          parent.addEventListener("unload", unloadHandler, false);
        } else if (parent.attachEvent) {
          parent.attachEvent("onunload", unloadHandler);
        }
      }
      documentIsHTML = !isXML(doc);
      support.attributes = assert(function(div) {
        div.className = "i";
        return !div.getAttribute("className");
      });
      support.getElementsByTagName = assert(function(div) {
        div.appendChild(doc.createComment(""));
        return !div.getElementsByTagName("*").length;
      });
      support.getElementsByClassName = rnative.test(doc.getElementsByClassName);
      support.getById = assert(function(div) {
        docElem.appendChild(div).id = expando;
        return !doc.getElementsByName || !doc.getElementsByName(expando).length;
      });
      if (support.getById) {
        Expr.find["ID"] = function(id, context) {
          if (typeof context.getElementById !== "undefined" && documentIsHTML) {
            var m = context.getElementById(id);
            return m && m.parentNode ? [m] : [];
          }
        };
        Expr.filter["ID"] = function(id) {
          var attrId = id.replace(runescape, funescape);
          return function(elem) {
            return elem.getAttribute("id") === attrId;
          };
        };
      } else {
        delete Expr.find["ID"];
        Expr.filter["ID"] = function(id) {
          var attrId = id.replace(runescape, funescape);
          return function(elem) {
            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
            return node && node.value === attrId;
          };
        };
      }
      Expr.find["TAG"] = support.getElementsByTagName ? function(tag, context) {
        if (typeof context.getElementsByTagName !== "undefined") {
          return context.getElementsByTagName(tag);
        } else if (support.qsa) {
          return context.querySelectorAll(tag);
        }
      } : function(tag, context) {
        var elem,
            tmp = [],
            i = 0,
            results = context.getElementsByTagName(tag);
        if (tag === "*") {
          while ((elem = results[i++])) {
            if (elem.nodeType === 1) {
              tmp.push(elem);
            }
          }
          return tmp;
        }
        return results;
      };
      Expr.find["CLASS"] = support.getElementsByClassName && function(className, context) {
        if (documentIsHTML) {
          return context.getElementsByClassName(className);
        }
      };
      rbuggyMatches = [];
      rbuggyQSA = [];
      if ((support.qsa = rnative.test(doc.querySelectorAll))) {
        assert(function(div) {
          docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\f]' msallowcapture=''>" + "<option selected=''></option></select>";
          if (div.querySelectorAll("[msallowcapture^='']").length) {
            rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
          }
          if (!div.querySelectorAll("[selected]").length) {
            rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
          }
          if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
            rbuggyQSA.push("~=");
          }
          if (!div.querySelectorAll(":checked").length) {
            rbuggyQSA.push(":checked");
          }
          if (!div.querySelectorAll("a#" + expando + "+*").length) {
            rbuggyQSA.push(".#.+[+~]");
          }
        });
        assert(function(div) {
          var input = doc.createElement("input");
          input.setAttribute("type", "hidden");
          div.appendChild(input).setAttribute("name", "D");
          if (div.querySelectorAll("[name=d]").length) {
            rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
          }
          if (!div.querySelectorAll(":enabled").length) {
            rbuggyQSA.push(":enabled", ":disabled");
          }
          div.querySelectorAll("*,:x");
          rbuggyQSA.push(",.*:");
        });
      }
      if ((support.matchesSelector = rnative.test((matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)))) {
        assert(function(div) {
          support.disconnectedMatch = matches.call(div, "div");
          matches.call(div, "[s!='']:x");
          rbuggyMatches.push("!=", pseudos);
        });
      }
      rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
      rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
      hasCompare = rnative.test(docElem.compareDocumentPosition);
      contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      } : function(a, b) {
        if (b) {
          while ((b = b.parentNode)) {
            if (b === a) {
              return true;
            }
          }
        }
        return false;
      };
      sortOrder = hasCompare ? function(a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if (compare) {
          return compare;
        }
        compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
        if (compare & 1 || (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
          if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
            return -1;
          }
          if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
            return 1;
          }
          return sortInput ? (indexOf(sortInput, a) - indexOf(sortInput, b)) : 0;
        }
        return compare & 4 ? -1 : 1;
      } : function(a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [a],
            bp = [b];
        if (!aup || !bup) {
          return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? (indexOf(sortInput, a) - indexOf(sortInput, b)) : 0;
        } else if (aup === bup) {
          return siblingCheck(a, b);
        }
        cur = a;
        while ((cur = cur.parentNode)) {
          ap.unshift(cur);
        }
        cur = b;
        while ((cur = cur.parentNode)) {
          bp.unshift(cur);
        }
        while (ap[i] === bp[i]) {
          i++;
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      };
      return doc;
    };
    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    Sizzle.matchesSelector = function(elem, expr) {
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }
      expr = expr.replace(rattributeQuotes, "='$1']");
      if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
        try {
          var ret = matches.call(elem, expr);
          if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
            return ret;
          }
        } catch (e) {}
      }
      return Sizzle(expr, document, null, [elem]).length > 0;
    };
    Sizzle.contains = function(context, elem) {
      if ((context.ownerDocument || context) !== document) {
        setDocument(context);
      }
      return contains(context, elem);
    };
    Sizzle.attr = function(elem, name) {
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name.toLowerCase()],
          val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
      return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
    };
    Sizzle.error = function(msg) {
      throw new Error("Syntax error, unrecognized expression: " + msg);
    };
    Sizzle.uniqueSort = function(results) {
      var elem,
          duplicates = [],
          j = 0,
          i = 0;
      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);
      if (hasDuplicate) {
        while ((elem = results[i++])) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }
        while (j--) {
          results.splice(duplicates[j], 1);
        }
      }
      sortInput = null;
      return results;
    };
    getText = Sizzle.getText = function(elem) {
      var node,
          ret = "",
          i = 0,
          nodeType = elem.nodeType;
      if (!nodeType) {
        while ((node = elem[i++])) {
          ret += getText(node);
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        if (typeof elem.textContent === "string") {
          return elem.textContent;
        } else {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            ret += getText(elem);
          }
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      }
      return ret;
    };
    Expr = Sizzle.selectors = {
      cacheLength: 50,
      createPseudo: markFunction,
      match: matchExpr,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: true
        },
        " ": {dir: "parentNode"},
        "+": {
          dir: "previousSibling",
          first: true
        },
        "~": {dir: "previousSibling"}
      },
      preFilter: {
        "ATTR": function(match) {
          match[1] = match[1].replace(runescape, funescape);
          match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
          if (match[2] === "~=") {
            match[3] = " " + match[3] + " ";
          }
          return match.slice(0, 4);
        },
        "CHILD": function(match) {
          match[1] = match[1].toLowerCase();
          if (match[1].slice(0, 3) === "nth") {
            if (!match[3]) {
              Sizzle.error(match[0]);
            }
            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
            match[5] = +((match[7] + match[8]) || match[3] === "odd");
          } else if (match[3]) {
            Sizzle.error(match[0]);
          }
          return match;
        },
        "PSEUDO": function(match) {
          var excess,
              unquoted = !match[6] && match[2];
          if (matchExpr["CHILD"].test(match[0])) {
            return null;
          }
          if (match[3]) {
            match[2] = match[4] || match[5] || "";
          } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
            match[0] = match[0].slice(0, excess);
            match[2] = unquoted.slice(0, excess);
          }
          return match.slice(0, 3);
        }
      },
      filter: {
        "TAG": function(nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
          return nodeNameSelector === "*" ? function() {
            return true;
          } : function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        "CLASS": function(className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
            return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
          });
        },
        "ATTR": function(name, operator, check) {
          return function(elem) {
            var result = Sizzle.attr(elem, name);
            if (result == null) {
              return operator === "!=";
            }
            if (!operator) {
              return true;
            }
            result += "";
            return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
          };
        },
        "CHILD": function(type, what, argument, first, last) {
          var simple = type.slice(0, 3) !== "nth",
              forward = type.slice(-4) !== "last",
              ofType = what === "of-type";
          return first === 1 && last === 0 ? function(elem) {
            return !!elem.parentNode;
          } : function(elem, context, xml) {
            var cache,
                outerCache,
                node,
                diff,
                nodeIndex,
                start,
                dir = simple !== forward ? "nextSibling" : "previousSibling",
                parent = elem.parentNode,
                name = ofType && elem.nodeName.toLowerCase(),
                useCache = !xml && !ofType;
            if (parent) {
              if (simple) {
                while (dir) {
                  node = elem;
                  while ((node = node[dir])) {
                    if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                      return false;
                    }
                  }
                  start = dir = type === "only" && !start && "nextSibling";
                }
                return true;
              }
              start = [forward ? parent.firstChild : parent.lastChild];
              if (forward && useCache) {
                outerCache = parent[expando] || (parent[expando] = {});
                cache = outerCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = cache[0] === dirruns && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];
                while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                  if (node.nodeType === 1 && ++diff && node === elem) {
                    outerCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                diff = cache[1];
              } else {
                while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
                  if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                    if (useCache) {
                      (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
                    }
                    if (node === elem) {
                      break;
                    }
                  }
                }
              }
              diff -= last;
              return diff === first || (diff % first === 0 && diff / first >= 0);
            }
          };
        },
        "PSEUDO": function(pseudo, argument) {
          var args,
              fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
          if (fn[expando]) {
            return fn(argument);
          }
          if (fn.length > 1) {
            args = [pseudo, pseudo, "", argument];
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
              var idx,
                  matched = fn(seed, argument),
                  i = matched.length;
              while (i--) {
                idx = indexOf(seed, matched[i]);
                seed[idx] = !(matches[idx] = matched[i]);
              }
            }) : function(elem) {
              return fn(elem, 0, args);
            };
          }
          return fn;
        }
      },
      pseudos: {
        "not": markFunction(function(selector) {
          var input = [],
              results = [],
              matcher = compile(selector.replace(rtrim, "$1"));
          return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
            var elem,
                unmatched = matcher(seed, null, xml, []),
                i = seed.length;
            while (i--) {
              if ((elem = unmatched[i])) {
                seed[i] = !(matches[i] = elem);
              }
            }
          }) : function(elem, context, xml) {
            input[0] = elem;
            matcher(input, null, xml, results);
            input[0] = null;
            return !results.pop();
          };
        }),
        "has": markFunction(function(selector) {
          return function(elem) {
            return Sizzle(selector, elem).length > 0;
          };
        }),
        "contains": markFunction(function(text) {
          text = text.replace(runescape, funescape);
          return function(elem) {
            return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
          };
        }),
        "lang": markFunction(function(lang) {
          if (!ridentifier.test(lang || "")) {
            Sizzle.error("unsupported lang: " + lang);
          }
          lang = lang.replace(runescape, funescape).toLowerCase();
          return function(elem) {
            var elemLang;
            do {
              if ((elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {
                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
              }
            } while ((elem = elem.parentNode) && elem.nodeType === 1);
            return false;
          };
        }),
        "target": function(elem) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice(1) === elem.id;
        },
        "root": function(elem) {
          return elem === docElem;
        },
        "focus": function(elem) {
          return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },
        "enabled": function(elem) {
          return elem.disabled === false;
        },
        "disabled": function(elem) {
          return elem.disabled === true;
        },
        "checked": function(elem) {
          var nodeName = elem.nodeName.toLowerCase();
          return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
        },
        "selected": function(elem) {
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
          return elem.selected === true;
        },
        "empty": function(elem) {
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeType < 6) {
              return false;
            }
          }
          return true;
        },
        "parent": function(elem) {
          return !Expr.pseudos["empty"](elem);
        },
        "header": function(elem) {
          return rheader.test(elem.nodeName);
        },
        "input": function(elem) {
          return rinputs.test(elem.nodeName);
        },
        "button": function(elem) {
          var name = elem.nodeName.toLowerCase();
          return name === "input" && elem.type === "button" || name === "button";
        },
        "text": function(elem) {
          var attr;
          return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
        },
        "first": createPositionalPseudo(function() {
          return [0];
        }),
        "last": createPositionalPseudo(function(matchIndexes, length) {
          return [length - 1];
        }),
        "eq": createPositionalPseudo(function(matchIndexes, length, argument) {
          return [argument < 0 ? argument + length : argument];
        }),
        "even": createPositionalPseudo(function(matchIndexes, length) {
          var i = 0;
          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        "odd": createPositionalPseudo(function(matchIndexes, length) {
          var i = 1;
          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        "lt": createPositionalPseudo(function(matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;
          for (; --i >= 0; ) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),
        "gt": createPositionalPseudo(function(matchIndexes, length, argument) {
          var i = argument < 0 ? argument + length : argument;
          for (; ++i < length; ) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        })
      }
    };
    Expr.pseudos["nth"] = Expr.pseudos["eq"];
    for (i in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in {
      submit: true,
      reset: true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();
    tokenize = Sizzle.tokenize = function(selector, parseOnly) {
      var matched,
          match,
          tokens,
          type,
          soFar,
          groups,
          preFilters,
          cached = tokenCache[selector + " "];
      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }
      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;
      while (soFar) {
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push((tokens = []));
        }
        matched = false;
        if ((match = rcombinators.exec(soFar))) {
          matched = match.shift();
          tokens.push({
            value: matched,
            type: match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: type,
              matches: match
            });
            soFar = soFar.slice(matched.length);
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
    };
    function toSelector(tokens) {
      var i = 0,
          len = tokens.length,
          selector = "";
      for (; i < len; i++) {
        selector += tokens[i].value;
      }
      return selector;
    }
    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir,
          checkNonElements = base && dir === "parentNode",
          doneName = done++;
      return combinator.first ? function(elem, context, xml) {
        while ((elem = elem[dir])) {
          if (elem.nodeType === 1 || checkNonElements) {
            return matcher(elem, context, xml);
          }
        }
      } : function(elem, context, xml) {
        var oldCache,
            outerCache,
            newCache = [dirruns, doneName];
        if (xml) {
          while ((elem = elem[dir])) {
            if (elem.nodeType === 1 || checkNonElements) {
              if (matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        } else {
          while ((elem = elem[dir])) {
            if (elem.nodeType === 1 || checkNonElements) {
              outerCache = elem[expando] || (elem[expando] = {});
              if ((oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                return (newCache[2] = oldCache[2]);
              } else {
                outerCache[dir] = newCache;
                if ((newCache[2] = matcher(elem, context, xml))) {
                  return true;
                }
              }
            }
          }
        }
      };
    }
    function elementMatcher(matchers) {
      return matchers.length > 1 ? function(elem, context, xml) {
        var i = matchers.length;
        while (i--) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    function multipleContexts(selector, contexts, results) {
      var i = 0,
          len = contexts.length;
      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }
    function condense(unmatched, map, filter, context, xml) {
      var elem,
          newUnmatched = [],
          i = 0,
          len = unmatched.length,
          mapped = map != null;
      for (; i < len; i++) {
        if ((elem = unmatched[i])) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem);
            if (mapped) {
              map.push(i);
            }
          }
        }
      }
      return newUnmatched;
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter);
      }
      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector);
      }
      return markFunction(function(seed, results, context, xml) {
        var temp,
            i,
            elem,
            preMap = [],
            postMap = [],
            preexisting = results.length,
            elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
            matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
            matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml);
        }
        if (postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml);
          i = temp.length;
          while (i--) {
            if ((elem = temp[i])) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              temp = [];
              i = matcherOut.length;
              while (i--) {
                if ((elem = matcherOut[i])) {
                  temp.push((matcherIn[i] = elem));
                }
              }
              postFinder(null, (matcherOut = []), temp, xml);
            }
            i = matcherOut.length;
            while (i--) {
              if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {
                seed[temp] = !(results[temp] = elem);
              }
            }
          }
        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }
    function matcherFromTokens(tokens) {
      var checkContext,
          matcher,
          j,
          len = tokens.length,
          leadingRelative = Expr.relative[tokens[0].type],
          implicitRelative = leadingRelative || Expr.relative[" "],
          i = leadingRelative ? 1 : 0,
          matchContext = addCombinator(function(elem) {
            return elem === checkContext;
          }, implicitRelative, true),
          matchAnyContext = addCombinator(function(elem) {
            return indexOf(checkContext, elem) > -1;
          }, implicitRelative, true),
          matchers = [function(elem, context, xml) {
            var ret = (!leadingRelative && (xml || context !== outermostContext)) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            checkContext = null;
            return ret;
          }];
      for (; i < len; i++) {
        if ((matcher = Expr.relative[tokens[i].type])) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
          if (matcher[expando]) {
            j = ++i;
            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({value: tokens[i - 2].type === " " ? "*" : ""})).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens((tokens = tokens.slice(j))), j < len && toSelector(tokens));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      var bySet = setMatchers.length > 0,
          byElement = elementMatchers.length > 0,
          superMatcher = function(seed, context, xml, results, outermost) {
            var elem,
                j,
                matcher,
                matchedCount = 0,
                i = "0",
                unmatched = seed && [],
                setMatched = [],
                contextBackup = outermostContext,
                elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                len = elems.length;
            if (outermost) {
              outermostContext = context !== document && context;
            }
            for (; i !== len && (elem = elems[i]) != null; i++) {
              if (byElement && elem) {
                j = 0;
                while ((matcher = elementMatchers[j++])) {
                  if (matcher(elem, context, xml)) {
                    results.push(elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if ((elem = !matcher && elem)) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i;
            if (bySet && i !== matchedCount) {
              j = 0;
              while ((matcher = setMatchers[j++])) {
                matcher(unmatched, setMatched, context, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i--) {
                    if (!(unmatched[i] || setMatched[i])) {
                      setMatched[i] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && (matchedCount + setMatchers.length) > 1) {
                Sizzle.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    compile = Sizzle.compile = function(selector, match) {
      var i,
          setMatchers = [],
          elementMatchers = [],
          cached = compilerCache[selector + " "];
      if (!cached) {
        if (!match) {
          match = tokenize(selector);
        }
        i = match.length;
        while (i--) {
          cached = matcherFromTokens(match[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
        cached.selector = selector;
      }
      return cached;
    };
    select = Sizzle.select = function(selector, context, results, seed) {
      var i,
          tokens,
          token,
          type,
          find,
          compiled = typeof selector === "function" && selector,
          match = !seed && tokenize((selector = compiled.selector || selector));
      results = results || [];
      if (match.length === 1) {
        tokens = match[0] = match[0].slice(0);
        if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
          context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
          if (!context) {
            return results;
          } else if (compiled) {
            context = context.parentNode;
          }
          selector = selector.slice(tokens.shift().value.length);
        }
        i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
        while (i--) {
          token = tokens[i];
          if (Expr.relative[(type = token.type)]) {
            break;
          }
          if ((find = Expr.find[type])) {
            if ((seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
              tokens.splice(i, 1);
              selector = seed.length && toSelector(tokens);
              if (!selector) {
                push.apply(results, seed);
                return results;
              }
              break;
            }
          }
        }
      }
      (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context);
      return results;
    };
    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
    support.detectDuplicates = !!hasDuplicate;
    setDocument();
    support.sortDetached = assert(function(div1) {
      return div1.compareDocumentPosition(document.createElement("div")) & 1;
    });
    if (!assert(function(div) {
      div.innerHTML = "<a href='#'></a>";
      return div.firstChild.getAttribute("href") === "#";
    })) {
      addHandle("type|href|height|width", function(elem, name, isXML) {
        if (!isXML) {
          return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
        }
      });
    }
    if (!support.attributes || !assert(function(div) {
      div.innerHTML = "<input/>";
      div.firstChild.setAttribute("value", "");
      return div.firstChild.getAttribute("value") === "";
    })) {
      addHandle("value", function(elem, name, isXML) {
        if (!isXML && elem.nodeName.toLowerCase() === "input") {
          return elem.defaultValue;
        }
      });
    }
    if (!assert(function(div) {
      return div.getAttribute("disabled") == null;
    })) {
      addHandle(booleans, function(elem, name, isXML) {
        var val;
        if (!isXML) {
          return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        }
      });
    }
    return Sizzle;
  })(window);
  jQuery.find = Sizzle;
  jQuery.expr = Sizzle.selectors;
  jQuery.expr[":"] = jQuery.expr.pseudos;
  jQuery.unique = Sizzle.uniqueSort;
  jQuery.text = Sizzle.getText;
  jQuery.isXMLDoc = Sizzle.isXML;
  jQuery.contains = Sizzle.contains;
  var rneedsContext = jQuery.expr.match.needsContext;
  var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
  var risSimple = /^.[^:#\[\.,]*$/;
  function winnow(elements, qualifier, not) {
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, function(elem, i) {
        return !!qualifier.call(elem, i, elem) !== not;
      });
    }
    if (qualifier.nodeType) {
      return jQuery.grep(elements, function(elem) {
        return (elem === qualifier) !== not;
      });
    }
    if (typeof qualifier === "string") {
      if (risSimple.test(qualifier)) {
        return jQuery.filter(qualifier, elements, not);
      }
      qualifier = jQuery.filter(qualifier, elements);
    }
    return jQuery.grep(elements, function(elem) {
      return (indexOf.call(qualifier, elem) >= 0) !== not;
    });
  }
  jQuery.filter = function(expr, elems, not) {
    var elem = elems[0];
    if (not) {
      expr = ":not(" + expr + ")";
    }
    return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
      return elem.nodeType === 1;
    }));
  };
  jQuery.fn.extend({
    find: function(selector) {
      var i,
          len = this.length,
          ret = [],
          self = this;
      if (typeof selector !== "string") {
        return this.pushStack(jQuery(selector).filter(function() {
          for (i = 0; i < len; i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }
      for (i = 0; i < len; i++) {
        jQuery.find(selector, self[i], ret);
      }
      ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
      ret.selector = this.selector ? this.selector + " " + selector : selector;
      return ret;
    },
    filter: function(selector) {
      return this.pushStack(winnow(this, selector || [], false));
    },
    not: function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    is: function(selector) {
      return !!winnow(this, typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    }
  });
  var rootjQuery,
      rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      init = jQuery.fn.init = function(selector, context) {
        var match,
            elem;
        if (!selector) {
          return this;
        }
        if (typeof selector === "string") {
          if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
            match = [null, selector, null];
          } else {
            match = rquickExpr.exec(selector);
          }
          if (match && (match[1] || !context)) {
            if (match[1]) {
              context = context instanceof jQuery ? context[0] : context;
              jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
              if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                for (match in context) {
                  if (jQuery.isFunction(this[match])) {
                    this[match](context[match]);
                  } else {
                    this.attr(match, context[match]);
                  }
                }
              }
              return this;
            } else {
              elem = document.getElementById(match[2]);
              if (elem && elem.parentNode) {
                this.length = 1;
                this[0] = elem;
              }
              this.context = document;
              this.selector = selector;
              return this;
            }
          } else if (!context || context.jquery) {
            return (context || rootjQuery).find(selector);
          } else {
            return this.constructor(context).find(selector);
          }
        } else if (selector.nodeType) {
          this.context = this[0] = selector;
          this.length = 1;
          return this;
        } else if (jQuery.isFunction(selector)) {
          return typeof rootjQuery.ready !== "undefined" ? rootjQuery.ready(selector) : selector(jQuery);
        }
        if (selector.selector !== undefined) {
          this.selector = selector.selector;
          this.context = selector.context;
        }
        return jQuery.makeArray(selector, this);
      };
  init.prototype = jQuery.fn;
  rootjQuery = jQuery(document);
  var rparentsprev = /^(?:parents|prev(?:Until|All))/,
      guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
      };
  jQuery.extend({
    dir: function(elem, dir, until) {
      var matched = [],
          truncate = until !== undefined;
      while ((elem = elem[dir]) && elem.nodeType !== 9) {
        if (elem.nodeType === 1) {
          if (truncate && jQuery(elem).is(until)) {
            break;
          }
          matched.push(elem);
        }
      }
      return matched;
    },
    sibling: function(n, elem) {
      var matched = [];
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          matched.push(n);
        }
      }
      return matched;
    }
  });
  jQuery.fn.extend({
    has: function(target) {
      var targets = jQuery(target, this),
          l = targets.length;
      return this.filter(function() {
        var i = 0;
        for (; i < l; i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    closest: function(selectors, context) {
      var cur,
          i = 0,
          l = this.length,
          matched = [],
          pos = rneedsContext.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;
      for (; i < l; i++) {
        for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
          if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
            matched.push(cur);
            break;
          }
        }
      }
      return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
    },
    index: function(elem) {
      if (!elem) {
        return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
      }
      if (typeof elem === "string") {
        return indexOf.call(jQuery(elem), this[0]);
      }
      return indexOf.call(this, elem.jquery ? elem[0] : elem);
    },
    add: function(selector, context) {
      return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(selector, context))));
    },
    addBack: function(selector) {
      return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    }
  });
  function sibling(cur, dir) {
    while ((cur = cur[dir]) && cur.nodeType !== 1) {}
    return cur;
  }
  jQuery.each({
    parent: function(elem) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function(elem) {
      return jQuery.dir(elem, "parentNode");
    },
    parentsUntil: function(elem, i, until) {
      return jQuery.dir(elem, "parentNode", until);
    },
    next: function(elem) {
      return sibling(elem, "nextSibling");
    },
    prev: function(elem) {
      return sibling(elem, "previousSibling");
    },
    nextAll: function(elem) {
      return jQuery.dir(elem, "nextSibling");
    },
    prevAll: function(elem) {
      return jQuery.dir(elem, "previousSibling");
    },
    nextUntil: function(elem, i, until) {
      return jQuery.dir(elem, "nextSibling", until);
    },
    prevUntil: function(elem, i, until) {
      return jQuery.dir(elem, "previousSibling", until);
    },
    siblings: function(elem) {
      return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
    },
    children: function(elem) {
      return jQuery.sibling(elem.firstChild);
    },
    contents: function(elem) {
      return elem.contentDocument || jQuery.merge([], elem.childNodes);
    }
  }, function(name, fn) {
    jQuery.fn[name] = function(until, selector) {
      var matched = jQuery.map(this, fn, until);
      if (name.slice(-5) !== "Until") {
        selector = until;
      }
      if (selector && typeof selector === "string") {
        matched = jQuery.filter(selector, matched);
      }
      if (this.length > 1) {
        if (!guaranteedUnique[name]) {
          jQuery.unique(matched);
        }
        if (rparentsprev.test(name)) {
          matched.reverse();
        }
      }
      return this.pushStack(matched);
    };
  });
  var rnotwhite = (/\S+/g);
  var optionsCache = {};
  function createOptions(options) {
    var object = optionsCache[options] = {};
    jQuery.each(options.match(rnotwhite) || [], function(_, flag) {
      object[flag] = true;
    });
    return object;
  }
  jQuery.Callbacks = function(options) {
    options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : jQuery.extend({}, options);
    var memory,
        fired,
        firing,
        firingStart,
        firingLength,
        firingIndex,
        list = [],
        stack = !options.once && [],
        fire = function(data) {
          memory = options.memory && data;
          fired = true;
          firingIndex = firingStart || 0;
          firingStart = 0;
          firingLength = list.length;
          firing = true;
          for (; list && firingIndex < firingLength; firingIndex++) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
              memory = false;
              break;
            }
          }
          firing = false;
          if (list) {
            if (stack) {
              if (stack.length) {
                fire(stack.shift());
              }
            } else if (memory) {
              list = [];
            } else {
              self.disable();
            }
          }
        },
        self = {
          add: function() {
            if (list) {
              var start = list.length;
              (function add(args) {
                jQuery.each(args, function(_, arg) {
                  var type = jQuery.type(arg);
                  if (type === "function") {
                    if (!options.unique || !self.has(arg)) {
                      list.push(arg);
                    }
                  } else if (arg && arg.length && type !== "string") {
                    add(arg);
                  }
                });
              })(arguments);
              if (firing) {
                firingLength = list.length;
              } else if (memory) {
                firingStart = start;
                fire(memory);
              }
            }
            return this;
          },
          remove: function() {
            if (list) {
              jQuery.each(arguments, function(_, arg) {
                var index;
                while ((index = jQuery.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1);
                  if (firing) {
                    if (index <= firingLength) {
                      firingLength--;
                    }
                    if (index <= firingIndex) {
                      firingIndex--;
                    }
                  }
                }
              });
            }
            return this;
          },
          has: function(fn) {
            return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
          },
          empty: function() {
            list = [];
            firingLength = 0;
            return this;
          },
          disable: function() {
            list = stack = memory = undefined;
            return this;
          },
          disabled: function() {
            return !list;
          },
          lock: function() {
            stack = undefined;
            if (!memory) {
              self.disable();
            }
            return this;
          },
          locked: function() {
            return !stack;
          },
          fireWith: function(context, args) {
            if (list && (!fired || stack)) {
              args = args || [];
              args = [context, args.slice ? args.slice() : args];
              if (firing) {
                stack.push(args);
              } else {
                fire(args);
              }
            }
            return this;
          },
          fire: function() {
            self.fireWith(this, arguments);
            return this;
          },
          fired: function() {
            return !!fired;
          }
        };
    return self;
  };
  jQuery.extend({
    Deferred: function(func) {
      var tuples = [["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]],
          state = "pending",
          promise = {
            state: function() {
              return state;
            },
            always: function() {
              deferred.done(arguments).fail(arguments);
              return this;
            },
            then: function() {
              var fns = arguments;
              return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(i, tuple) {
                  var fn = jQuery.isFunction(fns[i]) && fns[i];
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this, arguments);
                    if (returned && jQuery.isFunction(returned.promise)) {
                      returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                    } else {
                      newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                    }
                  });
                });
                fns = null;
              }).promise();
            },
            promise: function(obj) {
              return obj != null ? jQuery.extend(obj, promise) : promise;
            }
          },
          deferred = {};
      promise.pipe = promise.then;
      jQuery.each(tuples, function(i, tuple) {
        var list = tuple[2],
            stateString = tuple[3];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function() {
            state = stateString;
          }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
        }
        deferred[tuple[0]] = function() {
          deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
          return this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      });
      promise.promise(deferred);
      if (func) {
        func.call(deferred, deferred);
      }
      return deferred;
    },
    when: function(subordinate) {
      var i = 0,
          resolveValues = slice.call(arguments),
          length = resolveValues.length,
          remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,
          deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
          updateFunc = function(i, contexts, values) {
            return function(value) {
              contexts[i] = this;
              values[i] = arguments.length > 1 ? slice.call(arguments) : value;
              if (values === progressValues) {
                deferred.notifyWith(contexts, values);
              } else if (!(--remaining)) {
                deferred.resolveWith(contexts, values);
              }
            };
          },
          progressValues,
          progressContexts,
          resolveContexts;
      if (length > 1) {
        progressValues = new Array(length);
        progressContexts = new Array(length);
        resolveContexts = new Array(length);
        for (; i < length; i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
          } else {
            --remaining;
          }
        }
      }
      if (!remaining) {
        deferred.resolveWith(resolveContexts, resolveValues);
      }
      return deferred.promise();
    }
  });
  var readyList;
  jQuery.fn.ready = function(fn) {
    jQuery.ready.promise().done(fn);
    return this;
  };
  jQuery.extend({
    isReady: false,
    readyWait: 1,
    holdReady: function(hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    ready: function(wait) {
      if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
        return;
      }
      jQuery.isReady = true;
      if (wait !== true && --jQuery.readyWait > 0) {
        return;
      }
      readyList.resolveWith(document, [jQuery]);
      if (jQuery.fn.triggerHandler) {
        jQuery(document).triggerHandler("ready");
        jQuery(document).off("ready");
      }
    }
  });
  function completed() {
    document.removeEventListener("DOMContentLoaded", completed, false);
    window.removeEventListener("load", completed, false);
    jQuery.ready();
  }
  jQuery.ready.promise = function(obj) {
    if (!readyList) {
      readyList = jQuery.Deferred();
      if (document.readyState === "complete") {
        setTimeout(jQuery.ready);
      } else {
        document.addEventListener("DOMContentLoaded", completed, false);
        window.addEventListener("load", completed, false);
      }
    }
    return readyList.promise(obj);
  };
  jQuery.ready.promise();
  var access = jQuery.access = function(elems, fn, key, value, chainable, emptyGet, raw) {
    var i = 0,
        len = elems.length,
        bulk = key == null;
    if (jQuery.type(key) === "object") {
      chainable = true;
      for (i in key) {
        jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
      }
    } else if (value !== undefined) {
      chainable = true;
      if (!jQuery.isFunction(value)) {
        raw = true;
      }
      if (bulk) {
        if (raw) {
          fn.call(elems, value);
          fn = null;
        } else {
          bulk = fn;
          fn = function(elem, key, value) {
            return bulk.call(jQuery(elem), value);
          };
        }
      }
      if (fn) {
        for (; i < len; i++) {
          fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
        }
      }
    }
    return chainable ? elems : bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet;
  };
  jQuery.acceptData = function(owner) {
    return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
  };
  function Data() {
    Object.defineProperty(this.cache = {}, 0, {get: function() {
        return {};
      }});
    this.expando = jQuery.expando + Data.uid++;
  }
  Data.uid = 1;
  Data.accepts = jQuery.acceptData;
  Data.prototype = {
    key: function(owner) {
      if (!Data.accepts(owner)) {
        return 0;
      }
      var descriptor = {},
          unlock = owner[this.expando];
      if (!unlock) {
        unlock = Data.uid++;
        try {
          descriptor[this.expando] = {value: unlock};
          Object.defineProperties(owner, descriptor);
        } catch (e) {
          descriptor[this.expando] = unlock;
          jQuery.extend(owner, descriptor);
        }
      }
      if (!this.cache[unlock]) {
        this.cache[unlock] = {};
      }
      return unlock;
    },
    set: function(owner, data, value) {
      var prop,
          unlock = this.key(owner),
          cache = this.cache[unlock];
      if (typeof data === "string") {
        cache[data] = value;
      } else {
        if (jQuery.isEmptyObject(cache)) {
          jQuery.extend(this.cache[unlock], data);
        } else {
          for (prop in data) {
            cache[prop] = data[prop];
          }
        }
      }
      return cache;
    },
    get: function(owner, key) {
      var cache = this.cache[this.key(owner)];
      return key === undefined ? cache : cache[key];
    },
    access: function(owner, key, value) {
      var stored;
      if (key === undefined || ((key && typeof key === "string") && value === undefined)) {
        stored = this.get(owner, key);
        return stored !== undefined ? stored : this.get(owner, jQuery.camelCase(key));
      }
      this.set(owner, key, value);
      return value !== undefined ? value : key;
    },
    remove: function(owner, key) {
      var i,
          name,
          camel,
          unlock = this.key(owner),
          cache = this.cache[unlock];
      if (key === undefined) {
        this.cache[unlock] = {};
      } else {
        if (jQuery.isArray(key)) {
          name = key.concat(key.map(jQuery.camelCase));
        } else {
          camel = jQuery.camelCase(key);
          if (key in cache) {
            name = [key, camel];
          } else {
            name = camel;
            name = name in cache ? [name] : (name.match(rnotwhite) || []);
          }
        }
        i = name.length;
        while (i--) {
          delete cache[name[i]];
        }
      }
    },
    hasData: function(owner) {
      return !jQuery.isEmptyObject(this.cache[owner[this.expando]] || {});
    },
    discard: function(owner) {
      if (owner[this.expando]) {
        delete this.cache[owner[this.expando]];
      }
    }
  };
  var data_priv = new Data();
  var data_user = new Data();
  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      rmultiDash = /([A-Z])/g;
  function dataAttr(elem, key, data) {
    var name;
    if (data === undefined && elem.nodeType === 1) {
      name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
      data = elem.getAttribute(name);
      if (typeof data === "string") {
        try {
          data = data === "true" ? true : data === "false" ? false : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (e) {}
        data_user.set(elem, key, data);
      } else {
        data = undefined;
      }
    }
    return data;
  }
  jQuery.extend({
    hasData: function(elem) {
      return data_user.hasData(elem) || data_priv.hasData(elem);
    },
    data: function(elem, name, data) {
      return data_user.access(elem, name, data);
    },
    removeData: function(elem, name) {
      data_user.remove(elem, name);
    },
    _data: function(elem, name, data) {
      return data_priv.access(elem, name, data);
    },
    _removeData: function(elem, name) {
      data_priv.remove(elem, name);
    }
  });
  jQuery.fn.extend({
    data: function(key, value) {
      var i,
          name,
          data,
          elem = this[0],
          attrs = elem && elem.attributes;
      if (key === undefined) {
        if (this.length) {
          data = data_user.get(elem);
          if (elem.nodeType === 1 && !data_priv.get(elem, "hasDataAttrs")) {
            i = attrs.length;
            while (i--) {
              if (attrs[i]) {
                name = attrs[i].name;
                if (name.indexOf("data-") === 0) {
                  name = jQuery.camelCase(name.slice(5));
                  dataAttr(elem, name, data[name]);
                }
              }
            }
            data_priv.set(elem, "hasDataAttrs", true);
          }
        }
        return data;
      }
      if (typeof key === "object") {
        return this.each(function() {
          data_user.set(this, key);
        });
      }
      return access(this, function(value) {
        var data,
            camelKey = jQuery.camelCase(key);
        if (elem && value === undefined) {
          data = data_user.get(elem, key);
          if (data !== undefined) {
            return data;
          }
          data = data_user.get(elem, camelKey);
          if (data !== undefined) {
            return data;
          }
          data = dataAttr(elem, camelKey, undefined);
          if (data !== undefined) {
            return data;
          }
          return;
        }
        this.each(function() {
          var data = data_user.get(this, camelKey);
          data_user.set(this, camelKey, value);
          if (key.indexOf("-") !== -1 && data !== undefined) {
            data_user.set(this, key, value);
          }
        });
      }, null, value, arguments.length > 1, null, true);
    },
    removeData: function(key) {
      return this.each(function() {
        data_user.remove(this, key);
      });
    }
  });
  jQuery.extend({
    queue: function(elem, type, data) {
      var queue;
      if (elem) {
        type = (type || "fx") + "queue";
        queue = data_priv.get(elem, type);
        if (data) {
          if (!queue || jQuery.isArray(data)) {
            queue = data_priv.access(elem, type, jQuery.makeArray(data));
          } else {
            queue.push(data);
          }
        }
        return queue || [];
      }
    },
    dequeue: function(elem, type) {
      type = type || "fx";
      var queue = jQuery.queue(elem, type),
          startLength = queue.length,
          fn = queue.shift(),
          hooks = jQuery._queueHooks(elem, type),
          next = function() {
            jQuery.dequeue(elem, type);
          };
      if (fn === "inprogress") {
        fn = queue.shift();
        startLength--;
      }
      if (fn) {
        if (type === "fx") {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!startLength && hooks) {
        hooks.empty.fire();
      }
    },
    _queueHooks: function(elem, type) {
      var key = type + "queueHooks";
      return data_priv.get(elem, key) || data_priv.access(elem, key, {empty: jQuery.Callbacks("once memory").add(function() {
          data_priv.remove(elem, [type + "queue", key]);
        })});
    }
  });
  jQuery.fn.extend({
    queue: function(type, data) {
      var setter = 2;
      if (typeof type !== "string") {
        data = type;
        type = "fx";
        setter--;
      }
      if (arguments.length < setter) {
        return jQuery.queue(this[0], type);
      }
      return data === undefined ? this : this.each(function() {
        var queue = jQuery.queue(this, type, data);
        jQuery._queueHooks(this, type);
        if (type === "fx" && queue[0] !== "inprogress") {
          jQuery.dequeue(this, type);
        }
      });
    },
    dequeue: function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    clearQueue: function(type) {
      return this.queue(type || "fx", []);
    },
    promise: function(type, obj) {
      var tmp,
          count = 1,
          defer = jQuery.Deferred(),
          elements = this,
          i = this.length,
          resolve = function() {
            if (!(--count)) {
              defer.resolveWith(elements, [elements]);
            }
          };
      if (typeof type !== "string") {
        obj = type;
        type = undefined;
      }
      type = type || "fx";
      while (i--) {
        tmp = data_priv.get(elements[i], type + "queueHooks");
        if (tmp && tmp.empty) {
          count++;
          tmp.empty.add(resolve);
        }
      }
      resolve();
      return defer.promise(obj);
    }
  });
  var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  var isHidden = function(elem, el) {
    elem = el || elem;
    return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
  };
  var rcheckableType = (/^(?:checkbox|radio)$/i);
  (function() {
    var fragment = document.createDocumentFragment(),
        div = fragment.appendChild(document.createElement("div")),
        input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("checked", "checked");
    input.setAttribute("name", "t");
    div.appendChild(input);
    support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
    div.innerHTML = "<textarea>x</textarea>";
    support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
  })();
  var strundefined = typeof undefined;
  support.focusinBubbles = "onfocusin" in window;
  var rkeyEvent = /^key/,
      rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
      rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
      rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
  function returnTrue() {
    return true;
  }
  function returnFalse() {
    return false;
  }
  function safeActiveElement() {
    try {
      return document.activeElement;
    } catch (err) {}
  }
  jQuery.event = {
    global: {},
    add: function(elem, types, handler, data, selector) {
      var handleObjIn,
          eventHandle,
          tmp,
          events,
          t,
          handleObj,
          special,
          handlers,
          type,
          namespaces,
          origType,
          elemData = data_priv.get(elem);
      if (!elemData) {
        return;
      }
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }
      if (!handler.guid) {
        handler.guid = jQuery.guid++;
      }
      if (!(events = elemData.events)) {
        events = elemData.events = {};
      }
      if (!(eventHandle = elemData.handle)) {
        eventHandle = elemData.handle = function(e) {
          return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
        };
      }
      types = (types || "").match(rnotwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        if (!type) {
          continue;
        }
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        special = jQuery.event.special[type] || {};
        handleObj = jQuery.extend({
          type: type,
          origType: origType,
          data: data,
          handler: handler,
          guid: handler.guid,
          selector: selector,
          needsContext: selector && jQuery.expr.match.needsContext.test(selector),
          namespace: namespaces.join(".")
        }, handleObjIn);
        if (!(handlers = events[type])) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;
          if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle, false);
            }
          }
        }
        if (special.add) {
          special.add.call(elem, handleObj);
          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        }
        jQuery.event.global[type] = true;
      }
    },
    remove: function(elem, types, handler, selector, mappedTypes) {
      var j,
          origCount,
          tmp,
          events,
          t,
          handleObj,
          special,
          handlers,
          type,
          namespaces,
          origType,
          elemData = data_priv.hasData(elem) && data_priv.get(elem);
      if (!elemData || !(events = elemData.events)) {
        return;
      }
      types = (types || "").match(rnotwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        if (!type) {
          for (type in events) {
            jQuery.event.remove(elem, type + types[t], handler, selector, true);
          }
          continue;
        }
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        handlers = events[type] || [];
        tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
        origCount = j = handlers.length;
        while (j--) {
          handleObj = handlers[j];
          if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
            handlers.splice(j, 1);
            if (handleObj.selector) {
              handlers.delegateCount--;
            }
            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        }
        if (origCount && !handlers.length) {
          if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
            jQuery.removeEvent(elem, type, elemData.handle);
          }
          delete events[type];
        }
      }
      if (jQuery.isEmptyObject(events)) {
        delete elemData.handle;
        data_priv.remove(elem, "events");
      }
    },
    trigger: function(event, data, elem, onlyHandlers) {
      var i,
          cur,
          tmp,
          bubbleType,
          ontype,
          handle,
          special,
          eventPath = [elem || document],
          type = hasOwn.call(event, "type") ? event.type : event,
          namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      cur = tmp = elem = elem || document;
      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }
      if (rfocusMorph.test(type + jQuery.event.triggered)) {
        return;
      }
      if (type.indexOf(".") >= 0) {
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces.sort();
      }
      ontype = type.indexOf(":") < 0 && "on" + type;
      event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
      event.isTrigger = onlyHandlers ? 2 : 3;
      event.namespace = namespaces.join(".");
      event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
      event.result = undefined;
      if (!event.target) {
        event.target = elem;
      }
      data = data == null ? [event] : jQuery.makeArray(data, [event]);
      special = jQuery.event.special[type] || {};
      if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
        return;
      }
      if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
        bubbleType = special.delegateType || type;
        if (!rfocusMorph.test(bubbleType + type)) {
          cur = cur.parentNode;
        }
        for (; cur; cur = cur.parentNode) {
          eventPath.push(cur);
          tmp = cur;
        }
        if (tmp === (elem.ownerDocument || document)) {
          eventPath.push(tmp.defaultView || tmp.parentWindow || window);
        }
      }
      i = 0;
      while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
        event.type = i > 1 ? bubbleType : special.bindType || type;
        handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle");
        if (handle) {
          handle.apply(cur, data);
        }
        handle = ontype && cur[ontype];
        if (handle && handle.apply && jQuery.acceptData(cur)) {
          event.result = handle.apply(cur, data);
          if (event.result === false) {
            event.preventDefault();
          }
        }
      }
      event.type = type;
      if (!onlyHandlers && !event.isDefaultPrevented()) {
        if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && jQuery.acceptData(elem)) {
          if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {
            tmp = elem[ontype];
            if (tmp) {
              elem[ontype] = null;
            }
            jQuery.event.triggered = type;
            elem[type]();
            jQuery.event.triggered = undefined;
            if (tmp) {
              elem[ontype] = tmp;
            }
          }
        }
      }
      return event.result;
    },
    dispatch: function(event) {
      event = jQuery.event.fix(event);
      var i,
          j,
          ret,
          matched,
          handleObj,
          handlerQueue = [],
          args = slice.call(arguments),
          handlers = (data_priv.get(this, "events") || {})[event.type] || [],
          special = jQuery.event.special[event.type] || {};
      args[0] = event;
      event.delegateTarget = this;
      if (special.preDispatch && special.preDispatch.call(this, event) === false) {
        return;
      }
      handlerQueue = jQuery.event.handlers.call(this, event, handlers);
      i = 0;
      while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
        event.currentTarget = matched.elem;
        j = 0;
        while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
          if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
            event.handleObj = handleObj;
            event.data = handleObj.data;
            ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
            if (ret !== undefined) {
              if ((event.result = ret) === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }
      if (special.postDispatch) {
        special.postDispatch.call(this, event);
      }
      return event.result;
    },
    handlers: function(event, handlers) {
      var i,
          matches,
          sel,
          handleObj,
          handlerQueue = [],
          delegateCount = handlers.delegateCount,
          cur = event.target;
      if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {
        for (; cur !== this; cur = cur.parentNode || this) {
          if (cur.disabled !== true || event.type !== "click") {
            matches = [];
            for (i = 0; i < delegateCount; i++) {
              handleObj = handlers[i];
              sel = handleObj.selector + " ";
              if (matches[sel] === undefined) {
                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem: cur,
                handlers: matches
              });
            }
          }
        }
      }
      if (delegateCount < handlers.length) {
        handlerQueue.push({
          elem: this,
          handlers: handlers.slice(delegateCount)
        });
      }
      return handlerQueue;
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function(event, original) {
        if (event.which == null) {
          event.which = original.charCode != null ? original.charCode : original.keyCode;
        }
        return event;
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function(event, original) {
        var eventDoc,
            doc,
            body,
            button = original.button;
        if (event.pageX == null && original.clientX != null) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;
          event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }
        if (!event.which && button !== undefined) {
          event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
        }
        return event;
      }
    },
    fix: function(event) {
      if (event[jQuery.expando]) {
        return event;
      }
      var i,
          prop,
          copy,
          type = event.type,
          originalEvent = event,
          fixHook = this.fixHooks[type];
      if (!fixHook) {
        this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
      }
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = new jQuery.Event(originalEvent);
      i = copy.length;
      while (i--) {
        prop = copy[i];
        event[prop] = originalEvent[prop];
      }
      if (!event.target) {
        event.target = document;
      }
      if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
      }
      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    special: {
      load: {noBubble: true},
      focus: {
        trigger: function() {
          if (this !== safeActiveElement() && this.focus) {
            this.focus();
            return false;
          }
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function() {
          if (this === safeActiveElement() && this.blur) {
            this.blur();
            return false;
          }
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function() {
          if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
            this.click();
            return false;
          }
        },
        _default: function(event) {
          return jQuery.nodeName(event.target, "a");
        }
      },
      beforeunload: {postDispatch: function(event) {
          if (event.result !== undefined && event.originalEvent) {
            event.originalEvent.returnValue = event.result;
          }
        }}
    },
    simulate: function(type, elem, event, bubble) {
      var e = jQuery.extend(new jQuery.Event(), event, {
        type: type,
        isSimulated: true,
        originalEvent: {}
      });
      if (bubble) {
        jQuery.event.trigger(e, null, elem);
      } else {
        jQuery.event.dispatch.call(elem, e);
      }
      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    }
  };
  jQuery.removeEvent = function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle, false);
    }
  };
  jQuery.Event = function(src, props) {
    if (!(this instanceof jQuery.Event)) {
      return new jQuery.Event(src, props);
    }
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false ? returnTrue : returnFalse;
    } else {
      this.type = src;
    }
    if (props) {
      jQuery.extend(this, props);
    }
    this.timeStamp = src && src.timeStamp || jQuery.now();
    this[jQuery.expando] = true;
  };
  jQuery.Event.prototype = {
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    preventDefault: function() {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;
      if (e && e.preventDefault) {
        e.preventDefault();
      }
    },
    stopPropagation: function() {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue;
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
    },
    stopImmediatePropagation: function() {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = returnTrue;
      if (e && e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }
      this.stopPropagation();
    }
  };
  jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType: fix,
      bindType: fix,
      handle: function(event) {
        var ret,
            target = this,
            related = event.relatedTarget,
            handleObj = event.handleObj;
        if (!related || (related !== target && !jQuery.contains(target, related))) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply(this, arguments);
          event.type = fix;
        }
        return ret;
      }
    };
  });
  if (!support.focusinBubbles) {
    jQuery.each({
      focus: "focusin",
      blur: "focusout"
    }, function(orig, fix) {
      var handler = function(event) {
        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
      };
      jQuery.event.special[fix] = {
        setup: function() {
          var doc = this.ownerDocument || this,
              attaches = data_priv.access(doc, fix);
          if (!attaches) {
            doc.addEventListener(orig, handler, true);
          }
          data_priv.access(doc, fix, (attaches || 0) + 1);
        },
        teardown: function() {
          var doc = this.ownerDocument || this,
              attaches = data_priv.access(doc, fix) - 1;
          if (!attaches) {
            doc.removeEventListener(orig, handler, true);
            data_priv.remove(doc, fix);
          } else {
            data_priv.access(doc, fix, attaches);
          }
        }
      };
    });
  }
  jQuery.fn.extend({
    on: function(types, selector, data, fn, one) {
      var origFn,
          type;
      if (typeof types === "object") {
        if (typeof selector !== "string") {
          data = data || selector;
          selector = undefined;
        }
        for (type in types) {
          this.on(type, selector, data, types[type], one);
        }
        return this;
      }
      if (data == null && fn == null) {
        fn = selector;
        data = selector = undefined;
      } else if (fn == null) {
        if (typeof selector === "string") {
          fn = data;
          data = undefined;
        } else {
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if (fn === false) {
        fn = returnFalse;
      } else if (!fn) {
        return this;
      }
      if (one === 1) {
        origFn = fn;
        fn = function(event) {
          jQuery().off(event);
          return origFn.apply(this, arguments);
        };
        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
      }
      return this.each(function() {
        jQuery.event.add(this, types, fn, data, selector);
      });
    },
    one: function(types, selector, data, fn) {
      return this.on(types, selector, data, fn, 1);
    },
    off: function(types, selector, fn) {
      var handleObj,
          type;
      if (types && types.preventDefault && types.handleObj) {
        handleObj = types.handleObj;
        jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
        return this;
      }
      if (typeof types === "object") {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === "function") {
        fn = selector;
        selector = undefined;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    trigger: function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler: function(type, data) {
      var elem = this[0];
      if (elem) {
        return jQuery.event.trigger(type, data, elem, true);
      }
    }
  });
  var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
      rtagName = /<([\w:]+)/,
      rhtml = /<|&#?\w+;/,
      rnoInnerhtml = /<(?:script|style|link)/i,
      rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
      rscriptType = /^$|\/(?:java|ecma)script/i,
      rscriptTypeMasked = /^true\/(.*)/,
      rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
      wrapMap = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;
  function manipulationTarget(elem, content) {
    return jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
  }
  function disableScript(elem) {
    elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
    return elem;
  }
  function restoreScript(elem) {
    var match = rscriptTypeMasked.exec(elem.type);
    if (match) {
      elem.type = match[1];
    } else {
      elem.removeAttribute("type");
    }
    return elem;
  }
  function setGlobalEval(elems, refElements) {
    var i = 0,
        l = elems.length;
    for (; i < l; i++) {
      data_priv.set(elems[i], "globalEval", !refElements || data_priv.get(refElements[i], "globalEval"));
    }
  }
  function cloneCopyEvent(src, dest) {
    var i,
        l,
        type,
        pdataOld,
        pdataCur,
        udataOld,
        udataCur,
        events;
    if (dest.nodeType !== 1) {
      return;
    }
    if (data_priv.hasData(src)) {
      pdataOld = data_priv.access(src);
      pdataCur = data_priv.set(dest, pdataOld);
      events = pdataOld.events;
      if (events) {
        delete pdataCur.handle;
        pdataCur.events = {};
        for (type in events) {
          for (i = 0, l = events[type].length; i < l; i++) {
            jQuery.event.add(dest, type, events[type][i]);
          }
        }
      }
    }
    if (data_user.hasData(src)) {
      udataOld = data_user.access(src);
      udataCur = jQuery.extend({}, udataOld);
      data_user.set(dest, udataCur);
    }
  }
  function getAll(context, tag) {
    var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
    return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
  }
  function fixInput(src, dest) {
    var nodeName = dest.nodeName.toLowerCase();
    if (nodeName === "input" && rcheckableType.test(src.type)) {
      dest.checked = src.checked;
    } else if (nodeName === "input" || nodeName === "textarea") {
      dest.defaultValue = src.defaultValue;
    }
  }
  jQuery.extend({
    clone: function(elem, dataAndEvents, deepDataAndEvents) {
      var i,
          l,
          srcElements,
          destElements,
          clone = elem.cloneNode(true),
          inPage = jQuery.contains(elem.ownerDocument, elem);
      if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
        destElements = getAll(clone);
        srcElements = getAll(elem);
        for (i = 0, l = srcElements.length; i < l; i++) {
          fixInput(srcElements[i], destElements[i]);
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);
          for (i = 0, l = srcElements.length; i < l; i++) {
            cloneCopyEvent(srcElements[i], destElements[i]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      }
      destElements = getAll(clone, "script");
      if (destElements.length > 0) {
        setGlobalEval(destElements, !inPage && getAll(elem, "script"));
      }
      return clone;
    },
    buildFragment: function(elems, context, scripts, selection) {
      var elem,
          tmp,
          tag,
          wrap,
          contains,
          j,
          fragment = context.createDocumentFragment(),
          nodes = [],
          i = 0,
          l = elems.length;
      for (; i < l; i++) {
        elem = elems[i];
        if (elem || elem === 0) {
          if (jQuery.type(elem) === "object") {
            jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
          } else if (!rhtml.test(elem)) {
            nodes.push(context.createTextNode(elem));
          } else {
            tmp = tmp || fragment.appendChild(context.createElement("div"));
            tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
            j = wrap[0];
            while (j--) {
              tmp = tmp.lastChild;
            }
            jQuery.merge(nodes, tmp.childNodes);
            tmp = fragment.firstChild;
            tmp.textContent = "";
          }
        }
      }
      fragment.textContent = "";
      i = 0;
      while ((elem = nodes[i++])) {
        if (selection && jQuery.inArray(elem, selection) !== -1) {
          continue;
        }
        contains = jQuery.contains(elem.ownerDocument, elem);
        tmp = getAll(fragment.appendChild(elem), "script");
        if (contains) {
          setGlobalEval(tmp);
        }
        if (scripts) {
          j = 0;
          while ((elem = tmp[j++])) {
            if (rscriptType.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }
      return fragment;
    },
    cleanData: function(elems) {
      var data,
          elem,
          type,
          key,
          special = jQuery.event.special,
          i = 0;
      for (; (elem = elems[i]) !== undefined; i++) {
        if (jQuery.acceptData(elem)) {
          key = elem[data_priv.expando];
          if (key && (data = data_priv.cache[key])) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  jQuery.event.remove(elem, type);
                } else {
                  jQuery.removeEvent(elem, type, data.handle);
                }
              }
            }
            if (data_priv.cache[key]) {
              delete data_priv.cache[key];
            }
          }
        }
        delete data_user.cache[elem[data_user.expando]];
      }
    }
  });
  jQuery.fn.extend({
    text: function(value) {
      return access(this, function(value) {
        return value === undefined ? jQuery.text(this) : this.empty().each(function() {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            this.textContent = value;
          }
        });
      }, null, value, arguments.length);
    },
    append: function() {
      return this.domManip(arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    prepend: function() {
      return this.domManip(arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    before: function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    after: function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    remove: function(selector, keepData) {
      var elem,
          elems = selector ? jQuery.filter(selector, this) : this,
          i = 0;
      for (; (elem = elems[i]) != null; i++) {
        if (!keepData && elem.nodeType === 1) {
          jQuery.cleanData(getAll(elem));
        }
        if (elem.parentNode) {
          if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
            setGlobalEval(getAll(elem, "script"));
          }
          elem.parentNode.removeChild(elem);
        }
      }
      return this;
    },
    empty: function() {
      var elem,
          i = 0;
      for (; (elem = this[i]) != null; i++) {
        if (elem.nodeType === 1) {
          jQuery.cleanData(getAll(elem, false));
          elem.textContent = "";
        }
      }
      return this;
    },
    clone: function(dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      return this.map(function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function(value) {
      return access(this, function(value) {
        var elem = this[0] || {},
            i = 0,
            l = this.length;
        if (value === undefined && elem.nodeType === 1) {
          return elem.innerHTML;
        }
        if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
          value = value.replace(rxhtmlTag, "<$1></$2>");
          try {
            for (; i < l; i++) {
              elem = this[i] || {};
              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.innerHTML = value;
              }
            }
            elem = 0;
          } catch (e) {}
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    replaceWith: function() {
      var arg = arguments[0];
      this.domManip(arguments, function(elem) {
        arg = this.parentNode;
        jQuery.cleanData(getAll(this));
        if (arg) {
          arg.replaceChild(elem, this);
        }
      });
      return arg && (arg.length || arg.nodeType) ? this : this.remove();
    },
    detach: function(selector) {
      return this.remove(selector, true);
    },
    domManip: function(args, callback) {
      args = concat.apply([], args);
      var fragment,
          first,
          scripts,
          hasScripts,
          node,
          doc,
          i = 0,
          l = this.length,
          set = this,
          iNoClone = l - 1,
          value = args[0],
          isFunction = jQuery.isFunction(value);
      if (isFunction || (l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value))) {
        return this.each(function(index) {
          var self = set.eq(index);
          if (isFunction) {
            args[0] = value.call(this, index, self.html());
          }
          self.domManip(args, callback);
        });
      }
      if (l) {
        fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
        first = fragment.firstChild;
        if (fragment.childNodes.length === 1) {
          fragment = first;
        }
        if (first) {
          scripts = jQuery.map(getAll(fragment, "script"), disableScript);
          hasScripts = scripts.length;
          for (; i < l; i++) {
            node = fragment;
            if (i !== iNoClone) {
              node = jQuery.clone(node, true, true);
              if (hasScripts) {
                jQuery.merge(scripts, getAll(node, "script"));
              }
            }
            callback.call(this[i], node, i);
          }
          if (hasScripts) {
            doc = scripts[scripts.length - 1].ownerDocument;
            jQuery.map(scripts, restoreScript);
            for (i = 0; i < hasScripts; i++) {
              node = scripts[i];
              if (rscriptType.test(node.type || "") && !data_priv.access(node, "globalEval") && jQuery.contains(doc, node)) {
                if (node.src) {
                  if (jQuery._evalUrl) {
                    jQuery._evalUrl(node.src);
                  }
                } else {
                  jQuery.globalEval(node.textContent.replace(rcleanScript, ""));
                }
              }
            }
          }
        }
      }
      return this;
    }
  });
  jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(name, original) {
    jQuery.fn[name] = function(selector) {
      var elems,
          ret = [],
          insert = jQuery(selector),
          last = insert.length - 1,
          i = 0;
      for (; i <= last; i++) {
        elems = i === last ? this : this.clone(true);
        jQuery(insert[i])[original](elems);
        push.apply(ret, elems.get());
      }
      return this.pushStack(ret);
    };
  });
  var iframe,
      elemdisplay = {};
  function actualDisplay(name, doc) {
    var style,
        elem = jQuery(doc.createElement(name)).appendTo(doc.body),
        display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ? style.display : jQuery.css(elem[0], "display");
    elem.detach();
    return display;
  }
  function defaultDisplay(nodeName) {
    var doc = document,
        display = elemdisplay[nodeName];
    if (!display) {
      display = actualDisplay(nodeName, doc);
      if (display === "none" || !display) {
        iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);
        doc = iframe[0].contentDocument;
        doc.write();
        doc.close();
        display = actualDisplay(nodeName, doc);
        iframe.detach();
      }
      elemdisplay[nodeName] = display;
    }
    return display;
  }
  var rmargin = (/^margin/);
  var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
  var getStyles = function(elem) {
    if (elem.ownerDocument.defaultView.opener) {
      return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    }
    return window.getComputedStyle(elem, null);
  };
  function curCSS(elem, name, computed) {
    var width,
        minWidth,
        maxWidth,
        ret,
        style = elem.style;
    computed = computed || getStyles(elem);
    if (computed) {
      ret = computed.getPropertyValue(name) || computed[name];
    }
    if (computed) {
      if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
        ret = jQuery.style(elem, name);
      }
      if (rnumnonpx.test(ret) && rmargin.test(name)) {
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;
        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;
        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }
    return ret !== undefined ? ret + "" : ret;
  }
  function addGetHookIf(conditionFn, hookFn) {
    return {get: function() {
        if (conditionFn()) {
          delete this.get;
          return;
        }
        return (this.get = hookFn).apply(this, arguments);
      }};
  }
  (function() {
    var pixelPositionVal,
        boxSizingReliableVal,
        docElem = document.documentElement,
        container = document.createElement("div"),
        div = document.createElement("div");
    if (!div.style) {
      return;
    }
    div.style.backgroundClip = "content-box";
    div.cloneNode(true).style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";
    container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" + "position:absolute";
    container.appendChild(div);
    function computePixelPositionAndBoxSizingReliable() {
      div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" + "box-sizing:border-box;display:block;margin-top:1%;top:1%;" + "border:1px;padding:1px;width:4px;position:absolute";
      div.innerHTML = "";
      docElem.appendChild(container);
      var divStyle = window.getComputedStyle(div, null);
      pixelPositionVal = divStyle.top !== "1%";
      boxSizingReliableVal = divStyle.width === "4px";
      docElem.removeChild(container);
    }
    if (window.getComputedStyle) {
      jQuery.extend(support, {
        pixelPosition: function() {
          computePixelPositionAndBoxSizingReliable();
          return pixelPositionVal;
        },
        boxSizingReliable: function() {
          if (boxSizingReliableVal == null) {
            computePixelPositionAndBoxSizingReliable();
          }
          return boxSizingReliableVal;
        },
        reliableMarginRight: function() {
          var ret,
              marginDiv = div.appendChild(document.createElement("div"));
          marginDiv.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
          marginDiv.style.marginRight = marginDiv.style.width = "0";
          div.style.width = "1px";
          docElem.appendChild(container);
          ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight);
          docElem.removeChild(container);
          div.removeChild(marginDiv);
          return ret;
        }
      });
    }
  })();
  jQuery.swap = function(elem, options, callback, args) {
    var ret,
        name,
        old = {};
    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }
    ret = callback.apply(elem, args || []);
    for (name in options) {
      elem.style[name] = old[name];
    }
    return ret;
  };
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
      rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"),
      rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"),
      cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
      },
      cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
      },
      cssPrefixes = ["Webkit", "O", "Moz", "ms"];
  function vendorPropName(style, name) {
    if (name in style) {
      return name;
    }
    var capName = name[0].toUpperCase() + name.slice(1),
        origName = name,
        i = cssPrefixes.length;
    while (i--) {
      name = cssPrefixes[i] + capName;
      if (name in style) {
        return name;
      }
    }
    return origName;
  }
  function setPositiveNumber(elem, value, subtract) {
    var matches = rnumsplit.exec(value);
    return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
  }
  function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
    var i = extra === (isBorderBox ? "border" : "content") ? 4 : name === "width" ? 1 : 0,
        val = 0;
    for (; i < 4; i += 2) {
      if (extra === "margin") {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if (extra === "content") {
          val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        }
        if (extra !== "margin") {
          val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      } else {
        val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        if (extra !== "padding") {
          val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      }
    }
    return val;
  }
  function getWidthOrHeight(elem, name, extra) {
    var valueIsBorderBox = true,
        val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
        styles = getStyles(elem),
        isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
    if (val <= 0 || val == null) {
      val = curCSS(elem, name, styles);
      if (val < 0 || val == null) {
        val = elem.style[name];
      }
      if (rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
      val = parseFloat(val) || 0;
    }
    return (val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles)) + "px";
  }
  function showHide(elements, show) {
    var display,
        elem,
        hidden,
        values = [],
        index = 0,
        length = elements.length;
    for (; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      values[index] = data_priv.get(elem, "olddisplay");
      display = elem.style.display;
      if (show) {
        if (!values[index] && display === "none") {
          elem.style.display = "";
        }
        if (elem.style.display === "" && isHidden(elem)) {
          values[index] = data_priv.access(elem, "olddisplay", defaultDisplay(elem.nodeName));
        }
      } else {
        hidden = isHidden(elem);
        if (display !== "none" || !hidden) {
          data_priv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
        }
      }
    }
    for (index = 0; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      if (!show || elem.style.display === "none" || elem.style.display === "") {
        elem.style.display = show ? values[index] || "" : "none";
      }
    }
    return elements;
  }
  jQuery.extend({
    cssHooks: {opacity: {get: function(elem, computed) {
          if (computed) {
            var ret = curCSS(elem, "opacity");
            return ret === "" ? "1" : ret;
          }
        }}},
    cssNumber: {
      "columnCount": true,
      "fillOpacity": true,
      "flexGrow": true,
      "flexShrink": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    },
    cssProps: {"float": "cssFloat"},
    style: function(elem, name, value, extra) {
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }
      var ret,
          type,
          hooks,
          origName = jQuery.camelCase(name),
          style = elem.style;
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
      if (value !== undefined) {
        type = typeof value;
        if (type === "string" && (ret = rrelNum.exec(value))) {
          value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
          type = "number";
        }
        if (value == null || value !== value) {
          return;
        }
        if (type === "number" && !jQuery.cssNumber[origName]) {
          value += "px";
        }
        if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
          style[name] = "inherit";
        }
        if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
          style[name] = value;
        }
      } else {
        if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
          return ret;
        }
        return style[name];
      }
    },
    css: function(elem, name, extra, styles) {
      var val,
          num,
          hooks,
          origName = jQuery.camelCase(name);
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
      if (hooks && "get" in hooks) {
        val = hooks.get(elem, true, extra);
      }
      if (val === undefined) {
        val = curCSS(elem, name, styles);
      }
      if (val === "normal" && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      }
      if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
      }
      return val;
    }
  });
  jQuery.each(["height", "width"], function(i, name) {
    jQuery.cssHooks[name] = {
      get: function(elem, computed, extra) {
        if (computed) {
          return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ? jQuery.swap(elem, cssShow, function() {
            return getWidthOrHeight(elem, name, extra);
          }) : getWidthOrHeight(elem, name, extra);
        }
      },
      set: function(elem, value, extra) {
        var styles = extra && getStyles(elem);
        return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles) : 0);
      }
    };
  });
  jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(elem, computed) {
    if (computed) {
      return jQuery.swap(elem, {"display": "inline-block"}, curCSS, [elem, "marginRight"]);
    }
  });
  jQuery.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {expand: function(value) {
        var i = 0,
            expanded = {},
            parts = typeof value === "string" ? value.split(" ") : [value];
        for (; i < 4; i++) {
          expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
        }
        return expanded;
      }};
    if (!rmargin.test(prefix)) {
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  jQuery.fn.extend({
    css: function(name, value) {
      return access(this, function(elem, name, value) {
        var styles,
            len,
            map = {},
            i = 0;
        if (jQuery.isArray(name)) {
          styles = getStyles(elem);
          len = name.length;
          for (; i < len; i++) {
            map[name[i]] = jQuery.css(elem, name[i], false, styles);
          }
          return map;
        }
        return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
      }, name, value, arguments.length > 1);
    },
    show: function() {
      return showHide(this, true);
    },
    hide: function() {
      return showHide(this);
    },
    toggle: function(state) {
      if (typeof state === "boolean") {
        return state ? this.show() : this.hide();
      }
      return this.each(function() {
        if (isHidden(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }
  jQuery.Tween = Tween;
  Tween.prototype = {
    constructor: Tween,
    init: function(elem, options, prop, end, easing, unit) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || "swing";
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    cur: function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    run: function(percent) {
      var eased,
          hooks = Tween.propHooks[this.prop];
      if (this.options.duration) {
        this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
      } else {
        this.pos = eased = percent;
      }
      this.now = (this.end - this.start) * eased + this.start;
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }
      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }
      return this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {_default: {
      get: function(tween) {
        var result;
        if (tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
          return tween.elem[tween.prop];
        }
        result = jQuery.css(tween.elem, tween.prop, "");
        return !result || result === "auto" ? 0 : result;
      },
      set: function(tween) {
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
          jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
        } else {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }};
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {set: function(tween) {
      if (tween.elem.nodeType && tween.elem.parentNode) {
        tween.elem[tween.prop] = tween.now;
      }
    }};
  jQuery.easing = {
    linear: function(p) {
      return p;
    },
    swing: function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    }
  };
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.step = {};
  var fxNow,
      timerId,
      rfxtypes = /^(?:toggle|show|hide)$/,
      rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"),
      rrun = /queueHooks$/,
      animationPrefilters = [defaultPrefilter],
      tweeners = {"*": [function(prop, value) {
          var tween = this.createTween(prop, value),
              target = tween.cur(),
              parts = rfxnum.exec(value),
              unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"),
              start = (jQuery.cssNumber[prop] || unit !== "px" && +target) && rfxnum.exec(jQuery.css(tween.elem, prop)),
              scale = 1,
              maxIterations = 20;
          if (start && start[3] !== unit) {
            unit = unit || start[3];
            parts = parts || [];
            start = +target || 1;
            do {
              scale = scale || ".5";
              start = start / scale;
              jQuery.style(tween.elem, prop, start + unit);
            } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
          }
          if (parts) {
            start = tween.start = +start || +target || 0;
            tween.unit = unit;
            tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2];
          }
          return tween;
        }]};
  function createFxNow() {
    setTimeout(function() {
      fxNow = undefined;
    });
    return (fxNow = jQuery.now());
  }
  function genFx(type, includeWidth) {
    var which,
        i = 0,
        attrs = {height: type};
    includeWidth = includeWidth ? 1 : 0;
    for (; i < 4; i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }
    return attrs;
  }
  function createTween(value, prop, animation) {
    var tween,
        collection = (tweeners[prop] || []).concat(tweeners["*"]),
        index = 0,
        length = collection.length;
    for (; index < length; index++) {
      if ((tween = collection[index].call(animation, prop, value))) {
        return tween;
      }
    }
  }
  function defaultPrefilter(elem, props, opts) {
    var prop,
        value,
        toggle,
        tween,
        hooks,
        oldfire,
        display,
        checkDisplay,
        anim = this,
        orig = {},
        style = elem.style,
        hidden = elem.nodeType && isHidden(elem),
        dataShow = data_priv.get(elem, "fxshow");
    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, "fx");
      if (hooks.unqueued == null) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function() {
        anim.always(function() {
          hooks.unqueued--;
          if (!jQuery.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
      opts.overflow = [style.overflow, style.overflowX, style.overflowY];
      display = jQuery.css(elem, "display");
      checkDisplay = display === "none" ? data_priv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;
      if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
        style.display = "inline-block";
      }
    }
    if (opts.overflow) {
      style.overflow = "hidden";
      anim.always(function() {
        style.overflow = opts.overflow[0];
        style.overflowX = opts.overflow[1];
        style.overflowY = opts.overflow[2];
      });
    }
    for (prop in props) {
      value = props[prop];
      if (rfxtypes.exec(value)) {
        delete props[prop];
        toggle = toggle || value === "toggle";
        if (value === (hidden ? "hide" : "show")) {
          if (value === "show" && dataShow && dataShow[prop] !== undefined) {
            hidden = true;
          } else {
            continue;
          }
        }
        orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      } else {
        display = undefined;
      }
    }
    if (!jQuery.isEmptyObject(orig)) {
      if (dataShow) {
        if ("hidden" in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = data_priv.access(elem, "fxshow", {});
      }
      if (toggle) {
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        jQuery(elem).show();
      } else {
        anim.done(function() {
          jQuery(elem).hide();
        });
      }
      anim.done(function() {
        var prop;
        data_priv.remove(elem, "fxshow");
        for (prop in orig) {
          jQuery.style(elem, prop, orig[prop]);
        }
      });
      for (prop in orig) {
        tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
        if (!(prop in dataShow)) {
          dataShow[prop] = tween.start;
          if (hidden) {
            tween.end = tween.start;
            tween.start = prop === "width" || prop === "height" ? 1 : 0;
          }
        }
      }
    } else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
      style.display = display;
    }
  }
  function propFilter(props, specialEasing) {
    var index,
        name,
        easing,
        value,
        hooks;
    for (index in props) {
      name = jQuery.camelCase(index);
      easing = specialEasing[name];
      value = props[index];
      if (jQuery.isArray(value)) {
        easing = value[1];
        value = props[index] = value[0];
      }
      if (index !== name) {
        props[name] = value;
        delete props[index];
      }
      hooks = jQuery.cssHooks[name];
      if (hooks && "expand" in hooks) {
        value = hooks.expand(value);
        delete props[name];
        for (index in value) {
          if (!(index in props)) {
            props[index] = value[index];
            specialEasing[index] = easing;
          }
        }
      } else {
        specialEasing[name] = easing;
      }
    }
  }
  function Animation(elem, properties, options) {
    var result,
        stopped,
        index = 0,
        length = animationPrefilters.length,
        deferred = jQuery.Deferred().always(function() {
          delete tick.elem;
        }),
        tick = function() {
          if (stopped) {
            return false;
          }
          var currentTime = fxNow || createFxNow(),
              remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
              temp = remaining / animation.duration || 0,
              percent = 1 - temp,
              index = 0,
              length = animation.tweens.length;
          for (; index < length; index++) {
            animation.tweens[index].run(percent);
          }
          deferred.notifyWith(elem, [animation, percent, remaining]);
          if (percent < 1 && length) {
            return remaining;
          } else {
            deferred.resolveWith(elem, [animation]);
            return false;
          }
        },
        animation = deferred.promise({
          elem: elem,
          props: jQuery.extend({}, properties),
          opts: jQuery.extend(true, {specialEasing: {}}, options),
          originalProperties: properties,
          originalOptions: options,
          startTime: fxNow || createFxNow(),
          duration: options.duration,
          tweens: [],
          createTween: function(prop, end) {
            var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
            animation.tweens.push(tween);
            return tween;
          },
          stop: function(gotoEnd) {
            var index = 0,
                length = gotoEnd ? animation.tweens.length : 0;
            if (stopped) {
              return this;
            }
            stopped = true;
            for (; index < length; index++) {
              animation.tweens[index].run(1);
            }
            if (gotoEnd) {
              deferred.resolveWith(elem, [animation, gotoEnd]);
            } else {
              deferred.rejectWith(elem, [animation, gotoEnd]);
            }
            return this;
          }
        }),
        props = animation.props;
    propFilter(props, animation.opts.specialEasing);
    for (; index < length; index++) {
      result = animationPrefilters[index].call(animation, elem, props, animation.opts);
      if (result) {
        return result;
      }
    }
    jQuery.map(props, createTween, animation);
    if (jQuery.isFunction(animation.opts.start)) {
      animation.opts.start.call(elem, animation);
    }
    jQuery.fx.timer(jQuery.extend(tick, {
      elem: elem,
      anim: animation,
      queue: animation.opts.queue
    }));
    return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  jQuery.Animation = jQuery.extend(Animation, {
    tweener: function(props, callback) {
      if (jQuery.isFunction(props)) {
        callback = props;
        props = ["*"];
      } else {
        props = props.split(" ");
      }
      var prop,
          index = 0,
          length = props.length;
      for (; index < length; index++) {
        prop = props[index];
        tweeners[prop] = tweeners[prop] || [];
        tweeners[prop].unshift(callback);
      }
    },
    prefilter: function(callback, prepend) {
      if (prepend) {
        animationPrefilters.unshift(callback);
      } else {
        animationPrefilters.push(callback);
      }
    }
  });
  jQuery.speed = function(speed, easing, fn) {
    var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
      complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
      duration: speed,
      easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
    };
    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
    if (opt.queue == null || opt.queue === true) {
      opt.queue = "fx";
    }
    opt.old = opt.complete;
    opt.complete = function() {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    };
    return opt;
  };
  jQuery.fn.extend({
    fadeTo: function(speed, to, easing, callback) {
      return this.filter(isHidden).css("opacity", 0).show().end().animate({opacity: to}, speed, easing, callback);
    },
    animate: function(prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop),
          optall = jQuery.speed(speed, easing, callback),
          doAnimation = function() {
            var anim = Animation(this, jQuery.extend({}, prop), optall);
            if (empty || data_priv.get(this, "finish")) {
              anim.stop(true);
            }
          };
      doAnimation.finish = doAnimation;
      return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    stop: function(type, clearQueue, gotoEnd) {
      var stopQueue = function(hooks) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop(gotoEnd);
      };
      if (typeof type !== "string") {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if (clearQueue && type !== false) {
        this.queue(type || "fx", []);
      }
      return this.each(function() {
        var dequeue = true,
            index = type != null && type + "queueHooks",
            timers = jQuery.timers,
            data = data_priv.get(this);
        if (index) {
          if (data[index] && data[index].stop) {
            stopQueue(data[index]);
          }
        } else {
          for (index in data) {
            if (data[index] && data[index].stop && rrun.test(index)) {
              stopQueue(data[index]);
            }
          }
        }
        for (index = timers.length; index--; ) {
          if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
            timers[index].anim.stop(gotoEnd);
            dequeue = false;
            timers.splice(index, 1);
          }
        }
        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    },
    finish: function(type) {
      if (type !== false) {
        type = type || "fx";
      }
      return this.each(function() {
        var index,
            data = data_priv.get(this),
            queue = data[type + "queue"],
            hooks = data[type + "queueHooks"],
            timers = jQuery.timers,
            length = queue ? queue.length : 0;
        data.finish = true;
        jQuery.queue(this, type, []);
        if (hooks && hooks.stop) {
          hooks.stop.call(this, true);
        }
        for (index = timers.length; index--; ) {
          if (timers[index].elem === this && timers[index].queue === type) {
            timers[index].anim.stop(true);
            timers.splice(index, 1);
          }
        }
        for (index = 0; index < length; index++) {
          if (queue[index] && queue[index].finish) {
            queue[index].finish.call(this);
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery.each(["toggle", "show", "hide"], function(i, name) {
    var cssFn = jQuery.fn[name];
    jQuery.fn[name] = function(speed, easing, callback) {
      return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
    };
  });
  jQuery.each({
    slideDown: genFx("show"),
    slideUp: genFx("hide"),
    slideToggle: genFx("toggle"),
    fadeIn: {opacity: "show"},
    fadeOut: {opacity: "hide"},
    fadeToggle: {opacity: "toggle"}
  }, function(name, props) {
    jQuery.fn[name] = function(speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  });
  jQuery.timers = [];
  jQuery.fx.tick = function() {
    var timer,
        i = 0,
        timers = jQuery.timers;
    fxNow = jQuery.now();
    for (; i < timers.length; i++) {
      timer = timers[i];
      if (!timer() && timers[i] === timer) {
        timers.splice(i--, 1);
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    fxNow = undefined;
  };
  jQuery.fx.timer = function(timer) {
    jQuery.timers.push(timer);
    if (timer()) {
      jQuery.fx.start();
    } else {
      jQuery.timers.pop();
    }
  };
  jQuery.fx.interval = 13;
  jQuery.fx.start = function() {
    if (!timerId) {
      timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  jQuery.fx.stop = function() {
    clearInterval(timerId);
    timerId = null;
  };
  jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  };
  jQuery.fn.delay = function(time, type) {
    time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
    type = type || "fx";
    return this.queue(type, function(next, hooks) {
      var timeout = setTimeout(next, time);
      hooks.stop = function() {
        clearTimeout(timeout);
      };
    });
  };
  (function() {
    var input = document.createElement("input"),
        select = document.createElement("select"),
        opt = select.appendChild(document.createElement("option"));
    input.type = "checkbox";
    support.checkOn = input.value !== "";
    support.optSelected = opt.selected;
    select.disabled = true;
    support.optDisabled = !opt.disabled;
    input = document.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";
  })();
  var nodeHook,
      boolHook,
      attrHandle = jQuery.expr.attrHandle;
  jQuery.fn.extend({
    attr: function(name, value) {
      return access(this, jQuery.attr, name, value, arguments.length > 1);
    },
    removeAttr: function(name) {
      return this.each(function() {
        jQuery.removeAttr(this, name);
      });
    }
  });
  jQuery.extend({
    attr: function(elem, name, value) {
      var hooks,
          ret,
          nType = elem.nodeType;
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (typeof elem.getAttribute === strundefined) {
        return jQuery.prop(elem, name, value);
      }
      if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
        name = name.toLowerCase();
        hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
      }
      if (value !== undefined) {
        if (value === null) {
          jQuery.removeAttr(elem, name);
        } else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
          return ret;
        } else {
          elem.setAttribute(name, value + "");
          return value;
        }
      } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      } else {
        ret = jQuery.find.attr(elem, name);
        return ret == null ? undefined : ret;
      }
    },
    removeAttr: function(elem, value) {
      var name,
          propName,
          i = 0,
          attrNames = value && value.match(rnotwhite);
      if (attrNames && elem.nodeType === 1) {
        while ((name = attrNames[i++])) {
          propName = jQuery.propFix[name] || name;
          if (jQuery.expr.match.bool.test(name)) {
            elem[propName] = false;
          }
          elem.removeAttribute(name);
        }
      }
    },
    attrHooks: {type: {set: function(elem, value) {
          if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
            var val = elem.value;
            elem.setAttribute("type", value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        }}}
  });
  boolHook = {set: function(elem, value, name) {
      if (value === false) {
        jQuery.removeAttr(elem, name);
      } else {
        elem.setAttribute(name, name);
      }
      return name;
    }};
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
    var getter = attrHandle[name] || jQuery.find.attr;
    attrHandle[name] = function(elem, name, isXML) {
      var ret,
          handle;
      if (!isXML) {
        handle = attrHandle[name];
        attrHandle[name] = ret;
        ret = getter(elem, name, isXML) != null ? name.toLowerCase() : null;
        attrHandle[name] = handle;
      }
      return ret;
    };
  });
  var rfocusable = /^(?:input|select|textarea|button)$/i;
  jQuery.fn.extend({
    prop: function(name, value) {
      return access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    removeProp: function(name) {
      return this.each(function() {
        delete this[jQuery.propFix[name] || name];
      });
    }
  });
  jQuery.extend({
    propFix: {
      "for": "htmlFor",
      "class": "className"
    },
    prop: function(elem, name, value) {
      var ret,
          hooks,
          notxml,
          nType = elem.nodeType;
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
      if (notxml) {
        name = jQuery.propFix[name] || name;
        hooks = jQuery.propHooks[name];
      }
      if (value !== undefined) {
        return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : (elem[name] = value);
      } else {
        return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ? ret : elem[name];
      }
    },
    propHooks: {tabIndex: {get: function(elem) {
          return elem.hasAttribute("tabindex") || rfocusable.test(elem.nodeName) || elem.href ? elem.tabIndex : -1;
        }}}
  });
  if (!support.optSelected) {
    jQuery.propHooks.selected = {get: function(elem) {
        var parent = elem.parentNode;
        if (parent && parent.parentNode) {
          parent.parentNode.selectedIndex;
        }
        return null;
      }};
  }
  jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    jQuery.propFix[this.toLowerCase()] = this;
  });
  var rclass = /[\t\r\n\f]/g;
  jQuery.fn.extend({
    addClass: function(value) {
      var classes,
          elem,
          cur,
          clazz,
          j,
          finalValue,
          proceed = typeof value === "string" && value,
          i = 0,
          len = this.length;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).addClass(value.call(this, j, this.className));
        });
      }
      if (proceed) {
        classes = (value || "").match(rnotwhite) || [];
        for (; i < len; i++) {
          elem = this[i];
          cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ");
          if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
              if (cur.indexOf(" " + clazz + " ") < 0) {
                cur += clazz + " ";
              }
            }
            finalValue = jQuery.trim(cur);
            if (elem.className !== finalValue) {
              elem.className = finalValue;
            }
          }
        }
      }
      return this;
    },
    removeClass: function(value) {
      var classes,
          elem,
          cur,
          clazz,
          j,
          finalValue,
          proceed = arguments.length === 0 || typeof value === "string" && value,
          i = 0,
          len = this.length;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).removeClass(value.call(this, j, this.className));
        });
      }
      if (proceed) {
        classes = (value || "").match(rnotwhite) || [];
        for (; i < len; i++) {
          elem = this[i];
          cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "");
          if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
              while (cur.indexOf(" " + clazz + " ") >= 0) {
                cur = cur.replace(" " + clazz + " ", " ");
              }
            }
            finalValue = value ? jQuery.trim(cur) : "";
            if (elem.className !== finalValue) {
              elem.className = finalValue;
            }
          }
        }
      }
      return this;
    },
    toggleClass: function(value, stateVal) {
      var type = typeof value;
      if (typeof stateVal === "boolean" && type === "string") {
        return stateVal ? this.addClass(value) : this.removeClass(value);
      }
      if (jQuery.isFunction(value)) {
        return this.each(function(i) {
          jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
        });
      }
      return this.each(function() {
        if (type === "string") {
          var className,
              i = 0,
              self = jQuery(this),
              classNames = value.match(rnotwhite) || [];
          while ((className = classNames[i++])) {
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }
        } else if (type === strundefined || type === "boolean") {
          if (this.className) {
            data_priv.set(this, "__className__", this.className);
          }
          this.className = this.className || value === false ? "" : data_priv.get(this, "__className__") || "";
        }
      });
    },
    hasClass: function(selector) {
      var className = " " + selector + " ",
          i = 0,
          l = this.length;
      for (; i < l; i++) {
        if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
          return true;
        }
      }
      return false;
    }
  });
  var rreturn = /\r/g;
  jQuery.fn.extend({val: function(value) {
      var hooks,
          ret,
          isFunction,
          elem = this[0];
      if (!arguments.length) {
        if (elem) {
          hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
          if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
            return ret;
          }
          ret = elem.value;
          return typeof ret === "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret;
        }
        return;
      }
      isFunction = jQuery.isFunction(value);
      return this.each(function(i) {
        var val;
        if (this.nodeType !== 1) {
          return;
        }
        if (isFunction) {
          val = value.call(this, i, jQuery(this).val());
        } else {
          val = value;
        }
        if (val == null) {
          val = "";
        } else if (typeof val === "number") {
          val += "";
        } else if (jQuery.isArray(val)) {
          val = jQuery.map(val, function(value) {
            return value == null ? "" : value + "";
          });
        }
        hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
        if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
          this.value = val;
        }
      });
    }});
  jQuery.extend({valHooks: {
      option: {get: function(elem) {
          var val = jQuery.find.attr(elem, "value");
          return val != null ? val : jQuery.trim(jQuery.text(elem));
        }},
      select: {
        get: function(elem) {
          var value,
              option,
              options = elem.options,
              index = elem.selectedIndex,
              one = elem.type === "select-one" || index < 0,
              values = one ? null : [],
              max = one ? index + 1 : options.length,
              i = index < 0 ? max : one ? index : 0;
          for (; i < max; i++) {
            option = options[i];
            if ((option.selected || i === index) && (support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
              value = jQuery(option).val();
              if (one) {
                return value;
              }
              values.push(value);
            }
          }
          return values;
        },
        set: function(elem, value) {
          var optionSet,
              option,
              options = elem.options,
              values = jQuery.makeArray(value),
              i = options.length;
          while (i--) {
            option = options[i];
            if ((option.selected = jQuery.inArray(option.value, values) >= 0)) {
              optionSet = true;
            }
          }
          if (!optionSet) {
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    }});
  jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {set: function(elem, value) {
        if (jQuery.isArray(value)) {
          return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
        }
      }};
    if (!support.checkOn) {
      jQuery.valHooks[this].get = function(elem) {
        return elem.getAttribute("value") === null ? "on" : elem.value;
      };
    }
  });
  jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function(i, name) {
    jQuery.fn[name] = function(data, fn) {
      return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({
    hover: function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
    bind: function(types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function(types, fn) {
      return this.off(types, null, fn);
    },
    delegate: function(selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function(selector, types, fn) {
      return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    }
  });
  var nonce = jQuery.now();
  var rquery = (/\?/);
  jQuery.parseJSON = function(data) {
    return JSON.parse(data + "");
  };
  jQuery.parseXML = function(data) {
    var xml,
        tmp;
    if (!data || typeof data !== "string") {
      return null;
    }
    try {
      tmp = new DOMParser();
      xml = tmp.parseFromString(data, "text/xml");
    } catch (e) {
      xml = undefined;
    }
    if (!xml || xml.getElementsByTagName("parsererror").length) {
      jQuery.error("Invalid XML: " + data);
    }
    return xml;
  };
  var rhash = /#.*$/,
      rts = /([?&])_=[^&]*/,
      rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
      rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
      rnoContent = /^(?:GET|HEAD)$/,
      rprotocol = /^\/\//,
      rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
      prefilters = {},
      transports = {},
      allTypes = "*/".concat("*"),
      ajaxLocation = window.location.href,
      ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
  function addToPrefiltersOrTransports(structure) {
    return function(dataTypeExpression, func) {
      if (typeof dataTypeExpression !== "string") {
        func = dataTypeExpression;
        dataTypeExpression = "*";
      }
      var dataType,
          i = 0,
          dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
      if (jQuery.isFunction(func)) {
        while ((dataType = dataTypes[i++])) {
          if (dataType[0] === "+") {
            dataType = dataType.slice(1) || "*";
            (structure[dataType] = structure[dataType] || []).unshift(func);
          } else {
            (structure[dataType] = structure[dataType] || []).push(func);
          }
        }
      }
    };
  }
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    var inspected = {},
        seekingTransport = (structure === transports);
    function inspect(dataType) {
      var selected;
      inspected[dataType] = true;
      jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
        var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
        if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
          options.dataTypes.unshift(dataTypeOrTransport);
          inspect(dataTypeOrTransport);
          return false;
        } else if (seekingTransport) {
          return !(selected = dataTypeOrTransport);
        }
      });
      return selected;
    }
    return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
  }
  function ajaxExtend(target, src) {
    var key,
        deep,
        flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
      }
    }
    if (deep) {
      jQuery.extend(true, target, deep);
    }
    return target;
  }
  function ajaxHandleResponses(s, jqXHR, responses) {
    var ct,
        type,
        finalDataType,
        firstDataType,
        contents = s.contents,
        dataTypes = s.dataTypes;
    while (dataTypes[0] === "*") {
      dataTypes.shift();
      if (ct === undefined) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      finalDataType = finalDataType || firstDataType;
    }
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }
      return responses[finalDataType];
    }
  }
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2,
        current,
        conv,
        tmp,
        prev,
        converters = {},
        dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    while (current) {
      if (s.responseFields[current]) {
        jqXHR[s.responseFields[current]] = response;
      }
      if (!prev && isSuccess && s.dataFilter) {
        response = s.dataFilter(response, s.dataType);
      }
      prev = current;
      current = dataTypes.shift();
      if (current) {
        if (current === "*") {
          current = prev;
        } else if (prev !== "*" && prev !== current) {
          conv = converters[prev + " " + current] || converters["* " + current];
          if (!conv) {
            for (conv2 in converters) {
              tmp = conv2.split(" ");
              if (tmp[1] === current) {
                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                if (conv) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.unshift(tmp[1]);
                  }
                  break;
                }
              }
            }
          }
          if (conv !== true) {
            if (conv && s["throws"]) {
              response = conv(response);
            } else {
              try {
                response = conv(response);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: conv ? e : "No conversion from " + prev + " to " + current
                };
              }
            }
          }
        }
      }
    }
    return {
      state: "success",
      data: response
    };
  }
  jQuery.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: ajaxLocation,
      type: "GET",
      isLocal: rlocalProtocol.test(ajaxLocParts[1]),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": true,
        "text json": jQuery.parseJSON,
        "text xml": jQuery.parseXML
      },
      flatOptions: {
        url: true,
        context: true
      }
    },
    ajaxSetup: function(target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    ajax: function(url, options) {
      if (typeof url === "object") {
        options = url;
        url = undefined;
      }
      options = options || {};
      var transport,
          cacheURL,
          responseHeadersString,
          responseHeaders,
          timeoutTimer,
          parts,
          fireGlobals,
          i,
          s = jQuery.ajaxSetup({}, options),
          callbackContext = s.context || s,
          globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,
          deferred = jQuery.Deferred(),
          completeDeferred = jQuery.Callbacks("once memory"),
          statusCode = s.statusCode || {},
          requestHeaders = {},
          requestHeadersNames = {},
          state = 0,
          strAbort = "canceled",
          jqXHR = {
            readyState: 0,
            getResponseHeader: function(key) {
              var match;
              if (state === 2) {
                if (!responseHeaders) {
                  responseHeaders = {};
                  while ((match = rheaders.exec(responseHeadersString))) {
                    responseHeaders[match[1].toLowerCase()] = match[2];
                  }
                }
                match = responseHeaders[key.toLowerCase()];
              }
              return match == null ? null : match;
            },
            getAllResponseHeaders: function() {
              return state === 2 ? responseHeadersString : null;
            },
            setRequestHeader: function(name, value) {
              var lname = name.toLowerCase();
              if (!state) {
                name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                requestHeaders[name] = value;
              }
              return this;
            },
            overrideMimeType: function(type) {
              if (!state) {
                s.mimeType = type;
              }
              return this;
            },
            statusCode: function(map) {
              var code;
              if (map) {
                if (state < 2) {
                  for (code in map) {
                    statusCode[code] = [statusCode[code], map[code]];
                  }
                } else {
                  jqXHR.always(map[jqXHR.status]);
                }
              }
              return this;
            },
            abort: function(statusText) {
              var finalText = statusText || strAbort;
              if (transport) {
                transport.abort(finalText);
              }
              done(0, finalText);
              return this;
            }
          };
      deferred.promise(jqXHR).complete = completeDeferred.add;
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;
      s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");
      s.type = options.method || options.type || s.method || s.type;
      s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];
      if (s.crossDomain == null) {
        parts = rurl.exec(s.url.toLowerCase());
        s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? "80" : "443")) !== (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443"))));
      }
      if (s.data && s.processData && typeof s.data !== "string") {
        s.data = jQuery.param(s.data, s.traditional);
      }
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
      if (state === 2) {
        return jqXHR;
      }
      fireGlobals = jQuery.event && s.global;
      if (fireGlobals && jQuery.active++ === 0) {
        jQuery.event.trigger("ajaxStart");
      }
      s.type = s.type.toUpperCase();
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url;
      if (!s.hasContent) {
        if (s.data) {
          cacheURL = (s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data);
          delete s.data;
        }
        if (s.cache === false) {
          s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + nonce++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
        }
      }
      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      }
      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }
      jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
        return jqXHR.abort();
      }
      strAbort = "abort";
      for (i in {
        success: 1,
        error: 1,
        complete: 1
      }) {
        jqXHR[i](s[i]);
      }
      transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
      if (!transport) {
        done(-1, "No Transport");
      } else {
        jqXHR.readyState = 1;
        if (fireGlobals) {
          globalEventContext.trigger("ajaxSend", [jqXHR, s]);
        }
        if (s.async && s.timeout > 0) {
          timeoutTimer = setTimeout(function() {
            jqXHR.abort("timeout");
          }, s.timeout);
        }
        try {
          state = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (state < 2) {
            done(-1, e);
          } else {
            throw e;
          }
        }
      }
      function done(status, nativeStatusText, responses, headers) {
        var isSuccess,
            success,
            error,
            response,
            modified,
            statusText = nativeStatusText;
        if (state === 2) {
          return;
        }
        state = 2;
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }
        transport = undefined;
        responseHeadersString = headers || "";
        jqXHR.readyState = status > 0 ? 4 : 0;
        isSuccess = status >= 200 && status < 300 || status === 304;
        if (responses) {
          response = ajaxHandleResponses(s, jqXHR, responses);
        }
        response = ajaxConvert(s, response, jqXHR, isSuccess);
        if (isSuccess) {
          if (s.ifModified) {
            modified = jqXHR.getResponseHeader("Last-Modified");
            if (modified) {
              jQuery.lastModified[cacheURL] = modified;
            }
            modified = jqXHR.getResponseHeader("etag");
            if (modified) {
              jQuery.etag[cacheURL] = modified;
            }
          }
          if (status === 204 || s.type === "HEAD") {
            statusText = "nocontent";
          } else if (status === 304) {
            statusText = "notmodified";
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          error = statusText;
          if (status || !statusText) {
            statusText = "error";
            if (status < 0) {
              status = 0;
            }
          }
        }
        jqXHR.status = status;
        jqXHR.statusText = (nativeStatusText || statusText) + "";
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
        } else {
          deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
        }
        jqXHR.statusCode(statusCode);
        statusCode = undefined;
        if (fireGlobals) {
          globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
        }
        completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
        if (fireGlobals) {
          globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
          if (!(--jQuery.active)) {
            jQuery.event.trigger("ajaxStop");
          }
        }
      }
      return jqXHR;
    },
    getJSON: function(url, data, callback) {
      return jQuery.get(url, data, callback, "json");
    },
    getScript: function(url, callback) {
      return jQuery.get(url, undefined, callback, "script");
    }
  });
  jQuery.each(["get", "post"], function(i, method) {
    jQuery[method] = function(url, data, callback, type) {
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }
      return jQuery.ajax({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback
      });
    };
  });
  jQuery._evalUrl = function(url) {
    return jQuery.ajax({
      url: url,
      type: "GET",
      dataType: "script",
      async: false,
      global: false,
      "throws": true
    });
  };
  jQuery.fn.extend({
    wrapAll: function(html) {
      var wrap;
      if (jQuery.isFunction(html)) {
        return this.each(function(i) {
          jQuery(this).wrapAll(html.call(this, i));
        });
      }
      if (this[0]) {
        wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function() {
          var elem = this;
          while (elem.firstElementChild) {
            elem = elem.firstElementChild;
          }
          return elem;
        }).append(this);
      }
      return this;
    },
    wrapInner: function(html) {
      if (jQuery.isFunction(html)) {
        return this.each(function(i) {
          jQuery(this).wrapInner(html.call(this, i));
        });
      }
      return this.each(function() {
        var self = jQuery(this),
            contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap: function(html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function(i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    unwrap: function() {
      return this.parent().each(function() {
        if (!jQuery.nodeName(this, "body")) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    }
  });
  jQuery.expr.filters.hidden = function(elem) {
    return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
  };
  jQuery.expr.filters.visible = function(elem) {
    return !jQuery.expr.filters.hidden(elem);
  };
  var r20 = /%20/g,
      rbracket = /\[\]$/,
      rCRLF = /\r?\n/g,
      rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
      rsubmittable = /^(?:input|select|textarea|keygen)/i;
  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (jQuery.isArray(obj)) {
      jQuery.each(obj, function(i, v) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
        }
      });
    } else if (!traditional && jQuery.type(obj) === "object") {
      for (name in obj) {
        buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  jQuery.param = function(a, traditional) {
    var prefix,
        s = [],
        add = function(key, value) {
          value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
    if (traditional === undefined) {
      traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }
    if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
      jQuery.each(a, function() {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return s.join("&").replace(r20, "+");
  };
  jQuery.fn.extend({
    serialize: function() {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function() {
        var type = this.type;
        return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
      }).map(function(i, elem) {
        var val = jQuery(this).val();
        return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
          return {
            name: elem.name,
            value: val.replace(rCRLF, "\r\n")
          };
        }) : {
          name: elem.name,
          value: val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  });
  jQuery.ajaxSettings.xhr = function() {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
  };
  var xhrId = 0,
      xhrCallbacks = {},
      xhrSuccessStatus = {
        0: 200,
        1223: 204
      },
      xhrSupported = jQuery.ajaxSettings.xhr();
  if (window.attachEvent) {
    window.attachEvent("onunload", function() {
      for (var key in xhrCallbacks) {
        xhrCallbacks[key]();
      }
    });
  }
  support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
  support.ajax = xhrSupported = !!xhrSupported;
  jQuery.ajaxTransport(function(options) {
    var callback;
    if (support.cors || xhrSupported && !options.crossDomain) {
      return {
        send: function(headers, complete) {
          var i,
              xhr = options.xhr(),
              id = ++xhrId;
          xhr.open(options.type, options.url, options.async, options.username, options.password);
          if (options.xhrFields) {
            for (i in options.xhrFields) {
              xhr[i] = options.xhrFields[i];
            }
          }
          if (options.mimeType && xhr.overrideMimeType) {
            xhr.overrideMimeType(options.mimeType);
          }
          if (!options.crossDomain && !headers["X-Requested-With"]) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          }
          for (i in headers) {
            xhr.setRequestHeader(i, headers[i]);
          }
          callback = function(type) {
            return function() {
              if (callback) {
                delete xhrCallbacks[id];
                callback = xhr.onload = xhr.onerror = null;
                if (type === "abort") {
                  xhr.abort();
                } else if (type === "error") {
                  complete(xhr.status, xhr.statusText);
                } else {
                  complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, typeof xhr.responseText === "string" ? {text: xhr.responseText} : undefined, xhr.getAllResponseHeaders());
                }
              }
            };
          };
          xhr.onload = callback();
          xhr.onerror = callback("error");
          callback = xhrCallbacks[id] = callback("abort");
          try {
            xhr.send(options.hasContent && options.data || null);
          } catch (e) {
            if (callback) {
              throw e;
            }
          }
        },
        abort: function() {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  jQuery.ajaxSetup({
    accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
    contents: {script: /(?:java|ecma)script/},
    converters: {"text script": function(text) {
        jQuery.globalEval(text);
        return text;
      }}
  });
  jQuery.ajaxPrefilter("script", function(s) {
    if (s.cache === undefined) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = "GET";
    }
  });
  jQuery.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script,
          callback;
      return {
        send: function(_, complete) {
          script = jQuery("<script>").prop({
            async: true,
            charset: s.scriptCharset,
            src: s.url
          }).on("load error", callback = function(evt) {
            script.remove();
            callback = null;
            if (evt) {
              complete(evt.type === "error" ? 404 : 200, evt.type);
            }
          });
          document.head.appendChild(script[0]);
        },
        abort: function() {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  var oldCallbacks = [],
      rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
      this[callback] = true;
      return callback;
    }
  });
  jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var callbackName,
        overwritten,
        responseContainer,
        jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
    if (jsonProp || s.dataTypes[0] === "jsonp") {
      callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
      if (jsonProp) {
        s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
      } else if (s.jsonp !== false) {
        s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
      }
      s.converters["script json"] = function() {
        if (!responseContainer) {
          jQuery.error(callbackName + " was not called");
        }
        return responseContainer[0];
      };
      s.dataTypes[0] = "json";
      overwritten = window[callbackName];
      window[callbackName] = function() {
        responseContainer = arguments;
      };
      jqXHR.always(function() {
        window[callbackName] = overwritten;
        if (s[callbackName]) {
          s.jsonpCallback = originalSettings.jsonpCallback;
          oldCallbacks.push(callbackName);
        }
        if (responseContainer && jQuery.isFunction(overwritten)) {
          overwritten(responseContainer[0]);
        }
        responseContainer = overwritten = undefined;
      });
      return "script";
    }
  });
  jQuery.parseHTML = function(data, context, keepScripts) {
    if (!data || typeof data !== "string") {
      return null;
    }
    if (typeof context === "boolean") {
      keepScripts = context;
      context = false;
    }
    context = context || document;
    var parsed = rsingleTag.exec(data),
        scripts = !keepScripts && [];
    if (parsed) {
      return [context.createElement(parsed[1])];
    }
    parsed = jQuery.buildFragment([data], context, scripts);
    if (scripts && scripts.length) {
      jQuery(scripts).remove();
    }
    return jQuery.merge([], parsed.childNodes);
  };
  var _load = jQuery.fn.load;
  jQuery.fn.load = function(url, params, callback) {
    if (typeof url !== "string" && _load) {
      return _load.apply(this, arguments);
    }
    var selector,
        type,
        response,
        self = this,
        off = url.indexOf(" ");
    if (off >= 0) {
      selector = jQuery.trim(url.slice(off));
      url = url.slice(0, off);
    }
    if (jQuery.isFunction(params)) {
      callback = params;
      params = undefined;
    } else if (params && typeof params === "object") {
      type = "POST";
    }
    if (self.length > 0) {
      jQuery.ajax({
        url: url,
        type: type,
        dataType: "html",
        data: params
      }).done(function(responseText) {
        response = arguments;
        self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
      }).complete(callback && function(jqXHR, status) {
        self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
      });
    }
    return this;
  };
  jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(i, type) {
    jQuery.fn[type] = function(fn) {
      return this.on(type, fn);
    };
  });
  jQuery.expr.filters.animated = function(elem) {
    return jQuery.grep(jQuery.timers, function(fn) {
      return elem === fn.elem;
    }).length;
  };
  var docElem = window.document.documentElement;
  function getWindow(elem) {
    return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  }
  jQuery.offset = {setOffset: function(elem, options, i) {
      var curPosition,
          curLeft,
          curCSSTop,
          curTop,
          curOffset,
          curCSSLeft,
          calculatePosition,
          position = jQuery.css(elem, "position"),
          curElem = jQuery(elem),
          props = {};
      if (position === "static") {
        elem.style.position = "relative";
      }
      curOffset = curElem.offset();
      curCSSTop = jQuery.css(elem, "top");
      curCSSLeft = jQuery.css(elem, "left");
      calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }
      if (options.top != null) {
        props.top = (options.top - curOffset.top) + curTop;
      }
      if (options.left != null) {
        props.left = (options.left - curOffset.left) + curLeft;
      }
      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }};
  jQuery.fn.extend({
    offset: function(options) {
      if (arguments.length) {
        return options === undefined ? this : this.each(function(i) {
          jQuery.offset.setOffset(this, options, i);
        });
      }
      var docElem,
          win,
          elem = this[0],
          box = {
            top: 0,
            left: 0
          },
          doc = elem && elem.ownerDocument;
      if (!doc) {
        return;
      }
      docElem = doc.documentElement;
      if (!jQuery.contains(docElem, elem)) {
        return box;
      }
      if (typeof elem.getBoundingClientRect !== strundefined) {
        box = elem.getBoundingClientRect();
      }
      win = getWindow(doc);
      return {
        top: box.top + win.pageYOffset - docElem.clientTop,
        left: box.left + win.pageXOffset - docElem.clientLeft
      };
    },
    position: function() {
      if (!this[0]) {
        return;
      }
      var offsetParent,
          offset,
          elem = this[0],
          parentOffset = {
            top: 0,
            left: 0
          };
      if (jQuery.css(elem, "position") === "fixed") {
        offset = elem.getBoundingClientRect();
      } else {
        offsetParent = this.offsetParent();
        offset = this.offset();
        if (!jQuery.nodeName(offsetParent[0], "html")) {
          parentOffset = offsetParent.offset();
        }
        parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
        parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
      }
      return {
        top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
        left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
      };
    },
    offsetParent: function() {
      return this.map(function() {
        var offsetParent = this.offsetParent || docElem;
        while (offsetParent && (!jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static")) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docElem;
      });
    }
  });
  jQuery.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function(method, prop) {
    var top = "pageYOffset" === prop;
    jQuery.fn[method] = function(val) {
      return access(this, function(elem, method, val) {
        var win = getWindow(elem);
        if (val === undefined) {
          return win ? win[prop] : elem[method];
        }
        if (win) {
          win.scrollTo(!top ? val : window.pageXOffset, top ? val : window.pageYOffset);
        } else {
          elem[method] = val;
        }
      }, method, val, arguments.length, null);
    };
  });
  jQuery.each(["top", "left"], function(i, prop) {
    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
      if (computed) {
        computed = curCSS(elem, prop);
        return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
      }
    });
  });
  jQuery.each({
    Height: "height",
    Width: "width"
  }, function(name, type) {
    jQuery.each({
      padding: "inner" + name,
      content: type,
      "": "outer" + name
    }, function(defaultExtra, funcName) {
      jQuery.fn[funcName] = function(margin, value) {
        var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
            extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
        return access(this, function(elem, type, value) {
          var doc;
          if (jQuery.isWindow(elem)) {
            return elem.document.documentElement["client" + name];
          }
          if (elem.nodeType === 9) {
            doc = elem.documentElement;
            return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
          }
          return value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
        }, type, chainable ? margin : undefined, chainable, null);
      };
    });
  });
  jQuery.fn.size = function() {
    return this.length;
  };
  jQuery.fn.andSelf = jQuery.fn.addBack;
  if (typeof define === "function" && define.amd) {
    define("github:components/jquery@2.1.4/jquery", [], function() {
      return jQuery;
    });
  }
  var _jQuery = window.jQuery,
      _$ = window.$;
  jQuery.noConflict = function(deep) {
    if (window.$ === jQuery) {
      window.$ = _$;
    }
    if (deep && window.jQuery === jQuery) {
      window.jQuery = _jQuery;
    }
    return jQuery;
  };
  if (typeof noGlobal === strundefined) {
    window.jQuery = window.$ = jQuery;
  }
  return jQuery;
}));

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:components/jquery@2.1.4", ["github:components/jquery@2.1.4/jquery"], function(main) {
  return main;
});

_removeDefine();
})();
System.registerDynamic("github:Dogfalo/materialize@0.97.0/dist/js/materialize", ["github:components/jquery@2.1.4"], false, function(__require, __exports, __module) {
  var _retrieveGlobal = System.get("@@global-helpers").prepareGlobal(__module.id, "$", null);
  (function() {
    var Vel = this["Vel"];
    "format global";
    "deps jquery";
    "exports $";
    jQuery.easing['jswing'] = jQuery.easing['swing'];
    jQuery.extend(jQuery.easing, {
      def: 'easeOutQuad',
      swing: function(x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
      },
      easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
          return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      },
      easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
          return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      },
      easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
      },
      easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
          return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      },
      easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
      },
      easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
          return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      },
      easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      },
      easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0)
          return b;
        if (t == d)
          return b + c;
        if ((t /= d / 2) < 1)
          return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      },
      easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
          return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      },
      easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0)
          return b;
        if ((t /= d) == 1)
          return b + c;
        if (!p)
          p = d * .3;
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        } else
          var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      },
      easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0)
          return b;
        if ((t /= d) == 1)
          return b + c;
        if (!p)
          p = d * .3;
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        } else
          var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
      },
      easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0)
          return b;
        if ((t /= d / 2) == 2)
          return b + c;
        if (!p)
          p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        } else
          var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1)
          return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      },
      easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined)
          s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined)
          s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined)
          s = 1.70158;
        if ((t /= d / 2) < 1)
          return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      },
      easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
      },
      easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
      },
      easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2)
          return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
      }
    });
    ;
    jQuery.extend(jQuery.easing, {easeInOutMaterial: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
          return c / 2 * t * t + b;
        return c / 4 * ((t -= 2) * t * t + 2) + b;
      }});
    ;
    !function(e) {
      function t(e) {
        var t = e.length,
            r = $.type(e);
        return "function" === r || $.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === r || 0 === t || "number" == typeof t && t > 0 && t - 1 in e;
      }
      if (!e.jQuery) {
        var $ = function(e, t) {
          return new $.fn.init(e, t);
        };
        $.isWindow = function(e) {
          return null != e && e == e.window;
        }, $.type = function(e) {
          return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? a[o.call(e)] || "object" : typeof e;
        }, $.isArray = Array.isArray || function(e) {
          return "array" === $.type(e);
        }, $.isPlainObject = function(e) {
          var t;
          if (!e || "object" !== $.type(e) || e.nodeType || $.isWindow(e))
            return !1;
          try {
            if (e.constructor && !n.call(e, "constructor") && !n.call(e.constructor.prototype, "isPrototypeOf"))
              return !1;
          } catch (r) {
            return !1;
          }
          for (t in e)
            ;
          return void 0 === t || n.call(e, t);
        }, $.each = function(e, r, a) {
          var n,
              o = 0,
              i = e.length,
              s = t(e);
          if (a) {
            if (s)
              for (; i > o && (n = r.apply(e[o], a), n !== !1); o++)
                ;
            else
              for (o in e)
                if (n = r.apply(e[o], a), n === !1)
                  break;
          } else if (s)
            for (; i > o && (n = r.call(e[o], o, e[o]), n !== !1); o++)
              ;
          else
            for (o in e)
              if (n = r.call(e[o], o, e[o]), n === !1)
                break;
          return e;
        }, $.data = function(e, t, a) {
          if (void 0 === a) {
            var n = e[$.expando],
                o = n && r[n];
            if (void 0 === t)
              return o;
            if (o && t in o)
              return o[t];
          } else if (void 0 !== t) {
            var n = e[$.expando] || (e[$.expando] = ++$.uuid);
            return r[n] = r[n] || {}, r[n][t] = a, a;
          }
        }, $.removeData = function(e, t) {
          var a = e[$.expando],
              n = a && r[a];
          n && $.each(t, function(e, t) {
            delete n[t];
          });
        }, $.extend = function() {
          var e,
              t,
              r,
              a,
              n,
              o,
              i = arguments[0] || {},
              s = 1,
              l = arguments.length,
              u = !1;
          for ("boolean" == typeof i && (u = i, i = arguments[s] || {}, s++), "object" != typeof i && "function" !== $.type(i) && (i = {}), s === l && (i = this, s--); l > s; s++)
            if (null != (n = arguments[s]))
              for (a in n)
                e = i[a], r = n[a], i !== r && (u && r && ($.isPlainObject(r) || (t = $.isArray(r))) ? (t ? (t = !1, o = e && $.isArray(e) ? e : []) : o = e && $.isPlainObject(e) ? e : {}, i[a] = $.extend(u, o, r)) : void 0 !== r && (i[a] = r));
          return i;
        }, $.queue = function(e, r, a) {
          function n(e, r) {
            var a = r || [];
            return null != e && (t(Object(e)) ? !function(e, t) {
              for (var r = +t.length,
                  a = 0,
                  n = e.length; r > a; )
                e[n++] = t[a++];
              if (r !== r)
                for (; void 0 !== t[a]; )
                  e[n++] = t[a++];
              return e.length = n, e;
            }(a, "string" == typeof e ? [e] : e) : [].push.call(a, e)), a;
          }
          if (e) {
            r = (r || "fx") + "queue";
            var o = $.data(e, r);
            return a ? (!o || $.isArray(a) ? o = $.data(e, r, n(a)) : o.push(a), o) : o || [];
          }
        }, $.dequeue = function(e, t) {
          $.each(e.nodeType ? [e] : e, function(e, r) {
            t = t || "fx";
            var a = $.queue(r, t),
                n = a.shift();
            "inprogress" === n && (n = a.shift()), n && ("fx" === t && a.unshift("inprogress"), n.call(r, function() {
              $.dequeue(r, t);
            }));
          });
        }, $.fn = $.prototype = {
          init: function(e) {
            if (e.nodeType)
              return this[0] = e, this;
            throw new Error("Not a DOM node.");
          },
          offset: function() {
            var t = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
              top: 0,
              left: 0
            };
            return {
              top: t.top + (e.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
              left: t.left + (e.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
            };
          },
          position: function() {
            function e() {
              for (var e = this.offsetParent || document; e && "html" === !e.nodeType.toLowerCase && "static" === e.style.position; )
                e = e.offsetParent;
              return e || document;
            }
            var t = this[0],
                e = e.apply(t),
                r = this.offset(),
                a = /^(?:body|html)$/i.test(e.nodeName) ? {
                  top: 0,
                  left: 0
                } : $(e).offset();
            return r.top -= parseFloat(t.style.marginTop) || 0, r.left -= parseFloat(t.style.marginLeft) || 0, e.style && (a.top += parseFloat(e.style.borderTopWidth) || 0, a.left += parseFloat(e.style.borderLeftWidth) || 0), {
              top: r.top - a.top,
              left: r.left - a.left
            };
          }
        };
        var r = {};
        $.expando = "velocity" + (new Date).getTime(), $.uuid = 0;
        for (var a = {},
            n = a.hasOwnProperty,
            o = a.toString,
            i = "Boolean Number String Function Array Date RegExp Object Error".split(" "),
            s = 0; s < i.length; s++)
          a["[object " + i[s] + "]"] = i[s].toLowerCase();
        $.fn.init.prototype = $.fn, e.Velocity = {Utilities: $};
      }
    }(window), function(e) {
      "object" == typeof module && "object" == typeof module.exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : e();
    }(function() {
      return function(e, t, r, a) {
        function n(e) {
          for (var t = -1,
              r = e ? e.length : 0,
              a = []; ++t < r; ) {
            var n = e[t];
            n && a.push(n);
          }
          return a;
        }
        function o(e) {
          return g.isWrapped(e) ? e = [].slice.call(e) : g.isNode(e) && (e = [e]), e;
        }
        function i(e) {
          var t = $.data(e, "velocity");
          return null === t ? a : t;
        }
        function s(e) {
          return function(t) {
            return Math.round(t * e) * (1 / e);
          };
        }
        function l(e, r, a, n) {
          function o(e, t) {
            return 1 - 3 * t + 3 * e;
          }
          function i(e, t) {
            return 3 * t - 6 * e;
          }
          function s(e) {
            return 3 * e;
          }
          function l(e, t, r) {
            return ((o(t, r) * e + i(t, r)) * e + s(t)) * e;
          }
          function u(e, t, r) {
            return 3 * o(t, r) * e * e + 2 * i(t, r) * e + s(t);
          }
          function c(t, r) {
            for (var n = 0; m > n; ++n) {
              var o = u(r, e, a);
              if (0 === o)
                return r;
              var i = l(r, e, a) - t;
              r -= i / o;
            }
            return r;
          }
          function p() {
            for (var t = 0; b > t; ++t)
              w[t] = l(t * x, e, a);
          }
          function f(t, r, n) {
            var o,
                i,
                s = 0;
            do
              i = r + (n - r) / 2, o = l(i, e, a) - t, o > 0 ? n = i : r = i;
 while (Math.abs(o) > h && ++s < v);
            return i;
          }
          function d(t) {
            for (var r = 0,
                n = 1,
                o = b - 1; n != o && w[n] <= t; ++n)
              r += x;
            --n;
            var i = (t - w[n]) / (w[n + 1] - w[n]),
                s = r + i * x,
                l = u(s, e, a);
            return l >= y ? c(t, s) : 0 == l ? s : f(t, r, r + x);
          }
          function g() {
            V = !0, (e != r || a != n) && p();
          }
          var m = 4,
              y = .001,
              h = 1e-7,
              v = 10,
              b = 11,
              x = 1 / (b - 1),
              S = "Float32Array" in t;
          if (4 !== arguments.length)
            return !1;
          for (var P = 0; 4 > P; ++P)
            if ("number" != typeof arguments[P] || isNaN(arguments[P]) || !isFinite(arguments[P]))
              return !1;
          e = Math.min(e, 1), a = Math.min(a, 1), e = Math.max(e, 0), a = Math.max(a, 0);
          var w = S ? new Float32Array(b) : new Array(b),
              V = !1,
              C = function(t) {
                return V || g(), e === r && a === n ? t : 0 === t ? 0 : 1 === t ? 1 : l(d(t), r, n);
              };
          C.getControlPoints = function() {
            return [{
              x: e,
              y: r
            }, {
              x: a,
              y: n
            }];
          };
          var T = "generateBezier(" + [e, r, a, n] + ")";
          return C.toString = function() {
            return T;
          }, C;
        }
        function u(e, t) {
          var r = e;
          return g.isString(e) ? v.Easings[e] || (r = !1) : r = g.isArray(e) && 1 === e.length ? s.apply(null, e) : g.isArray(e) && 2 === e.length ? b.apply(null, e.concat([t])) : g.isArray(e) && 4 === e.length ? l.apply(null, e) : !1, r === !1 && (r = v.Easings[v.defaults.easing] ? v.defaults.easing : h), r;
        }
        function c(e) {
          if (e) {
            var t = (new Date).getTime(),
                r = v.State.calls.length;
            r > 1e4 && (v.State.calls = n(v.State.calls));
            for (var o = 0; r > o; o++)
              if (v.State.calls[o]) {
                var s = v.State.calls[o],
                    l = s[0],
                    u = s[2],
                    f = s[3],
                    d = !!f,
                    m = null;
                f || (f = v.State.calls[o][3] = t - 16);
                for (var y = Math.min((t - f) / u.duration, 1),
                    h = 0,
                    b = l.length; b > h; h++) {
                  var S = l[h],
                      w = S.element;
                  if (i(w)) {
                    var V = !1;
                    if (u.display !== a && null !== u.display && "none" !== u.display) {
                      if ("flex" === u.display) {
                        var C = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                        $.each(C, function(e, t) {
                          x.setPropertyValue(w, "display", t);
                        });
                      }
                      x.setPropertyValue(w, "display", u.display);
                    }
                    u.visibility !== a && "hidden" !== u.visibility && x.setPropertyValue(w, "visibility", u.visibility);
                    for (var T in S)
                      if ("element" !== T) {
                        var k = S[T],
                            A,
                            F = g.isString(k.easing) ? v.Easings[k.easing] : k.easing;
                        if (1 === y)
                          A = k.endValue;
                        else {
                          var E = k.endValue - k.startValue;
                          if (A = k.startValue + E * F(y, u, E), !d && A === k.currentValue)
                            continue;
                        }
                        if (k.currentValue = A, "tween" === T)
                          m = A;
                        else {
                          if (x.Hooks.registered[T]) {
                            var j = x.Hooks.getRoot(T),
                                H = i(w).rootPropertyValueCache[j];
                            H && (k.rootPropertyValue = H);
                          }
                          var N = x.setPropertyValue(w, T, k.currentValue + (0 === parseFloat(A) ? "" : k.unitType), k.rootPropertyValue, k.scrollData);
                          x.Hooks.registered[T] && (i(w).rootPropertyValueCache[j] = x.Normalizations.registered[j] ? x.Normalizations.registered[j]("extract", null, N[1]) : N[1]), "transform" === N[0] && (V = !0);
                        }
                      }
                    u.mobileHA && i(w).transformCache.translate3d === a && (i(w).transformCache.translate3d = "(0px, 0px, 0px)", V = !0), V && x.flushTransformCache(w);
                  }
                }
                u.display !== a && "none" !== u.display && (v.State.calls[o][2].display = !1), u.visibility !== a && "hidden" !== u.visibility && (v.State.calls[o][2].visibility = !1), u.progress && u.progress.call(s[1], s[1], y, Math.max(0, f + u.duration - t), f, m), 1 === y && p(o);
              }
          }
          v.State.isTicking && P(c);
        }
        function p(e, t) {
          if (!v.State.calls[e])
            return !1;
          for (var r = v.State.calls[e][0],
              n = v.State.calls[e][1],
              o = v.State.calls[e][2],
              s = v.State.calls[e][4],
              l = !1,
              u = 0,
              c = r.length; c > u; u++) {
            var p = r[u].element;
            if (t || o.loop || ("none" === o.display && x.setPropertyValue(p, "display", o.display), "hidden" === o.visibility && x.setPropertyValue(p, "visibility", o.visibility)), o.loop !== !0 && ($.queue(p)[1] === a || !/\.velocityQueueEntryFlag/i.test($.queue(p)[1])) && i(p)) {
              i(p).isAnimating = !1, i(p).rootPropertyValueCache = {};
              var f = !1;
              $.each(x.Lists.transforms3D, function(e, t) {
                var r = /^scale/.test(t) ? 1 : 0,
                    n = i(p).transformCache[t];
                i(p).transformCache[t] !== a && new RegExp("^\\(" + r + "[^.]").test(n) && (f = !0, delete i(p).transformCache[t]);
              }), o.mobileHA && (f = !0, delete i(p).transformCache.translate3d), f && x.flushTransformCache(p), x.Values.removeClass(p, "velocity-animating");
            }
            if (!t && o.complete && !o.loop && u === c - 1)
              try {
                o.complete.call(n, n);
              } catch (d) {
                setTimeout(function() {
                  throw d;
                }, 1);
              }
            s && o.loop !== !0 && s(n), i(p) && o.loop === !0 && !t && ($.each(i(p).tweensContainer, function(e, t) {
              /^rotate/.test(e) && 360 === parseFloat(t.endValue) && (t.endValue = 0, t.startValue = 360), /^backgroundPosition/.test(e) && 100 === parseFloat(t.endValue) && "%" === t.unitType && (t.endValue = 0, t.startValue = 100);
            }), v(p, "reverse", {
              loop: !0,
              delay: o.delay
            })), o.queue !== !1 && $.dequeue(p, o.queue);
          }
          v.State.calls[e] = !1;
          for (var g = 0,
              m = v.State.calls.length; m > g; g++)
            if (v.State.calls[g] !== !1) {
              l = !0;
              break;
            }
          l === !1 && (v.State.isTicking = !1, delete v.State.calls, v.State.calls = []);
        }
        var f = function() {
          if (r.documentMode)
            return r.documentMode;
          for (var e = 7; e > 4; e--) {
            var t = r.createElement("div");
            if (t.innerHTML = "<!--[if IE " + e + "]><span></span><![endif]-->", t.getElementsByTagName("span").length)
              return t = null, e;
          }
          return a;
        }(),
            d = function() {
              var e = 0;
              return t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || function(t) {
                var r = (new Date).getTime(),
                    a;
                return a = Math.max(0, 16 - (r - e)), e = r + a, setTimeout(function() {
                  t(r + a);
                }, a);
              };
            }(),
            g = {
              isString: function(e) {
                return "string" == typeof e;
              },
              isArray: Array.isArray || function(e) {
                return "[object Array]" === Object.prototype.toString.call(e);
              },
              isFunction: function(e) {
                return "[object Function]" === Object.prototype.toString.call(e);
              },
              isNode: function(e) {
                return e && e.nodeType;
              },
              isNodeList: function(e) {
                return "object" == typeof e && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e)) && e.length !== a && (0 === e.length || "object" == typeof e[0] && e[0].nodeType > 0);
              },
              isWrapped: function(e) {
                return e && (e.jquery || t.Zepto && t.Zepto.zepto.isZ(e));
              },
              isSVG: function(e) {
                return t.SVGElement && e instanceof t.SVGElement;
              },
              isEmptyObject: function(e) {
                for (var t in e)
                  return !1;
                return !0;
              }
            },
            $,
            m = !1;
        if (e.fn && e.fn.jquery ? ($ = e, m = !0) : $ = t.Velocity.Utilities, 8 >= f && !m)
          throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
        if (7 >= f)
          return void(jQuery.fn.velocity = jQuery.fn.animate);
        var y = 400,
            h = "swing",
            v = {
              State: {
                isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                isAndroid: /Android/i.test(navigator.userAgent),
                isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                isChrome: t.chrome,
                isFirefox: /Firefox/i.test(navigator.userAgent),
                prefixElement: r.createElement("div"),
                prefixMatches: {},
                scrollAnchor: null,
                scrollPropertyLeft: null,
                scrollPropertyTop: null,
                isTicking: !1,
                calls: []
              },
              CSS: {},
              Utilities: $,
              Redirects: {},
              Easings: {},
              Promise: t.Promise,
              defaults: {
                queue: "",
                duration: y,
                easing: h,
                begin: a,
                complete: a,
                progress: a,
                display: a,
                visibility: a,
                loop: !1,
                delay: !1,
                mobileHA: !0,
                _cacheValues: !0
              },
              init: function(e) {
                $.data(e, "velocity", {
                  isSVG: g.isSVG(e),
                  isAnimating: !1,
                  computedStyle: null,
                  tweensContainer: null,
                  rootPropertyValueCache: {},
                  transformCache: {}
                });
              },
              hook: null,
              mock: !1,
              version: {
                major: 1,
                minor: 2,
                patch: 2
              },
              debug: !1
            };
        t.pageYOffset !== a ? (v.State.scrollAnchor = t, v.State.scrollPropertyLeft = "pageXOffset", v.State.scrollPropertyTop = "pageYOffset") : (v.State.scrollAnchor = r.documentElement || r.body.parentNode || r.body, v.State.scrollPropertyLeft = "scrollLeft", v.State.scrollPropertyTop = "scrollTop");
        var b = function() {
          function e(e) {
            return -e.tension * e.x - e.friction * e.v;
          }
          function t(t, r, a) {
            var n = {
              x: t.x + a.dx * r,
              v: t.v + a.dv * r,
              tension: t.tension,
              friction: t.friction
            };
            return {
              dx: n.v,
              dv: e(n)
            };
          }
          function r(r, a) {
            var n = {
              dx: r.v,
              dv: e(r)
            },
                o = t(r, .5 * a, n),
                i = t(r, .5 * a, o),
                s = t(r, a, i),
                l = 1 / 6 * (n.dx + 2 * (o.dx + i.dx) + s.dx),
                u = 1 / 6 * (n.dv + 2 * (o.dv + i.dv) + s.dv);
            return r.x = r.x + l * a, r.v = r.v + u * a, r;
          }
          return function a(e, t, n) {
            var o = {
              x: -1,
              v: 0,
              tension: null,
              friction: null
            },
                i = [0],
                s = 0,
                l = 1e-4,
                u = .016,
                c,
                p,
                f;
            for (e = parseFloat(e) || 500, t = parseFloat(t) || 20, n = n || null, o.tension = e, o.friction = t, c = null !== n, c ? (s = a(e, t), p = s / n * u) : p = u; ; )
              if (f = r(f || o, p), i.push(1 + f.x), s += 16, !(Math.abs(f.x) > l && Math.abs(f.v) > l))
                break;
            return c ? function(e) {
              return i[e * (i.length - 1) | 0];
            } : s;
          };
        }();
        v.Easings = {
          linear: function(e) {
            return e;
          },
          swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2;
          },
          spring: function(e) {
            return 1 - Math.cos(4.5 * e * Math.PI) * Math.exp(6 * -e);
          }
        }, $.each([["ease", [.25, .1, .25, 1]], ["ease-in", [.42, 0, 1, 1]], ["ease-out", [0, 0, .58, 1]], ["ease-in-out", [.42, 0, .58, 1]], ["easeInSine", [.47, 0, .745, .715]], ["easeOutSine", [.39, .575, .565, 1]], ["easeInOutSine", [.445, .05, .55, .95]], ["easeInQuad", [.55, .085, .68, .53]], ["easeOutQuad", [.25, .46, .45, .94]], ["easeInOutQuad", [.455, .03, .515, .955]], ["easeInCubic", [.55, .055, .675, .19]], ["easeOutCubic", [.215, .61, .355, 1]], ["easeInOutCubic", [.645, .045, .355, 1]], ["easeInQuart", [.895, .03, .685, .22]], ["easeOutQuart", [.165, .84, .44, 1]], ["easeInOutQuart", [.77, 0, .175, 1]], ["easeInQuint", [.755, .05, .855, .06]], ["easeOutQuint", [.23, 1, .32, 1]], ["easeInOutQuint", [.86, 0, .07, 1]], ["easeInExpo", [.95, .05, .795, .035]], ["easeOutExpo", [.19, 1, .22, 1]], ["easeInOutExpo", [1, 0, 0, 1]], ["easeInCirc", [.6, .04, .98, .335]], ["easeOutCirc", [.075, .82, .165, 1]], ["easeInOutCirc", [.785, .135, .15, .86]]], function(e, t) {
          v.Easings[t[0]] = l.apply(null, t[1]);
        });
        var x = v.CSS = {
          RegEx: {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
          },
          Lists: {
            colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
            transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
            transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
          },
          Hooks: {
            templates: {
              textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
              boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
              clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
              backgroundPosition: ["X Y", "0% 0%"],
              transformOrigin: ["X Y Z", "50% 50% 0px"],
              perspectiveOrigin: ["X Y", "50% 50%"]
            },
            registered: {},
            register: function() {
              for (var e = 0; e < x.Lists.colors.length; e++) {
                var t = "color" === x.Lists.colors[e] ? "0 0 0 1" : "255 255 255 1";
                x.Hooks.templates[x.Lists.colors[e]] = ["Red Green Blue Alpha", t];
              }
              var r,
                  a,
                  n;
              if (f)
                for (r in x.Hooks.templates) {
                  a = x.Hooks.templates[r], n = a[0].split(" ");
                  var o = a[1].match(x.RegEx.valueSplit);
                  "Color" === n[0] && (n.push(n.shift()), o.push(o.shift()), x.Hooks.templates[r] = [n.join(" "), o.join(" ")]);
                }
              for (r in x.Hooks.templates) {
                a = x.Hooks.templates[r], n = a[0].split(" ");
                for (var e in n) {
                  var i = r + n[e],
                      s = e;
                  x.Hooks.registered[i] = [r, s];
                }
              }
            },
            getRoot: function(e) {
              var t = x.Hooks.registered[e];
              return t ? t[0] : e;
            },
            cleanRootPropertyValue: function(e, t) {
              return x.RegEx.valueUnwrap.test(t) && (t = t.match(x.RegEx.valueUnwrap)[1]), x.Values.isCSSNullValue(t) && (t = x.Hooks.templates[e][1]), t;
            },
            extractValue: function(e, t) {
              var r = x.Hooks.registered[e];
              if (r) {
                var a = r[0],
                    n = r[1];
                return t = x.Hooks.cleanRootPropertyValue(a, t), t.toString().match(x.RegEx.valueSplit)[n];
              }
              return t;
            },
            injectValue: function(e, t, r) {
              var a = x.Hooks.registered[e];
              if (a) {
                var n = a[0],
                    o = a[1],
                    i,
                    s;
                return r = x.Hooks.cleanRootPropertyValue(n, r), i = r.toString().match(x.RegEx.valueSplit), i[o] = t, s = i.join(" ");
              }
              return r;
            }
          },
          Normalizations: {
            registered: {
              clip: function(e, t, r) {
                switch (e) {
                  case "name":
                    return "clip";
                  case "extract":
                    var a;
                    return x.RegEx.wrappedValueAlreadyExtracted.test(r) ? a = r : (a = r.toString().match(x.RegEx.valueUnwrap), a = a ? a[1].replace(/,(\s+)?/g, " ") : r), a;
                  case "inject":
                    return "rect(" + r + ")";
                }
              },
              blur: function(e, t, r) {
                switch (e) {
                  case "name":
                    return v.State.isFirefox ? "filter" : "-webkit-filter";
                  case "extract":
                    var a = parseFloat(r);
                    if (!a && 0 !== a) {
                      var n = r.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                      a = n ? n[1] : 0;
                    }
                    return a;
                  case "inject":
                    return parseFloat(r) ? "blur(" + r + ")" : "none";
                }
              },
              opacity: function(e, t, r) {
                if (8 >= f)
                  switch (e) {
                    case "name":
                      return "filter";
                    case "extract":
                      var a = r.toString().match(/alpha\(opacity=(.*)\)/i);
                      return r = a ? a[1] / 100 : 1;
                    case "inject":
                      return t.style.zoom = 1, parseFloat(r) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(r), 10) + ")";
                  }
                else
                  switch (e) {
                    case "name":
                      return "opacity";
                    case "extract":
                      return r;
                    case "inject":
                      return r;
                  }
              }
            },
            register: function() {
              9 >= f || v.State.isGingerbread || (x.Lists.transformsBase = x.Lists.transformsBase.concat(x.Lists.transforms3D));
              for (var e = 0; e < x.Lists.transformsBase.length; e++)
                !function() {
                  var t = x.Lists.transformsBase[e];
                  x.Normalizations.registered[t] = function(e, r, n) {
                    switch (e) {
                      case "name":
                        return "transform";
                      case "extract":
                        return i(r) === a || i(r).transformCache[t] === a ? /^scale/i.test(t) ? 1 : 0 : i(r).transformCache[t].replace(/[()]/g, "");
                      case "inject":
                        var o = !1;
                        switch (t.substr(0, t.length - 1)) {
                          case "translate":
                            o = !/(%|px|em|rem|vw|vh|\d)$/i.test(n);
                            break;
                          case "scal":
                          case "scale":
                            v.State.isAndroid && i(r).transformCache[t] === a && 1 > n && (n = 1), o = !/(\d)$/i.test(n);
                            break;
                          case "skew":
                            o = !/(deg|\d)$/i.test(n);
                            break;
                          case "rotate":
                            o = !/(deg|\d)$/i.test(n);
                        }
                        return o || (i(r).transformCache[t] = "(" + n + ")"), i(r).transformCache[t];
                    }
                  };
                }();
              for (var e = 0; e < x.Lists.colors.length; e++)
                !function() {
                  var t = x.Lists.colors[e];
                  x.Normalizations.registered[t] = function(e, r, n) {
                    switch (e) {
                      case "name":
                        return t;
                      case "extract":
                        var o;
                        if (x.RegEx.wrappedValueAlreadyExtracted.test(n))
                          o = n;
                        else {
                          var i,
                              s = {
                                black: "rgb(0, 0, 0)",
                                blue: "rgb(0, 0, 255)",
                                gray: "rgb(128, 128, 128)",
                                green: "rgb(0, 128, 0)",
                                red: "rgb(255, 0, 0)",
                                white: "rgb(255, 255, 255)"
                              };
                          /^[A-z]+$/i.test(n) ? i = s[n] !== a ? s[n] : s.black : x.RegEx.isHex.test(n) ? i = "rgb(" + x.Values.hexToRgb(n).join(" ") + ")" : /^rgba?\(/i.test(n) || (i = s.black), o = (i || n).toString().match(x.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                        }
                        return 8 >= f || 3 !== o.split(" ").length || (o += " 1"), o;
                      case "inject":
                        return 8 >= f ? 4 === n.split(" ").length && (n = n.split(/\s+/).slice(0, 3).join(" ")) : 3 === n.split(" ").length && (n += " 1"), (8 >= f ? "rgb" : "rgba") + "(" + n.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                    }
                  };
                }();
            }
          },
          Names: {
            camelCase: function(e) {
              return e.replace(/-(\w)/g, function(e, t) {
                return t.toUpperCase();
              });
            },
            SVGAttribute: function(e) {
              var t = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
              return (f || v.State.isAndroid && !v.State.isChrome) && (t += "|transform"), new RegExp("^(" + t + ")$", "i").test(e);
            },
            prefixCheck: function(e) {
              if (v.State.prefixMatches[e])
                return [v.State.prefixMatches[e], !0];
              for (var t = ["", "Webkit", "Moz", "ms", "O"],
                  r = 0,
                  a = t.length; a > r; r++) {
                var n;
                if (n = 0 === r ? e : t[r] + e.replace(/^\w/, function(e) {
                  return e.toUpperCase();
                }), g.isString(v.State.prefixElement.style[n]))
                  return v.State.prefixMatches[e] = n, [n, !0];
              }
              return [e, !1];
            }
          },
          Values: {
            hexToRgb: function(e) {
              var t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                  r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                  a;
              return e = e.replace(t, function(e, t, r, a) {
                return t + t + r + r + a + a;
              }), a = r.exec(e), a ? [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)] : [0, 0, 0];
            },
            isCSSNullValue: function(e) {
              return 0 == e || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e);
            },
            getUnitType: function(e) {
              return /^(rotate|skew)/i.test(e) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e) ? "" : "px";
            },
            getDisplayType: function(e) {
              var t = e && e.tagName.toString().toLowerCase();
              return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t) ? "inline" : /^(li)$/i.test(t) ? "list-item" : /^(tr)$/i.test(t) ? "table-row" : /^(table)$/i.test(t) ? "table" : /^(tbody)$/i.test(t) ? "table-row-group" : "block";
            },
            addClass: function(e, t) {
              e.classList ? e.classList.add(t) : e.className += (e.className.length ? " " : "") + t;
            },
            removeClass: function(e, t) {
              e.classList ? e.classList.remove(t) : e.className = e.className.toString().replace(new RegExp("(^|\\s)" + t.split(" ").join("|") + "(\\s|$)", "gi"), " ");
            }
          },
          getPropertyValue: function(e, r, n, o) {
            function s(e, r) {
              function n() {
                u && x.setPropertyValue(e, "display", "none");
              }
              var l = 0;
              if (8 >= f)
                l = $.css(e, r);
              else {
                var u = !1;
                if (/^(width|height)$/.test(r) && 0 === x.getPropertyValue(e, "display") && (u = !0, x.setPropertyValue(e, "display", x.Values.getDisplayType(e))), !o) {
                  if ("height" === r && "border-box" !== x.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                    var c = e.offsetHeight - (parseFloat(x.getPropertyValue(e, "borderTopWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "borderBottomWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingTop")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingBottom")) || 0);
                    return n(), c;
                  }
                  if ("width" === r && "border-box" !== x.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                    var p = e.offsetWidth - (parseFloat(x.getPropertyValue(e, "borderLeftWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "borderRightWidth")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingLeft")) || 0) - (parseFloat(x.getPropertyValue(e, "paddingRight")) || 0);
                    return n(), p;
                  }
                }
                var d;
                d = i(e) === a ? t.getComputedStyle(e, null) : i(e).computedStyle ? i(e).computedStyle : i(e).computedStyle = t.getComputedStyle(e, null), "borderColor" === r && (r = "borderTopColor"), l = 9 === f && "filter" === r ? d.getPropertyValue(r) : d[r], ("" === l || null === l) && (l = e.style[r]), n();
              }
              if ("auto" === l && /^(top|right|bottom|left)$/i.test(r)) {
                var g = s(e, "position");
                ("fixed" === g || "absolute" === g && /top|left/i.test(r)) && (l = $(e).position()[r] + "px");
              }
              return l;
            }
            var l;
            if (x.Hooks.registered[r]) {
              var u = r,
                  c = x.Hooks.getRoot(u);
              n === a && (n = x.getPropertyValue(e, x.Names.prefixCheck(c)[0])), x.Normalizations.registered[c] && (n = x.Normalizations.registered[c]("extract", e, n)), l = x.Hooks.extractValue(u, n);
            } else if (x.Normalizations.registered[r]) {
              var p,
                  d;
              p = x.Normalizations.registered[r]("name", e), "transform" !== p && (d = s(e, x.Names.prefixCheck(p)[0]), x.Values.isCSSNullValue(d) && x.Hooks.templates[r] && (d = x.Hooks.templates[r][1])), l = x.Normalizations.registered[r]("extract", e, d);
            }
            if (!/^[\d-]/.test(l))
              if (i(e) && i(e).isSVG && x.Names.SVGAttribute(r))
                if (/^(height|width)$/i.test(r))
                  try {
                    l = e.getBBox()[r];
                  } catch (g) {
                    l = 0;
                  }
                else
                  l = e.getAttribute(r);
              else
                l = s(e, x.Names.prefixCheck(r)[0]);
            return x.Values.isCSSNullValue(l) && (l = 0), v.debug >= 2 && console.log("Get " + r + ": " + l), l;
          },
          setPropertyValue: function(e, r, a, n, o) {
            var s = r;
            if ("scroll" === r)
              o.container ? o.container["scroll" + o.direction] = a : "Left" === o.direction ? t.scrollTo(a, o.alternateValue) : t.scrollTo(o.alternateValue, a);
            else if (x.Normalizations.registered[r] && "transform" === x.Normalizations.registered[r]("name", e))
              x.Normalizations.registered[r]("inject", e, a), s = "transform", a = i(e).transformCache[r];
            else {
              if (x.Hooks.registered[r]) {
                var l = r,
                    u = x.Hooks.getRoot(r);
                n = n || x.getPropertyValue(e, u), a = x.Hooks.injectValue(l, a, n), r = u;
              }
              if (x.Normalizations.registered[r] && (a = x.Normalizations.registered[r]("inject", e, a), r = x.Normalizations.registered[r]("name", e)), s = x.Names.prefixCheck(r)[0], 8 >= f)
                try {
                  e.style[s] = a;
                } catch (c) {
                  v.debug && console.log("Browser does not support [" + a + "] for [" + s + "]");
                }
              else
                i(e) && i(e).isSVG && x.Names.SVGAttribute(r) ? e.setAttribute(r, a) : e.style[s] = a;
              v.debug >= 2 && console.log("Set " + r + " (" + s + "): " + a);
            }
            return [s, a];
          },
          flushTransformCache: function(e) {
            function t(t) {
              return parseFloat(x.getPropertyValue(e, t));
            }
            var r = "";
            if ((f || v.State.isAndroid && !v.State.isChrome) && i(e).isSVG) {
              var a = {
                translate: [t("translateX"), t("translateY")],
                skewX: [t("skewX")],
                skewY: [t("skewY")],
                scale: 1 !== t("scale") ? [t("scale"), t("scale")] : [t("scaleX"), t("scaleY")],
                rotate: [t("rotateZ"), 0, 0]
              };
              $.each(i(e).transformCache, function(e) {
                /^translate/i.test(e) ? e = "translate" : /^scale/i.test(e) ? e = "scale" : /^rotate/i.test(e) && (e = "rotate"), a[e] && (r += e + "(" + a[e].join(" ") + ") ", delete a[e]);
              });
            } else {
              var n,
                  o;
              $.each(i(e).transformCache, function(t) {
                return n = i(e).transformCache[t], "transformPerspective" === t ? (o = n, !0) : (9 === f && "rotateZ" === t && (t = "rotate"), void(r += t + n + " "));
              }), o && (r = "perspective" + o + " " + r);
            }
            x.setPropertyValue(e, "transform", r);
          }
        };
        x.Hooks.register(), x.Normalizations.register(), v.hook = function(e, t, r) {
          var n = a;
          return e = o(e), $.each(e, function(e, o) {
            if (i(o) === a && v.init(o), r === a)
              n === a && (n = v.CSS.getPropertyValue(o, t));
            else {
              var s = v.CSS.setPropertyValue(o, t, r);
              "transform" === s[0] && v.CSS.flushTransformCache(o), n = s;
            }
          }), n;
        };
        var S = function() {
          function e() {
            return l ? T.promise || null : f;
          }
          function n() {
            function e(e) {
              function p(e, t) {
                var r = a,
                    i = a,
                    s = a;
                return g.isArray(e) ? (r = e[0], !g.isArray(e[1]) && /^[\d-]/.test(e[1]) || g.isFunction(e[1]) || x.RegEx.isHex.test(e[1]) ? s = e[1] : (g.isString(e[1]) && !x.RegEx.isHex.test(e[1]) || g.isArray(e[1])) && (i = t ? e[1] : u(e[1], o.duration), e[2] !== a && (s = e[2]))) : r = e, t || (i = i || o.easing), g.isFunction(r) && (r = r.call(n, w, P)), g.isFunction(s) && (s = s.call(n, w, P)), [r || 0, i, s];
              }
              function f(e, t) {
                var r,
                    a;
                return a = (t || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(e) {
                  return r = e, "";
                }), r || (r = x.Values.getUnitType(e)), [a, r];
              }
              function d() {
                var e = {
                  myParent: n.parentNode || r.body,
                  position: x.getPropertyValue(n, "position"),
                  fontSize: x.getPropertyValue(n, "fontSize")
                },
                    a = e.position === N.lastPosition && e.myParent === N.lastParent,
                    o = e.fontSize === N.lastFontSize;
                N.lastParent = e.myParent, N.lastPosition = e.position, N.lastFontSize = e.fontSize;
                var s = 100,
                    l = {};
                if (o && a)
                  l.emToPx = N.lastEmToPx, l.percentToPxWidth = N.lastPercentToPxWidth, l.percentToPxHeight = N.lastPercentToPxHeight;
                else {
                  var u = i(n).isSVG ? r.createElementNS("http://www.w3.org/2000/svg", "rect") : r.createElement("div");
                  v.init(u), e.myParent.appendChild(u), $.each(["overflow", "overflowX", "overflowY"], function(e, t) {
                    v.CSS.setPropertyValue(u, t, "hidden");
                  }), v.CSS.setPropertyValue(u, "position", e.position), v.CSS.setPropertyValue(u, "fontSize", e.fontSize), v.CSS.setPropertyValue(u, "boxSizing", "content-box"), $.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(e, t) {
                    v.CSS.setPropertyValue(u, t, s + "%");
                  }), v.CSS.setPropertyValue(u, "paddingLeft", s + "em"), l.percentToPxWidth = N.lastPercentToPxWidth = (parseFloat(x.getPropertyValue(u, "width", null, !0)) || 1) / s, l.percentToPxHeight = N.lastPercentToPxHeight = (parseFloat(x.getPropertyValue(u, "height", null, !0)) || 1) / s, l.emToPx = N.lastEmToPx = (parseFloat(x.getPropertyValue(u, "paddingLeft")) || 1) / s, e.myParent.removeChild(u);
                }
                return null === N.remToPx && (N.remToPx = parseFloat(x.getPropertyValue(r.body, "fontSize")) || 16), null === N.vwToPx && (N.vwToPx = parseFloat(t.innerWidth) / 100, N.vhToPx = parseFloat(t.innerHeight) / 100), l.remToPx = N.remToPx, l.vwToPx = N.vwToPx, l.vhToPx = N.vhToPx, v.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(l), n), l;
              }
              if (o.begin && 0 === w)
                try {
                  o.begin.call(m, m);
                } catch (y) {
                  setTimeout(function() {
                    throw y;
                  }, 1);
                }
              if ("scroll" === k) {
                var S = /^x$/i.test(o.axis) ? "Left" : "Top",
                    V = parseFloat(o.offset) || 0,
                    C,
                    A,
                    F;
                o.container ? g.isWrapped(o.container) || g.isNode(o.container) ? (o.container = o.container[0] || o.container, C = o.container["scroll" + S], F = C + $(n).position()[S.toLowerCase()] + V) : o.container = null : (C = v.State.scrollAnchor[v.State["scrollProperty" + S]], A = v.State.scrollAnchor[v.State["scrollProperty" + ("Left" === S ? "Top" : "Left")]], F = $(n).offset()[S.toLowerCase()] + V), s = {
                  scroll: {
                    rootPropertyValue: !1,
                    startValue: C,
                    currentValue: C,
                    endValue: F,
                    unitType: "",
                    easing: o.easing,
                    scrollData: {
                      container: o.container,
                      direction: S,
                      alternateValue: A
                    }
                  },
                  element: n
                }, v.debug && console.log("tweensContainer (scroll): ", s.scroll, n);
              } else if ("reverse" === k) {
                if (!i(n).tweensContainer)
                  return void $.dequeue(n, o.queue);
                "none" === i(n).opts.display && (i(n).opts.display = "auto"), "hidden" === i(n).opts.visibility && (i(n).opts.visibility = "visible"), i(n).opts.loop = !1, i(n).opts.begin = null, i(n).opts.complete = null, b.easing || delete o.easing, b.duration || delete o.duration, o = $.extend({}, i(n).opts, o);
                var E = $.extend(!0, {}, i(n).tweensContainer);
                for (var j in E)
                  if ("element" !== j) {
                    var H = E[j].startValue;
                    E[j].startValue = E[j].currentValue = E[j].endValue, E[j].endValue = H, g.isEmptyObject(b) || (E[j].easing = o.easing), v.debug && console.log("reverse tweensContainer (" + j + "): " + JSON.stringify(E[j]), n);
                  }
                s = E;
              } else if ("start" === k) {
                var E;
                i(n).tweensContainer && i(n).isAnimating === !0 && (E = i(n).tweensContainer), $.each(h, function(e, t) {
                  if (RegExp("^" + x.Lists.colors.join("$|^") + "$").test(e)) {
                    var r = p(t, !0),
                        n = r[0],
                        o = r[1],
                        i = r[2];
                    if (x.RegEx.isHex.test(n)) {
                      for (var s = ["Red", "Green", "Blue"],
                          l = x.Values.hexToRgb(n),
                          u = i ? x.Values.hexToRgb(i) : a,
                          c = 0; c < s.length; c++) {
                        var f = [l[c]];
                        o && f.push(o), u !== a && f.push(u[c]), h[e + s[c]] = f;
                      }
                      delete h[e];
                    }
                  }
                });
                for (var R in h) {
                  var O = p(h[R]),
                      z = O[0],
                      q = O[1],
                      M = O[2];
                  R = x.Names.camelCase(R);
                  var I = x.Hooks.getRoot(R),
                      B = !1;
                  if (i(n).isSVG || "tween" === I || x.Names.prefixCheck(I)[1] !== !1 || x.Normalizations.registered[I] !== a) {
                    (o.display !== a && null !== o.display && "none" !== o.display || o.visibility !== a && "hidden" !== o.visibility) && /opacity|filter/.test(R) && !M && 0 !== z && (M = 0), o._cacheValues && E && E[R] ? (M === a && (M = E[R].endValue + E[R].unitType), B = i(n).rootPropertyValueCache[I]) : x.Hooks.registered[R] ? M === a ? (B = x.getPropertyValue(n, I), M = x.getPropertyValue(n, R, B)) : B = x.Hooks.templates[I][1] : M === a && (M = x.getPropertyValue(n, R));
                    var W,
                        G,
                        D,
                        X = !1;
                    if (W = f(R, M), M = W[0], D = W[1], W = f(R, z), z = W[0].replace(/^([+-\/*])=/, function(e, t) {
                      return X = t, "";
                    }), G = W[1], M = parseFloat(M) || 0, z = parseFloat(z) || 0, "%" === G && (/^(fontSize|lineHeight)$/.test(R) ? (z /= 100, G = "em") : /^scale/.test(R) ? (z /= 100, G = "") : /(Red|Green|Blue)$/i.test(R) && (z = z / 100 * 255, G = "")), /[\/*]/.test(X))
                      G = D;
                    else if (D !== G && 0 !== M)
                      if (0 === z)
                        G = D;
                      else {
                        l = l || d();
                        var Y = /margin|padding|left|right|width|text|word|letter/i.test(R) || /X$/.test(R) || "x" === R ? "x" : "y";
                        switch (D) {
                          case "%":
                            M *= "x" === Y ? l.percentToPxWidth : l.percentToPxHeight;
                            break;
                          case "px":
                            break;
                          default:
                            M *= l[D + "ToPx"];
                        }
                        switch (G) {
                          case "%":
                            M *= 1 / ("x" === Y ? l.percentToPxWidth : l.percentToPxHeight);
                            break;
                          case "px":
                            break;
                          default:
                            M *= 1 / l[G + "ToPx"];
                        }
                      }
                    switch (X) {
                      case "+":
                        z = M + z;
                        break;
                      case "-":
                        z = M - z;
                        break;
                      case "*":
                        z = M * z;
                        break;
                      case "/":
                        z = M / z;
                    }
                    s[R] = {
                      rootPropertyValue: B,
                      startValue: M,
                      currentValue: M,
                      endValue: z,
                      unitType: G,
                      easing: q
                    }, v.debug && console.log("tweensContainer (" + R + "): " + JSON.stringify(s[R]), n);
                  } else
                    v.debug && console.log("Skipping [" + I + "] due to a lack of browser support.");
                }
                s.element = n;
              }
              s.element && (x.Values.addClass(n, "velocity-animating"), L.push(s), "" === o.queue && (i(n).tweensContainer = s, i(n).opts = o), i(n).isAnimating = !0, w === P - 1 ? (v.State.calls.push([L, m, o, null, T.resolver]), v.State.isTicking === !1 && (v.State.isTicking = !0, c())) : w++);
            }
            var n = this,
                o = $.extend({}, v.defaults, b),
                s = {},
                l;
            switch (i(n) === a && v.init(n), parseFloat(o.delay) && o.queue !== !1 && $.queue(n, o.queue, function(e) {
              v.velocityQueueEntryFlag = !0, i(n).delayTimer = {
                setTimeout: setTimeout(e, parseFloat(o.delay)),
                next: e
              };
            }), o.duration.toString().toLowerCase()) {
              case "fast":
                o.duration = 200;
                break;
              case "normal":
                o.duration = y;
                break;
              case "slow":
                o.duration = 600;
                break;
              default:
                o.duration = parseFloat(o.duration) || 1;
            }
            v.mock !== !1 && (v.mock === !0 ? o.duration = o.delay = 1 : (o.duration *= parseFloat(v.mock) || 1, o.delay *= parseFloat(v.mock) || 1)), o.easing = u(o.easing, o.duration), o.begin && !g.isFunction(o.begin) && (o.begin = null), o.progress && !g.isFunction(o.progress) && (o.progress = null), o.complete && !g.isFunction(o.complete) && (o.complete = null), o.display !== a && null !== o.display && (o.display = o.display.toString().toLowerCase(), "auto" === o.display && (o.display = v.CSS.Values.getDisplayType(n))), o.visibility !== a && null !== o.visibility && (o.visibility = o.visibility.toString().toLowerCase()), o.mobileHA = o.mobileHA && v.State.isMobile && !v.State.isGingerbread, o.queue === !1 ? o.delay ? setTimeout(e, o.delay) : e() : $.queue(n, o.queue, function(t, r) {
              return r === !0 ? (T.promise && T.resolver(m), !0) : (v.velocityQueueEntryFlag = !0, void e(t));
            }), "" !== o.queue && "fx" !== o.queue || "inprogress" === $.queue(n)[0] || $.dequeue(n);
          }
          var s = arguments[0] && (arguments[0].p || $.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || g.isString(arguments[0].properties)),
              l,
              f,
              d,
              m,
              h,
              b;
          if (g.isWrapped(this) ? (l = !1, d = 0, m = this, f = this) : (l = !0, d = 1, m = s ? arguments[0].elements || arguments[0].e : arguments[0]), m = o(m)) {
            s ? (h = arguments[0].properties || arguments[0].p, b = arguments[0].options || arguments[0].o) : (h = arguments[d], b = arguments[d + 1]);
            var P = m.length,
                w = 0;
            if (!/^(stop|finish)$/i.test(h) && !$.isPlainObject(b)) {
              var V = d + 1;
              b = {};
              for (var C = V; C < arguments.length; C++)
                g.isArray(arguments[C]) || !/^(fast|normal|slow)$/i.test(arguments[C]) && !/^\d/.test(arguments[C]) ? g.isString(arguments[C]) || g.isArray(arguments[C]) ? b.easing = arguments[C] : g.isFunction(arguments[C]) && (b.complete = arguments[C]) : b.duration = arguments[C];
            }
            var T = {
              promise: null,
              resolver: null,
              rejecter: null
            };
            l && v.Promise && (T.promise = new v.Promise(function(e, t) {
              T.resolver = e, T.rejecter = t;
            }));
            var k;
            switch (h) {
              case "scroll":
                k = "scroll";
                break;
              case "reverse":
                k = "reverse";
                break;
              case "finish":
              case "stop":
                $.each(m, function(e, t) {
                  i(t) && i(t).delayTimer && (clearTimeout(i(t).delayTimer.setTimeout), i(t).delayTimer.next && i(t).delayTimer.next(), delete i(t).delayTimer);
                });
                var A = [];
                return $.each(v.State.calls, function(e, t) {
                  t && $.each(t[1], function(r, n) {
                    var o = b === a ? "" : b;
                    return o === !0 || t[2].queue === o || b === a && t[2].queue === !1 ? void $.each(m, function(r, a) {
                      a === n && ((b === !0 || g.isString(b)) && ($.each($.queue(a, g.isString(b) ? b : ""), function(e, t) {
                        g.isFunction(t) && t(null, !0);
                      }), $.queue(a, g.isString(b) ? b : "", [])), "stop" === h ? (i(a) && i(a).tweensContainer && o !== !1 && $.each(i(a).tweensContainer, function(e, t) {
                        t.endValue = t.currentValue;
                      }), A.push(e)) : "finish" === h && (t[2].duration = 1));
                    }) : !0;
                  });
                }), "stop" === h && ($.each(A, function(e, t) {
                  p(t, !0);
                }), T.promise && T.resolver(m)), e();
              default:
                if (!$.isPlainObject(h) || g.isEmptyObject(h)) {
                  if (g.isString(h) && v.Redirects[h]) {
                    var F = $.extend({}, b),
                        E = F.duration,
                        j = F.delay || 0;
                    return F.backwards === !0 && (m = $.extend(!0, [], m).reverse()), $.each(m, function(e, t) {
                      parseFloat(F.stagger) ? F.delay = j + parseFloat(F.stagger) * e : g.isFunction(F.stagger) && (F.delay = j + F.stagger.call(t, e, P)), F.drag && (F.duration = parseFloat(E) || (/^(callout|transition)/.test(h) ? 1e3 : y), F.duration = Math.max(F.duration * (F.backwards ? 1 - e / P : (e + 1) / P), .75 * F.duration, 200)), v.Redirects[h].call(t, t, F || {}, e, P, m, T.promise ? T : a);
                    }), e();
                  }
                  var H = "Velocity: First argument (" + h + ") was not a property map, a known action, or a registered redirect. Aborting.";
                  return T.promise ? T.rejecter(new Error(H)) : console.log(H), e();
                }
                k = "start";
            }
            var N = {
              lastParent: null,
              lastPosition: null,
              lastFontSize: null,
              lastPercentToPxWidth: null,
              lastPercentToPxHeight: null,
              lastEmToPx: null,
              remToPx: null,
              vwToPx: null,
              vhToPx: null
            },
                L = [];
            $.each(m, function(e, t) {
              g.isNode(t) && n.call(t);
            });
            var F = $.extend({}, v.defaults, b),
                R;
            if (F.loop = parseInt(F.loop), R = 2 * F.loop - 1, F.loop)
              for (var O = 0; R > O; O++) {
                var z = {
                  delay: F.delay,
                  progress: F.progress
                };
                O === R - 1 && (z.display = F.display, z.visibility = F.visibility, z.complete = F.complete), S(m, "reverse", z);
              }
            return e();
          }
        };
        v = $.extend(S, v), v.animate = S;
        var P = t.requestAnimationFrame || d;
        return v.State.isMobile || r.hidden === a || r.addEventListener("visibilitychange", function() {
          r.hidden ? (P = function(e) {
            return setTimeout(function() {
              e(!0);
            }, 16);
          }, c()) : P = t.requestAnimationFrame || d;
        }), e.Velocity = v, e !== t && (e.fn.velocity = S, e.fn.velocity.defaults = v.defaults), $.each(["Down", "Up"], function(e, t) {
          v.Redirects["slide" + t] = function(e, r, n, o, i, s) {
            var l = $.extend({}, r),
                u = l.begin,
                c = l.complete,
                p = {
                  height: "",
                  marginTop: "",
                  marginBottom: "",
                  paddingTop: "",
                  paddingBottom: ""
                },
                f = {};
            l.display === a && (l.display = "Down" === t ? "inline" === v.CSS.Values.getDisplayType(e) ? "inline-block" : "block" : "none"), l.begin = function() {
              u && u.call(i, i);
              for (var r in p) {
                f[r] = e.style[r];
                var a = v.CSS.getPropertyValue(e, r);
                p[r] = "Down" === t ? [a, 0] : [0, a];
              }
              f.overflow = e.style.overflow, e.style.overflow = "hidden";
            }, l.complete = function() {
              for (var t in f)
                e.style[t] = f[t];
              c && c.call(i, i), s && s.resolver(i);
            }, v(e, p, l);
          };
        }), $.each(["In", "Out"], function(e, t) {
          v.Redirects["fade" + t] = function(e, r, n, o, i, s) {
            var l = $.extend({}, r),
                u = {opacity: "In" === t ? 1 : 0},
                c = l.complete;
            l.complete = n !== o - 1 ? l.begin = null : function() {
              c && c.call(i, i), s && s.resolver(i);
            }, l.display === a && (l.display = "In" === t ? "auto" : "none"), v(this, u, l);
          };
        }), v;
      }(window.jQuery || window.Zepto || window, window, document);
    });
    ;
    !function(a, b, c, d) {
      "use strict";
      function k(a, b, c) {
        return setTimeout(q(a, c), b);
      }
      function l(a, b, c) {
        return Array.isArray(a) ? (m(a, c[b], c), !0) : !1;
      }
      function m(a, b, c) {
        var e;
        if (a)
          if (a.forEach)
            a.forEach(b, c);
          else if (a.length !== d)
            for (e = 0; e < a.length; )
              b.call(c, a[e], e, a), e++;
          else
            for (e in a)
              a.hasOwnProperty(e) && b.call(c, a[e], e, a);
      }
      function n(a, b, c) {
        for (var e = Object.keys(b),
            f = 0; f < e.length; )
          (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
        return a;
      }
      function o(a, b) {
        return n(a, b, !0);
      }
      function p(a, b, c) {
        var e,
            d = b.prototype;
        e = a.prototype = Object.create(d), e.constructor = a, e._super = d, c && n(e, c);
      }
      function q(a, b) {
        return function() {
          return a.apply(b, arguments);
        };
      }
      function r(a, b) {
        return typeof a == g ? a.apply(b ? b[0] || d : d, b) : a;
      }
      function s(a, b) {
        return a === d ? b : a;
      }
      function t(a, b, c) {
        m(x(b), function(b) {
          a.addEventListener(b, c, !1);
        });
      }
      function u(a, b, c) {
        m(x(b), function(b) {
          a.removeEventListener(b, c, !1);
        });
      }
      function v(a, b) {
        for (; a; ) {
          if (a == b)
            return !0;
          a = a.parentNode;
        }
        return !1;
      }
      function w(a, b) {
        return a.indexOf(b) > -1;
      }
      function x(a) {
        return a.trim().split(/\s+/g);
      }
      function y(a, b, c) {
        if (a.indexOf && !c)
          return a.indexOf(b);
        for (var d = 0; d < a.length; ) {
          if (c && a[d][c] == b || !c && a[d] === b)
            return d;
          d++;
        }
        return -1;
      }
      function z(a) {
        return Array.prototype.slice.call(a, 0);
      }
      function A(a, b, c) {
        for (var d = [],
            e = [],
            f = 0; f < a.length; ) {
          var g = b ? a[f][b] : a[f];
          y(e, g) < 0 && d.push(a[f]), e[f] = g, f++;
        }
        return c && (d = b ? d.sort(function(a, c) {
          return a[b] > c[b];
        }) : d.sort()), d;
      }
      function B(a, b) {
        for (var c,
            f,
            g = b[0].toUpperCase() + b.slice(1),
            h = 0; h < e.length; ) {
          if (c = e[h], f = c ? c + g : b, f in a)
            return f;
          h++;
        }
        return d;
      }
      function D() {
        return C++;
      }
      function E(a) {
        var b = a.ownerDocument;
        return b.defaultView || b.parentWindow;
      }
      function ab(a, b) {
        var c = this;
        this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function(b) {
          r(a.options.enable, [a]) && c.handler(b);
        }, this.init();
      }
      function bb(a) {
        var b,
            c = a.options.inputClass;
        return b = c ? c : H ? wb : I ? Eb : G ? Gb : rb, new b(a, cb);
      }
      function cb(a, b, c) {
        var d = c.pointers.length,
            e = c.changedPointers.length,
            f = b & O && 0 === d - e,
            g = b & (Q | R) && 0 === d - e;
        c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, db(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c;
      }
      function db(a, b) {
        var c = a.session,
            d = b.pointers,
            e = d.length;
        c.firstInput || (c.firstInput = gb(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = gb(b) : 1 === e && (c.firstMultiple = !1);
        var f = c.firstInput,
            g = c.firstMultiple,
            h = g ? g.center : f.center,
            i = b.center = hb(d);
        b.timeStamp = j(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = lb(h, i), b.distance = kb(h, i), eb(c, b), b.offsetDirection = jb(b.deltaX, b.deltaY), b.scale = g ? nb(g.pointers, d) : 1, b.rotation = g ? mb(g.pointers, d) : 0, fb(c, b);
        var k = a.element;
        v(b.srcEvent.target, k) && (k = b.srcEvent.target), b.target = k;
      }
      function eb(a, b) {
        var c = b.center,
            d = a.offsetDelta || {},
            e = a.prevDelta || {},
            f = a.prevInput || {};
        (b.eventType === O || f.eventType === Q) && (e = a.prevDelta = {
          x: f.deltaX || 0,
          y: f.deltaY || 0
        }, d = a.offsetDelta = {
          x: c.x,
          y: c.y
        }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y);
      }
      function fb(a, b) {
        var f,
            g,
            h,
            j,
            c = a.lastInterval || b,
            e = b.timeStamp - c.timeStamp;
        if (b.eventType != R && (e > N || c.velocity === d)) {
          var k = c.deltaX - b.deltaX,
              l = c.deltaY - b.deltaY,
              m = ib(e, k, l);
          g = m.x, h = m.y, f = i(m.x) > i(m.y) ? m.x : m.y, j = jb(k, l), a.lastInterval = b;
        } else
          f = c.velocity, g = c.velocityX, h = c.velocityY, j = c.direction;
        b.velocity = f, b.velocityX = g, b.velocityY = h, b.direction = j;
      }
      function gb(a) {
        for (var b = [],
            c = 0; c < a.pointers.length; )
          b[c] = {
            clientX: h(a.pointers[c].clientX),
            clientY: h(a.pointers[c].clientY)
          }, c++;
        return {
          timeStamp: j(),
          pointers: b,
          center: hb(b),
          deltaX: a.deltaX,
          deltaY: a.deltaY
        };
      }
      function hb(a) {
        var b = a.length;
        if (1 === b)
          return {
            x: h(a[0].clientX),
            y: h(a[0].clientY)
          };
        for (var c = 0,
            d = 0,
            e = 0; b > e; )
          c += a[e].clientX, d += a[e].clientY, e++;
        return {
          x: h(c / b),
          y: h(d / b)
        };
      }
      function ib(a, b, c) {
        return {
          x: b / a || 0,
          y: c / a || 0
        };
      }
      function jb(a, b) {
        return a === b ? S : i(a) >= i(b) ? a > 0 ? T : U : b > 0 ? V : W;
      }
      function kb(a, b, c) {
        c || (c = $);
        var d = b[c[0]] - a[c[0]],
            e = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + e * e);
      }
      function lb(a, b, c) {
        c || (c = $);
        var d = b[c[0]] - a[c[0]],
            e = b[c[1]] - a[c[1]];
        return 180 * Math.atan2(e, d) / Math.PI;
      }
      function mb(a, b) {
        return lb(b[1], b[0], _) - lb(a[1], a[0], _);
      }
      function nb(a, b) {
        return kb(b[0], b[1], _) / kb(a[0], a[1], _);
      }
      function rb() {
        this.evEl = pb, this.evWin = qb, this.allow = !0, this.pressed = !1, ab.apply(this, arguments);
      }
      function wb() {
        this.evEl = ub, this.evWin = vb, ab.apply(this, arguments), this.store = this.manager.session.pointerEvents = [];
      }
      function Ab() {
        this.evTarget = yb, this.evWin = zb, this.started = !1, ab.apply(this, arguments);
      }
      function Bb(a, b) {
        var c = z(a.touches),
            d = z(a.changedTouches);
        return b & (Q | R) && (c = A(c.concat(d), "identifier", !0)), [c, d];
      }
      function Eb() {
        this.evTarget = Db, this.targetIds = {}, ab.apply(this, arguments);
      }
      function Fb(a, b) {
        var c = z(a.touches),
            d = this.targetIds;
        if (b & (O | P) && 1 === c.length)
          return d[c[0].identifier] = !0, [c, c];
        var e,
            f,
            g = z(a.changedTouches),
            h = [],
            i = this.target;
        if (f = c.filter(function(a) {
          return v(a.target, i);
        }), b === O)
          for (e = 0; e < f.length; )
            d[f[e].identifier] = !0, e++;
        for (e = 0; e < g.length; )
          d[g[e].identifier] && h.push(g[e]), b & (Q | R) && delete d[g[e].identifier], e++;
        return h.length ? [A(f.concat(h), "identifier", !0), h] : void 0;
      }
      function Gb() {
        ab.apply(this, arguments);
        var a = q(this.handler, this);
        this.touch = new Eb(this.manager, a), this.mouse = new rb(this.manager, a);
      }
      function Pb(a, b) {
        this.manager = a, this.set(b);
      }
      function Qb(a) {
        if (w(a, Mb))
          return Mb;
        var b = w(a, Nb),
            c = w(a, Ob);
        return b && c ? Nb + " " + Ob : b || c ? b ? Nb : Ob : w(a, Lb) ? Lb : Kb;
      }
      function Yb(a) {
        this.id = D(), this.manager = null, this.options = o(a || {}, this.defaults), this.options.enable = s(this.options.enable, !0), this.state = Rb, this.simultaneous = {}, this.requireFail = [];
      }
      function Zb(a) {
        return a & Wb ? "cancel" : a & Ub ? "end" : a & Tb ? "move" : a & Sb ? "start" : "";
      }
      function $b(a) {
        return a == W ? "down" : a == V ? "up" : a == T ? "left" : a == U ? "right" : "";
      }
      function _b(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a;
      }
      function ac() {
        Yb.apply(this, arguments);
      }
      function bc() {
        ac.apply(this, arguments), this.pX = null, this.pY = null;
      }
      function cc() {
        ac.apply(this, arguments);
      }
      function dc() {
        Yb.apply(this, arguments), this._timer = null, this._input = null;
      }
      function ec() {
        ac.apply(this, arguments);
      }
      function fc() {
        ac.apply(this, arguments);
      }
      function gc() {
        Yb.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0;
      }
      function hc(a, b) {
        return b = b || {}, b.recognizers = s(b.recognizers, hc.defaults.preset), new kc(a, b);
      }
      function kc(a, b) {
        b = b || {}, this.options = o(b, hc.defaults), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = a, this.input = bb(this), this.touchAction = new Pb(this, this.options.touchAction), lc(this, !0), m(b.recognizers, function(a) {
          var b = this.add(new a[0](a[1]));
          a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3]);
        }, this);
      }
      function lc(a, b) {
        var c = a.element;
        m(a.options.cssProps, function(a, d) {
          c.style[B(c.style, d)] = b ? a : "";
        });
      }
      function mc(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d);
      }
      var e = ["", "webkit", "moz", "MS", "ms", "o"],
          f = b.createElement("div"),
          g = "function",
          h = Math.round,
          i = Math.abs,
          j = Date.now,
          C = 1,
          F = /mobile|tablet|ip(ad|hone|od)|android/i,
          G = "ontouchstart" in a,
          H = B(a, "PointerEvent") !== d,
          I = G && F.test(navigator.userAgent),
          J = "touch",
          K = "pen",
          L = "mouse",
          M = "kinect",
          N = 25,
          O = 1,
          P = 2,
          Q = 4,
          R = 8,
          S = 1,
          T = 2,
          U = 4,
          V = 8,
          W = 16,
          X = T | U,
          Y = V | W,
          Z = X | Y,
          $ = ["x", "y"],
          _ = ["clientX", "clientY"];
      ab.prototype = {
        handler: function() {},
        init: function() {
          this.evEl && t(this.element, this.evEl, this.domHandler), this.evTarget && t(this.target, this.evTarget, this.domHandler), this.evWin && t(E(this.element), this.evWin, this.domHandler);
        },
        destroy: function() {
          this.evEl && u(this.element, this.evEl, this.domHandler), this.evTarget && u(this.target, this.evTarget, this.domHandler), this.evWin && u(E(this.element), this.evWin, this.domHandler);
        }
      };
      var ob = {
        mousedown: O,
        mousemove: P,
        mouseup: Q
      },
          pb = "mousedown",
          qb = "mousemove mouseup";
      p(rb, ab, {handler: function(a) {
          var b = ob[a.type];
          b & O && 0 === a.button && (this.pressed = !0), b & P && 1 !== a.which && (b = Q), this.pressed && this.allow && (b & Q && (this.pressed = !1), this.callback(this.manager, b, {
            pointers: [a],
            changedPointers: [a],
            pointerType: L,
            srcEvent: a
          }));
        }});
      var sb = {
        pointerdown: O,
        pointermove: P,
        pointerup: Q,
        pointercancel: R,
        pointerout: R
      },
          tb = {
            2: J,
            3: K,
            4: L,
            5: M
          },
          ub = "pointerdown",
          vb = "pointermove pointerup pointercancel";
      a.MSPointerEvent && (ub = "MSPointerDown", vb = "MSPointerMove MSPointerUp MSPointerCancel"), p(wb, ab, {handler: function(a) {
          var b = this.store,
              c = !1,
              d = a.type.toLowerCase().replace("ms", ""),
              e = sb[d],
              f = tb[a.pointerType] || a.pointerType,
              g = f == J,
              h = y(b, a.pointerId, "pointerId");
          e & O && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Q | R) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, {
            pointers: b,
            changedPointers: [a],
            pointerType: f,
            srcEvent: a
          }), c && b.splice(h, 1));
        }});
      var xb = {
        touchstart: O,
        touchmove: P,
        touchend: Q,
        touchcancel: R
      },
          yb = "touchstart",
          zb = "touchstart touchmove touchend touchcancel";
      p(Ab, ab, {handler: function(a) {
          var b = xb[a.type];
          if (b === O && (this.started = !0), this.started) {
            var c = Bb.call(this, a, b);
            b & (Q | R) && 0 === c[0].length - c[1].length && (this.started = !1), this.callback(this.manager, b, {
              pointers: c[0],
              changedPointers: c[1],
              pointerType: J,
              srcEvent: a
            });
          }
        }});
      var Cb = {
        touchstart: O,
        touchmove: P,
        touchend: Q,
        touchcancel: R
      },
          Db = "touchstart touchmove touchend touchcancel";
      p(Eb, ab, {handler: function(a) {
          var b = Cb[a.type],
              c = Fb.call(this, a, b);
          c && this.callback(this.manager, b, {
            pointers: c[0],
            changedPointers: c[1],
            pointerType: J,
            srcEvent: a
          });
        }}), p(Gb, ab, {
        handler: function(a, b, c) {
          var d = c.pointerType == J,
              e = c.pointerType == L;
          if (d)
            this.mouse.allow = !1;
          else if (e && !this.mouse.allow)
            return;
          b & (Q | R) && (this.mouse.allow = !0), this.callback(a, b, c);
        },
        destroy: function() {
          this.touch.destroy(), this.mouse.destroy();
        }
      });
      var Hb = B(f.style, "touchAction"),
          Ib = Hb !== d,
          Jb = "compute",
          Kb = "auto",
          Lb = "manipulation",
          Mb = "none",
          Nb = "pan-x",
          Ob = "pan-y";
      Pb.prototype = {
        set: function(a) {
          a == Jb && (a = this.compute()), Ib && (this.manager.element.style[Hb] = a), this.actions = a.toLowerCase().trim();
        },
        update: function() {
          this.set(this.manager.options.touchAction);
        },
        compute: function() {
          var a = [];
          return m(this.manager.recognizers, function(b) {
            r(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()));
          }), Qb(a.join(" "));
        },
        preventDefaults: function(a) {
          if (!Ib) {
            var b = a.srcEvent,
                c = a.offsetDirection;
            if (this.manager.session.prevented)
              return b.preventDefault(), void 0;
            var d = this.actions,
                e = w(d, Mb),
                f = w(d, Ob),
                g = w(d, Nb);
            return e || f && c & X || g && c & Y ? this.preventSrc(b) : void 0;
          }
        },
        preventSrc: function(a) {
          this.manager.session.prevented = !0, a.preventDefault();
        }
      };
      var Rb = 1,
          Sb = 2,
          Tb = 4,
          Ub = 8,
          Vb = Ub,
          Wb = 16,
          Xb = 32;
      Yb.prototype = {
        defaults: {},
        set: function(a) {
          return n(this.options, a), this.manager && this.manager.touchAction.update(), this;
        },
        recognizeWith: function(a) {
          if (l(a, "recognizeWith", this))
            return this;
          var b = this.simultaneous;
          return a = _b(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this;
        },
        dropRecognizeWith: function(a) {
          return l(a, "dropRecognizeWith", this) ? this : (a = _b(a, this), delete this.simultaneous[a.id], this);
        },
        requireFailure: function(a) {
          if (l(a, "requireFailure", this))
            return this;
          var b = this.requireFail;
          return a = _b(a, this), -1 === y(b, a) && (b.push(a), a.requireFailure(this)), this;
        },
        dropRequireFailure: function(a) {
          if (l(a, "dropRequireFailure", this))
            return this;
          a = _b(a, this);
          var b = y(this.requireFail, a);
          return b > -1 && this.requireFail.splice(b, 1), this;
        },
        hasRequireFailures: function() {
          return this.requireFail.length > 0;
        },
        canRecognizeWith: function(a) {
          return !!this.simultaneous[a.id];
        },
        emit: function(a) {
          function d(d) {
            b.manager.emit(b.options.event + (d ? Zb(c) : ""), a);
          }
          var b = this,
              c = this.state;
          Ub > c && d(!0), d(), c >= Ub && d(!0);
        },
        tryEmit: function(a) {
          return this.canEmit() ? this.emit(a) : (this.state = Xb, void 0);
        },
        canEmit: function() {
          for (var a = 0; a < this.requireFail.length; ) {
            if (!(this.requireFail[a].state & (Xb | Rb)))
              return !1;
            a++;
          }
          return !0;
        },
        recognize: function(a) {
          var b = n({}, a);
          return r(this.options.enable, [this, b]) ? (this.state & (Vb | Wb | Xb) && (this.state = Rb), this.state = this.process(b), this.state & (Sb | Tb | Ub | Wb) && this.tryEmit(b), void 0) : (this.reset(), this.state = Xb, void 0);
        },
        process: function() {},
        getTouchAction: function() {},
        reset: function() {}
      }, p(ac, Yb, {
        defaults: {pointers: 1},
        attrTest: function(a) {
          var b = this.options.pointers;
          return 0 === b || a.pointers.length === b;
        },
        process: function(a) {
          var b = this.state,
              c = a.eventType,
              d = b & (Sb | Tb),
              e = this.attrTest(a);
          return d && (c & R || !e) ? b | Wb : d || e ? c & Q ? b | Ub : b & Sb ? b | Tb : Sb : Xb;
        }
      }), p(bc, ac, {
        defaults: {
          event: "pan",
          threshold: 10,
          pointers: 1,
          direction: Z
        },
        getTouchAction: function() {
          var a = this.options.direction,
              b = [];
          return a & X && b.push(Ob), a & Y && b.push(Nb), b;
        },
        directionTest: function(a) {
          var b = this.options,
              c = !0,
              d = a.distance,
              e = a.direction,
              f = a.deltaX,
              g = a.deltaY;
          return e & b.direction || (b.direction & X ? (e = 0 === f ? S : 0 > f ? T : U, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? S : 0 > g ? V : W, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction;
        },
        attrTest: function(a) {
          return ac.prototype.attrTest.call(this, a) && (this.state & Sb || !(this.state & Sb) && this.directionTest(a));
        },
        emit: function(a) {
          this.pX = a.deltaX, this.pY = a.deltaY;
          var b = $b(a.direction);
          b && this.manager.emit(this.options.event + b, a), this._super.emit.call(this, a);
        }
      }), p(cc, ac, {
        defaults: {
          event: "pinch",
          threshold: 0,
          pointers: 2
        },
        getTouchAction: function() {
          return [Mb];
        },
        attrTest: function(a) {
          return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & Sb);
        },
        emit: function(a) {
          if (this._super.emit.call(this, a), 1 !== a.scale) {
            var b = a.scale < 1 ? "in" : "out";
            this.manager.emit(this.options.event + b, a);
          }
        }
      }), p(dc, Yb, {
        defaults: {
          event: "press",
          pointers: 1,
          time: 500,
          threshold: 5
        },
        getTouchAction: function() {
          return [Kb];
        },
        process: function(a) {
          var b = this.options,
              c = a.pointers.length === b.pointers,
              d = a.distance < b.threshold,
              e = a.deltaTime > b.time;
          if (this._input = a, !d || !c || a.eventType & (Q | R) && !e)
            this.reset();
          else if (a.eventType & O)
            this.reset(), this._timer = k(function() {
              this.state = Vb, this.tryEmit();
            }, b.time, this);
          else if (a.eventType & Q)
            return Vb;
          return Xb;
        },
        reset: function() {
          clearTimeout(this._timer);
        },
        emit: function(a) {
          this.state === Vb && (a && a.eventType & Q ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = j(), this.manager.emit(this.options.event, this._input)));
        }
      }), p(ec, ac, {
        defaults: {
          event: "rotate",
          threshold: 0,
          pointers: 2
        },
        getTouchAction: function() {
          return [Mb];
        },
        attrTest: function(a) {
          return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & Sb);
        }
      }), p(fc, ac, {
        defaults: {
          event: "swipe",
          threshold: 10,
          velocity: .65,
          direction: X | Y,
          pointers: 1
        },
        getTouchAction: function() {
          return bc.prototype.getTouchAction.call(this);
        },
        attrTest: function(a) {
          var c,
              b = this.options.direction;
          return b & (X | Y) ? c = a.velocity : b & X ? c = a.velocityX : b & Y && (c = a.velocityY), this._super.attrTest.call(this, a) && b & a.direction && a.distance > this.options.threshold && i(c) > this.options.velocity && a.eventType & Q;
        },
        emit: function(a) {
          var b = $b(a.direction);
          b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a);
        }
      }), p(gc, Yb, {
        defaults: {
          event: "tap",
          pointers: 1,
          taps: 1,
          interval: 300,
          time: 250,
          threshold: 2,
          posThreshold: 10
        },
        getTouchAction: function() {
          return [Lb];
        },
        process: function(a) {
          var b = this.options,
              c = a.pointers.length === b.pointers,
              d = a.distance < b.threshold,
              e = a.deltaTime < b.time;
          if (this.reset(), a.eventType & O && 0 === this.count)
            return this.failTimeout();
          if (d && e && c) {
            if (a.eventType != Q)
              return this.failTimeout();
            var f = this.pTime ? a.timeStamp - this.pTime < b.interval : !0,
                g = !this.pCenter || kb(this.pCenter, a.center) < b.posThreshold;
            this.pTime = a.timeStamp, this.pCenter = a.center, g && f ? this.count += 1 : this.count = 1, this._input = a;
            var h = this.count % b.taps;
            if (0 === h)
              return this.hasRequireFailures() ? (this._timer = k(function() {
                this.state = Vb, this.tryEmit();
              }, b.interval, this), Sb) : Vb;
          }
          return Xb;
        },
        failTimeout: function() {
          return this._timer = k(function() {
            this.state = Xb;
          }, this.options.interval, this), Xb;
        },
        reset: function() {
          clearTimeout(this._timer);
        },
        emit: function() {
          this.state == Vb && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input));
        }
      }), hc.VERSION = "2.0.4", hc.defaults = {
        domEvents: !1,
        touchAction: Jb,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [[ec, {enable: !1}], [cc, {enable: !1}, ["rotate"]], [fc, {direction: X}], [bc, {direction: X}, ["swipe"]], [gc], [gc, {
          event: "doubletap",
          taps: 2
        }, ["tap"]], [dc]],
        cssProps: {
          userSelect: "default",
          touchSelect: "none",
          touchCallout: "none",
          contentZooming: "none",
          userDrag: "none",
          tapHighlightColor: "rgba(0,0,0,0)"
        }
      };
      var ic = 1,
          jc = 2;
      kc.prototype = {
        set: function(a) {
          return n(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this;
        },
        stop: function(a) {
          this.session.stopped = a ? jc : ic;
        },
        recognize: function(a) {
          var b = this.session;
          if (!b.stopped) {
            this.touchAction.preventDefaults(a);
            var c,
                d = this.recognizers,
                e = b.curRecognizer;
            (!e || e && e.state & Vb) && (e = b.curRecognizer = null);
            for (var f = 0; f < d.length; )
              c = d[f], b.stopped === jc || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (Sb | Tb | Ub) && (e = b.curRecognizer = c), f++;
          }
        },
        get: function(a) {
          if (a instanceof Yb)
            return a;
          for (var b = this.recognizers,
              c = 0; c < b.length; c++)
            if (b[c].options.event == a)
              return b[c];
          return null;
        },
        add: function(a) {
          if (l(a, "add", this))
            return this;
          var b = this.get(a.options.event);
          return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a;
        },
        remove: function(a) {
          if (l(a, "remove", this))
            return this;
          var b = this.recognizers;
          return a = this.get(a), b.splice(y(b, a), 1), this.touchAction.update(), this;
        },
        on: function(a, b) {
          var c = this.handlers;
          return m(x(a), function(a) {
            c[a] = c[a] || [], c[a].push(b);
          }), this;
        },
        off: function(a, b) {
          var c = this.handlers;
          return m(x(a), function(a) {
            b ? c[a].splice(y(c[a], b), 1) : delete c[a];
          }), this;
        },
        emit: function(a, b) {
          this.options.domEvents && mc(a, b);
          var c = this.handlers[a] && this.handlers[a].slice();
          if (c && c.length) {
            b.type = a, b.preventDefault = function() {
              b.srcEvent.preventDefault();
            };
            for (var d = 0; d < c.length; )
              c[d](b), d++;
          }
        },
        destroy: function() {
          this.element && lc(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null;
        }
      }, n(hc, {
        INPUT_START: O,
        INPUT_MOVE: P,
        INPUT_END: Q,
        INPUT_CANCEL: R,
        STATE_POSSIBLE: Rb,
        STATE_BEGAN: Sb,
        STATE_CHANGED: Tb,
        STATE_ENDED: Ub,
        STATE_RECOGNIZED: Vb,
        STATE_CANCELLED: Wb,
        STATE_FAILED: Xb,
        DIRECTION_NONE: S,
        DIRECTION_LEFT: T,
        DIRECTION_RIGHT: U,
        DIRECTION_UP: V,
        DIRECTION_DOWN: W,
        DIRECTION_HORIZONTAL: X,
        DIRECTION_VERTICAL: Y,
        DIRECTION_ALL: Z,
        Manager: kc,
        Input: ab,
        TouchAction: Pb,
        TouchInput: Eb,
        MouseInput: rb,
        PointerEventInput: wb,
        TouchMouseInput: Gb,
        SingleTouchInput: Ab,
        Recognizer: Yb,
        AttrRecognizer: ac,
        Tap: gc,
        Pan: bc,
        Swipe: fc,
        Pinch: cc,
        Rotate: ec,
        Press: dc,
        on: t,
        off: u,
        each: m,
        merge: o,
        extend: n,
        inherit: p,
        bindFn: q,
        prefixed: B
      }), typeof define == g && define.amd ? define(function() {
        return hc;
      }) : "undefined" != typeof module && module.exports ? module.exports = hc : a[c] = hc;
    }(window, document, "Hammer");
    ;
    (function(factory) {
      if (typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
      } else if (typeof exports === 'object') {
        factory(require('jquery'), require('hammerjs'));
      } else {
        factory(jQuery, Hammer);
      }
    }(function($, Hammer) {
      function hammerify(el, options) {
        var $el = $(el);
        if (!$el.data("hammer")) {
          $el.data("hammer", new Hammer($el[0], options));
        }
      }
      $.fn.hammer = function(options) {
        return this.each(function() {
          hammerify(this, options);
        });
      };
      Hammer.Manager.prototype.emit = (function(originalEmit) {
        return function(type, data) {
          originalEmit.call(this, type, data);
          $(this.element).trigger({
            type: type,
            gesture: data
          });
        };
      })(Hammer.Manager.prototype.emit);
    }));
    ;
    Materialize = {};
    Materialize.guid = (function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      };
    })();
    Materialize.elementOrParentIsFixed = function(element) {
      var $element = $(element);
      var $checkElements = $element.add($element.parents());
      var isFixed = false;
      $checkElements.each(function() {
        if ($(this).css("position") === "fixed") {
          isFixed = true;
          return false;
        }
      });
      return isFixed;
    };
    var Vel;
    if ($) {
      Vel = $.Velocity;
    } else {
      Vel = Velocity;
    }
    ;
    (function($) {
      $.fn.collapsible = function(options) {
        var defaults = {accordion: undefined};
        options = $.extend(defaults, options);
        return this.each(function() {
          var $this = $(this);
          var $panel_headers = $(this).find('> li > .collapsible-header');
          var collapsible_type = $this.data("collapsible");
          $this.off('click.collapse', '.collapsible-header');
          $panel_headers.off('click.collapse');
          function accordionOpen(object) {
            $panel_headers = $this.find('> li > .collapsible-header');
            if (object.hasClass('active')) {
              object.parent().addClass('active');
            } else {
              object.parent().removeClass('active');
            }
            if (object.parent().hasClass('active')) {
              object.siblings('.collapsible-body').stop(true, false).slideDown({
                duration: 350,
                easing: "easeOutQuart",
                queue: false,
                complete: function() {
                  $(this).css('height', '');
                }
              });
            } else {
              object.siblings('.collapsible-body').stop(true, false).slideUp({
                duration: 350,
                easing: "easeOutQuart",
                queue: false,
                complete: function() {
                  $(this).css('height', '');
                }
              });
            }
            $panel_headers.not(object).removeClass('active').parent().removeClass('active');
            $panel_headers.not(object).parent().children('.collapsible-body').stop(true, false).slideUp({
              duration: 350,
              easing: "easeOutQuart",
              queue: false,
              complete: function() {
                $(this).css('height', '');
              }
            });
          }
          function expandableOpen(object) {
            if (object.hasClass('active')) {
              object.parent().addClass('active');
            } else {
              object.parent().removeClass('active');
            }
            if (object.parent().hasClass('active')) {
              object.siblings('.collapsible-body').stop(true, false).slideDown({
                duration: 350,
                easing: "easeOutQuart",
                queue: false,
                complete: function() {
                  $(this).css('height', '');
                }
              });
            } else {
              object.siblings('.collapsible-body').stop(true, false).slideUp({
                duration: 350,
                easing: "easeOutQuart",
                queue: false,
                complete: function() {
                  $(this).css('height', '');
                }
              });
            }
          }
          function isChildrenOfPanelHeader(object) {
            var panelHeader = getPanelHeader(object);
            return panelHeader.length > 0;
          }
          function getPanelHeader(object) {
            return object.closest('li > .collapsible-header');
          }
          if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) {
            $panel_headers = $this.find('> li > .collapsible-header');
            $panel_headers.on('click.collapse', function(e) {
              var element = $(e.target);
              if (isChildrenOfPanelHeader(element)) {
                element = getPanelHeader(element);
              }
              element.toggleClass('active');
              accordionOpen(element);
            });
            accordionOpen($panel_headers.filter('.active').first());
          } else {
            $panel_headers.each(function() {
              $(this).on('click.collapse', function(e) {
                var element = $(e.target);
                if (isChildrenOfPanelHeader(element)) {
                  element = getPanelHeader(element);
                }
                element.toggleClass('active');
                expandableOpen(element);
              });
              if ($(this).hasClass('active')) {
                expandableOpen($(this));
              }
            });
          }
        });
      };
      $(document).ready(function() {
        $('.collapsible').collapsible();
      });
    }(jQuery));
    ;
    (function($) {
      $.fn.scrollTo = function(elem) {
        $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
        return this;
      };
      $.fn.dropdown = function(option) {
        var defaults = {
          inDuration: 300,
          outDuration: 225,
          constrain_width: true,
          hover: false,
          gutter: 0,
          belowOrigin: false
        };
        this.each(function() {
          var origin = $(this);
          var options = $.extend({}, defaults, option);
          var activates = $("#" + origin.attr('data-activates'));
          function updateOptions() {
            if (origin.data('induration') !== undefined)
              options.inDuration = origin.data('inDuration');
            if (origin.data('outduration') !== undefined)
              options.outDuration = origin.data('outDuration');
            if (origin.data('constrainwidth') !== undefined)
              options.constrain_width = origin.data('constrainwidth');
            if (origin.data('hover') !== undefined)
              options.hover = origin.data('hover');
            if (origin.data('gutter') !== undefined)
              options.gutter = origin.data('gutter');
            if (origin.data('beloworigin') !== undefined)
              options.belowOrigin = origin.data('beloworigin');
          }
          updateOptions();
          origin.after(activates);
          function placeDropdown() {
            updateOptions();
            activates.addClass('active');
            if (options.constrain_width === true) {
              activates.css('width', origin.outerWidth());
            }
            var offset = 0;
            if (options.belowOrigin === true) {
              offset = origin.height();
            }
            var offsetLeft = origin.offset().left;
            var width_difference = 0;
            var gutter_spacing = options.gutter;
            if (offsetLeft + activates.innerWidth() > $(window).width()) {
              width_difference = origin.innerWidth() - activates.innerWidth();
              gutter_spacing = gutter_spacing * -1;
            }
            activates.css({
              position: 'absolute',
              top: origin.position().top + offset,
              left: origin.position().left + width_difference + gutter_spacing
            });
            activates.stop(true, true).css('opacity', 0).slideDown({
              queue: false,
              duration: options.inDuration,
              easing: 'easeOutCubic',
              complete: function() {
                $(this).css('height', '');
              }
            }).animate({opacity: 1}, {
              queue: false,
              duration: options.inDuration,
              easing: 'easeOutSine'
            });
          }
          function hideDropdown() {
            activates.fadeOut(options.outDuration);
            activates.removeClass('active');
          }
          if (options.hover) {
            var open = false;
            origin.unbind('click.' + origin.attr('id'));
            origin.on('mouseenter', function(e) {
              if (open === false) {
                placeDropdown();
                open = true;
              }
            });
            origin.on('mouseleave', function(e) {
              var toEl = e.toElement || e.relatedTarget;
              if (!$(toEl).closest('.dropdown-content').is(activates)) {
                activates.stop(true, true);
                hideDropdown();
                open = false;
              }
            });
            activates.on('mouseleave', function(e) {
              var toEl = e.toElement || e.relatedTarget;
              if (!$(toEl).closest('.dropdown-button').is(origin)) {
                activates.stop(true, true);
                hideDropdown();
                open = false;
              }
            });
          } else {
            origin.unbind('click.' + origin.attr('id'));
            origin.bind('click.' + origin.attr('id'), function(e) {
              if (origin[0] == e.currentTarget && ($(e.target).closest('.dropdown-content').length === 0)) {
                e.preventDefault();
                placeDropdown();
              } else {
                if (origin.hasClass('active')) {
                  hideDropdown();
                  $(document).unbind('click.' + activates.attr('id'));
                }
              }
              if (activates.hasClass('active')) {
                $(document).bind('click.' + activates.attr('id'), function(e) {
                  if (!activates.is(e.target) && !origin.is(e.target) && (!origin.find(e.target).length > 0)) {
                    hideDropdown();
                    $(document).unbind('click.' + activates.attr('id'));
                  }
                });
              }
            });
          }
          origin.on('open', placeDropdown);
          origin.on('close', hideDropdown);
        });
      };
      $(document).ready(function() {
        $('.dropdown-button').dropdown();
      });
    }(jQuery));
    ;
    (function($) {
      var _stack = 0,
          _lastID = 0,
          _generateID = function() {
            _lastID++;
            return 'materialize-lean-overlay-' + _lastID;
          };
      $.fn.extend({openModal: function(options) {
          $('body').css('overflow', 'hidden');
          var defaults = {
            opacity: 0.5,
            in_duration: 350,
            out_duration: 250,
            ready: undefined,
            complete: undefined,
            dismissible: true,
            starting_top: '4%'
          },
              overlayID = _generateID(),
              $modal = $(this),
              $overlay = $('<div class="lean-overlay"></div>'),
              lStack = (++_stack);
          $overlay.attr('id', overlayID).css('z-index', 1000 + lStack * 2);
          $modal.data('overlay-id', overlayID).css('z-index', 1000 + lStack * 2 + 1);
          $("body").append($overlay);
          options = $.extend(defaults, options);
          if (options.dismissible) {
            $overlay.click(function() {
              $modal.closeModal(options);
            });
            $(document).on('keyup.leanModal' + overlayID, function(e) {
              if (e.keyCode === 27) {
                $modal.closeModal(options);
              }
            });
          }
          $modal.find(".modal-close").on('click.close', function(e) {
            $modal.closeModal(options);
          });
          $overlay.css({
            display: "block",
            opacity: 0
          });
          $modal.css({
            display: "block",
            opacity: 0
          });
          $overlay.velocity({opacity: options.opacity}, {
            duration: options.in_duration,
            queue: false,
            ease: "easeOutCubic"
          });
          $modal.data('associated-overlay', $overlay[0]);
          if ($modal.hasClass('bottom-sheet')) {
            $modal.velocity({
              bottom: "0",
              opacity: 1
            }, {
              duration: options.in_duration,
              queue: false,
              ease: "easeOutCubic",
              complete: function() {
                if (typeof(options.ready) === "function") {
                  options.ready();
                }
              }
            });
          } else {
            $.Velocity.hook($modal, "scaleX", 0.7);
            $modal.css({top: options.starting_top});
            $modal.velocity({
              top: "10%",
              opacity: 1,
              scaleX: '1'
            }, {
              duration: options.in_duration,
              queue: false,
              ease: "easeOutCubic",
              complete: function() {
                if (typeof(options.ready) === "function") {
                  options.ready();
                }
              }
            });
          }
        }});
      $.fn.extend({closeModal: function(options) {
          var defaults = {
            out_duration: 250,
            complete: undefined
          },
              $modal = $(this),
              overlayID = $modal.data('overlay-id'),
              $overlay = $('#' + overlayID);
          options = $.extend(defaults, options);
          $('body').css('overflow', '');
          $modal.find('.modal-close').off('click.close');
          $(document).off('keyup.leanModal' + overlayID);
          $overlay.velocity({opacity: 0}, {
            duration: options.out_duration,
            queue: false,
            ease: "easeOutQuart"
          });
          if ($modal.hasClass('bottom-sheet')) {
            $modal.velocity({
              bottom: "-100%",
              opacity: 0
            }, {
              duration: options.out_duration,
              queue: false,
              ease: "easeOutCubic",
              complete: function() {
                $overlay.css({display: "none"});
                if (typeof(options.complete) === "function") {
                  options.complete();
                }
                $overlay.remove();
                _stack--;
              }
            });
          } else {
            $modal.velocity({
              top: options.starting_top,
              opacity: 0,
              scaleX: 0.7
            }, {
              duration: options.out_duration,
              complete: function() {
                $(this).css('display', 'none');
                if (typeof(options.complete) === "function") {
                  options.complete();
                }
                $overlay.remove();
                _stack--;
              }
            });
          }
        }});
      $.fn.extend({leanModal: function(option) {
          return this.each(function() {
            var defaults = {starting_top: '4%'},
                options = $.extend(defaults, option);
            $(this).click(function(e) {
              options.starting_top = ($(this).offset().top - $(window).scrollTop()) / 1.15;
              var modal_id = $(this).attr("href") || '#' + $(this).data('target');
              $(modal_id).openModal(options);
              e.preventDefault();
            });
          });
        }});
    })(jQuery);
    ;
    (function($) {
      $.fn.materialbox = function() {
        return this.each(function() {
          if ($(this).hasClass('initialized')) {
            return;
          }
          $(this).addClass('initialized');
          var overlayActive = false;
          var doneAnimating = true;
          var inDuration = 275;
          var outDuration = 200;
          var origin = $(this);
          var placeholder = $('<div></div>').addClass('material-placeholder');
          var originalWidth = 0;
          var originalHeight = 0;
          origin.wrap(placeholder);
          origin.on('click', function() {
            var placeholder = origin.parent('.material-placeholder');
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var originalWidth = origin.width();
            var originalHeight = origin.height();
            if (doneAnimating === false) {
              returnToOriginal();
              return false;
            } else if (overlayActive && doneAnimating === true) {
              returnToOriginal();
              return false;
            }
            doneAnimating = false;
            origin.addClass('active');
            overlayActive = true;
            placeholder.css({
              width: placeholder[0].getBoundingClientRect().width,
              height: placeholder[0].getBoundingClientRect().height,
              position: 'relative',
              top: 0,
              left: 0
            });
            origin.css({
              position: 'absolute',
              'z-index': 1000
            }).data('width', originalWidth).data('height', originalHeight);
            var overlay = $('<div id="materialbox-overlay"></div>').css({opacity: 0}).click(function() {
              if (doneAnimating === true)
                returnToOriginal();
            });
            $('body').append(overlay);
            overlay.velocity({opacity: 1}, {
              duration: inDuration,
              queue: false,
              easing: 'easeOutQuad'
            });
            if (origin.data('caption') !== "") {
              var $photo_caption = $('<div class="materialbox-caption"></div>');
              $photo_caption.text(origin.data('caption'));
              $('body').append($photo_caption);
              $photo_caption.css({"display": "inline"});
              $photo_caption.velocity({opacity: 1}, {
                duration: inDuration,
                queue: false,
                easing: 'easeOutQuad'
              });
            }
            var ratio = 0;
            var widthPercent = originalWidth / windowWidth;
            var heightPercent = originalHeight / windowHeight;
            var newWidth = 0;
            var newHeight = 0;
            if (widthPercent > heightPercent) {
              ratio = originalHeight / originalWidth;
              newWidth = windowWidth * 0.9;
              newHeight = windowWidth * 0.9 * ratio;
            } else {
              ratio = originalWidth / originalHeight;
              newWidth = (windowHeight * 0.9) * ratio;
              newHeight = windowHeight * 0.9;
            }
            if (origin.hasClass('responsive-img')) {
              origin.velocity({
                'max-width': newWidth,
                'width': originalWidth
              }, {
                duration: 0,
                queue: false,
                complete: function() {
                  origin.css({
                    left: 0,
                    top: 0
                  }).velocity({
                    height: newHeight,
                    width: newWidth,
                    left: $(document).scrollLeft() + windowWidth / 2 - origin.parent('.material-placeholder').offset().left - newWidth / 2,
                    top: $(document).scrollTop() + windowHeight / 2 - origin.parent('.material-placeholder').offset().top - newHeight / 2
                  }, {
                    duration: inDuration,
                    queue: false,
                    easing: 'easeOutQuad',
                    complete: function() {
                      doneAnimating = true;
                    }
                  });
                }
              });
            } else {
              origin.css('left', 0).css('top', 0).velocity({
                height: newHeight,
                width: newWidth,
                left: $(document).scrollLeft() + windowWidth / 2 - origin.parent('.material-placeholder').offset().left - newWidth / 2,
                top: $(document).scrollTop() + windowHeight / 2 - origin.parent('.material-placeholder').offset().top - newHeight / 2
              }, {
                duration: inDuration,
                queue: false,
                easing: 'easeOutQuad',
                complete: function() {
                  doneAnimating = true;
                }
              });
            }
          });
          $(window).scroll(function() {
            if (overlayActive) {
              returnToOriginal();
            }
          });
          $(document).keyup(function(e) {
            if (e.keyCode === 27 && doneAnimating === true) {
              if (overlayActive) {
                returnToOriginal();
              }
            }
          });
          function returnToOriginal() {
            doneAnimating = false;
            var placeholder = origin.parent('.material-placeholder');
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var originalWidth = origin.data('width');
            var originalHeight = origin.data('height');
            origin.velocity("stop", true);
            $('#materialbox-overlay').velocity("stop", true);
            $('.materialbox-caption').velocity("stop", true);
            $('#materialbox-overlay').velocity({opacity: 0}, {
              duration: outDuration,
              queue: false,
              easing: 'easeOutQuad',
              complete: function() {
                overlayActive = false;
                $(this).remove();
              }
            });
            origin.velocity({
              width: originalWidth,
              height: originalHeight,
              left: 0,
              top: 0
            }, {
              duration: outDuration,
              queue: false,
              easing: 'easeOutQuad'
            });
            $('.materialbox-caption').velocity({opacity: 0}, {
              duration: outDuration,
              queue: false,
              easing: 'easeOutQuad',
              complete: function() {
                placeholder.css({
                  height: '',
                  width: '',
                  position: '',
                  top: '',
                  left: ''
                });
                origin.css({
                  height: '',
                  top: '',
                  left: '',
                  width: '',
                  'max-width': '',
                  position: '',
                  'z-index': ''
                });
                origin.removeClass('active');
                doneAnimating = true;
                $(this).remove();
              }
            });
          }
        });
      };
      $(document).ready(function() {
        $('.materialboxed').materialbox();
      });
    }(jQuery));
    ;
    (function($) {
      $.fn.parallax = function() {
        var window_width = $(window).width();
        return this.each(function(i) {
          var $this = $(this);
          $this.addClass('parallax');
          function updateParallax(initial) {
            var container_height;
            if (window_width < 601) {
              container_height = ($this.height() > 0) ? $this.height() : $this.children("img").height();
            } else {
              container_height = ($this.height() > 0) ? $this.height() : 500;
            }
            var $img = $this.children("img").first();
            var img_height = $img.height();
            var parallax_dist = img_height - container_height;
            var bottom = $this.offset().top + container_height;
            var top = $this.offset().top;
            var scrollTop = $(window).scrollTop();
            var windowHeight = window.innerHeight;
            var windowBottom = scrollTop + windowHeight;
            var percentScrolled = (windowBottom - top) / (container_height + windowHeight);
            var parallax = Math.round((parallax_dist * percentScrolled));
            if (initial) {
              $img.css('display', 'block');
            }
            if ((bottom > scrollTop) && (top < (scrollTop + windowHeight))) {
              $img.css('transform', "translate3D(-50%," + parallax + "px, 0)");
            }
          }
          $this.children("img").one("load", function() {
            updateParallax(true);
          }).each(function() {
            if (this.complete)
              $(this).load();
          });
          $(window).scroll(function() {
            window_width = $(window).width();
            updateParallax(false);
          });
          $(window).resize(function() {
            window_width = $(window).width();
            updateParallax(false);
          });
        });
      };
    }(jQuery));
    ;
    (function($) {
      var methods = {
        init: function() {
          return this.each(function() {
            var $this = $(this),
                window_width = $(window).width();
            $this.width('100%');
            var $num_tabs = $(this).children('li').length;
            $this.children('li').each(function() {
              $(this).width((100 / $num_tabs) + '%');
            });
            var $active,
                $content,
                $links = $this.find('li.tab a'),
                $tabs_width = $this.width(),
                $tab_width = $this.find('li').first().outerWidth(),
                $index = 0;
            $active = $($links.filter('[href="' + location.hash + '"]'));
            if ($active.length === 0) {
              $active = $(this).find('li.tab a.active').first();
            }
            if ($active.length === 0) {
              $active = $(this).find('li.tab a').first();
            }
            $active.addClass('active');
            $index = $links.index($active);
            if ($index < 0) {
              $index = 0;
            }
            $content = $($active[0].hash);
            $this.append('<div class="indicator"></div>');
            var $indicator = $this.find('.indicator');
            if ($this.is(":visible")) {
              $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
              $indicator.css({"left": $index * $tab_width});
            }
            $(window).resize(function() {
              $tabs_width = $this.width();
              $tab_width = $this.find('li').first().outerWidth();
              if ($index < 0) {
                $index = 0;
              }
              if ($tab_width !== 0 && $tabs_width !== 0) {
                $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
                $indicator.css({"left": $index * $tab_width});
              }
            });
            $links.not($active).each(function() {
              $(this.hash).hide();
            });
            $this.on('click', 'a', function(e) {
              if ($(this).parent().hasClass('disabled')) {
                e.preventDefault();
                return;
              }
              $tabs_width = $this.width();
              $tab_width = $this.find('li').first().outerWidth();
              $active.removeClass('active');
              $content.hide();
              $active = $(this);
              $content = $(this.hash);
              $links = $this.find('li.tab a');
              $active.addClass('active');
              var $prev_index = $index;
              $index = $links.index($(this));
              if ($index < 0) {
                $index = 0;
              }
              $content.show();
              if (($index - $prev_index) >= 0) {
                $indicator.velocity({"right": $tabs_width - (($index + 1) * $tab_width)}, {
                  duration: 300,
                  queue: false,
                  easing: 'easeOutQuad'
                });
                $indicator.velocity({"left": $index * $tab_width}, {
                  duration: 300,
                  queue: false,
                  easing: 'easeOutQuad',
                  delay: 90
                });
              } else {
                $indicator.velocity({"left": $index * $tab_width}, {
                  duration: 300,
                  queue: false,
                  easing: 'easeOutQuad'
                });
                $indicator.velocity({"right": $tabs_width - (($index + 1) * $tab_width)}, {
                  duration: 300,
                  queue: false,
                  easing: 'easeOutQuad',
                  delay: 90
                });
              }
              e.preventDefault();
            });
          });
        },
        select_tab: function(id) {
          this.find('a[href="#' + id + '"]').trigger('click');
        }
      };
      $.fn.tabs = function(methodOrOptions) {
        if (methods[methodOrOptions]) {
          return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
          return methods.init.apply(this, arguments);
        } else {
          $.error('Method ' + methodOrOptions + ' does not exist on jQuery.tooltip');
        }
      };
      $(document).ready(function() {
        $('ul.tabs').tabs();
      });
    }(jQuery));
    ;
    (function($) {
      $.fn.tooltip = function(options) {
        var timeout = null,
            counter = null,
            started = false,
            counterInterval = null,
            margin = 5;
        var defaults = {delay: 350};
        options = $.extend(defaults, options);
        $('.material-tooltip').remove();
        return this.each(function() {
          var origin = $(this);
          var tooltip_text = $('<span></span>').text(origin.attr('data-tooltip'));
          var newTooltip = $('<div></div>');
          newTooltip.addClass('material-tooltip').append(tooltip_text);
          newTooltip.appendTo($('body'));
          var backdrop = $('<div></div>').addClass('backdrop');
          backdrop.appendTo(newTooltip);
          backdrop.css({
            top: 0,
            left: 0
          });
          $(this).off('mouseenter mouseleave');
          $(this).on({
            mouseenter: function(e) {
              var tooltip_delay = origin.data("delay");
              tooltip_delay = (tooltip_delay === undefined || tooltip_delay === '') ? options.delay : tooltip_delay;
              counter = 0;
              counterInterval = setInterval(function() {
                counter += 10;
                if (counter >= tooltip_delay && started === false) {
                  started = true;
                  newTooltip.css({
                    display: 'block',
                    left: '0px',
                    top: '0px'
                  });
                  newTooltip.children('span').text(origin.attr('data-tooltip'));
                  var originWidth = origin.outerWidth();
                  var originHeight = origin.outerHeight();
                  var tooltipPosition = origin.attr('data-position');
                  var tooltipHeight = newTooltip.outerHeight();
                  var tooltipWidth = newTooltip.outerWidth();
                  var tooltipVerticalMovement = '0px';
                  var tooltipHorizontalMovement = '0px';
                  var scale_factor = 8;
                  if (tooltipPosition === "top") {
                    newTooltip.css({
                      top: origin.offset().top - tooltipHeight - margin,
                      left: origin.offset().left + originWidth / 2 - tooltipWidth / 2
                    });
                    tooltipVerticalMovement = '-10px';
                    backdrop.css({
                      borderRadius: '14px 14px 0 0',
                      transformOrigin: '50% 90%',
                      marginTop: tooltipHeight,
                      marginLeft: (tooltipWidth / 2) - (backdrop.width() / 2)
                    });
                  } else if (tooltipPosition === "left") {
                    newTooltip.css({
                      top: origin.offset().top + originHeight / 2 - tooltipHeight / 2,
                      left: origin.offset().left - tooltipWidth - margin
                    });
                    tooltipHorizontalMovement = '-10px';
                    backdrop.css({
                      width: '14px',
                      height: '14px',
                      borderRadius: '14px 0 0 14px',
                      transformOrigin: '95% 50%',
                      marginTop: tooltipHeight / 2,
                      marginLeft: tooltipWidth
                    });
                  } else if (tooltipPosition === "right") {
                    newTooltip.css({
                      top: origin.offset().top + originHeight / 2 - tooltipHeight / 2,
                      left: origin.offset().left + originWidth + margin
                    });
                    tooltipHorizontalMovement = '+10px';
                    backdrop.css({
                      width: '14px',
                      height: '14px',
                      borderRadius: '0 14px 14px 0',
                      transformOrigin: '5% 50%',
                      marginTop: tooltipHeight / 2,
                      marginLeft: '0px'
                    });
                  } else {
                    newTooltip.css({
                      top: origin.offset().top + origin.outerHeight() + margin,
                      left: origin.offset().left + originWidth / 2 - tooltipWidth / 2
                    });
                    tooltipVerticalMovement = '+10px';
                    backdrop.css({marginLeft: (tooltipWidth / 2) - (backdrop.width() / 2)});
                  }
                  scale_factor = tooltipWidth / 8;
                  if (scale_factor < 8) {
                    scale_factor = 8;
                  }
                  if (tooltipPosition === "right" || tooltipPosition === "left") {
                    scale_factor = tooltipWidth / 10;
                    if (scale_factor < 6)
                      scale_factor = 6;
                  }
                  newTooltip.velocity({
                    opacity: 1,
                    marginTop: tooltipVerticalMovement,
                    marginLeft: tooltipHorizontalMovement
                  }, {
                    duration: 350,
                    queue: false
                  });
                  backdrop.css({display: 'block'}).velocity({opacity: 1}, {
                    duration: 55,
                    delay: 0,
                    queue: false
                  }).velocity({scale: scale_factor}, {
                    duration: 300,
                    delay: 0,
                    queue: false,
                    easing: 'easeInOutQuad'
                  });
                }
              }, 10);
            },
            mouseleave: function() {
              clearInterval(counterInterval);
              counter = 0;
              newTooltip.velocity({
                opacity: 0,
                marginTop: 0,
                marginLeft: 0
              }, {
                duration: 225,
                queue: false,
                delay: 275
              });
              backdrop.velocity({
                opacity: 0,
                scale: 1
              }, {
                duration: 225,
                delay: 275,
                queue: false,
                complete: function() {
                  backdrop.css('display', 'none');
                  newTooltip.css('display', 'none');
                  started = false;
                }
              });
            }
          });
        });
      };
      $(document).ready(function() {
        $('.tooltipped').tooltip();
      });
    }(jQuery));
    ;
    ;
    (function(window) {
      'use strict';
      var Waves = Waves || {};
      var $$ = document.querySelectorAll.bind(document);
      function isWindow(obj) {
        return obj !== null && obj === obj.window;
      }
      function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
      }
      function offset(elem) {
        var docElem,
            win,
            box = {
              top: 0,
              left: 0
            },
            doc = elem && elem.ownerDocument;
        docElem = doc.documentElement;
        if (typeof elem.getBoundingClientRect !== typeof undefined) {
          box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
          top: box.top + win.pageYOffset - docElem.clientTop,
          left: box.left + win.pageXOffset - docElem.clientLeft
        };
      }
      function convertStyle(obj) {
        var style = '';
        for (var a in obj) {
          if (obj.hasOwnProperty(a)) {
            style += (a + ':' + obj[a] + ';');
          }
        }
        return style;
      }
      var Effect = {
        duration: 750,
        show: function(e, element) {
          if (e.button === 2) {
            return false;
          }
          var el = element || this;
          var ripple = document.createElement('div');
          ripple.className = 'waves-ripple';
          el.appendChild(ripple);
          var pos = offset(el);
          var relativeY = (e.pageY - pos.top);
          var relativeX = (e.pageX - pos.left);
          var scale = 'scale(' + ((el.clientWidth / 100) * 10) + ')';
          if ('touches' in e) {
            relativeY = (e.touches[0].pageY - pos.top);
            relativeX = (e.touches[0].pageX - pos.left);
          }
          ripple.setAttribute('data-hold', Date.now());
          ripple.setAttribute('data-scale', scale);
          ripple.setAttribute('data-x', relativeX);
          ripple.setAttribute('data-y', relativeY);
          var rippleStyle = {
            'top': relativeY + 'px',
            'left': relativeX + 'px'
          };
          ripple.className = ripple.className + ' waves-notransition';
          ripple.setAttribute('style', convertStyle(rippleStyle));
          ripple.className = ripple.className.replace('waves-notransition', '');
          rippleStyle['-webkit-transform'] = scale;
          rippleStyle['-moz-transform'] = scale;
          rippleStyle['-ms-transform'] = scale;
          rippleStyle['-o-transform'] = scale;
          rippleStyle.transform = scale;
          rippleStyle.opacity = '1';
          rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
          rippleStyle['-moz-transition-duration'] = Effect.duration + 'ms';
          rippleStyle['-o-transition-duration'] = Effect.duration + 'ms';
          rippleStyle['transition-duration'] = Effect.duration + 'ms';
          rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
          rippleStyle['-moz-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
          rippleStyle['-o-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
          rippleStyle['transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
          ripple.setAttribute('style', convertStyle(rippleStyle));
        },
        hide: function(e) {
          TouchHandler.touchup(e);
          var el = this;
          var width = el.clientWidth * 1.4;
          var ripple = null;
          var ripples = el.getElementsByClassName('waves-ripple');
          if (ripples.length > 0) {
            ripple = ripples[ripples.length - 1];
          } else {
            return false;
          }
          var relativeX = ripple.getAttribute('data-x');
          var relativeY = ripple.getAttribute('data-y');
          var scale = ripple.getAttribute('data-scale');
          var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
          var delay = 350 - diff;
          if (delay < 0) {
            delay = 0;
          }
          setTimeout(function() {
            var style = {
              'top': relativeY + 'px',
              'left': relativeX + 'px',
              'opacity': '0',
              '-webkit-transition-duration': Effect.duration + 'ms',
              '-moz-transition-duration': Effect.duration + 'ms',
              '-o-transition-duration': Effect.duration + 'ms',
              'transition-duration': Effect.duration + 'ms',
              '-webkit-transform': scale,
              '-moz-transform': scale,
              '-ms-transform': scale,
              '-o-transform': scale,
              'transform': scale
            };
            ripple.setAttribute('style', convertStyle(style));
            setTimeout(function() {
              try {
                el.removeChild(ripple);
              } catch (e) {
                return false;
              }
            }, Effect.duration);
          }, delay);
        },
        wrapInput: function(elements) {
          for (var a = 0; a < elements.length; a++) {
            var el = elements[a];
            if (el.tagName.toLowerCase() === 'input') {
              var parent = el.parentNode;
              if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('waves-effect') !== -1) {
                continue;
              }
              var wrapper = document.createElement('i');
              wrapper.className = el.className + ' waves-input-wrapper';
              var elementStyle = el.getAttribute('style');
              if (!elementStyle) {
                elementStyle = '';
              }
              wrapper.setAttribute('style', elementStyle);
              el.className = 'waves-button-input';
              el.removeAttribute('style');
              parent.replaceChild(wrapper, el);
              wrapper.appendChild(el);
            }
          }
        }
      };
      var TouchHandler = {
        touches: 0,
        allowEvent: function(e) {
          var allow = true;
          if (e.type === 'touchstart') {
            TouchHandler.touches += 1;
          } else if (e.type === 'touchend' || e.type === 'touchcancel') {
            setTimeout(function() {
              if (TouchHandler.touches > 0) {
                TouchHandler.touches -= 1;
              }
            }, 500);
          } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
            allow = false;
          }
          return allow;
        },
        touchup: function(e) {
          TouchHandler.allowEvent(e);
        }
      };
      function getWavesEffectElement(e) {
        if (TouchHandler.allowEvent(e) === false) {
          return null;
        }
        var element = null;
        var target = e.target || e.srcElement;
        while (target.parentElement !== null) {
          if (!(target instanceof SVGElement) && target.className.indexOf('waves-effect') !== -1) {
            element = target;
            break;
          } else if (target.classList.contains('waves-effect')) {
            element = target;
            break;
          }
          target = target.parentElement;
        }
        return element;
      }
      function showEffect(e) {
        var element = getWavesEffectElement(e);
        if (element !== null) {
          Effect.show(e, element);
          if ('ontouchstart' in window) {
            element.addEventListener('touchend', Effect.hide, false);
            element.addEventListener('touchcancel', Effect.hide, false);
          }
          element.addEventListener('mouseup', Effect.hide, false);
          element.addEventListener('mouseleave', Effect.hide, false);
        }
      }
      Waves.displayEffect = function(options) {
        options = options || {};
        if ('duration' in options) {
          Effect.duration = options.duration;
        }
        Effect.wrapInput($$('.waves-effect'));
        if ('ontouchstart' in window) {
          document.body.addEventListener('touchstart', showEffect, false);
        }
        document.body.addEventListener('mousedown', showEffect, false);
      };
      Waves.attach = function(element) {
        if (element.tagName.toLowerCase() === 'input') {
          Effect.wrapInput([element]);
          element = element.parentElement;
        }
        if ('ontouchstart' in window) {
          element.addEventListener('touchstart', showEffect, false);
        }
        element.addEventListener('mousedown', showEffect, false);
      };
      window.Waves = Waves;
      document.addEventListener('DOMContentLoaded', function() {
        Waves.displayEffect();
      }, false);
    })(window);
    ;
    Materialize.toast = function(message, displayLength, className, completeCallback) {
      className = className || "";
      var container = document.getElementById('toast-container');
      if (container === null) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }
      var newToast = createToast(message);
      if (message) {
        container.appendChild(newToast);
      }
      newToast.style.top = '35px';
      newToast.style.opacity = 0;
      Vel(newToast, {
        "top": "0px",
        opacity: 1
      }, {
        duration: 300,
        easing: 'easeOutCubic',
        queue: false
      });
      var timeLeft = displayLength;
      var counterInterval = setInterval(function() {
        if (newToast.parentNode === null)
          window.clearInterval(counterInterval);
        if (!newToast.classList.contains('panning')) {
          timeLeft -= 20;
        }
        if (timeLeft <= 0) {
          Vel(newToast, {
            "opacity": 0,
            marginTop: '-40px'
          }, {
            duration: 375,
            easing: 'easeOutExpo',
            queue: false,
            complete: function() {
              if (typeof(completeCallback) === "function")
                completeCallback();
              this[0].parentNode.removeChild(this[0]);
            }
          });
          window.clearInterval(counterInterval);
        }
      }, 20);
      function createToast(html) {
        var toast = document.createElement('div');
        toast.classList.add('toast');
        if (className) {
          var classes = className.split(' ');
          for (var i = 0,
              count = classes.length; i < count; i++) {
            toast.classList.add(classes[i]);
          }
        }
        toast.innerHTML = html;
        var hammerHandler = new Hammer(toast, {prevent_default: false});
        hammerHandler.on('pan', function(e) {
          var deltaX = e.deltaX;
          var activationDistance = 80;
          if (!toast.classList.contains('panning')) {
            toast.classList.add('panning');
          }
          var opacityPercent = 1 - Math.abs(deltaX / activationDistance);
          if (opacityPercent < 0)
            opacityPercent = 0;
          Vel(toast, {
            left: deltaX,
            opacity: opacityPercent
          }, {
            duration: 50,
            queue: false,
            easing: 'easeOutQuad'
          });
        });
        hammerHandler.on('panend', function(e) {
          var deltaX = e.deltaX;
          var activationDistance = 80;
          if (Math.abs(deltaX) > activationDistance) {
            Vel(toast, {marginTop: '-40px'}, {
              duration: 375,
              easing: 'easeOutExpo',
              queue: false,
              complete: function() {
                if (typeof(completeCallback) === "function") {
                  completeCallback();
                }
                toast.parentNode.removeChild(toast);
              }
            });
          } else {
            toast.classList.remove('panning');
            Vel(toast, {
              left: 0,
              opacity: 1
            }, {
              duration: 300,
              easing: 'easeOutExpo',
              queue: false
            });
          }
        });
        return toast;
      }
    };
    ;
    (function($) {
      var methods = {
        init: function(options) {
          var defaults = {
            menuWidth: 240,
            edge: 'left',
            closeOnClick: false
          };
          options = $.extend(defaults, options);
          $(this).each(function() {
            var $this = $(this);
            var menu_id = $("#" + $this.attr('data-activates'));
            if (options.menuWidth != 240) {
              menu_id.css('width', options.menuWidth);
            }
            $('body').append($('<div class="drag-target"></div>'));
            if (options.edge == 'left') {
              menu_id.css('left', -1 * (options.menuWidth + 10));
              $('.drag-target').css({'left': 0});
            } else {
              menu_id.addClass('right-aligned').css('right', -1 * (options.menuWidth + 10)).css('left', '');
              $('.drag-target').css({'right': 0});
            }
            if (menu_id.hasClass('fixed')) {
              if (window.innerWidth > 992) {
                menu_id.css('left', 0);
              }
            }
            if (menu_id.hasClass('fixed')) {
              $(window).resize(function() {
                if (window.innerWidth > 992) {
                  if ($('#sidenav-overlay').css('opacity') !== 0 && menuOut) {
                    removeMenu(true);
                  } else {
                    menu_id.removeAttr('style');
                    menu_id.css('width', options.menuWidth);
                  }
                } else if (menuOut === false) {
                  if (options.edge === 'left')
                    menu_id.css('left', -1 * (options.menuWidth + 10));
                  else
                    menu_id.css('right', -1 * (options.menuWidth + 10));
                }
              });
            }
            if (options.closeOnClick === true) {
              menu_id.on("click.itemclick", "a:not(.collapsible-header)", function() {
                removeMenu();
              });
            }
            function removeMenu(restoreNav) {
              panning = false;
              menuOut = false;
              $('body').css('overflow', '');
              $('#sidenav-overlay').velocity({opacity: 0}, {
                duration: 200,
                queue: false,
                easing: 'easeOutQuad',
                complete: function() {
                  $(this).remove();
                }
              });
              if (options.edge === 'left') {
                $('.drag-target').css({
                  width: '',
                  right: '',
                  left: '0'
                });
                menu_id.velocity({left: -1 * (options.menuWidth + 10)}, {
                  duration: 200,
                  queue: false,
                  easing: 'easeOutCubic',
                  complete: function() {
                    if (restoreNav === true) {
                      menu_id.removeAttr('style');
                      menu_id.css('width', options.menuWidth);
                    }
                  }
                });
              } else {
                $('.drag-target').css({
                  width: '',
                  right: '0',
                  left: ''
                });
                menu_id.velocity({right: -1 * (options.menuWidth + 10)}, {
                  duration: 200,
                  queue: false,
                  easing: 'easeOutCubic',
                  complete: function() {
                    if (restoreNav === true) {
                      menu_id.removeAttr('style');
                      menu_id.css('width', options.menuWidth);
                    }
                  }
                });
              }
            }
            var panning = false;
            var menuOut = false;
            $('.drag-target').on('click', function() {
              removeMenu();
            });
            $('.drag-target').hammer({prevent_default: false}).bind('pan', function(e) {
              if (e.gesture.pointerType == "touch") {
                var direction = e.gesture.direction;
                var x = e.gesture.center.x;
                var y = e.gesture.center.y;
                var velocityX = e.gesture.velocityX;
                $('body').css('overflow', 'hidden');
                if ($('#sidenav-overlay').length === 0) {
                  var overlay = $('<div id="sidenav-overlay"></div>');
                  overlay.css('opacity', 0).click(function() {
                    removeMenu();
                  });
                  $('body').append(overlay);
                }
                if (options.edge === 'left') {
                  if (x > options.menuWidth) {
                    x = options.menuWidth;
                  } else if (x < 0) {
                    x = 0;
                  }
                }
                if (options.edge === 'left') {
                  if (x < (options.menuWidth / 2)) {
                    menuOut = false;
                  } else if (x >= (options.menuWidth / 2)) {
                    menuOut = true;
                  }
                  menu_id.css('left', (x - options.menuWidth));
                } else {
                  if (x < (window.innerWidth - options.menuWidth / 2)) {
                    menuOut = true;
                  } else if (x >= (window.innerWidth - options.menuWidth / 2)) {
                    menuOut = false;
                  }
                  var rightPos = -1 * (x - options.menuWidth / 2);
                  if (rightPos > 0) {
                    rightPos = 0;
                  }
                  menu_id.css('right', rightPos);
                }
                var overlayPerc;
                if (options.edge === 'left') {
                  overlayPerc = x / options.menuWidth;
                  $('#sidenav-overlay').velocity({opacity: overlayPerc}, {
                    duration: 50,
                    queue: false,
                    easing: 'easeOutQuad'
                  });
                } else {
                  overlayPerc = Math.abs((x - window.innerWidth) / options.menuWidth);
                  $('#sidenav-overlay').velocity({opacity: overlayPerc}, {
                    duration: 50,
                    queue: false,
                    easing: 'easeOutQuad'
                  });
                }
              }
            }).bind('panend', function(e) {
              if (e.gesture.pointerType == "touch") {
                var velocityX = e.gesture.velocityX;
                panning = false;
                if (options.edge === 'left') {
                  if ((menuOut && velocityX <= 0.3) || velocityX < -0.5) {
                    menu_id.velocity({left: 0}, {
                      duration: 300,
                      queue: false,
                      easing: 'easeOutQuad'
                    });
                    $('#sidenav-overlay').velocity({opacity: 1}, {
                      duration: 50,
                      queue: false,
                      easing: 'easeOutQuad'
                    });
                    $('.drag-target').css({
                      width: '50%',
                      right: 0,
                      left: ''
                    });
                  } else if (!menuOut || velocityX > 0.3) {
                    $('body').css('overflow', '');
                    menu_id.velocity({left: -1 * (options.menuWidth + 10)}, {
                      duration: 200,
                      queue: false,
                      easing: 'easeOutQuad'
                    });
                    $('#sidenav-overlay').velocity({opacity: 0}, {
                      duration: 200,
                      queue: false,
                      easing: 'easeOutQuad',
                      complete: function() {
                        $(this).remove();
                      }
                    });
                    $('.drag-target').css({
                      width: '10px',
                      right: '',
                      left: 0
                    });
                  }
                } else {
                  if ((menuOut && velocityX >= -0.3) || velocityX > 0.5) {
                    menu_id.velocity({right: 0}, {
                      duration: 300,
                      queue: false,
                      easing: 'easeOutQuad'
                    });
                    $('#sidenav-overlay').velocity({opacity: 1}, {
                      duration: 50,
                      queue: false,
                      easing: 'easeOutQuad'
                    });
                    $('.drag-target').css({
                      width: '50%',
                      right: '',
                      left: 0
                    });
                  } else if (!menuOut || velocityX < -0.3) {
                    $('body').css('overflow', '');
                    menu_id.velocity({right: -1 * (options.menuWidth + 10)}, {
                      duration: 200,
                      queue: false,
                      easing: 'easeOutQuad'
                    });
                    $('#sidenav-overlay').velocity({opacity: 0}, {
                      duration: 200,
                      queue: false,
                      easing: 'easeOutQuad',
                      complete: function() {
                        $(this).remove();
                      }
                    });
                    $('.drag-target').css({
                      width: '10px',
                      right: 0,
                      left: ''
                    });
                  }
                }
              }
            });
            $this.click(function() {
              if (menuOut === true) {
                menuOut = false;
                panning = false;
                removeMenu();
              } else {
                $('body').css('overflow', 'hidden');
                if (options.edge === 'left') {
                  $('.drag-target').css({
                    width: '50%',
                    right: 0,
                    left: ''
                  });
                  menu_id.velocity({left: 0}, {
                    duration: 300,
                    queue: false,
                    easing: 'easeOutQuad'
                  });
                } else {
                  $('.drag-target').css({
                    width: '50%',
                    right: '',
                    left: 0
                  });
                  menu_id.velocity({right: 0}, {
                    duration: 300,
                    queue: false,
                    easing: 'easeOutQuad'
                  });
                  menu_id.css('left', '');
                }
                var overlay = $('<div id="sidenav-overlay"></div>');
                overlay.css('opacity', 0).click(function() {
                  menuOut = false;
                  panning = false;
                  removeMenu();
                  overlay.velocity({opacity: 0}, {
                    duration: 300,
                    queue: false,
                    easing: 'easeOutQuad',
                    complete: function() {
                      $(this).remove();
                    }
                  });
                });
                $('body').append(overlay);
                overlay.velocity({opacity: 1}, {
                  duration: 300,
                  queue: false,
                  easing: 'easeOutQuad',
                  complete: function() {
                    menuOut = true;
                    panning = false;
                  }
                });
              }
              return false;
            });
          });
        },
        show: function() {
          this.trigger('click');
        },
        hide: function() {
          $('#sidenav-overlay').trigger('click');
        }
      };
      $.fn.sideNav = function(methodOrOptions) {
        if (methods[methodOrOptions]) {
          return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
          return methods.init.apply(this, arguments);
        } else {
          $.error('Method ' + methodOrOptions + ' does not exist on jQuery.sideNav');
        }
      };
    }(jQuery));
    ;
    (function($) {
      var jWindow = $(window);
      var elements = [];
      var elementsInView = [];
      var isSpying = false;
      var ticks = 0;
      var unique_id = 1;
      var offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      function findElements(top, right, bottom, left) {
        var hits = $();
        $.each(elements, function(i, element) {
          if (element.height() > 0) {
            var elTop = element.offset().top,
                elLeft = element.offset().left,
                elRight = elLeft + element.width(),
                elBottom = elTop + element.height();
            var isIntersect = !(elLeft > right || elRight < left || elTop > bottom || elBottom < top);
            if (isIntersect) {
              hits.push(element);
            }
          }
        });
        return hits;
      }
      function onScroll() {
        ++ticks;
        var top = jWindow.scrollTop(),
            left = jWindow.scrollLeft(),
            right = left + jWindow.width(),
            bottom = top + jWindow.height();
        var intersections = findElements(top + offset.top + 200, right + offset.right, bottom + offset.bottom, left + offset.left);
        $.each(intersections, function(i, element) {
          var lastTick = element.data('scrollSpy:ticks');
          if (typeof lastTick != 'number') {
            element.triggerHandler('scrollSpy:enter');
          }
          element.data('scrollSpy:ticks', ticks);
        });
        $.each(elementsInView, function(i, element) {
          var lastTick = element.data('scrollSpy:ticks');
          if (typeof lastTick == 'number' && lastTick !== ticks) {
            element.triggerHandler('scrollSpy:exit');
            element.data('scrollSpy:ticks', null);
          }
        });
        elementsInView = intersections;
      }
      function onWinSize() {
        jWindow.trigger('scrollSpy:winSize');
      }
      var getTime = (Date.now || function() {
        return new Date().getTime();
      });
      function throttle(func, wait, options) {
        var context,
            args,
            result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function() {
          previous = options.leading === false ? 0 : getTime();
          timeout = null;
          result = func.apply(context, args);
          context = args = null;
        };
        return function() {
          var now = getTime();
          if (!previous && options.leading === false)
            previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            context = args = null;
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
      }
      ;
      $.scrollSpy = function(selector, options) {
        var visible = [];
        selector = $(selector);
        selector.each(function(i, element) {
          elements.push($(element));
          $(element).data("scrollSpy:id", i);
          $('a[href=#' + $(element).attr('id') + ']').click(function(e) {
            e.preventDefault();
            var offset = $(this.hash).offset().top + 1;
            $('html, body').animate({scrollTop: offset - 200}, {
              duration: 400,
              queue: false,
              easing: 'easeOutCubic'
            });
          });
        });
        options = options || {throttle: 100};
        offset.top = options.offsetTop || 0;
        offset.right = options.offsetRight || 0;
        offset.bottom = options.offsetBottom || 0;
        offset.left = options.offsetLeft || 0;
        var throttledScroll = throttle(onScroll, options.throttle || 100);
        var readyScroll = function() {
          $(document).ready(throttledScroll);
        };
        if (!isSpying) {
          jWindow.on('scroll', readyScroll);
          jWindow.on('resize', readyScroll);
          isSpying = true;
        }
        setTimeout(readyScroll, 0);
        selector.on('scrollSpy:enter', function() {
          visible = $.grep(visible, function(value) {
            return value.height() != 0;
          });
          var $this = $(this);
          if (visible[0]) {
            $('a[href=#' + visible[0].attr('id') + ']').removeClass('active');
            if ($this.data('scrollSpy:id') < visible[0].data('scrollSpy:id')) {
              visible.unshift($(this));
            } else {
              visible.push($(this));
            }
          } else {
            visible.push($(this));
          }
          $('a[href=#' + visible[0].attr('id') + ']').addClass('active');
        });
        selector.on('scrollSpy:exit', function() {
          visible = $.grep(visible, function(value) {
            return value.height() != 0;
          });
          if (visible[0]) {
            $('a[href=#' + visible[0].attr('id') + ']').removeClass('active');
            var $this = $(this);
            visible = $.grep(visible, function(value) {
              return value.attr('id') != $this.attr('id');
            });
            if (visible[0]) {
              $('a[href=#' + visible[0].attr('id') + ']').addClass('active');
            }
          }
        });
        return selector;
      };
      $.winSizeSpy = function(options) {
        $.winSizeSpy = function() {
          return jWindow;
        };
        options = options || {throttle: 100};
        return jWindow.on('resize', throttle(onWinSize, options.throttle || 100));
      };
      $.fn.scrollSpy = function(options) {
        return $.scrollSpy($(this), options);
      };
    })(jQuery);
    ;
    (function($) {
      $(document).ready(function() {
        Materialize.updateTextFields = function() {
          var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
          $(input_selector).each(function(index, element) {
            if ($(element).val().length > 0 || $(this).attr('placeholder') !== undefined || $(element)[0].validity.badInput === true) {
              $(this).siblings('label, i').addClass('active');
            } else {
              $(this).siblings('label, i').removeClass('active');
            }
          });
        };
        var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
        $('input[autofocus]').siblings('label, i').addClass('active');
        $(document).on('change', input_selector, function() {
          if ($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined) {
            $(this).siblings('label, i').addClass('active');
          }
          validate_field($(this));
        });
        $(document).ready(function() {
          Materialize.updateTextFields();
        });
        $(document).on('reset', function(e) {
          var formReset = $(e.target);
          if (formReset.is('form')) {
            formReset.find(input_selector).removeClass('valid').removeClass('invalid');
            formReset.find(input_selector).each(function() {
              if ($(this).attr('value') === '') {
                $(this).siblings('label, i').removeClass('active');
              }
            });
            formReset.find('select.initialized').each(function() {
              var reset_text = formReset.find('option[selected]').text();
              formReset.siblings('input.select-dropdown').val(reset_text);
            });
          }
        });
        $(document).on('focus', input_selector, function() {
          $(this).siblings('label, i').addClass('active');
        });
        $(document).on('blur', input_selector, function() {
          var $inputElement = $(this);
          if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') === undefined) {
            $inputElement.siblings('label, i').removeClass('active');
          }
          validate_field($inputElement);
        });
        validate_field = function(object) {
          var hasLength = object.attr('length') !== undefined;
          var lenAttr = parseInt(object.attr('length'));
          var len = object.val().length;
          if (object.val().length === 0 && object[0].validity.badInput === false) {
            if (object.hasClass('validate')) {
              object.removeClass('valid');
              object.removeClass('invalid');
            }
          } else {
            if (object.hasClass('validate')) {
              if ((object.is(':valid') && hasLength && (len < lenAttr)) || (object.is(':valid') && !hasLength)) {
                object.removeClass('invalid');
                object.addClass('valid');
              } else {
                object.removeClass('valid');
                object.addClass('invalid');
              }
            }
          }
        };
        var hiddenDiv = $('.hiddendiv').first();
        if (!hiddenDiv.length) {
          hiddenDiv = $('<div class="hiddendiv common"></div>');
          $('body').append(hiddenDiv);
        }
        var text_area_selector = '.materialize-textarea';
        function textareaAutoResize($textarea) {
          var fontFamily = $textarea.css('font-family');
          var fontSize = $textarea.css('font-size');
          if (fontSize) {
            hiddenDiv.css('font-size', fontSize);
          }
          if (fontFamily) {
            hiddenDiv.css('font-family', fontFamily);
          }
          if ($textarea.attr('wrap') === "off") {
            hiddenDiv.css('overflow-wrap', "normal").css('white-space', "pre");
          }
          hiddenDiv.text($textarea.val() + '\n');
          var content = hiddenDiv.html().replace(/\n/g, '<br>');
          hiddenDiv.html(content);
          if ($textarea.is(':visible')) {
            hiddenDiv.css('width', $textarea.width());
          } else {
            hiddenDiv.css('width', $(window).width() / 2);
          }
          $textarea.css('height', hiddenDiv.height());
        }
        $(text_area_selector).each(function() {
          var $textarea = $(this);
          if ($textarea.val().length) {
            textareaAutoResize($textarea);
          }
        });
        $('body').on('keyup keydown', text_area_selector, function() {
          textareaAutoResize($(this));
        });
        $('.file-field').each(function() {
          var path_input = $(this).find('input.file-path');
          $(this).find('input[type="file"]').change(function() {
            path_input.val($(this)[0].files[0].name);
            path_input.trigger('change');
          });
        });
        var range_type = 'input[type=range]';
        var range_mousedown = false;
        var left;
        $(range_type).each(function() {
          var thumb = $('<span class="thumb"><span class="value"></span></span>');
          $(this).after(thumb);
        });
        var range_wrapper = '.range-field';
        $(document).on('change', range_type, function(e) {
          var thumb = $(this).siblings('.thumb');
          thumb.find('.value').html($(this).val());
        });
        $(document).on('mousedown touchstart', range_type, function(e) {
          var thumb = $(this).siblings('.thumb');
          if (thumb.length <= 0) {
            thumb = $('<span class="thumb"><span class="value"></span></span>');
            $(this).append(thumb);
          }
          thumb.find('.value').html($(this).val());
          range_mousedown = true;
          $(this).addClass('active');
          if (!thumb.hasClass('active')) {
            thumb.velocity({
              height: "30px",
              width: "30px",
              top: "-20px",
              marginLeft: "-15px"
            }, {
              duration: 300,
              easing: 'easeOutExpo'
            });
          }
          if (e.pageX === undefined || e.pageX === null) {
            left = e.originalEvent.touches[0].pageX - $(this).offset().left;
          } else {
            left = e.pageX - $(this).offset().left;
          }
          var width = $(this).outerWidth();
          if (left < 0) {
            left = 0;
          } else if (left > width) {
            left = width;
          }
          thumb.addClass('active').css('left', left);
          thumb.find('.value').html($(this).val());
        });
        $(document).on('mouseup touchend', range_wrapper, function() {
          range_mousedown = false;
          $(this).removeClass('active');
        });
        $(document).on('mousemove touchmove', range_wrapper, function(e) {
          var thumb = $(this).children('.thumb');
          var left;
          if (range_mousedown) {
            if (!thumb.hasClass('active')) {
              thumb.velocity({
                height: '30px',
                width: '30px',
                top: '-20px',
                marginLeft: '-15px'
              }, {
                duration: 300,
                easing: 'easeOutExpo'
              });
            }
            if (e.pageX === undefined || e.pageX === null) {
              left = e.originalEvent.touches[0].pageX - $(this).offset().left;
            } else {
              left = e.pageX - $(this).offset().left;
            }
            var width = $(this).outerWidth();
            if (left < 0) {
              left = 0;
            } else if (left > width) {
              left = width;
            }
            thumb.addClass('active').css('left', left);
          }
        });
        $(document).on('mouseout touchleave', range_wrapper, function() {
          if (!range_mousedown) {
            var thumb = $(this).children('.thumb');
            if (thumb.hasClass('active')) {
              thumb.velocity({
                height: '0',
                width: '0',
                top: '10px',
                marginLeft: '-6px'
              }, {duration: 100});
            }
            thumb.removeClass('active');
          }
        });
      });
      $.fn.material_select = function(callback) {
        $(this).each(function() {
          $select = $(this);
          if ($select.hasClass('browser-default')) {
            return;
          }
          var lastID = $select.data('select-id');
          if (lastID) {
            $select.parent().find('i').remove();
            $select.parent().find('input').remove();
            $select.unwrap();
            $('ul#select-options-' + lastID).remove();
          }
          if (callback === 'destroy') {
            $select.data('select-id', null).removeClass('initialized');
            return;
          }
          var uniqueID = Materialize.guid();
          $select.data('select-id', uniqueID);
          var wrapper = $('<div class="select-wrapper"></div>');
          wrapper.addClass($select.attr('class'));
          var options = $('<ul id="select-options-' + uniqueID + '" class="dropdown-content select-dropdown"></ul>');
          var selectOptions = $select.children('option');
          var label;
          if ($select.find('option:selected') !== undefined) {
            label = $select.find('option:selected');
          } else {
            label = options.first();
          }
          selectOptions.each(function() {
            options.append($('<li class="' + (($(this).is(':disabled')) ? 'disabled' : '') + '"><span>' + $(this).html() + '</span></li>'));
          });
          options.find('li').each(function(i) {
            var $curr_select = $select;
            $(this).click(function() {
              if (!$(this).hasClass('disabled')) {
                $curr_select.find('option').eq(i).prop('selected', true);
                $curr_select.trigger('change');
                $curr_select.siblings('input.select-dropdown').val($(this).text());
                if (typeof callback !== 'undefined')
                  callback();
              }
            });
          });
          $select.wrap(wrapper);
          var dropdownIcon = $('<span class="caret">&#9660;</span>');
          if ($select.is(':disabled'))
            dropdownIcon.addClass('disabled');
          var $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + (($select.is(':disabled')) ? 'disabled' : '') + ' data-activates="select-options-' + uniqueID + '" value="' + label.html() + '"/>');
          $select.before($newSelect);
          $newSelect.before(dropdownIcon);
          $('body').append(options);
          if (!$select.is(':disabled')) {
            $newSelect.dropdown({"hover": false});
          }
          if ($select.attr('tabindex')) {
            $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
          }
          $select.addClass('initialized');
          $newSelect.on('focus', function() {
            $(this).trigger('open');
            label = $(this).val();
            selectedOption = options.find('li').filter(function() {
              return $(this).text().toLowerCase() === label.toLowerCase();
            })[0];
            activateOption(options, selectedOption);
          });
          $newSelect.on('blur', function() {
            $(this).trigger('close');
          });
          activateOption = function(collection, newOption) {
            collection.find('li.active').removeClass('active');
            $(newOption).addClass('active');
            collection.scrollTo(newOption);
          };
          filterQuery = [];
          onKeyDown = function(event) {
            if (event.which == 9) {
              $newSelect.trigger('close');
              return;
            }
            if (event.which == 40 && !options.is(":visible")) {
              $newSelect.trigger('open');
              return;
            }
            if (event.which == 13 && !options.is(":visible")) {
              return;
            }
            event.preventDefault();
            letter = String.fromCharCode(event.which).toLowerCase();
            var nonLetters = [9, 13, 27, 38, 40];
            if (letter && (nonLetters.indexOf(event.which) === -1)) {
              filterQuery.push(letter);
              string = filterQuery.join("");
              newOption = options.find('li').filter(function() {
                return $(this).text().toLowerCase().indexOf(string) === 0;
              })[0];
              if (newOption) {
                activateOption(options, newOption);
              }
            }
            if (event.which == 13) {
              activeOption = options.find('li.active:not(.disabled)')[0];
              if (activeOption) {
                $(activeOption).trigger('click');
                $newSelect.trigger('close');
              }
            }
            if (event.which == 40) {
              newOption = options.find('li.active').next('li:not(.disabled)')[0];
              if (newOption) {
                activateOption(options, newOption);
              }
            }
            if (event.which == 27) {
              $newSelect.trigger('close');
            }
            if (event.which == 38) {
              newOption = options.find('li.active').prev('li:not(.disabled)')[0];
              if (newOption) {
                activateOption(options, newOption);
              }
            }
            setTimeout(function() {
              filterQuery = [];
            }, 1000);
          };
          $newSelect.on('keydown', onKeyDown);
        });
      };
    }(jQuery));
    ;
    (function($) {
      var methods = {
        init: function(options) {
          var defaults = {
            indicators: true,
            height: 400,
            transition: 500,
            interval: 6000
          };
          options = $.extend(defaults, options);
          return this.each(function() {
            var $this = $(this);
            var $slider = $this.find('ul.slides').first();
            var $slides = $slider.find('li');
            var $active_index = $slider.find('.active').index();
            var $active;
            if ($active_index != -1) {
              $active = $slides.eq($active_index);
            }
            function captionTransition(caption, duration) {
              if (caption.hasClass("center-align")) {
                caption.velocity({
                  opacity: 0,
                  translateY: -100
                }, {
                  duration: duration,
                  queue: false
                });
              } else if (caption.hasClass("right-align")) {
                caption.velocity({
                  opacity: 0,
                  translateX: 100
                }, {
                  duration: duration,
                  queue: false
                });
              } else if (caption.hasClass("left-align")) {
                caption.velocity({
                  opacity: 0,
                  translateX: -100
                }, {
                  duration: duration,
                  queue: false
                });
              }
            }
            function moveToSlide(index) {
              if (index >= $slides.length)
                index = 0;
              else if (index < 0)
                index = $slides.length - 1;
              $active_index = $slider.find('.active').index();
              if ($active_index != index) {
                $active = $slides.eq($active_index);
                $caption = $active.find('.caption');
                $active.removeClass('active');
                $active.velocity({opacity: 0}, {
                  duration: options.transition,
                  queue: false,
                  easing: 'easeOutQuad',
                  complete: function() {
                    $slides.not('.active').velocity({
                      opacity: 0,
                      translateX: 0,
                      translateY: 0
                    }, {
                      duration: 0,
                      queue: false
                    });
                  }
                });
                captionTransition($caption, options.transition);
                if (options.indicators) {
                  $indicators.eq($active_index).removeClass('active');
                }
                $slides.eq(index).velocity({opacity: 1}, {
                  duration: options.transition,
                  queue: false,
                  easing: 'easeOutQuad'
                });
                $slides.eq(index).find('.caption').velocity({
                  opacity: 1,
                  translateX: 0,
                  translateY: 0
                }, {
                  duration: options.transition,
                  delay: options.transition,
                  queue: false,
                  easing: 'easeOutQuad'
                });
                $slides.eq(index).addClass('active');
                if (options.indicators) {
                  $indicators.eq(index).addClass('active');
                }
              }
            }
            if (!$this.hasClass('fullscreen')) {
              if (options.indicators) {
                $this.height(options.height + 40);
              } else {
                $this.height(options.height);
              }
              $slider.height(options.height);
            }
            $slides.find('.caption').each(function() {
              captionTransition($(this), 0);
            });
            $slides.find('img').each(function() {
              $(this).css('background-image', 'url(' + $(this).attr('src') + ')');
              $(this).attr('src', 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
            });
            if (options.indicators) {
              var $indicators = $('<ul class="indicators"></ul>');
              $slides.each(function(index) {
                var $indicator = $('<li class="indicator-item"></li>');
                $indicator.click(function() {
                  var $parent = $slider.parent();
                  var curr_index = $parent.find($(this)).index();
                  moveToSlide(curr_index);
                  clearInterval($interval);
                  $interval = setInterval(function() {
                    $active_index = $slider.find('.active').index();
                    if ($slides.length == $active_index + 1)
                      $active_index = 0;
                    else
                      $active_index += 1;
                    moveToSlide($active_index);
                  }, options.transition + options.interval);
                });
                $indicators.append($indicator);
              });
              $this.append($indicators);
              $indicators = $this.find('ul.indicators').find('li.indicator-item');
            }
            if ($active) {
              $active.show();
            } else {
              $slides.first().addClass('active').velocity({opacity: 1}, {
                duration: options.transition,
                queue: false,
                easing: 'easeOutQuad'
              });
              $active_index = 0;
              $active = $slides.eq($active_index);
              if (options.indicators) {
                $indicators.eq($active_index).addClass('active');
              }
            }
            $active.find('img').each(function() {
              $active.find('.caption').velocity({
                opacity: 1,
                translateX: 0,
                translateY: 0
              }, {
                duration: options.transition,
                queue: false,
                easing: 'easeOutQuad'
              });
            });
            $interval = setInterval(function() {
              $active_index = $slider.find('.active').index();
              moveToSlide($active_index + 1);
            }, options.transition + options.interval);
            var panning = false;
            var swipeLeft = false;
            var swipeRight = false;
            $this.hammer({prevent_default: false}).bind('pan', function(e) {
              if (e.gesture.pointerType === "touch") {
                clearInterval($interval);
                var direction = e.gesture.direction;
                var x = e.gesture.deltaX;
                var velocityX = e.gesture.velocityX;
                $curr_slide = $slider.find('.active');
                $curr_slide.velocity({translateX: x}, {
                  duration: 50,
                  queue: false,
                  easing: 'easeOutQuad'
                });
                if (direction === 4 && (x > ($this.innerWidth() / 2) || velocityX < -0.65)) {
                  swipeRight = true;
                } else if (direction === 2 && (x < (-1 * $this.innerWidth() / 2) || velocityX > 0.65)) {
                  swipeLeft = true;
                }
                var next_slide;
                if (swipeLeft) {
                  next_slide = $curr_slide.next();
                  if (next_slide.length === 0) {
                    next_slide = $slides.first();
                  }
                  next_slide.velocity({opacity: 1}, {
                    duration: 300,
                    queue: false,
                    easing: 'easeOutQuad'
                  });
                }
                if (swipeRight) {
                  next_slide = $curr_slide.prev();
                  if (next_slide.length === 0) {
                    next_slide = $slides.last();
                  }
                  next_slide.velocity({opacity: 1}, {
                    duration: 300,
                    queue: false,
                    easing: 'easeOutQuad'
                  });
                }
              }
            }).bind('panend', function(e) {
              if (e.gesture.pointerType === "touch") {
                $curr_slide = $slider.find('.active');
                panning = false;
                curr_index = $slider.find('.active').index();
                if (!swipeRight && !swipeLeft) {
                  $curr_slide.velocity({translateX: 0}, {
                    duration: 300,
                    queue: false,
                    easing: 'easeOutQuad'
                  });
                } else if (swipeLeft) {
                  moveToSlide(curr_index + 1);
                  $curr_slide.velocity({translateX: -1 * $this.innerWidth()}, {
                    duration: 300,
                    queue: false,
                    easing: 'easeOutQuad',
                    complete: function() {
                      $curr_slide.velocity({
                        opacity: 0,
                        translateX: 0
                      }, {
                        duration: 0,
                        queue: false
                      });
                    }
                  });
                } else if (swipeRight) {
                  moveToSlide(curr_index - 1);
                  $curr_slide.velocity({translateX: $this.innerWidth()}, {
                    duration: 300,
                    queue: false,
                    easing: 'easeOutQuad',
                    complete: function() {
                      $curr_slide.velocity({
                        opacity: 0,
                        translateX: 0
                      }, {
                        duration: 0,
                        queue: false
                      });
                    }
                  });
                }
                swipeLeft = false;
                swipeRight = false;
                clearInterval($interval);
                $interval = setInterval(function() {
                  $active_index = $slider.find('.active').index();
                  if ($slides.length == $active_index + 1)
                    $active_index = 0;
                  else
                    $active_index += 1;
                  moveToSlide($active_index);
                }, options.transition + options.interval);
              }
            });
            $this.on('sliderPause', function() {
              clearInterval($interval);
            });
            $this.on('sliderStart', function() {
              clearInterval($interval);
              $interval = setInterval(function() {
                $active_index = $slider.find('.active').index();
                if ($slides.length == $active_index + 1)
                  $active_index = 0;
                else
                  $active_index += 1;
                moveToSlide($active_index);
              }, options.transition + options.interval);
            });
          });
        },
        pause: function() {
          $(this).trigger('sliderPause');
        },
        start: function() {
          $(this).trigger('sliderStart');
        }
      };
      $.fn.slider = function(methodOrOptions) {
        if (methods[methodOrOptions]) {
          return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
          return methods.init.apply(this, arguments);
        } else {
          $.error('Method ' + methodOrOptions + ' does not exist on jQuery.tooltip');
        }
      };
    }(jQuery));
    ;
    (function($) {
      $(document).ready(function() {
        $(document).on('click.card', '.card', function(e) {
          if ($(this).find('.card-reveal').length) {
            if ($(e.target).is($('.card-reveal .card-title')) || $(e.target).is($('.card-reveal .card-title i'))) {
              $(this).find('.card-reveal').velocity({translateY: 0}, {
                duration: 225,
                queue: false,
                easing: 'easeInOutQuad',
                complete: function() {
                  $(this).css({display: 'none'});
                }
              });
            } else if ($(e.target).is($('.card .activator')) || $(e.target).is($('.card .activator i'))) {
              $(this).find('.card-reveal').css({display: 'block'}).velocity("stop", false).velocity({translateY: '-100%'}, {
                duration: 300,
                queue: false,
                easing: 'easeInOutQuad'
              });
            }
          }
        });
      });
    }(jQuery));
    ;
    (function($) {
      $(document).ready(function() {
        $.fn.pushpin = function(options) {
          var defaults = {
            top: 0,
            bottom: Infinity,
            offset: 0
          };
          options = $.extend(defaults, options);
          $index = 0;
          return this.each(function() {
            var $uniqueId = Materialize.guid(),
                $this = $(this),
                $original_offset = $(this).offset().top;
            function removePinClasses(object) {
              object.removeClass('pin-top');
              object.removeClass('pinned');
              object.removeClass('pin-bottom');
            }
            function updateElements(objects, scrolled) {
              objects.each(function() {
                if (options.top <= scrolled && options.bottom >= scrolled && !$(this).hasClass('pinned')) {
                  removePinClasses($(this));
                  $(this).css('top', options.offset);
                  $(this).addClass('pinned');
                }
                if (scrolled < options.top && !$(this).hasClass('pin-top')) {
                  removePinClasses($(this));
                  $(this).css('top', 0);
                  $(this).addClass('pin-top');
                }
                if (scrolled > options.bottom && !$(this).hasClass('pin-bottom')) {
                  removePinClasses($(this));
                  $(this).addClass('pin-bottom');
                  $(this).css('top', options.bottom - $original_offset);
                }
              });
            }
            updateElements($this, $(window).scrollTop());
            $(window).on('scroll.' + $uniqueId, function() {
              var $scrolled = $(window).scrollTop() + options.offset;
              updateElements($this, $scrolled);
            });
          });
        };
      });
    }(jQuery));
    ;
    (function($) {
      $(document).ready(function() {
        $.fn.reverse = [].reverse;
        $(document).on('mouseenter.fixedActionBtn', '.fixed-action-btn', function(e) {
          var $this = $(this);
          openFABMenu($this);
        });
        $(document).on('mouseleave.fixedActionBtn', '.fixed-action-btn', function(e) {
          var $this = $(this);
          closeFABMenu($this);
        });
      });
      $.fn.extend({
        openFAB: function() {
          var $this = $(this);
          openFABMenu($this);
        },
        closeFAB: function() {
          closeFABMenu($this);
        }
      });
      var openFABMenu = function(btn) {
        $this = btn;
        if ($this.hasClass('active') === false) {
          $this.addClass('active');
          $this.find('ul .btn-floating').velocity({
            scaleY: ".4",
            scaleX: ".4",
            translateY: "40px"
          }, {duration: 0});
          var time = 0;
          $this.find('ul .btn-floating').reverse().each(function() {
            $(this).velocity({
              opacity: "1",
              scaleX: "1",
              scaleY: "1",
              translateY: "0"
            }, {
              duration: 80,
              delay: time
            });
            time += 40;
          });
        }
      };
      var closeFABMenu = function(btn) {
        $this = btn;
        $this.removeClass('active');
        var time = 0;
        $this.find('ul .btn-floating').velocity("stop", true);
        $this.find('ul .btn-floating').velocity({
          opacity: "0",
          scaleX: ".4",
          scaleY: ".4",
          translateY: "40px"
        }, {duration: 80});
      };
    }(jQuery));
    ;
    (function($) {
      Materialize.fadeInImage = function(selector) {
        var element = $(selector);
        element.css({opacity: 0});
        $(element).velocity({opacity: 1}, {
          duration: 650,
          queue: false,
          easing: 'easeOutSine'
        });
        $(element).velocity({opacity: 1}, {
          duration: 1300,
          queue: false,
          easing: 'swing',
          step: function(now, fx) {
            fx.start = 100;
            var grayscale_setting = now / 100;
            var brightness_setting = 150 - (100 - now) / 1.75;
            if (brightness_setting < 100) {
              brightness_setting = 100;
            }
            if (now >= 0) {
              $(this).css({
                "-webkit-filter": "grayscale(" + grayscale_setting + ")" + "brightness(" + brightness_setting + "%)",
                "filter": "grayscale(" + grayscale_setting + ")" + "brightness(" + brightness_setting + "%)"
              });
            }
          }
        });
      };
      Materialize.showStaggeredList = function(selector) {
        var time = 0;
        $(selector).find('li').velocity({translateX: "-100px"}, {duration: 0});
        $(selector).find('li').each(function() {
          $(this).velocity({
            opacity: "1",
            translateX: "0"
          }, {
            duration: 800,
            delay: time,
            easing: [60, 10]
          });
          time += 120;
        });
      };
      $(document).ready(function() {
        var swipeLeft = false;
        var swipeRight = false;
        $('.dismissable').each(function() {
          $(this).hammer({prevent_default: false}).bind('pan', function(e) {
            if (e.gesture.pointerType === "touch") {
              var $this = $(this);
              var direction = e.gesture.direction;
              var x = e.gesture.deltaX;
              var velocityX = e.gesture.velocityX;
              $this.velocity({translateX: x}, {
                duration: 50,
                queue: false,
                easing: 'easeOutQuad'
              });
              if (direction === 4 && (x > ($this.innerWidth() / 2) || velocityX < -0.75)) {
                swipeLeft = true;
              }
              if (direction === 2 && (x < (-1 * $this.innerWidth() / 2) || velocityX > 0.75)) {
                swipeRight = true;
              }
            }
          }).bind('panend', function(e) {
            if (Math.abs(e.gesture.deltaX) < ($(this).innerWidth() / 2)) {
              swipeRight = false;
              swipeLeft = false;
            }
            if (e.gesture.pointerType === "touch") {
              var $this = $(this);
              if (swipeLeft || swipeRight) {
                var fullWidth;
                if (swipeLeft) {
                  fullWidth = $this.innerWidth();
                } else {
                  fullWidth = -1 * $this.innerWidth();
                }
                $this.velocity({translateX: fullWidth}, {
                  duration: 100,
                  queue: false,
                  easing: 'easeOutQuad',
                  complete: function() {
                    $this.css('border', 'none');
                    $this.velocity({
                      height: 0,
                      padding: 0
                    }, {
                      duration: 200,
                      queue: false,
                      easing: 'easeOutQuad',
                      complete: function() {
                        $this.remove();
                      }
                    });
                  }
                });
              } else {
                $this.velocity({translateX: 0}, {
                  duration: 100,
                  queue: false,
                  easing: 'easeOutQuad'
                });
              }
              swipeLeft = false;
              swipeRight = false;
            }
          });
        });
      });
    }(jQuery));
    ;
    (function($) {
      Materialize.scrollFire = function(options) {
        var didScroll = false;
        window.addEventListener("scroll", function() {
          didScroll = true;
        });
        setInterval(function() {
          if (didScroll) {
            didScroll = false;
            var windowScroll = window.pageYOffset + window.innerHeight;
            for (var i = 0; i < options.length; i++) {
              var value = options[i];
              var selector = value.selector,
                  offset = value.offset,
                  callback = value.callback;
              var currentElement = document.querySelector(selector);
              if (currentElement !== null) {
                var elementOffset = currentElement.getBoundingClientRect().top + document.body.scrollTop;
                if (windowScroll > (elementOffset + offset)) {
                  if (value.done !== true) {
                    var callbackFunc = new Function(callback);
                    callbackFunc();
                    value.done = true;
                  }
                }
              }
            }
          }
        }, 100);
      };
    })(jQuery);
    ;
    (function(factory) {
      if (typeof define == 'function' && define.amd)
        define('picker', ['jquery'], factory);
      else if (typeof exports == 'object')
        module.exports = factory(require('jquery'));
      else
        this.Picker = factory(jQuery);
    }(function($) {
      var $window = $(window);
      var $document = $(document);
      var $html = $(document.documentElement);
      function PickerConstructor(ELEMENT, NAME, COMPONENT, OPTIONS) {
        if (!ELEMENT)
          return PickerConstructor;
        var IS_DEFAULT_THEME = false,
            STATE = {id: ELEMENT.id || 'P' + Math.abs(~~(Math.random() * new Date()))},
            SETTINGS = COMPONENT ? $.extend(true, {}, COMPONENT.defaults, OPTIONS) : OPTIONS || {},
            CLASSES = $.extend({}, PickerConstructor.klasses(), SETTINGS.klass),
            $ELEMENT = $(ELEMENT),
            PickerInstance = function() {
              return this.start();
            },
            P = PickerInstance.prototype = {
              constructor: PickerInstance,
              $node: $ELEMENT,
              start: function() {
                if (STATE && STATE.start)
                  return P;
                STATE.methods = {};
                STATE.start = true;
                STATE.open = false;
                STATE.type = ELEMENT.type;
                ELEMENT.autofocus = ELEMENT == getActiveElement();
                ELEMENT.readOnly = !SETTINGS.editable;
                ELEMENT.id = ELEMENT.id || STATE.id;
                if (ELEMENT.type != 'text') {
                  ELEMENT.type = 'text';
                }
                P.component = new COMPONENT(P, SETTINGS);
                P.$root = $(PickerConstructor._.node('div', createWrappedComponent(), CLASSES.picker, 'id="' + ELEMENT.id + '_root" tabindex="0"'));
                prepareElementRoot();
                if (SETTINGS.formatSubmit) {
                  prepareElementHidden();
                }
                prepareElement();
                if (SETTINGS.container)
                  $(SETTINGS.container).append(P.$root);
                else
                  $ELEMENT.after(P.$root);
                P.on({
                  start: P.component.onStart,
                  render: P.component.onRender,
                  stop: P.component.onStop,
                  open: P.component.onOpen,
                  close: P.component.onClose,
                  set: P.component.onSet
                }).on({
                  start: SETTINGS.onStart,
                  render: SETTINGS.onRender,
                  stop: SETTINGS.onStop,
                  open: SETTINGS.onOpen,
                  close: SETTINGS.onClose,
                  set: SETTINGS.onSet
                });
                IS_DEFAULT_THEME = isUsingDefaultTheme(P.$root.children()[0]);
                if (ELEMENT.autofocus) {
                  P.open();
                }
                return P.trigger('start').trigger('render');
              },
              render: function(entireComponent) {
                if (entireComponent)
                  P.$root.html(createWrappedComponent());
                else
                  P.$root.find('.' + CLASSES.box).html(P.component.nodes(STATE.open));
                return P.trigger('render');
              },
              stop: function() {
                if (!STATE.start)
                  return P;
                P.close();
                if (P._hidden) {
                  P._hidden.parentNode.removeChild(P._hidden);
                }
                P.$root.remove();
                $ELEMENT.removeClass(CLASSES.input).removeData(NAME);
                setTimeout(function() {
                  $ELEMENT.off('.' + STATE.id);
                }, 0);
                ELEMENT.type = STATE.type;
                ELEMENT.readOnly = false;
                P.trigger('stop');
                STATE.methods = {};
                STATE.start = false;
                return P;
              },
              open: function(dontGiveFocus) {
                if (STATE.open)
                  return P;
                $ELEMENT.addClass(CLASSES.active);
                aria(ELEMENT, 'expanded', true);
                setTimeout(function() {
                  P.$root.addClass(CLASSES.opened);
                  aria(P.$root[0], 'hidden', false);
                }, 0);
                if (dontGiveFocus !== false) {
                  STATE.open = true;
                  if (IS_DEFAULT_THEME) {
                    $html.css('overflow', 'hidden').css('padding-right', '+=' + getScrollbarWidth());
                  }
                  P.$root[0].focus();
                  $document.on('click.' + STATE.id + ' focusin.' + STATE.id, function(event) {
                    var target = event.target;
                    if (target != ELEMENT && target != document && event.which != 3) {
                      P.close(target === P.$root.children()[0]);
                    }
                  }).on('keydown.' + STATE.id, function(event) {
                    var keycode = event.keyCode,
                        keycodeToMove = P.component.key[keycode],
                        target = event.target;
                    if (keycode == 27) {
                      P.close(true);
                    } else if (target == P.$root[0] && (keycodeToMove || keycode == 13)) {
                      event.preventDefault();
                      if (keycodeToMove) {
                        PickerConstructor._.trigger(P.component.key.go, P, [PickerConstructor._.trigger(keycodeToMove)]);
                      } else if (!P.$root.find('.' + CLASSES.highlighted).hasClass(CLASSES.disabled)) {
                        P.set('select', P.component.item.highlight).close();
                      }
                    } else if ($.contains(P.$root[0], target) && keycode == 13) {
                      event.preventDefault();
                      target.click();
                    }
                  });
                }
                return P.trigger('open');
              },
              close: function(giveFocus) {
                if (giveFocus) {
                  P.$root.off('focus.toOpen')[0].focus();
                  setTimeout(function() {
                    P.$root.on('focus.toOpen', handleFocusToOpenEvent);
                  }, 0);
                }
                $ELEMENT.removeClass(CLASSES.active);
                aria(ELEMENT, 'expanded', false);
                setTimeout(function() {
                  P.$root.removeClass(CLASSES.opened + ' ' + CLASSES.focused);
                  aria(P.$root[0], 'hidden', true);
                }, 0);
                if (!STATE.open)
                  return P;
                STATE.open = false;
                if (IS_DEFAULT_THEME) {
                  $html.css('overflow', '').css('padding-right', '-=' + getScrollbarWidth());
                }
                $document.off('.' + STATE.id);
                return P.trigger('close');
              },
              clear: function(options) {
                return P.set('clear', null, options);
              },
              set: function(thing, value, options) {
                var thingItem,
                    thingValue,
                    thingIsObject = $.isPlainObject(thing),
                    thingObject = thingIsObject ? thing : {};
                options = thingIsObject && $.isPlainObject(value) ? value : options || {};
                if (thing) {
                  if (!thingIsObject) {
                    thingObject[thing] = value;
                  }
                  for (thingItem in thingObject) {
                    thingValue = thingObject[thingItem];
                    if (thingItem in P.component.item) {
                      if (thingValue === undefined)
                        thingValue = null;
                      P.component.set(thingItem, thingValue, options);
                    }
                    if (thingItem == 'select' || thingItem == 'clear') {
                      $ELEMENT.val(thingItem == 'clear' ? '' : P.get(thingItem, SETTINGS.format)).trigger('change');
                    }
                  }
                  P.render();
                }
                return options.muted ? P : P.trigger('set', thingObject);
              },
              get: function(thing, format) {
                thing = thing || 'value';
                if (STATE[thing] != null) {
                  return STATE[thing];
                }
                if (thing == 'valueSubmit') {
                  if (P._hidden) {
                    return P._hidden.value;
                  }
                  thing = 'value';
                }
                if (thing == 'value') {
                  return ELEMENT.value;
                }
                if (thing in P.component.item) {
                  if (typeof format == 'string') {
                    var thingValue = P.component.get(thing);
                    return thingValue ? PickerConstructor._.trigger(P.component.formats.toString, P.component, [format, thingValue]) : '';
                  }
                  return P.component.get(thing);
                }
              },
              on: function(thing, method, internal) {
                var thingName,
                    thingMethod,
                    thingIsObject = $.isPlainObject(thing),
                    thingObject = thingIsObject ? thing : {};
                if (thing) {
                  if (!thingIsObject) {
                    thingObject[thing] = method;
                  }
                  for (thingName in thingObject) {
                    thingMethod = thingObject[thingName];
                    if (internal) {
                      thingName = '_' + thingName;
                    }
                    STATE.methods[thingName] = STATE.methods[thingName] || [];
                    STATE.methods[thingName].push(thingMethod);
                  }
                }
                return P;
              },
              off: function() {
                var i,
                    thingName,
                    names = arguments;
                for (i = 0, namesCount = names.length; i < namesCount; i += 1) {
                  thingName = names[i];
                  if (thingName in STATE.methods) {
                    delete STATE.methods[thingName];
                  }
                }
                return P;
              },
              trigger: function(name, data) {
                var _trigger = function(name) {
                  var methodList = STATE.methods[name];
                  if (methodList) {
                    methodList.map(function(method) {
                      PickerConstructor._.trigger(method, P, [data]);
                    });
                  }
                };
                _trigger('_' + name);
                _trigger(name);
                return P;
              }
            };
        function createWrappedComponent() {
          return PickerConstructor._.node('div', PickerConstructor._.node('div', PickerConstructor._.node('div', PickerConstructor._.node('div', P.component.nodes(STATE.open), CLASSES.box), CLASSES.wrap), CLASSES.frame), CLASSES.holder);
        }
        function prepareElement() {
          $ELEMENT.data(NAME, P).addClass(CLASSES.input).attr('tabindex', -1).val($ELEMENT.data('value') ? P.get('select', SETTINGS.format) : ELEMENT.value);
          if (!SETTINGS.editable) {
            $ELEMENT.on('focus.' + STATE.id + ' click.' + STATE.id, function(event) {
              event.preventDefault();
              P.$root[0].focus();
            }).on('keydown.' + STATE.id, handleKeydownEvent);
          }
          aria(ELEMENT, {
            haspopup: true,
            expanded: false,
            readonly: false,
            owns: ELEMENT.id + '_root'
          });
        }
        function prepareElementRoot() {
          P.$root.on({
            keydown: handleKeydownEvent,
            focusin: function(event) {
              P.$root.removeClass(CLASSES.focused);
              event.stopPropagation();
            },
            'mousedown click': function(event) {
              var target = event.target;
              if (target != P.$root.children()[0]) {
                event.stopPropagation();
                if (event.type == 'mousedown' && !$(target).is('input, select, textarea, button, option')) {
                  event.preventDefault();
                  P.$root[0].focus();
                }
              }
            }
          }).on({
            focus: function() {
              $ELEMENT.addClass(CLASSES.target);
            },
            blur: function() {
              $ELEMENT.removeClass(CLASSES.target);
            }
          }).on('focus.toOpen', handleFocusToOpenEvent).on('click', '[data-pick], [data-nav], [data-clear], [data-close]', function() {
            var $target = $(this),
                targetData = $target.data(),
                targetDisabled = $target.hasClass(CLASSES.navDisabled) || $target.hasClass(CLASSES.disabled),
                activeElement = getActiveElement();
            activeElement = activeElement && (activeElement.type || activeElement.href);
            if (targetDisabled || activeElement && !$.contains(P.$root[0], activeElement)) {
              P.$root[0].focus();
            }
            if (!targetDisabled && targetData.nav) {
              P.set('highlight', P.component.item.highlight, {nav: targetData.nav});
            } else if (!targetDisabled && 'pick' in targetData) {
              P.set('select', targetData.pick);
            } else if (targetData.clear) {
              P.clear().close(true);
            } else if (targetData.close) {
              P.close(true);
            }
          });
          aria(P.$root[0], 'hidden', true);
        }
        function prepareElementHidden() {
          var name;
          if (SETTINGS.hiddenName === true) {
            name = ELEMENT.name;
            ELEMENT.name = '';
          } else {
            name = [typeof SETTINGS.hiddenPrefix == 'string' ? SETTINGS.hiddenPrefix : '', typeof SETTINGS.hiddenSuffix == 'string' ? SETTINGS.hiddenSuffix : '_submit'];
            name = name[0] + ELEMENT.name + name[1];
          }
          P._hidden = $('<input ' + 'type=hidden ' + 'name="' + name + '"' + ($ELEMENT.data('value') || ELEMENT.value ? ' value="' + P.get('select', SETTINGS.formatSubmit) + '"' : '') + '>')[0];
          $ELEMENT.on('change.' + STATE.id, function() {
            P._hidden.value = ELEMENT.value ? P.get('select', SETTINGS.formatSubmit) : '';
          });
          if (SETTINGS.container)
            $(SETTINGS.container).append(P._hidden);
          else
            $ELEMENT.after(P._hidden);
        }
        function handleKeydownEvent(event) {
          var keycode = event.keyCode,
              isKeycodeDelete = /^(8|46)$/.test(keycode);
          if (keycode == 27) {
            P.close();
            return false;
          }
          if (keycode == 32 || isKeycodeDelete || !STATE.open && P.component.key[keycode]) {
            event.preventDefault();
            event.stopPropagation();
            if (isKeycodeDelete) {
              P.clear().close();
            } else {
              P.open();
            }
          }
        }
        function handleFocusToOpenEvent(event) {
          event.stopPropagation();
          if (event.type == 'focus') {
            P.$root.addClass(CLASSES.focused);
          }
          P.open();
        }
        return new PickerInstance();
      }
      PickerConstructor.klasses = function(prefix) {
        prefix = prefix || 'picker';
        return {
          picker: prefix,
          opened: prefix + '--opened',
          focused: prefix + '--focused',
          input: prefix + '__input',
          active: prefix + '__input--active',
          target: prefix + '__input--target',
          holder: prefix + '__holder',
          frame: prefix + '__frame',
          wrap: prefix + '__wrap',
          box: prefix + '__box'
        };
      };
      function isUsingDefaultTheme(element) {
        var theme,
            prop = 'position';
        if (element.currentStyle) {
          theme = element.currentStyle[prop];
        } else if (window.getComputedStyle) {
          theme = getComputedStyle(element)[prop];
        }
        return theme == 'fixed';
      }
      function getScrollbarWidth() {
        if ($html.height() <= $window.height()) {
          return 0;
        }
        var $outer = $('<div style="visibility:hidden;width:100px" />').appendTo('body');
        var widthWithoutScroll = $outer[0].offsetWidth;
        $outer.css('overflow', 'scroll');
        var $inner = $('<div style="width:100%" />').appendTo($outer);
        var widthWithScroll = $inner[0].offsetWidth;
        $outer.remove();
        return widthWithoutScroll - widthWithScroll;
      }
      PickerConstructor._ = {
        group: function(groupObject) {
          var loopObjectScope,
              nodesList = '',
              counter = PickerConstructor._.trigger(groupObject.min, groupObject);
          for (; counter <= PickerConstructor._.trigger(groupObject.max, groupObject, [counter]); counter += groupObject.i) {
            loopObjectScope = PickerConstructor._.trigger(groupObject.item, groupObject, [counter]);
            nodesList += PickerConstructor._.node(groupObject.node, loopObjectScope[0], loopObjectScope[1], loopObjectScope[2]);
          }
          return nodesList;
        },
        node: function(wrapper, item, klass, attribute) {
          if (!item)
            return '';
          item = $.isArray(item) ? item.join('') : item;
          klass = klass ? ' class="' + klass + '"' : '';
          attribute = attribute ? ' ' + attribute : '';
          return '<' + wrapper + klass + attribute + '>' + item + '</' + wrapper + '>';
        },
        lead: function(number) {
          return (number < 10 ? '0' : '') + number;
        },
        trigger: function(callback, scope, args) {
          return typeof callback == 'function' ? callback.apply(scope, args || []) : callback;
        },
        digits: function(string) {
          return (/\d/).test(string[1]) ? 2 : 1;
        },
        isDate: function(value) {
          return {}.toString.call(value).indexOf('Date') > -1 && this.isInteger(value.getDate());
        },
        isInteger: function(value) {
          return {}.toString.call(value).indexOf('Number') > -1 && value % 1 === 0;
        },
        ariaAttr: ariaAttr
      };
      PickerConstructor.extend = function(name, Component) {
        $.fn[name] = function(options, action) {
          var componentData = this.data(name);
          if (options == 'picker') {
            return componentData;
          }
          if (componentData && typeof options == 'string') {
            return PickerConstructor._.trigger(componentData[options], componentData, [action]);
          }
          return this.each(function() {
            var $this = $(this);
            if (!$this.data(name)) {
              new PickerConstructor(this, name, Component, options);
            }
          });
        };
        $.fn[name].defaults = Component.defaults;
      };
      function aria(element, attribute, value) {
        if ($.isPlainObject(attribute)) {
          for (var key in attribute) {
            ariaSet(element, key, attribute[key]);
          }
        } else {
          ariaSet(element, attribute, value);
        }
      }
      function ariaSet(element, attribute, value) {
        element.setAttribute((attribute == 'role' ? '' : 'aria-') + attribute, value);
      }
      function ariaAttr(attribute, data) {
        if (!$.isPlainObject(attribute)) {
          attribute = {attribute: data};
        }
        data = '';
        for (var key in attribute) {
          var attr = (key == 'role' ? '' : 'aria-') + key,
              attrVal = attribute[key];
          data += attrVal == null ? '' : attr + '="' + attribute[key] + '"';
        }
        return data;
      }
      function getActiveElement() {
        try {
          return document.activeElement;
        } catch (err) {}
      }
      return PickerConstructor;
    }));
    ;
    (function(factory) {
      if (typeof define == 'function' && define.amd)
        define(['picker', 'jquery'], factory);
      else if (typeof exports == 'object')
        module.exports = factory(require('./picker.js'), require('jquery'));
      else
        factory(Picker, jQuery);
    }(function(Picker, $) {
      var DAYS_IN_WEEK = 7,
          WEEKS_IN_CALENDAR = 6,
          _ = Picker._;
      function DatePicker(picker, settings) {
        var calendar = this,
            element = picker.$node[0],
            elementValue = element.value,
            elementDataValue = picker.$node.data('value'),
            valueString = elementDataValue || elementValue,
            formatString = elementDataValue ? settings.formatSubmit : settings.format,
            isRTL = function() {
              return element.currentStyle ? element.currentStyle.direction == 'rtl' : getComputedStyle(picker.$root[0]).direction == 'rtl';
            };
        calendar.settings = settings;
        calendar.$node = picker.$node;
        calendar.queue = {
          min: 'measure create',
          max: 'measure create',
          now: 'now create',
          select: 'parse create validate',
          highlight: 'parse navigate create validate',
          view: 'parse create validate viewset',
          disable: 'deactivate',
          enable: 'activate'
        };
        calendar.item = {};
        calendar.item.clear = null;
        calendar.item.disable = (settings.disable || []).slice(0);
        calendar.item.enable = -(function(collectionDisabled) {
          return collectionDisabled[0] === true ? collectionDisabled.shift() : -1;
        })(calendar.item.disable);
        calendar.set('min', settings.min).set('max', settings.max).set('now');
        if (valueString) {
          calendar.set('select', valueString, {format: formatString});
        } else {
          calendar.set('select', null).set('highlight', calendar.item.now);
        }
        calendar.key = {
          40: 7,
          38: -7,
          39: function() {
            return isRTL() ? -1 : 1;
          },
          37: function() {
            return isRTL() ? 1 : -1;
          },
          go: function(timeChange) {
            var highlightedObject = calendar.item.highlight,
                targetDate = new Date(highlightedObject.year, highlightedObject.month, highlightedObject.date + timeChange);
            calendar.set('highlight', targetDate, {interval: timeChange});
            this.render();
          }
        };
        picker.on('render', function() {
          picker.$root.find('.' + settings.klass.selectMonth).on('change', function() {
            var value = this.value;
            if (value) {
              picker.set('highlight', [picker.get('view').year, value, picker.get('highlight').date]);
              picker.$root.find('.' + settings.klass.selectMonth).trigger('focus');
            }
          });
          picker.$root.find('.' + settings.klass.selectYear).on('change', function() {
            var value = this.value;
            if (value) {
              picker.set('highlight', [value, picker.get('view').month, picker.get('highlight').date]);
              picker.$root.find('.' + settings.klass.selectYear).trigger('focus');
            }
          });
        }, 1).on('open', function() {
          var includeToday = '';
          if (calendar.disabled(calendar.get('now'))) {
            includeToday = ':not(.' + settings.klass.buttonToday + ')';
          }
          picker.$root.find('button' + includeToday + ', select').attr('disabled', false);
        }, 1).on('close', function() {
          picker.$root.find('button, select').attr('disabled', true);
        }, 1);
      }
      DatePicker.prototype.set = function(type, value, options) {
        var calendar = this,
            calendarItem = calendar.item;
        if (value === null) {
          if (type == 'clear')
            type = 'select';
          calendarItem[type] = value;
          return calendar;
        }
        calendarItem[(type == 'enable' ? 'disable' : type == 'flip' ? 'enable' : type)] = calendar.queue[type].split(' ').map(function(method) {
          value = calendar[method](type, value, options);
          return value;
        }).pop();
        if (type == 'select') {
          calendar.set('highlight', calendarItem.select, options);
        } else if (type == 'highlight') {
          calendar.set('view', calendarItem.highlight, options);
        } else if (type.match(/^(flip|min|max|disable|enable)$/)) {
          if (calendarItem.select && calendar.disabled(calendarItem.select)) {
            calendar.set('select', calendarItem.select, options);
          }
          if (calendarItem.highlight && calendar.disabled(calendarItem.highlight)) {
            calendar.set('highlight', calendarItem.highlight, options);
          }
        }
        return calendar;
      };
      DatePicker.prototype.get = function(type) {
        return this.item[type];
      };
      DatePicker.prototype.create = function(type, value, options) {
        var isInfiniteValue,
            calendar = this;
        value = value === undefined ? type : value;
        if (value == -Infinity || value == Infinity) {
          isInfiniteValue = value;
        } else if ($.isPlainObject(value) && _.isInteger(value.pick)) {
          value = value.obj;
        } else if ($.isArray(value)) {
          value = new Date(value[0], value[1], value[2]);
          value = _.isDate(value) ? value : calendar.create().obj;
        } else if (_.isInteger(value) || _.isDate(value)) {
          value = calendar.normalize(new Date(value), options);
        } else {
          value = calendar.now(type, value, options);
        }
        return {
          year: isInfiniteValue || value.getFullYear(),
          month: isInfiniteValue || value.getMonth(),
          date: isInfiniteValue || value.getDate(),
          day: isInfiniteValue || value.getDay(),
          obj: isInfiniteValue || value,
          pick: isInfiniteValue || value.getTime()
        };
      };
      DatePicker.prototype.createRange = function(from, to) {
        var calendar = this,
            createDate = function(date) {
              if (date === true || $.isArray(date) || _.isDate(date)) {
                return calendar.create(date);
              }
              return date;
            };
        if (!_.isInteger(from)) {
          from = createDate(from);
        }
        if (!_.isInteger(to)) {
          to = createDate(to);
        }
        if (_.isInteger(from) && $.isPlainObject(to)) {
          from = [to.year, to.month, to.date + from];
        } else if (_.isInteger(to) && $.isPlainObject(from)) {
          to = [from.year, from.month, from.date + to];
        }
        return {
          from: createDate(from),
          to: createDate(to)
        };
      };
      DatePicker.prototype.withinRange = function(range, dateUnit) {
        range = this.createRange(range.from, range.to);
        return dateUnit.pick >= range.from.pick && dateUnit.pick <= range.to.pick;
      };
      DatePicker.prototype.overlapRanges = function(one, two) {
        var calendar = this;
        one = calendar.createRange(one.from, one.to);
        two = calendar.createRange(two.from, two.to);
        return calendar.withinRange(one, two.from) || calendar.withinRange(one, two.to) || calendar.withinRange(two, one.from) || calendar.withinRange(two, one.to);
      };
      DatePicker.prototype.now = function(type, value, options) {
        value = new Date();
        if (options && options.rel) {
          value.setDate(value.getDate() + options.rel);
        }
        return this.normalize(value, options);
      };
      DatePicker.prototype.navigate = function(type, value, options) {
        var targetDateObject,
            targetYear,
            targetMonth,
            targetDate,
            isTargetArray = $.isArray(value),
            isTargetObject = $.isPlainObject(value),
            viewsetObject = this.item.view;
        if (isTargetArray || isTargetObject) {
          if (isTargetObject) {
            targetYear = value.year;
            targetMonth = value.month;
            targetDate = value.date;
          } else {
            targetYear = +value[0];
            targetMonth = +value[1];
            targetDate = +value[2];
          }
          if (options && options.nav && viewsetObject && viewsetObject.month !== targetMonth) {
            targetYear = viewsetObject.year;
            targetMonth = viewsetObject.month;
          }
          targetDateObject = new Date(targetYear, targetMonth + (options && options.nav ? options.nav : 0), 1);
          targetYear = targetDateObject.getFullYear();
          targetMonth = targetDateObject.getMonth();
          while (new Date(targetYear, targetMonth, targetDate).getMonth() !== targetMonth) {
            targetDate -= 1;
          }
          value = [targetYear, targetMonth, targetDate];
        }
        return value;
      };
      DatePicker.prototype.normalize = function(value) {
        value.setHours(0, 0, 0, 0);
        return value;
      };
      DatePicker.prototype.measure = function(type, value) {
        var calendar = this;
        if (!value) {
          value = type == 'min' ? -Infinity : Infinity;
        } else if (typeof value == 'string') {
          value = calendar.parse(type, value);
        } else if (_.isInteger(value)) {
          value = calendar.now(type, value, {rel: value});
        }
        return value;
      };
      DatePicker.prototype.viewset = function(type, dateObject) {
        return this.create([dateObject.year, dateObject.month, 1]);
      };
      DatePicker.prototype.validate = function(type, dateObject, options) {
        var calendar = this,
            originalDateObject = dateObject,
            interval = options && options.interval ? options.interval : 1,
            isFlippedBase = calendar.item.enable === -1,
            hasEnabledBeforeTarget,
            hasEnabledAfterTarget,
            minLimitObject = calendar.item.min,
            maxLimitObject = calendar.item.max,
            reachedMin,
            reachedMax,
            hasEnabledWeekdays = isFlippedBase && calendar.item.disable.filter(function(value) {
              if ($.isArray(value)) {
                var dateTime = calendar.create(value).pick;
                if (dateTime < dateObject.pick)
                  hasEnabledBeforeTarget = true;
                else if (dateTime > dateObject.pick)
                  hasEnabledAfterTarget = true;
              }
              return _.isInteger(value);
            }).length;
        if (!options || !options.nav)
          if ((!isFlippedBase && calendar.disabled(dateObject)) || (isFlippedBase && calendar.disabled(dateObject) && (hasEnabledWeekdays || hasEnabledBeforeTarget || hasEnabledAfterTarget)) || (!isFlippedBase && (dateObject.pick <= minLimitObject.pick || dateObject.pick >= maxLimitObject.pick))) {
            if (isFlippedBase && !hasEnabledWeekdays && ((!hasEnabledAfterTarget && interval > 0) || (!hasEnabledBeforeTarget && interval < 0))) {
              interval *= -1;
            }
            while (calendar.disabled(dateObject)) {
              if (Math.abs(interval) > 1 && (dateObject.month < originalDateObject.month || dateObject.month > originalDateObject.month)) {
                dateObject = originalDateObject;
                interval = interval > 0 ? 1 : -1;
              }
              if (dateObject.pick <= minLimitObject.pick) {
                reachedMin = true;
                interval = 1;
                dateObject = calendar.create([minLimitObject.year, minLimitObject.month, minLimitObject.date + (dateObject.pick === minLimitObject.pick ? 0 : -1)]);
              } else if (dateObject.pick >= maxLimitObject.pick) {
                reachedMax = true;
                interval = -1;
                dateObject = calendar.create([maxLimitObject.year, maxLimitObject.month, maxLimitObject.date + (dateObject.pick === maxLimitObject.pick ? 0 : 1)]);
              }
              if (reachedMin && reachedMax) {
                break;
              }
              dateObject = calendar.create([dateObject.year, dateObject.month, dateObject.date + interval]);
            }
          }
        return dateObject;
      };
      DatePicker.prototype.disabled = function(dateToVerify) {
        var calendar = this,
            isDisabledMatch = calendar.item.disable.filter(function(dateToDisable) {
              if (_.isInteger(dateToDisable)) {
                return dateToVerify.day === (calendar.settings.firstDay ? dateToDisable : dateToDisable - 1) % 7;
              }
              if ($.isArray(dateToDisable) || _.isDate(dateToDisable)) {
                return dateToVerify.pick === calendar.create(dateToDisable).pick;
              }
              if ($.isPlainObject(dateToDisable)) {
                return calendar.withinRange(dateToDisable, dateToVerify);
              }
            });
        isDisabledMatch = isDisabledMatch.length && !isDisabledMatch.filter(function(dateToDisable) {
          return $.isArray(dateToDisable) && dateToDisable[3] == 'inverted' || $.isPlainObject(dateToDisable) && dateToDisable.inverted;
        }).length;
        return calendar.item.enable === -1 ? !isDisabledMatch : isDisabledMatch || dateToVerify.pick < calendar.item.min.pick || dateToVerify.pick > calendar.item.max.pick;
      };
      DatePicker.prototype.parse = function(type, value, options) {
        var calendar = this,
            parsingObject = {};
        if (!value || typeof value != 'string') {
          return value;
        }
        if (!(options && options.format)) {
          options = options || {};
          options.format = calendar.settings.format;
        }
        calendar.formats.toArray(options.format).map(function(label) {
          var formattingLabel = calendar.formats[label],
              formatLength = formattingLabel ? _.trigger(formattingLabel, calendar, [value, parsingObject]) : label.replace(/^!/, '').length;
          if (formattingLabel) {
            parsingObject[label] = value.substr(0, formatLength);
          }
          value = value.substr(formatLength);
        });
        return [parsingObject.yyyy || parsingObject.yy, +(parsingObject.mm || parsingObject.m) - 1, parsingObject.dd || parsingObject.d];
      };
      DatePicker.prototype.formats = (function() {
        function getWordLengthFromCollection(string, collection, dateObject) {
          var word = string.match(/\w+/)[0];
          if (!dateObject.mm && !dateObject.m) {
            dateObject.m = collection.indexOf(word) + 1;
          }
          return word.length;
        }
        function getFirstWordLength(string) {
          return string.match(/\w+/)[0].length;
        }
        return {
          d: function(string, dateObject) {
            return string ? _.digits(string) : dateObject.date;
          },
          dd: function(string, dateObject) {
            return string ? 2 : _.lead(dateObject.date);
          },
          ddd: function(string, dateObject) {
            return string ? getFirstWordLength(string) : this.settings.weekdaysShort[dateObject.day];
          },
          dddd: function(string, dateObject) {
            return string ? getFirstWordLength(string) : this.settings.weekdaysFull[dateObject.day];
          },
          m: function(string, dateObject) {
            return string ? _.digits(string) : dateObject.month + 1;
          },
          mm: function(string, dateObject) {
            return string ? 2 : _.lead(dateObject.month + 1);
          },
          mmm: function(string, dateObject) {
            var collection = this.settings.monthsShort;
            return string ? getWordLengthFromCollection(string, collection, dateObject) : collection[dateObject.month];
          },
          mmmm: function(string, dateObject) {
            var collection = this.settings.monthsFull;
            return string ? getWordLengthFromCollection(string, collection, dateObject) : collection[dateObject.month];
          },
          yy: function(string, dateObject) {
            return string ? 2 : ('' + dateObject.year).slice(2);
          },
          yyyy: function(string, dateObject) {
            return string ? 4 : dateObject.year;
          },
          toArray: function(formatString) {
            return formatString.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
          },
          toString: function(formatString, itemObject) {
            var calendar = this;
            return calendar.formats.toArray(formatString).map(function(label) {
              return _.trigger(calendar.formats[label], calendar, [0, itemObject]) || label.replace(/^!/, '');
            }).join('');
          }
        };
      })();
      DatePicker.prototype.isDateExact = function(one, two) {
        var calendar = this;
        if ((_.isInteger(one) && _.isInteger(two)) || (typeof one == 'boolean' && typeof two == 'boolean')) {
          return one === two;
        }
        if ((_.isDate(one) || $.isArray(one)) && (_.isDate(two) || $.isArray(two))) {
          return calendar.create(one).pick === calendar.create(two).pick;
        }
        if ($.isPlainObject(one) && $.isPlainObject(two)) {
          return calendar.isDateExact(one.from, two.from) && calendar.isDateExact(one.to, two.to);
        }
        return false;
      };
      DatePicker.prototype.isDateOverlap = function(one, two) {
        var calendar = this,
            firstDay = calendar.settings.firstDay ? 1 : 0;
        if (_.isInteger(one) && (_.isDate(two) || $.isArray(two))) {
          one = one % 7 + firstDay;
          return one === calendar.create(two).day + 1;
        }
        if (_.isInteger(two) && (_.isDate(one) || $.isArray(one))) {
          two = two % 7 + firstDay;
          return two === calendar.create(one).day + 1;
        }
        if ($.isPlainObject(one) && $.isPlainObject(two)) {
          return calendar.overlapRanges(one, two);
        }
        return false;
      };
      DatePicker.prototype.flipEnable = function(val) {
        var itemObject = this.item;
        itemObject.enable = val || (itemObject.enable == -1 ? 1 : -1);
      };
      DatePicker.prototype.deactivate = function(type, datesToDisable) {
        var calendar = this,
            disabledItems = calendar.item.disable.slice(0);
        if (datesToDisable == 'flip') {
          calendar.flipEnable();
        } else if (datesToDisable === false) {
          calendar.flipEnable(1);
          disabledItems = [];
        } else if (datesToDisable === true) {
          calendar.flipEnable(-1);
          disabledItems = [];
        } else {
          datesToDisable.map(function(unitToDisable) {
            var matchFound;
            for (var index = 0; index < disabledItems.length; index += 1) {
              if (calendar.isDateExact(unitToDisable, disabledItems[index])) {
                matchFound = true;
                break;
              }
            }
            if (!matchFound) {
              if (_.isInteger(unitToDisable) || _.isDate(unitToDisable) || $.isArray(unitToDisable) || ($.isPlainObject(unitToDisable) && unitToDisable.from && unitToDisable.to)) {
                disabledItems.push(unitToDisable);
              }
            }
          });
        }
        return disabledItems;
      };
      DatePicker.prototype.activate = function(type, datesToEnable) {
        var calendar = this,
            disabledItems = calendar.item.disable,
            disabledItemsCount = disabledItems.length;
        if (datesToEnable == 'flip') {
          calendar.flipEnable();
        } else if (datesToEnable === true) {
          calendar.flipEnable(1);
          disabledItems = [];
        } else if (datesToEnable === false) {
          calendar.flipEnable(-1);
          disabledItems = [];
        } else {
          datesToEnable.map(function(unitToEnable) {
            var matchFound,
                disabledUnit,
                index,
                isExactRange;
            for (index = 0; index < disabledItemsCount; index += 1) {
              disabledUnit = disabledItems[index];
              if (calendar.isDateExact(disabledUnit, unitToEnable)) {
                matchFound = disabledItems[index] = null;
                isExactRange = true;
                break;
              } else if (calendar.isDateOverlap(disabledUnit, unitToEnable)) {
                if ($.isPlainObject(unitToEnable)) {
                  unitToEnable.inverted = true;
                  matchFound = unitToEnable;
                } else if ($.isArray(unitToEnable)) {
                  matchFound = unitToEnable;
                  if (!matchFound[3])
                    matchFound.push('inverted');
                } else if (_.isDate(unitToEnable)) {
                  matchFound = [unitToEnable.getFullYear(), unitToEnable.getMonth(), unitToEnable.getDate(), 'inverted'];
                }
                break;
              }
            }
            if (matchFound)
              for (index = 0; index < disabledItemsCount; index += 1) {
                if (calendar.isDateExact(disabledItems[index], unitToEnable)) {
                  disabledItems[index] = null;
                  break;
                }
              }
            if (isExactRange)
              for (index = 0; index < disabledItemsCount; index += 1) {
                if (calendar.isDateOverlap(disabledItems[index], unitToEnable)) {
                  disabledItems[index] = null;
                  break;
                }
              }
            if (matchFound) {
              disabledItems.push(matchFound);
            }
          });
        }
        return disabledItems.filter(function(val) {
          return val != null;
        });
      };
      DatePicker.prototype.nodes = function(isOpen) {
        var calendar = this,
            settings = calendar.settings,
            calendarItem = calendar.item,
            nowObject = calendarItem.now,
            selectedObject = calendarItem.select,
            highlightedObject = calendarItem.highlight,
            viewsetObject = calendarItem.view,
            disabledCollection = calendarItem.disable,
            minLimitObject = calendarItem.min,
            maxLimitObject = calendarItem.max,
            tableHead = (function(collection, fullCollection) {
              if (settings.firstDay) {
                collection.push(collection.shift());
                fullCollection.push(fullCollection.shift());
              }
              return _.node('thead', _.node('tr', _.group({
                min: 0,
                max: DAYS_IN_WEEK - 1,
                i: 1,
                node: 'th',
                item: function(counter) {
                  return [collection[counter], settings.klass.weekdays, 'scope=col title="' + fullCollection[counter] + '"'];
                }
              })));
            })((settings.showWeekdaysFull ? settings.weekdaysFull : settings.weekdaysLetter).slice(0), settings.weekdaysFull.slice(0)),
            createMonthNav = function(next) {
              return _.node('div', ' ', settings.klass['nav' + (next ? 'Next' : 'Prev')] + ((next && viewsetObject.year >= maxLimitObject.year && viewsetObject.month >= maxLimitObject.month) || (!next && viewsetObject.year <= minLimitObject.year && viewsetObject.month <= minLimitObject.month) ? ' ' + settings.klass.navDisabled : ''), 'data-nav=' + (next || -1) + ' ' + _.ariaAttr({
                role: 'button',
                controls: calendar.$node[0].id + '_table'
              }) + ' ' + 'title="' + (next ? settings.labelMonthNext : settings.labelMonthPrev) + '"');
            },
            createMonthLabel = function(override) {
              var monthsCollection = settings.showMonthsShort ? settings.monthsShort : settings.monthsFull;
              if (override == "short_months") {
                monthsCollection = settings.monthsShort;
              }
              if (settings.selectMonths && override == undefined) {
                return _.node('select', _.group({
                  min: 0,
                  max: 11,
                  i: 1,
                  node: 'option',
                  item: function(loopedMonth) {
                    return [monthsCollection[loopedMonth], 0, 'value=' + loopedMonth + (viewsetObject.month == loopedMonth ? ' selected' : '') + (((viewsetObject.year == minLimitObject.year && loopedMonth < minLimitObject.month) || (viewsetObject.year == maxLimitObject.year && loopedMonth > maxLimitObject.month)) ? ' disabled' : '')];
                  }
                }), settings.klass.selectMonth + ' browser-default', (isOpen ? '' : 'disabled') + ' ' + _.ariaAttr({controls: calendar.$node[0].id + '_table'}) + ' ' + 'title="' + settings.labelMonthSelect + '"');
              }
              if (override == "short_months")
                if (selectedObject != null)
                  return _.node('div', monthsCollection[selectedObject.month]);
                else
                  return _.node('div', monthsCollection[viewsetObject.month]);
              return _.node('div', monthsCollection[viewsetObject.month], settings.klass.month);
            },
            createYearLabel = function(override) {
              var focusedYear = viewsetObject.year,
                  numberYears = settings.selectYears === true ? 5 : ~~(settings.selectYears / 2);
              if (numberYears) {
                var minYear = minLimitObject.year,
                    maxYear = maxLimitObject.year,
                    lowestYear = focusedYear - numberYears,
                    highestYear = focusedYear + numberYears;
                if (minYear > lowestYear) {
                  highestYear += minYear - lowestYear;
                  lowestYear = minYear;
                }
                if (maxYear < highestYear) {
                  var availableYears = lowestYear - minYear,
                      neededYears = highestYear - maxYear;
                  lowestYear -= availableYears > neededYears ? neededYears : availableYears;
                  highestYear = maxYear;
                }
                if (settings.selectYears && override == undefined) {
                  return _.node('select', _.group({
                    min: lowestYear,
                    max: highestYear,
                    i: 1,
                    node: 'option',
                    item: function(loopedYear) {
                      return [loopedYear, 0, 'value=' + loopedYear + (focusedYear == loopedYear ? ' selected' : '')];
                    }
                  }), settings.klass.selectYear + ' browser-default', (isOpen ? '' : 'disabled') + ' ' + _.ariaAttr({controls: calendar.$node[0].id + '_table'}) + ' ' + 'title="' + settings.labelYearSelect + '"');
                }
              }
              if (override == "raw")
                return _.node('div', focusedYear);
              return _.node('div', focusedYear, settings.klass.year);
            };
        createDayLabel = function() {
          if (selectedObject != null)
            return _.node('div', selectedObject.date);
          else
            return _.node('div', nowObject.date);
        };
        createWeekdayLabel = function() {
          var display_day;
          if (selectedObject != null)
            display_day = selectedObject.day;
          else
            display_day = nowObject.day;
          var weekday = settings.weekdaysFull[display_day];
          return weekday;
        };
        return _.node('div', _.node('div', createWeekdayLabel(), "picker__weekday-display") + _.node('div', createMonthLabel("short_months"), settings.klass.month_display) + _.node('div', createDayLabel(), settings.klass.day_display) + _.node('div', createYearLabel("raw"), settings.klass.year_display), settings.klass.date_display) + _.node('div', _.node('div', (settings.selectYears ? createMonthLabel() + createYearLabel() : createMonthLabel() + createYearLabel()) + createMonthNav() + createMonthNav(1), settings.klass.header) + _.node('table', tableHead + _.node('tbody', _.group({
          min: 0,
          max: WEEKS_IN_CALENDAR - 1,
          i: 1,
          node: 'tr',
          item: function(rowCounter) {
            var shiftDateBy = settings.firstDay && calendar.create([viewsetObject.year, viewsetObject.month, 1]).day === 0 ? -7 : 0;
            return [_.group({
              min: DAYS_IN_WEEK * rowCounter - viewsetObject.day + shiftDateBy + 1,
              max: function() {
                return this.min + DAYS_IN_WEEK - 1;
              },
              i: 1,
              node: 'td',
              item: function(targetDate) {
                targetDate = calendar.create([viewsetObject.year, viewsetObject.month, targetDate + (settings.firstDay ? 1 : 0)]);
                var isSelected = selectedObject && selectedObject.pick == targetDate.pick,
                    isHighlighted = highlightedObject && highlightedObject.pick == targetDate.pick,
                    isDisabled = disabledCollection && calendar.disabled(targetDate) || targetDate.pick < minLimitObject.pick || targetDate.pick > maxLimitObject.pick,
                    formattedDate = _.trigger(calendar.formats.toString, calendar, [settings.format, targetDate]);
                return [_.node('div', targetDate.date, (function(klasses) {
                  klasses.push(viewsetObject.month == targetDate.month ? settings.klass.infocus : settings.klass.outfocus);
                  if (nowObject.pick == targetDate.pick) {
                    klasses.push(settings.klass.now);
                  }
                  if (isSelected) {
                    klasses.push(settings.klass.selected);
                  }
                  if (isHighlighted) {
                    klasses.push(settings.klass.highlighted);
                  }
                  if (isDisabled) {
                    klasses.push(settings.klass.disabled);
                  }
                  return klasses.join(' ');
                })([settings.klass.day]), 'data-pick=' + targetDate.pick + ' ' + _.ariaAttr({
                  role: 'gridcell',
                  label: formattedDate,
                  selected: isSelected && calendar.$node.val() === formattedDate ? true : null,
                  activedescendant: isHighlighted ? true : null,
                  disabled: isDisabled ? true : null
                })), '', _.ariaAttr({role: 'presentation'})];
              }
            })];
          }
        })), settings.klass.table, 'id="' + calendar.$node[0].id + '_table' + '" ' + _.ariaAttr({
          role: 'grid',
          controls: calendar.$node[0].id,
          readonly: true
        })), settings.klass.calendar_container) + _.node('div', _.node('button', settings.today, "btn-flat picker__today", 'type=button data-pick=' + nowObject.pick + (isOpen && !calendar.disabled(nowObject) ? '' : ' disabled') + ' ' + _.ariaAttr({controls: calendar.$node[0].id})) + _.node('button', settings.clear, "btn-flat picker__clear", 'type=button data-clear=1' + (isOpen ? '' : ' disabled') + ' ' + _.ariaAttr({controls: calendar.$node[0].id})) + _.node('button', settings.close, "btn-flat picker__close", 'type=button data-close=true ' + (isOpen ? '' : ' disabled') + ' ' + _.ariaAttr({controls: calendar.$node[0].id})), settings.klass.footer);
      };
      DatePicker.defaults = (function(prefix) {
        return {
          labelMonthNext: 'Next month',
          labelMonthPrev: 'Previous month',
          labelMonthSelect: 'Select a month',
          labelYearSelect: 'Select a year',
          monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          weekdaysLetter: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          today: 'Today',
          clear: 'Clear',
          close: 'Close',
          format: 'd mmmm, yyyy',
          klass: {
            table: prefix + 'table',
            header: prefix + 'header',
            date_display: prefix + 'date-display',
            day_display: prefix + 'day-display',
            month_display: prefix + 'month-display',
            year_display: prefix + 'year-display',
            calendar_container: prefix + 'calendar-container',
            navPrev: prefix + 'nav--prev',
            navNext: prefix + 'nav--next',
            navDisabled: prefix + 'nav--disabled',
            month: prefix + 'month',
            year: prefix + 'year',
            selectMonth: prefix + 'select--month',
            selectYear: prefix + 'select--year',
            weekdays: prefix + 'weekday',
            day: prefix + 'day',
            disabled: prefix + 'day--disabled',
            selected: prefix + 'day--selected',
            highlighted: prefix + 'day--highlighted',
            now: prefix + 'day--today',
            infocus: prefix + 'day--infocus',
            outfocus: prefix + 'day--outfocus',
            footer: prefix + 'footer',
            buttonClear: prefix + 'button--clear',
            buttonToday: prefix + 'button--today',
            buttonClose: prefix + 'button--close'
          }
        };
      })(Picker.klasses().picker + '__');
      Picker.extend('pickadate', DatePicker);
    }));
    ;
    (function($) {
      $.fn.characterCounter = function() {
        return this.each(function() {
          var itHasLengthAttribute = $(this).attr('length') !== undefined;
          if (itHasLengthAttribute) {
            $(this).on('input', updateCounter);
            $(this).on('focus', updateCounter);
            $(this).on('blur', removeCounterElement);
            addCounterElement($(this));
          }
        });
      };
      function updateCounter() {
        var maxLength = +$(this).attr('length'),
            actualLength = +$(this).val().length,
            isValidLength = actualLength <= maxLength;
        $(this).parent().find('span[class="character-counter"]').html(actualLength + '/' + maxLength);
        addInputStyle(isValidLength, $(this));
      }
      function addCounterElement($input) {
        var $counterElement = $('<span/>').addClass('character-counter').css('float', 'right').css('font-size', '12px').css('height', 1);
        $input.parent().append($counterElement);
      }
      function removeCounterElement() {
        $(this).parent().find('span[class="character-counter"]').html('');
      }
      function addInputStyle(isValidLength, $input) {
        var inputHasInvalidClass = $input.hasClass('invalid');
        if (isValidLength && inputHasInvalidClass) {
          $input.removeClass('invalid');
        } else if (!isValidLength && !inputHasInvalidClass) {
          $input.removeClass('valid');
          $input.addClass('invalid');
        }
      }
      $(document).ready(function() {
        $('input, textarea').characterCounter();
      });
    }(jQuery));
    this["Vel"] = Vel;
  })();
  return _retrieveGlobal();
});

System.registerDynamic("github:Dogfalo/materialize@0.97.0", ["github:Dogfalo/materialize@0.97.0/dist/js/materialize"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:Dogfalo/materialize@0.97.0/dist/js/materialize");
  global.define = __define;
  return module.exports;
});

System.register("main", ["github:Dogfalo/materialize@0.97.0"], function(_export) {
  'use strict';
  var materialize;
  _export('configure', configure);
  function configure(aurelia) {
    aurelia.use.standardConfiguration().developmentLogging();
    aurelia.start().then(function(a) {
      return a.setRoot();
    });
  }
  return {
    setters: [function(_DogfaloMaterialize) {
      materialize = _DogfaloMaterialize['default'];
    }],
    execute: function() {}
  };
});

System.registerDynamic("nav-bar.html!github:systemjs/plugin-text@0.0.2", [], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = "<template bindable=\"router\">\r\n    <script>\r\n        $(document).ready(function () {\r\n            $(\".button-collapse\").sideNav();\r\n        });\r\n    </script>\r\n    <nav role=\"navigation\">\r\n        <div class=\"nav-wrapper\">\r\n            <a href=\"#\" class=\"brand-logo\">${router.title}</a>\r\n            <a href=\"#\" data-activates=\"mobile-nav\" class=\"button-collapse\" materialize=\"sidenav\">\r\n                <i class=\"material-icons\">menu</i>\r\n            </a>\r\n            <ul class=\"side-nav\" id=\"mobile-nav\">\r\n                <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\r\n                    <a href.bind=\"route.href\" class=\"waves-effect waves-light\">${route.title}</a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </nav>\r\n</template>\r\n";
  global.define = __define;
  return module.exports;
});

(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/fetch-client@0.2.0/aurelia-fetch-client", ["exports", "npm:core-js@0.9.18"], function(exports, _coreJs) {
  'use strict';
  exports.__esModule = true;
  exports.json = json;
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  function json(body) {
    return new Blob([JSON.stringify(body)], {type: 'application/json'});
  }
  var HttpClientConfiguration = (function() {
    function HttpClientConfiguration() {
      _classCallCheck(this, HttpClientConfiguration);
      this.baseUrl = '';
      this.defaults = {};
      this.interceptors = [];
    }
    HttpClientConfiguration.prototype.withBaseUrl = function withBaseUrl(baseUrl) {
      this.baseUrl = baseUrl;
      return this;
    };
    HttpClientConfiguration.prototype.withDefaults = function withDefaults(defaults) {
      this.defaults = defaults;
      return this;
    };
    HttpClientConfiguration.prototype.withInterceptor = function withInterceptor(interceptor) {
      this.interceptors.push(interceptor);
      return this;
    };
    HttpClientConfiguration.prototype.useStandardConfiguration = function useStandardConfiguration() {
      var standardConfig = {credentials: 'same-origin'};
      Object.assign(this.defaults, standardConfig, this.defaults);
      return this.rejectErrorResponses();
    };
    HttpClientConfiguration.prototype.rejectErrorResponses = function rejectErrorResponses() {
      return this.withInterceptor({response: rejectOnError});
    };
    return HttpClientConfiguration;
  })();
  exports.HttpClientConfiguration = HttpClientConfiguration;
  function rejectOnError(response) {
    if (!response.ok) {
      throw response;
    }
    return response;
  }
  var HttpClient = (function() {
    function HttpClient() {
      _classCallCheck(this, HttpClient);
      this.activeRequestCount = 0;
      this.isRequesting = false;
      this.interceptors = [];
      this.isConfigured = false;
      this.baseUrl = '';
      this.defaults = null;
    }
    HttpClient.prototype.configure = function configure(config) {
      var _interceptors;
      var normalizedConfig = undefined;
      if (typeof config === 'string') {
        normalizedConfig = {baseUrl: config};
      } else if (typeof config === 'object') {
        normalizedConfig = {defaults: config};
      } else if (typeof config === 'function') {
        normalizedConfig = new HttpClientConfiguration();
        config(normalizedConfig);
      } else {
        throw new Error('invalid config');
      }
      var defaults = normalizedConfig.defaults;
      if (defaults && defaults.headers instanceof Headers) {
        throw new Error('Default headers must be a plain object.');
      }
      this.baseUrl = normalizedConfig.baseUrl;
      this.defaults = defaults;
      (_interceptors = this.interceptors).push.apply(_interceptors, normalizedConfig.interceptors || []);
      this.isConfigured = true;
      return this;
    };
    HttpClient.prototype.fetch = (function(_fetch) {
      function fetch(_x, _x2) {
        return _fetch.apply(this, arguments);
      }
      fetch.toString = function() {
        return _fetch.toString();
      };
      return fetch;
    })(function(input, init) {
      var _this = this;
      trackRequestStart.call(this);
      var request = Promise.resolve().then(function() {
        return buildRequest.call(_this, input, init, _this.defaults);
      });
      var promise = processRequest(request, this.interceptors).then(function(result) {
        var response = null;
        if (result instanceof Response) {
          response = result;
        } else if (result instanceof Request) {
          response = fetch(result);
        } else {
          throw new Error('An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [' + result + ']');
        }
        return processResponse(response, _this.interceptors);
      });
      return trackRequestEndWith.call(this, promise);
    });
    return HttpClient;
  })();
  exports.HttpClient = HttpClient;
  function trackRequestStart() {
    this.isRequesting = !!++this.activeRequestCount;
  }
  function trackRequestEnd() {
    this.isRequesting = !!--this.activeRequestCount;
  }
  function trackRequestEndWith(promise) {
    var handle = trackRequestEnd.bind(this);
    promise.then(handle, handle);
    return promise;
  }
  function buildRequest(input) {
    var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var defaults = this.defaults || {};
    var source = undefined;
    var url = undefined;
    var body = undefined;
    if (input instanceof Request) {
      if (!this.isConfigured) {
        return input;
      }
      source = input;
      url = input.url;
      body = input.blob();
    } else {
      source = init;
      url = input;
      body = init.body;
    }
    var requestInit = Object.assign({}, defaults, source, {body: body});
    var request = new Request((this.baseUrl || '') + url, requestInit);
    setDefaultHeaders(request.headers, defaults.headers);
    return request;
  }
  function setDefaultHeaders(headers, defaultHeaders) {
    for (var _name in defaultHeaders || {}) {
      if (defaultHeaders.hasOwnProperty(_name) && !headers.has(_name)) {
        headers.set(_name, defaultHeaders[_name]);
      }
    }
  }
  function processRequest(request, interceptors) {
    return applyInterceptors(request, interceptors, 'request', 'requestError');
  }
  function processResponse(response, interceptors) {
    return applyInterceptors(response, interceptors, 'response', 'responseError');
  }
  function applyInterceptors(input, interceptors, successName, errorName) {
    return (interceptors || []).reduce(function(chain, interceptor) {
      var successHandler = interceptor[successName];
      var errorHandler = interceptor[errorName];
      return chain.then(successHandler && successHandler.bind(interceptor), errorHandler && errorHandler.bind(interceptor));
    }, Promise.resolve(input));
  }
});

_removeDefine();
})();
(function() {
var _removeDefine = System.get("@@amd-helpers").createDefine();
define("github:aurelia/fetch-client@0.2.0", ["github:aurelia/fetch-client@0.2.0/aurelia-fetch-client"], function(main) {
  return main;
});

_removeDefine();
})();
System.registerDynamic("github:github/fetch@0.9.0/fetch", [], false, function(__require, __exports, __module) {
  var _retrieveGlobal = System.get("@@global-helpers").prepareGlobal(__module.id, null, null);
  (function() {
    (function() {
      'use strict';
      if (self.fetch) {
        return;
      }
      function normalizeName(name) {
        if (typeof name !== 'string') {
          name = name.toString();
        }
        if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
          throw new TypeError('Invalid character in header field name');
        }
        return name.toLowerCase();
      }
      function normalizeValue(value) {
        if (typeof value !== 'string') {
          value = value.toString();
        }
        return value;
      }
      function Headers(headers) {
        this.map = {};
        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }
      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var list = this.map[name];
        if (!list) {
          list = [];
          this.map[name] = list;
        }
        list.push(value);
      };
      Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)];
      };
      Headers.prototype.get = function(name) {
        var values = this.map[normalizeName(name)];
        return values ? values[0] : null;
      };
      Headers.prototype.getAll = function(name) {
        return this.map[normalizeName(name)] || [];
      };
      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };
      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = [normalizeValue(value)];
      };
      Headers.prototype.forEach = function(callback, thisArg) {
        Object.getOwnPropertyNames(this.map).forEach(function(name) {
          this.map[name].forEach(function(value) {
            callback.call(thisArg, value, name, this);
          }, this);
        }, this);
      };
      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'));
        }
        body.bodyUsed = true;
      }
      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        });
      }
      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        return fileReaderReady(reader);
      }
      function readBlobAsText(blob) {
        var reader = new FileReader();
        reader.readAsText(blob);
        return fileReaderReady(reader);
      }
      var support = {
        blob: 'FileReader' in self && 'Blob' in self && (function() {
          try {
            new Blob();
            return true;
          } catch (e) {
            return false;
          }
        })(),
        formData: 'FormData' in self
      };
      function Body() {
        this.bodyUsed = false;
        this._initBody = function(body) {
          this._bodyInit = body;
          if (typeof body === 'string') {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (!body) {
            this._bodyText = '';
          } else {
            throw new Error('unsupported BodyInit type');
          }
        };
        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob);
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob');
            } else {
              return Promise.resolve(new Blob([this._bodyText]));
            }
          };
          this.arrayBuffer = function() {
            return this.blob().then(readBlobAsArrayBuffer);
          };
          this.text = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return readBlobAsText(this._bodyBlob);
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as text');
            } else {
              return Promise.resolve(this._bodyText);
            }
          };
        } else {
          this.text = function() {
            var rejected = consumed(this);
            return rejected ? rejected : Promise.resolve(this._bodyText);
          };
        }
        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode);
          };
        }
        this.json = function() {
          return this.text().then(JSON.parse);
        };
        return this;
      }
      var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return (methods.indexOf(upcased) > -1) ? upcased : method;
      }
      function Request(url, options) {
        options = options || {};
        this.url = url;
        this.credentials = options.credentials || 'omit';
        this.headers = new Headers(options.headers);
        this.method = normalizeMethod(options.method || 'GET');
        this.mode = options.mode || null;
        this.referrer = null;
        if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
          throw new TypeError('Body not allowed for GET or HEAD requests');
        }
        this._initBody(options.body);
      }
      function decode(body) {
        var form = new FormData();
        body.trim().split('&').forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split('=');
            var name = split.shift().replace(/\+/g, ' ');
            var value = split.join('=').replace(/\+/g, ' ');
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
        return form;
      }
      function headers(xhr) {
        var head = new Headers();
        var pairs = xhr.getAllResponseHeaders().trim().split('\n');
        pairs.forEach(function(header) {
          var split = header.trim().split(':');
          var key = split.shift().trim();
          var value = split.join(':').trim();
          head.append(key, value);
        });
        return head;
      }
      Body.call(Request.prototype);
      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }
        this._initBody(bodyInit);
        this.type = 'default';
        this.url = null;
        this.status = options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = options.statusText;
        this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
        this.url = options.url || '';
      }
      Body.call(Response.prototype);
      self.Headers = Headers;
      self.Request = Request;
      self.Response = Response;
      self.fetch = function(input, init) {
        var request;
        if (Request.prototype.isPrototypeOf(input) && !init) {
          request = input;
        } else {
          request = new Request(input, init);
        }
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          function responseURL() {
            if ('responseURL' in xhr) {
              return xhr.responseURL;
            }
            if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
              return xhr.getResponseHeader('X-Request-URL');
            }
            return;
          }
          xhr.onload = function() {
            var status = (xhr.status === 1223) ? 204 : xhr.status;
            if (status < 100 || status > 599) {
              reject(new TypeError('Network request failed'));
              return;
            }
            var options = {
              status: status,
              statusText: xhr.statusText,
              headers: headers(xhr),
              url: responseURL()
            };
            var body = 'response' in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };
          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };
          xhr.open(request.method, request.url, true);
          if (request.credentials === 'include') {
            xhr.withCredentials = true;
          }
          if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob';
          }
          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });
          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        });
      };
      self.fetch.polyfill = true;
    })();
  })();
  return _retrieveGlobal();
});

System.registerDynamic("github:github/fetch@0.9.0", ["github:github/fetch@0.9.0/fetch"], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:github/fetch@0.9.0/fetch");
  global.define = __define;
  return module.exports;
});

System.register("users", ["github:aurelia/framework@0.16.0", "github:aurelia/fetch-client@0.2.0", "github:github/fetch@0.9.0"], function(_export) {
  'use strict';
  var inject,
      HttpClient,
      Users;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  return {
    setters: [function(_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function(_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
    }, function(_fetch) {}],
    execute: function() {
      Users = (function() {
        function Users(http) {
          _classCallCheck(this, _Users);
          this.heading = 'Github Users';
          this.users = [];
          http.configure(function(config) {
            config.useStandardConfiguration().withBaseUrl('https://api.github.com/');
          });
          this.http = http;
        }
        _createClass(Users, [{
          key: 'activate',
          value: function activate() {
            var _this = this;
            return this.http.fetch('users').then(function(response) {
              return response.json();
            }).then(function(data) {
              _this.users = data;
              Materialize.showStaggeredList('#staggedThat');
            });
          }
        }]);
        var _Users = Users;
        Users = inject(HttpClient)(Users) || Users;
        return Users;
      })();
      _export('Users', Users);
    }
  };
});

System.registerDynamic("users.html!github:systemjs/plugin-text@0.0.2", [], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = "<template>\n\n    <section>\r\n        <h2>${heading}</h2>\r\n        <div class=\"row\">\r\n\r\n            <div class=\"col s12 m7\" repeat.for=\"user of users\">\r\n\r\n                <div class=\"card hoverable\">\r\n\r\n                    <div class=\"card-image\">\r\n                        <img src.bind=\"user.avatar_url\" crossorigin ref=\"image\" />\r\n                        <span class=\"card-title\">${user.login}</span>\r\n                    </div>\r\n                    <div class=\"card-action\">\r\n                        <a target=\"_blank\" href.bind=\"user.html_url\">Contact</a>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n    </section>\n</template>\n";
  global.define = __define;
  return module.exports;
});

System.register("welcome", [], function(_export) {
  'use strict';
  var Welcome,
      UpperValueConverter;
  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }
  return {
    setters: [],
    execute: function() {
      Welcome = (function() {
        function Welcome() {
          _classCallCheck(this, Welcome);
          this.heading = 'Aurelia. Cordova. Materialized.';
          this.firstName = '';
          this.lastName = '';
          this.previousValue = this.fullName;
        }
        _createClass(Welcome, [{
          key: 'submit',
          value: function submit() {
            this.previousValue = this.fullName;
            Materialize.toast('Welcome, ' + ('' + this.fullName), 4000);
          }
        }, {
          key: 'canDeactivate',
          value: function canDeactivate() {
            if (this.fullName !== this.previousValue) {
              return confirm('Are you sure you want to leave?');
            }
          }
        }, {
          key: 'fullName',
          get: function get() {
            return this.firstName + ' ' + this.lastName;
          }
        }]);
        return Welcome;
      })();
      _export('Welcome', Welcome);
      UpperValueConverter = (function() {
        function UpperValueConverter() {
          _classCallCheck(this, UpperValueConverter);
        }
        _createClass(UpperValueConverter, [{
          key: 'toView',
          value: function toView(value) {
            return value && value.toUpperCase();
          }
        }]);
        return UpperValueConverter;
      })();
      _export('UpperValueConverter', UpperValueConverter);
    }
  };
});

System.registerDynamic("welcome.html!github:systemjs/plugin-text@0.0.2", [], true, function(require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = "<template>\n  <section>\n    <h4>${heading}</h4>\n    <form role=\"form\" submit.delegate=\"submit()\" class=\"col s12\">\n        <div class=\"row\">\r\n            <div class=\"input-field col s12\">\r\n                <input id=\"first_name\" value.bind=\"firstName\" type=\"text\" class=\"validate\">\r\n                <label for=\"first_name\">First Name</label>\r\n            </div>\r\n            </div>\r\n        <div class=\"row\">\r\n            <div class=\"input-field col s12\">\r\n                <input id=\"last_name\" value.bind=\"lastName\" type=\"text\" class=\"validate\">\r\n                <label for=\"last_name\">Last Name</label>\r\n            </div>\r\n        </div>\n      <div class=\"row\">\n        <label>Full Name</label>\n        <p class=\"help-block\">${fullName | upper}</p>\n      </div>\n      <button type=\"submit\" class=\"waves-effect waves-light btn\">Submit</button>\n    </form>\n  </section>\n</template>\n";
  global.define = __define;
  return module.exports;
});
