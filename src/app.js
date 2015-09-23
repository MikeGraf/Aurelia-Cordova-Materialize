import {inject} from './aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class App {
    constructor(events) {
        // subscribe to the router's navigation complete event.
        events.subscribe('router:navigation:complete', this.navigationComplete);
    }

  configureRouter(config, router){
    config.title = 'Aurelia';
    config.map([
      { route: ['','welcome'],  name: 'welcome',      moduleId: 'welcome',      nav: true, title:'Welcome' },
      { route: 'users',         name: 'users',        moduleId: 'users',        nav: true, title:'Github Users' },
      { route: 'child-router',  name: 'child-router', moduleId: 'child-router', nav: true, title:'Child Router' }
    ]);

    this.router = router;
    }

  navigationComplete(navigationInstruction) {
      // Enable the materialize "waves" effect on the new page.
      Waves.displayEffect();
  }

  attached(){
      $(".button-collapse").sideNav({
          closeOnClick: true
      });
  }
}
