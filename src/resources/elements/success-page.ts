import {bindable} from 'aurelia-framework';
import {inject} from "aurelia-dependency-injection";
import {I18N} from "aurelia-i18n";

/// <summary>
/// The page shows that the applicant was successfully added.
/// </summary>


@inject(I18N)
export class SuccessPage {
  @bindable successMessage = '';


  constructor(private  i18n: I18N) {
    this.i18n = i18n;
    this.successMessage = i18n.tr('SUCCESSAPL');
  }
  valueChanged(newValue, oldValue) {
    //
  }
}
