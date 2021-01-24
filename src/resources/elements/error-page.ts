import {bindable} from 'aurelia-framework';
import {inject} from "aurelia-dependency-injection";
import {I18N} from "aurelia-i18n";

@inject(I18N)
export class ErrorPage {
  @bindable errorMessage;

  constructor(private  i18n: I18N) {
    this.i18n = i18n;
    this.errorMessage = i18n.tr('ERRORAPL');
  }
  valueChanged(newValue, oldValue) {
    //
  }
}
