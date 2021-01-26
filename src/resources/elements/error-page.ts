import {bindable} from 'aurelia-framework';
import {inject} from "aurelia-dependency-injection";
import {I18N} from "aurelia-i18n";
import {DialogController} from 'aurelia-dialog';

/// <summary>
/// The page shows the errors if the form fails.
/// </summary>


@inject(I18N, DialogController)
export class ErrorPage {
  @bindable errorMessage;
  @bindable errorSummary;
  errormod = { errorMessage: '', errorSummary: ''  }

  constructor(private  i18n: I18N, private  dialogController: DialogController) {
    this.i18n = i18n;
    this.dialogController = dialogController;
  }

  activate(errormod){
    this.errormod = errormod;
  }
}


