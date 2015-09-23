System.register([], function (_export) {
  'use strict';

  var Welcome, UpperValueConverter;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [],
    execute: function () {
      Welcome = (function () {
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

      UpperValueConverter = (function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlbGNvbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O01BRWEsT0FBTyxFQTZCUCxtQkFBbUI7Ozs7Ozs7OztBQTdCbkIsYUFBTztpQkFBUCxPQUFPO2dDQUFQLE9BQU87O2VBRWxCLE9BQU8sR0FBRyxpQ0FBaUM7ZUFDM0MsU0FBUyxHQUFHLEVBQUU7ZUFDZCxRQUFRLEdBQUcsRUFBRTtlQUNiLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUTs7O3FCQUxsQixPQUFPOztpQkFnQlosa0JBQUU7QUFDTixnQkFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOztBQUVuQyx1QkFBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLFNBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1dBQzNEOzs7aUJBRVkseUJBQUc7QUFDZCxnQkFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDeEMscUJBQU8sT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7YUFDbkQ7V0FDRjs7O2VBZFcsZUFBRTtBQUNaLG1CQUFVLElBQUksQ0FBQyxTQUFTLFNBQUksSUFBSSxDQUFDLFFBQVEsQ0FBRztXQUM3Qzs7O2VBZFUsT0FBTzs7Ozs7QUE2QlAseUJBQW1CO2lCQUFuQixtQkFBbUI7Z0NBQW5CLG1CQUFtQjs7O3FCQUFuQixtQkFBbUI7O2lCQUN4QixnQkFBQyxLQUFLLEVBQUM7QUFDWCxtQkFBTyxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1dBQ3JDOzs7ZUFIVSxtQkFBbUIiLCJmaWxlIjoid2VsY29tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vaW1wb3J0IHtjb21wdXRlZEZyb219IGZyb20gJ2F1cmVsaWEtZnJhbWV3b3JrJztcblxuZXhwb3J0IGNsYXNzIFdlbGNvbWV7XG5cbiAgaGVhZGluZyA9ICdBdXJlbGlhLiBDb3Jkb3ZhLiBNYXRlcmlhbGl6ZWQuJztcbiAgZmlyc3ROYW1lID0gJyc7XG4gIGxhc3ROYW1lID0gJyc7XG4gIHByZXZpb3VzVmFsdWUgPSB0aGlzLmZ1bGxOYW1lO1xuXG4gIC8vR2V0dGVycyBjYW4ndCBiZSBkaXJlY3RseSBvYnNlcnZlZCwgc28gdGhleSBtdXN0IGJlIGRpcnR5IGNoZWNrZWQuXG4gIC8vSG93ZXZlciwgaWYgeW91IHRlbGwgQXVyZWxpYSB0aGUgZGVwZW5kZW5jaWVzLCBpdCBubyBsb25nZXIgbmVlZHMgdG8gZGlydHkgY2hlY2sgdGhlIHByb3BlcnR5LlxuICAvL1RvIG9wdGltaXplIGJ5IGRlY2xhcmluZyB0aGUgcHJvcGVydGllcyB0aGF0IHRoaXMgZ2V0dGVyIGlzIGNvbXB1dGVkIGZyb20sIHVuY29tbWVudCB0aGUgbGluZSBiZWxvd1xuICAvL2FzIHdlbGwgYXMgdGhlIGNvcnJyZXNwb25kaW5nIGltcG9ydCBhYm92ZS5cbiAgLy9AY29tcHV0ZWRGcm9tKCdmaXJzdE5hbWUnLCAnbGFzdE5hbWUnKVxuICBnZXQgZnVsbE5hbWUoKXtcbiAgICByZXR1cm4gYCR7dGhpcy5maXJzdE5hbWV9ICR7dGhpcy5sYXN0TmFtZX1gO1xuICB9XG5cbiAgc3VibWl0KCl7XG4gICAgdGhpcy5wcmV2aW91c1ZhbHVlID0gdGhpcy5mdWxsTmFtZTtcbiAgICAgIC8vYWxlcnQoYFdlbGNvbWUsICR7dGhpcy5mdWxsTmFtZX0hYCk7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoJ1dlbGNvbWUsICcgKyBgJHt0aGlzLmZ1bGxOYW1lfWAsIDQwMDApO1xuICB9XG5cbiAgY2FuRGVhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5mdWxsTmFtZSAhPT0gdGhpcy5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICByZXR1cm4gY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlPycpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVXBwZXJWYWx1ZUNvbnZlcnRlciB7XG4gIHRvVmlldyh2YWx1ZSl7XG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRvVXBwZXJDYXNlKCk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==