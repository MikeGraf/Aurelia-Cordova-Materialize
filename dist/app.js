System.register(['./aurelia-dependency-injection', 'aurelia-event-aggregator'], function (_export) {
    'use strict';

    var inject, EventAggregator, App;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_aureliaDependencyInjection) {
            inject = _aureliaDependencyInjection.inject;
        }, function (_aureliaEventAggregator) {
            EventAggregator = _aureliaEventAggregator.EventAggregator;
        }],
        execute: function () {
            App = (function () {
                function App(events) {
                    _classCallCheck(this, _App);

                    events.subscribe('router:navigation:complete', this.navigationComplete);
                }

                _createClass(App, [{
                    key: 'configureRouter',
                    value: function configureRouter(config, router) {
                        config.title = 'Aurelia';
                        config.map([{ route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome' }, { route: 'users', name: 'users', moduleId: 'users', nav: true, title: 'Github Users' }, { route: 'child-router', name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' }]);

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
                        $(".button-collapse").sideNav({
                            closeOnClick: true
                        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7aUNBSWEsR0FBRzs7Ozs7Ozs7aURBSlIsTUFBTTs7c0RBQ04sZUFBZTs7O0FBR1YsZUFBRztBQUNELHlCQURGLEdBQUcsQ0FDQSxNQUFNLEVBQUU7OztBQUVoQiwwQkFBTSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDM0U7OzZCQUpRLEdBQUc7OzJCQU1DLHlCQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUM7QUFDN0IsOEJBQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ3pCLDhCQUFNLENBQUMsR0FBRyxDQUFDLENBQ1QsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUMsU0FBUyxDQUFDLEVBQUcsSUFBSSxFQUFFLFNBQVMsRUFBTyxRQUFRLEVBQUUsU0FBUyxFQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLFNBQVMsRUFBRSxFQUN0RyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBUyxRQUFRLEVBQUUsT0FBTyxFQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLGNBQWMsRUFBRSxFQUMzRyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUcsSUFBSSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLGNBQWMsRUFBRSxDQUM1RyxDQUFDLENBQUM7O0FBRUgsNEJBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO3FCQUNwQjs7OzJCQUVlLDRCQUFDLHFCQUFxQixFQUFFO0FBRXRDLDZCQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7cUJBQ3pCOzs7MkJBRU8sb0JBQUU7QUFDTix5QkFBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzFCLHdDQUFZLEVBQUUsSUFBSTt5QkFDckIsQ0FBQyxDQUFDO3FCQUNOOzs7MkJBMUJVLEdBQUc7QUFBSCxtQkFBRyxHQURmLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FDWCxHQUFHLEtBQUgsR0FBRzt1QkFBSCxHQUFHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aW5qZWN0fSBmcm9tICcuL2F1cmVsaWEtZGVwZW5kZW5jeS1pbmplY3Rpb24nO1xuaW1wb3J0IHtFdmVudEFnZ3JlZ2F0b3J9IGZyb20gJ2F1cmVsaWEtZXZlbnQtYWdncmVnYXRvcic7XG5cbkBpbmplY3QoRXZlbnRBZ2dyZWdhdG9yKVxuZXhwb3J0IGNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoZXZlbnRzKSB7XG4gICAgICAgIC8vIHN1YnNjcmliZSB0byB0aGUgcm91dGVyJ3MgbmF2aWdhdGlvbiBjb21wbGV0ZSBldmVudC5cbiAgICAgICAgZXZlbnRzLnN1YnNjcmliZSgncm91dGVyOm5hdmlnYXRpb246Y29tcGxldGUnLCB0aGlzLm5hdmlnYXRpb25Db21wbGV0ZSk7XG4gICAgfVxuXG4gIGNvbmZpZ3VyZVJvdXRlcihjb25maWcsIHJvdXRlcil7XG4gICAgY29uZmlnLnRpdGxlID0gJ0F1cmVsaWEnO1xuICAgIGNvbmZpZy5tYXAoW1xuICAgICAgeyByb3V0ZTogWycnLCd3ZWxjb21lJ10sICBuYW1lOiAnd2VsY29tZScsICAgICAgbW9kdWxlSWQ6ICd3ZWxjb21lJywgICAgICBuYXY6IHRydWUsIHRpdGxlOidXZWxjb21lJyB9LFxuICAgICAgeyByb3V0ZTogJ3VzZXJzJywgICAgICAgICBuYW1lOiAndXNlcnMnLCAgICAgICAgbW9kdWxlSWQ6ICd1c2VycycsICAgICAgICBuYXY6IHRydWUsIHRpdGxlOidHaXRodWIgVXNlcnMnIH0sXG4gICAgICB7IHJvdXRlOiAnY2hpbGQtcm91dGVyJywgIG5hbWU6ICdjaGlsZC1yb3V0ZXInLCBtb2R1bGVJZDogJ2NoaWxkLXJvdXRlcicsIG5hdjogdHJ1ZSwgdGl0bGU6J0NoaWxkIFJvdXRlcicgfVxuICAgIF0pO1xuXG4gICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXI7XG4gICAgfVxuXG4gIG5hdmlnYXRpb25Db21wbGV0ZShuYXZpZ2F0aW9uSW5zdHJ1Y3Rpb24pIHtcbiAgICAgIC8vIEVuYWJsZSB0aGUgbWF0ZXJpYWxpemUgXCJ3YXZlc1wiIGVmZmVjdCBvbiB0aGUgbmV3IHBhZ2UuXG4gICAgICBXYXZlcy5kaXNwbGF5RWZmZWN0KCk7XG4gIH1cblxuICBhdHRhY2hlZCgpe1xuICAgICAgJChcIi5idXR0b24tY29sbGFwc2VcIikuc2lkZU5hdih7XHJcbiAgICAgICAgICBjbG9zZU9uQ2xpY2s6IHRydWVcclxuICAgICAgfSk7XHJcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9