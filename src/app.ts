import {HttpClient} from 'aurelia-http-client';
import {Applicant} from 'resources/elements/applicant'
import {bootstrap} from "aurelia-bootstrapper";
import { PLATFORM } from "aurelia-framework";
import {RouterConfiguration, Router} from 'aurelia-router';

//require('bootstrap/dist/css/bootstrap.min.css');
//require('bootstrap/bootstrap.bundle');
//require('aurelia-form-renderer-bootstrap');






export class App {
  configureRouter(config: RouterConfiguration, router: Router): void {
    console.log("Modulo" + PLATFORM.moduleName('resources/elements/applicant'))
    config.map([
      { route: ['', 'applicant'],   name: 'home',    moduleId: PLATFORM.moduleName('resources/elements/applicant') ,  nav: true, title:'Applicant' },
      { route:  'success',   name: 'success',    moduleId: PLATFORM.moduleName('resources/elements/success-page') ,  nav: true, title:'Success' },
      { route:  'error',   name: 'error',    moduleId: PLATFORM.moduleName('resources/elements/error-page') ,  nav: true, title:'Error' }
    ]);
  }

}
