System.register(['aurelia-framework'], function (_export) {
  'use strict';

  var bindable, Pager;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

  return {
    setters: [function (_aureliaFramework) {
      bindable = _aureliaFramework.bindable;
    }],
    execute: function () {
      Pager = (function () {
        var _instanceInitializers = {};

        function Pager() {
          _classCallCheck(this, Pager);

          _defineDecoratedPropertyDescriptor(this, 'pageIndex', _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, 'pageCount', _instanceInitializers);

          _defineDecoratedPropertyDescriptor(this, 'setPage', _instanceInitializers);
        }

        _createDecoratedClass(Pager, [{
          key: 'pageIndex',
          decorators: [bindable],
          initializer: null,
          enumerable: true
        }, {
          key: 'pageCount',
          decorators: [bindable],
          initializer: null,
          enumerable: true
        }, {
          key: 'setPage',
          decorators: [bindable],
          initializer: null,
          enumerable: true
        }], null, _instanceInitializers);

        return Pager;
      })();

      _export('Pager', Pager);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy9wYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Z0JBRWEsS0FBSzs7Ozs7Ozs7OzttQ0FGVixRQUFROzs7QUFFSCxXQUFLOzs7aUJBQUwsS0FBSztnQ0FBTCxLQUFLOzs7Ozs7Ozs7OEJBQUwsS0FBSzs7dUJBQ2YsUUFBUTs7Ozs7dUJBQ1IsUUFBUTs7Ozs7dUJBQ1IsUUFBUTs7Ozs7ZUFIRSxLQUFLIiwiZmlsZSI6InJlc291cmNlcy9wYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YmluZGFibGV9IGZyb20gJ2F1cmVsaWEtZnJhbWV3b3JrJztcblxuZXhwb3J0IGNsYXNzIFBhZ2VyIHtcbiAgQGJpbmRhYmxlIHBhZ2VJbmRleDtcbiAgQGJpbmRhYmxlIHBhZ2VDb3VudDtcbiAgQGJpbmRhYmxlIHNldFBhZ2U7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=