import {Aurelia} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import * as environment from '../config/environment.json';
import 'bootstrap';
import {PLATFORM} from 'aurelia-pal';
import {I18N, TCustomAttribute} from 'aurelia-i18n';
import Backend from 'i18next-http-backend'

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

 // aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
    let aliases = ['t', 'i18n'];
    // add aliases for 't' attribute
    TCustomAttribute.configureAliases(aliases);

    // register backend plugin
    instance.i18next.use(Backend);
    // adapt options to your needs (see http://i18next.com/docs/options/)
    // make sure to return the promise of the setup method, in order to guarantee proper loading
    return instance.setup({
      backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json',
      },
      attributes: aliases,
      lng : 'es',
      fallbackLng : 'en-US',
      debug : false
    });
  });

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'));
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-router'));

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
