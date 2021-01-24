import {
  ValidationRenderer,
  RenderInstruction,
  ValidateResult, ValidationController, ValidationControllerFactory
} from 'aurelia-validation';
import {inject} from "aurelia-dependency-injection";
import {I18N} from "aurelia-i18n";

@inject(I18N)
export class BootstrapFormRenderer {

  constructor(private  i18n: I18N) {
    this.i18n = i18n;}

  render(instruction: RenderInstruction) {
    for (let { result, elements } of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let { result, elements } of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  add(element: Element, result: ValidateResult) {
    const formGroup = element.closest('.form-group');
    if (!formGroup) {
      return;
    }

    if (result.valid) {
      if (!formGroup.classList.contains('has-error')) {
        formGroup.classList.add('has-success');
        const formInput = element.closest('.form-control');
        formInput.removeAttribute('style');
      }
    } else {
      // add the has-error class to the enclosing form-group div
      formGroup.classList.remove('has-success');
      formGroup.classList.add('has-error');
      const formInput = element.closest('.form-control');
      formInput.setAttribute('style', 'border : 2px solid red');
      // add help-block
      const message = document.createElement('span');
      message.className = 'help-block validation-message';
      message.style.color = 'red';
     // message.style.border = ' 2px solid red';
      message.textContent = this.i18n.tr(result.message) ;
      message.id = `validation-message-${result.id}`;
      formGroup.appendChild(message);
    }
  }

  remove(element: Element, result: ValidateResult) {
    const formGroup = element.closest('.form-group');
    if (!formGroup) {
      return;
    }

    if (result.valid) {
      if (formGroup.classList.contains('has-success')) {
        formGroup.classList.remove('has-success');
      }
    } else {
      // remove help-block
      const message = formGroup.querySelector(`#validation-message-${result.id}`);
      if (message) {
        formGroup.removeChild(message);

        // remove the has-error class from the enclosing form-group div
        if (formGroup.querySelectorAll('.help-block.validation-message').length === 0) {
          formGroup.classList.remove('has-error');
        }
      }
    }
  }
}
