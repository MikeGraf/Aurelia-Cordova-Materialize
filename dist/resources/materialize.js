System.register(['aurelia-framework', 'aurelia-task-queue'], function (_export) {
  'use strict';

  var inject, customAttribute, TaskQueue, Materialize;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function createEvent(name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    return event;
  }

  function fireEvent(element, name) {
    var event = createEvent(name);
    element.dispatchEvent(event);
  }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      customAttribute = _aureliaFramework.customAttribute;
    }, function (_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }],
    execute: function () {
      Materialize = (function () {
        function Materialize(element, taskQueue) {
          _classCallCheck(this, _Materialize);

          this.element = element;
          this.taskQueue = taskQueue;
        }

        _createClass(Materialize, [{
          key: 'bind',
          value: function bind() {
            var _this = this;

            if (!this.value) {
              this.value = this.element.nodeName.toLowerCase();
            }

            switch (this.value) {
              case 'datepicker':
                $(this.element).pickadate({
                  format: 'm/d/yyyy',
                  selectMonths: true,
                  selectYears: 15,
                  onSet: function onSet() {
                    return fireEvent(_this.element, 'change');
                  } });
                break;

              case 'select':
                setTimeout(function () {
                  return _this.bindSelect();
                }, 10);
                break;

              case 'sidenav':
                setTimeout(function () {
                  return $(_this.element).sideNav();
                }, 10);
                break;

              case 'label':
                this.taskQueue.queueMicroTask({ call: function call() {
                    return _this.fixLabelOverlap();
                  } });
                break;

              default:
                throw new Error('Unrecognized materialize attribute value: \'' + this.value + '\'');
            }
          }
        }, {
          key: 'detached',
          value: function detached() {
            clearInterval(this._interval);
            if (this.domObserver) {
              this.domObserver.disconnect();
              this.domObserver = null;
            }
          }
        }, {
          key: 'fixLabelOverlap',
          value: function fixLabelOverlap() {
            var $el = $(this.element);
            if ($el.prevUntil(null, ':input').val().length) {
              $el.addClass('active');
            }
          }
        }, {
          key: 'bindSelect',
          value: function bindSelect() {
            var _this2 = this;

            var input, getSelectedOption, selectedOption, lastSelectValue;

            $(this.element).material_select();
            input = $(this.element).prevUntil(null, ':input')[0];

            getSelectedOption = function () {
              var i, options, option, optionValue;
              options = _this2.element.options;
              i = options.length;
              while (i--) {
                option = options.item(i);
                if (option.selected) {
                  return option;
                }
              }
              throw new Error('should have found a selected option');
            };

            selectedOption = getSelectedOption();
            input.value = selectedOption.text;

            lastSelectValue = this.element.value;

            this._interval = setInterval(function () {
              if (lastSelectValue !== _this2.element.value) {
                selectedOption = getSelectedOption();
                if (input.value === selectedOption.text) {
                  fireEvent(_this2.element, 'change');
                } else {
                  input.value = selectedOption.text;
                }
                lastSelectValue = _this2.element.value;
              }
            }, 120);

            this.domObserver = new MutationObserver(function () {
              _this2.detached();
              $(_this2.element).material_select('destroy');
              _this2.bindSelect();
            });
            this.domObserver.observe(this.element, { childList: true, subtree: true });
          }
        }]);

        var _Materialize = Materialize;
        Materialize = inject(Element, TaskQueue)(Materialize) || Materialize;
        Materialize = customAttribute('materialize')(Materialize) || Materialize;
        return Materialize;
      })();

      _export('Materialize', Materialize);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUMsQ0FBQztpQkFDbkMsTUFBTTtBQUVMLHVCQUFLLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUM7aUJBQ25DO0FBQ0QsK0JBQWUsR0FBRyxPQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUM7ZUFDdEM7YUFDRixFQUNELEdBQUcsQ0FBQyxDQUFDOztBQUdQLGdCQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZ0JBQWdCLENBQUMsWUFBTTtBQUM1QyxxQkFBSyxRQUFRLEVBQUUsQ0FBQztBQUNoQixlQUFDLENBQUMsT0FBSyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0MscUJBQUssVUFBVSxFQUFFLENBQUM7YUFDbkIsQ0FBQyxDQUFDO0FBQ0gsZ0JBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1dBQzVFOzs7MkJBNUdVLFdBQVc7QUFBWCxtQkFBVyxHQUR2QixNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUNkLFdBQVcsS0FBWCxXQUFXO0FBQVgsbUJBQVcsR0FGdkIsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUVsQixXQUFXLEtBQVgsV0FBVztlQUFYLFdBQVciLCJmaWxlIjoicmVzb3VyY2VzL21hdGVyaWFsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpbmplY3QsIGN1c3RvbUF0dHJpYnV0ZX0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnO1xuaW1wb3J0IHtUYXNrUXVldWV9IGZyb20gJ2F1cmVsaWEtdGFzay1xdWV1ZSc7XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50KG5hbWUpIHtcbiAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gIGV2ZW50LmluaXRFdmVudChuYW1lLCB0cnVlLCB0cnVlKTtcbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5mdW5jdGlvbiBmaXJlRXZlbnQoZWxlbWVudCwgbmFtZSkge1xuICB2YXIgZXZlbnQgPSBjcmVhdGVFdmVudChuYW1lKTtcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuLyoqXG4qIEN1c3RvbSBodG1sIGF0dHJpYnV0ZSB0aGF0IHR1cm5zIG9uIGphdmFzY3JpcHQgYmFzZWQgbWF0ZXJpYWxpemUtY3NzIGNvbXBvZW5lbnRzLlxuKiBBbHNvIHNtb290aHMgb3V0IHNvbWUgaXNzdWVzIHdpdGggbWF0ZXJpYWxpemUgYW5kIGRhdGEtYmluZGluZy5cbiovXG5AY3VzdG9tQXR0cmlidXRlKCdtYXRlcmlhbGl6ZScpXG5AaW5qZWN0KEVsZW1lbnQsIFRhc2tRdWV1ZSlcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbGl6ZSB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHRhc2tRdWV1ZSkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy50YXNrUXVldWUgPSB0YXNrUXVldWU7XG4gIH1cblxuICBiaW5kKCkge1xuICAgIGlmICghdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIC8vIGhhbmRsZSB0aGUgZGV0YWlscyBvZiBjb25maWd1cmluZyB0aGUgbWF0ZXJpYWxpemUgamF2YXNjcmlwdCBjb21wb25lbnRzLi4uXG4gICAgc3dpdGNoKHRoaXMudmFsdWUpIHtcbiAgICAgIGNhc2UgJ2RhdGVwaWNrZXInOlxuICAgICAgICAkKHRoaXMuZWxlbWVudCkucGlja2FkYXRlKHtcbiAgICAgICAgICBmb3JtYXQ6ICdtL2QveXl5eScsXG4gICAgICAgICAgc2VsZWN0TW9udGhzOiB0cnVlLFxuICAgICAgICAgIHNlbGVjdFllYXJzOiAxNSxcbiAgICAgICAgICBvblNldDogKCkgPT4gZmlyZUV2ZW50KHRoaXMuZWxlbWVudCwgJ2NoYW5nZScpIC8vIGZpcmUgYSBjaGFuZ2UgZXZlbnQgc28gdGhlIGJpbmRpbmcgc3lzdGVtIGtub3dzIHRoZSBlbGVtZW50IHZhbHVlIHdhcyBjaGFuZ2VkXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmJpbmRTZWxlY3QoKSwgMTApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2lkZW5hdic6XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gJCh0aGlzLmVsZW1lbnQpLnNpZGVOYXYoKSwgMTApO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbGFiZWwnOlxuICAgICAgICB0aGlzLnRhc2tRdWV1ZS5xdWV1ZU1pY3JvVGFzayh7IGNhbGw6ICgpID0+IHRoaXMuZml4TGFiZWxPdmVybGFwKCkgfSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBtYXRlcmlhbGl6ZSBhdHRyaWJ1dGUgdmFsdWU6ICcke3RoaXMudmFsdWV9J2ApO1xuICAgIH1cbiAgfVxuXG4gIGRldGFjaGVkKCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpO1xuICAgIGlmICh0aGlzLmRvbU9ic2VydmVyKSB7XG4gICAgICB0aGlzLmRvbU9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIHRoaXMuZG9tT2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZpeExhYmVsT3ZlcmxhcCgpIHtcbiAgICB2YXIgJGVsID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIGlmICgkZWwucHJldlVudGlsKG51bGwsICc6aW5wdXQnKS52YWwoKS5sZW5ndGgpIHtcbiAgICAgICRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgfVxuICB9XG5cbiAgYmluZFNlbGVjdCgpIHtcbiAgICAvLyBTb21lIGhhY2t5IGNvZGUgdG8gbWFrZSB0aGUgbWF0ZXJpYWxpemUgc2VsZWN0IHdvcmsgd2l0aCBkYXRhLWJpbmRpbmcgZm9yIHRoZSBkZW1vLlxuICAgIC8vIEEgYmV0dGVyIGFwcHJvYWNoIHdvdWxkIGJlIHRvIGNyZWF0ZSBhIGN1c3RvbSBlbGVtZW50IHRoYXQgdXNlcyB0aGUgc2FtZSBzdHlsaW5nXG4gICAgLy8gYnV0IGlzIGEgY29tcGxldGUgcmUtd3JpdGUgb2YgdGhpcyBjb250cm9sLlxuICAgIHZhciBpbnB1dCwgZ2V0U2VsZWN0ZWRPcHRpb24sIHNlbGVjdGVkT3B0aW9uLCBsYXN0U2VsZWN0VmFsdWU7XG5cbiAgICAvLyBcIm1hdGVyaWFsaXplXCIgdGhlIHNlbGVjdCBhbmQgZmluZCB0aGUgcmVzdWx0aW5nIGlucHV0IHRoYXQgcmVwbGFjZXMgdGhlIHNlbGVjdCBlbGVtZW50LlxuICAgICQodGhpcy5lbGVtZW50KS5tYXRlcmlhbF9zZWxlY3QoKTtcbiAgICBpbnB1dCA9ICQodGhpcy5lbGVtZW50KS5wcmV2VW50aWwobnVsbCwgJzppbnB1dCcpWzBdO1xuXG4gICAgLy8gZ2V0IHRoZSBzZWxlY3QgZWxlbWVudCdzIHNlbGVjdGVkIG9wdGlvbiBlbGVtZW50LlxuICAgIGdldFNlbGVjdGVkT3B0aW9uID0gKCkgPT4ge1xuICAgICAgdmFyIGksIG9wdGlvbnMsIG9wdGlvbiwgb3B0aW9uVmFsdWU7XG4gICAgICBvcHRpb25zID0gdGhpcy5lbGVtZW50Lm9wdGlvbnM7XG4gICAgICBpID0gb3B0aW9ucy5sZW5ndGg7XG4gICAgICB3aGlsZShpLS0pIHtcbiAgICAgICAgb3B0aW9uID0gb3B0aW9ucy5pdGVtKGkpO1xuICAgICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzaG91bGQgaGF2ZSBmb3VuZCBhIHNlbGVjdGVkIG9wdGlvbicpO1xuICAgIH07XG5cbiAgICAvLyBzeW5jIHRoZSBpbnB1dCB3aXRoIHRoZSBzZWxlY3QgZWxlbWVudC5cbiAgICBzZWxlY3RlZE9wdGlvbiA9IGdldFNlbGVjdGVkT3B0aW9uKCk7XG4gICAgaW5wdXQudmFsdWUgPSBzZWxlY3RlZE9wdGlvbi50ZXh0O1xuXG4gICAgLy8gc3F1aXJyZWwgYXdheSB0aGUgc2VsZWN0IGVsZW1lbnQncyB2YWx1ZSBmb3IgZGlydHktY2hlY2tpbmcgcHVycG9zZXMuXG4gICAgbGFzdFNlbGVjdFZhbHVlID0gdGhpcy5lbGVtZW50LnZhbHVlO1xuXG4gICAgLy8gZGlycnJycnR5IGNoZWNraW5nLlxuICAgIHRoaXMuX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAobGFzdFNlbGVjdFZhbHVlICE9PSB0aGlzLmVsZW1lbnQudmFsdWUpIHtcbiAgICAgICAgICBzZWxlY3RlZE9wdGlvbiA9IGdldFNlbGVjdGVkT3B0aW9uKCk7XG4gICAgICAgICAgaWYgKGlucHV0LnZhbHVlID09PSBzZWxlY3RlZE9wdGlvbi50ZXh0KSB7XG4gICAgICAgICAgICAvLyBtYXRlcmlhbGl6ZSBjaGFuZ2VkIHRoZSBzZWxlY3QncyB2YWx1ZS4gIG5vdGlmeSB0aGUgYmluZGluZyBzeXN0ZW0uXG4gICAgICAgICAgICBmaXJlRXZlbnQodGhpcy5lbGVtZW50LCAnY2hhbmdlJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRoZSBiaW5kaW5nIHN5c3RlbSB1cGRhdGVkIHRoZSBzZWxlY3QncyB2YWx1ZS4gIHN5bmNocm9uaXplIHRoZSBtYXRlcmlhbGl6ZSBpbnB1dC5cbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gc2VsZWN0ZWRPcHRpb24udGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGFzdFNlbGVjdFZhbHVlID0gdGhpcy5lbGVtZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgMTIwKTtcblxuICAgIC8vIGhhbmRsZSBvcHRpb24gY2hhbmdlc1xuICAgIHRoaXMuZG9tT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICB0aGlzLmRldGFjaGVkKCk7XG4gICAgICAkKHRoaXMuZWxlbWVudCkubWF0ZXJpYWxfc2VsZWN0KCdkZXN0cm95Jyk7XG4gICAgICB0aGlzLmJpbmRTZWxlY3QoKTtcbiAgICB9KTtcbiAgICB0aGlzLmRvbU9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9