System.register(['numeral'], function (_export) {
  'use strict';

  var numeral, NumberFormatValueConverter;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_numeral) {
      numeral = _numeral['default'];
    }],
    execute: function () {
      NumberFormatValueConverter = (function () {
        function NumberFormatValueConverter() {
          _classCallCheck(this, NumberFormatValueConverter);
        }

        _createClass(NumberFormatValueConverter, [{
          key: 'toView',
          value: function toView(value, format) {
            if (value === null || value === undefined || isNaN(value)) {
              return null;
            }
            return numeral(value).format(format);
          }
        }]);

        return NumberFormatValueConverter;
      })();

      _export('NumberFormatValueConverter', NumberFormatValueConverter);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy9udW1iZXItZm9ybWF0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztlQUVhLDBCQUEwQjs7Ozs7Ozs7Ozs7QUFBMUIsZ0NBQTBCO2lCQUExQiwwQkFBMEI7Z0NBQTFCLDBCQUEwQjs7O3FCQUExQiwwQkFBMEI7O2lCQUMvQixnQkFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ3BCLGdCQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDekQscUJBQU8sSUFBSSxDQUFDO2FBQ2I7QUFDRCxtQkFBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1dBQ3RDOzs7ZUFOVSwwQkFBMEIiLCJmaWxlIjoicmVzb3VyY2VzL251bWJlci1mb3JtYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnVtZXJhbCBmcm9tICdudW1lcmFsJztcblxuZXhwb3J0IGNsYXNzIE51bWJlckZvcm1hdFZhbHVlQ29udmVydGVyIHtcbiAgdG9WaWV3KHZhbHVlLCBmb3JtYXQpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCBpc05hTih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbnVtZXJhbCh2YWx1ZSkuZm9ybWF0KGZvcm1hdCk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==