System.register(['aurelia-framework', 'aurelia-fetch-client', 'fetch'], function (_export) {
  'use strict';

  var inject, HttpClient, Users;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
    }, function (_fetch) {}],
    execute: function () {
      Users = (function () {
        function Users(http) {
          _classCallCheck(this, _Users);

          this.heading = 'Github Users';
          this.users = [];

          http.configure(function (config) {
            config.useStandardConfiguration().withBaseUrl('https://api.github.com/');
          });

          this.http = http;
        }

        _createClass(Users, [{
          key: 'activate',
          value: function activate() {
            var _this = this;

            return this.http.fetch('users').then(function (response) {
              return response.json();
            }).then(function (data) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVzZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzswQkFLYSxLQUFLOzs7Ozs7OztpQ0FMVixNQUFNOzt1Q0FDTixVQUFVOzs7QUFJTCxXQUFLO0FBSUwsaUJBSkEsS0FBSyxDQUlKLElBQUksRUFBQzs7O2VBSGpCLE9BQU8sR0FBRyxjQUFjO2VBQ3hCLEtBQUssR0FBRyxFQUFFOztBQUdSLGNBQUksQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDdkIsa0JBQU0sQ0FDSCx3QkFBd0IsRUFBRSxDQUMxQixXQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQztXQUMzQyxDQUFDLENBQUM7O0FBRUgsY0FBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDbEI7O3FCQVpVLEtBQUs7O2lCQWNSLG9CQUFFOzs7QUFDTixtQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FDNUIsSUFBSSxDQUFDLFVBQUEsUUFBUTtxQkFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO2FBQUEsQ0FBQyxDQUNqQyxJQUFJLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDVixvQkFBSyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQix5QkFBVyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFBO2FBU2hELENBQUMsQ0FBQztXQUNSOzs7cUJBOUJVLEtBQUs7QUFBTCxhQUFLLEdBRGpCLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FDTixLQUFLLEtBQUwsS0FBSztlQUFMLEtBQUsiLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2luamVjdH0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnO1xuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdhdXJlbGlhLWZldGNoLWNsaWVudCc7XG5pbXBvcnQgJ2ZldGNoJztcblxuQGluamVjdChIdHRwQ2xpZW50KVxuZXhwb3J0IGNsYXNzIFVzZXJze1xuICBoZWFkaW5nID0gJ0dpdGh1YiBVc2Vycyc7XG4gIHVzZXJzID0gW107XG5cbiAgY29uc3RydWN0b3IoaHR0cCl7XG4gICAgaHR0cC5jb25maWd1cmUoY29uZmlnID0+IHtcbiAgICAgIGNvbmZpZ1xuICAgICAgICAudXNlU3RhbmRhcmRDb25maWd1cmF0aW9uKClcbiAgICAgICAgLndpdGhCYXNlVXJsKCdodHRwczovL2FwaS5naXRodWIuY29tLycpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5odHRwID0gaHR0cDtcbiAgfVxuXG4gIGFjdGl2YXRlKCl7XG4gICAgICByZXR1cm4gdGhpcy5odHRwLmZldGNoKCd1c2VycycpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVzZXJzID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgIE1hdGVyaWFsaXplLnNob3dTdGFnZ2VyZWRMaXN0KCcjc3RhZ2dlZFRoYXQnKVxyXG5cclxuICAgICAgICAgICAgLy9mb3IobGV0IHUgb2YgdGhpcy51c2Vycyl7XHJcbiAgICAgICAgICAgIC8vICAgIHRoaXMuaHR0cC5mZXRjaChcInVzZXJzL1wiK3UubG9naW4pXHJcbiAgICAgICAgICAgIC8vICAgIC50aGVuKHIgPT4gci5qc29uKCkpXHJcbiAgICAgICAgICAgIC8vICAgIC50aGVuKGQgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgdS5pbmZvID0gZDtcclxuICAgICAgICAgICAgLy8gICAgfSk7XHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgIH0pO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=