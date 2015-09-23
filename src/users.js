import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Users{
  heading = 'Github Users';
  users = [];

  constructor(http){
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('https://api.github.com/');
    });

    this.http = http;
  }

  activate(){
      return this.http.fetch('users')
        .then(response => response.json())
        .then(data => {
            this.users = data;

            Materialize.showStaggeredList('#staggedThat')

            //for(let u of this.users){
            //    this.http.fetch("users/"+u.login)
            //    .then(r => r.json())
            //    .then(d => {
            //        u.info = d;
            //    });
            //}
        });
  }
}
