import {bindable} from 'aurelia-framework';
import {HttpClient} from "aurelia-http-client";
import {App} from "../../app";
import {I18N} from 'aurelia-i18n';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import {autoinject} from 'aurelia-dependency-injection';
import {ValidationControllerFactory, ValidationController, ValidationRules} from 'aurelia-validation';

let httpClient = new HttpClient()
  .configure(x => {
    x.withBaseUrl('https://localhost:5001/');
    x.withHeader('Accept', 'application/json');
    x.withInterceptor({
      request(message) {
        return message;
      },

      requestError(error) {
        throw error;
      },

      response(message) {
        return message;
      },

      responseError(error) {
        return error;
      }
    });
  });



function getAllApllicants(){
  httpClient.get('GetAll').then(result => console.log(result.response));
}

function getOneApllicants(ID : number){
  return  httpClient.get('GetOne?ID=' + ID).then(result => console.log(result.response));
}

/*function addOneApplicant(){
  //let applicant = new Applicant(3, "Jhoseph", "Joestar", "Brookling 123", "Argentina", "jhoseph@joestar.com", 23, true);
  let applicant = new Applicant(3, "fai", "fai", "fai", "fai", "fai", 15, false);
    httpClient.post('Add', applicant).then(result => console.log(result.response));
}*/

function addOneApplicant(applicant){
  httpClient.post('Add', applicant).then(result => console.log(result));
}

function upadteOneApplicant(applicant: Applicant){
  //let applicant = new Applicant(3, "Jhoseph", "Joestar", "Brookling 123", "Argentina", "jhoseph@joestar.com", 23, false);
  return httpClient.put('Update', applicant).then(result => console.log(result.response));
}

function deleteOneApplicant(ID : number){
  return httpClient.delete('Delete?ID=' + ID).then(result => console.log(result.response));
}

//addOneApplicant();

getAllApllicants();

//upadteOneApplicant();

//getOneApllicants(1);

//deleteOneApplicant(2);

@inject(I18N, ValidationController, ValidationControllerFactory)
export class Applicant {
  @bindable id = 0
  @bindable name = '';
  @bindable familyName  = '';
  @bindable address = '';
  @bindable countryOfOrigin  = '';
  @bindable eMailAdress  = '';
  @bindable age = 0;
  @bindable hired = false;
  //static inject = [I18N];
  //private i18n: I18N;

  constructor(private  i18n: I18N, private controller: ValidationController,private validationControllerFactory : ValidationControllerFactory, ID: number, Name: string, FamilyName: string, Address: string , CountryOfOrigin: string, EMailAdress: string, Age : number, hired : boolean) {
    this.i18n = i18n;

    controller = validationControllerFactory.createForCurrentScope();
    console.log(ValidationControllerFactory);
    console.log(this.controller);
    console.log(i18n);
    console.log(this.i18n.getLocale());
    console.log(this.i18n.tr('name'.toUpperCase()));
    console.log(this.i18n.tr('Country of Origin'.toUpperCase()));
    this.id = ID;
    this.name = Name;
    this.familyName = FamilyName;
    this.address = Address;
    this.countryOfOrigin = CountryOfOrigin;
    this.eMailAdress = EMailAdress;
    this.age = Age;
    this.hired = hired;
    ValidationRules
      .ensure("name").required().minLength(5)
      .ensure("familyName").required().minLength(6).on(this);
  }

  submit() {
    if(this.hired === null){
      this.hired = false;
    }
   this.controller.validate()
      .then(result => {
        if (result.valid) {
          alert("Success my man");
          let saveApplicant = {ID: this.id, name : this.name, familyName: this.familyName, address : this.address, countryOfOrigin : this.countryOfOrigin, eMailAdress:this.eMailAdress, age: this.age , hired: this.hired};
          console.log(saveApplicant)
          addOneApplicant(saveApplicant);
        } else {
          alert("Failure my man");
        }
      });
  }
  valueChanged(newValue, oldValue) {
    //
  }
}



