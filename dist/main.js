System.register(['Dogfalo/materialize'], function (_export) {
  'use strict';

  var materialize;

  _export('configure', configure);

  function configure(aurelia) {
    aurelia.use.standardConfiguration().developmentLogging();

    aurelia.start().then(function (a) {
      return a.setRoot();
    });
  }

  return {
    setters: [function (_DogfaloMaterialize) {
      materialize = _DogfaloMaterialize['default'];
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVPLFdBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRTtBQUNqQyxXQUFPLENBQUMsR0FBRyxDQUNSLHFCQUFxQixFQUFFLENBRXZCLGtCQUFrQixFQUFFLENBQUM7O0FBU3hCLFdBQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTtLQUFBLENBQUMsQ0FBQztHQUN4QyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1hdGVyaWFsaXplIGZyb20gJ0RvZ2ZhbG8vbWF0ZXJpYWxpemUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGF1cmVsaWEpIHtcbiAgYXVyZWxpYS51c2VcbiAgICAuc3RhbmRhcmRDb25maWd1cmF0aW9uKClcbiAgICAvLy5wbHVnaW4oJ2F1cmVsaWEtbWF0ZXJpYWxpemUnKVxuICAgIC5kZXZlbG9wbWVudExvZ2dpbmcoKTtcblxuICAvL1VuY29tbWVudCB0aGUgbGluZSBiZWxvdyB0byBlbmFibGUgYW5pbWF0aW9uLlxuICAvL2F1cmVsaWEudXNlLnBsdWdpbignYXVyZWxpYS1hbmltYXRvci1jc3MnKTtcblxuICAvL0FueW9uZSB3YW50aW5nIHRvIHVzZSBIVE1MSW1wb3J0cyB0byBsb2FkIHZpZXdzLCB3aWxsIG5lZWQgdG8gaW5zdGFsbCB0aGUgZm9sbG93aW5nIHBsdWdpbi5cbiAgICAvL2F1cmVsaWEudXNlLnBsdWdpbignYXVyZWxpYS1odG1sLWltcG9ydC10ZW1wbGF0ZS1sb2FkZXInKVxuICAvL2F1cmVsaWEudXNlLnBsdWdpbignYXVyZWxpYS1odG1sLWltcG9ydC10ZW1wbGF0ZS1sb2FkZXInKVxuXG4gIGF1cmVsaWEuc3RhcnQoKS50aGVuKGEgPT4gYS5zZXRSb290KCkpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9