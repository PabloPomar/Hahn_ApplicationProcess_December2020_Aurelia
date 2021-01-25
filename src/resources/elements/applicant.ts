import {bindable, PLATFORM} from 'aurelia-framework';
import {HttpClient} from "aurelia-http-client";
import {App} from "../../app";
import {I18N} from 'aurelia-i18n';
import {inject, NewInstance} from 'aurelia-dependency-injection';
import {autoinject} from 'aurelia-dependency-injection';
import {ValidationControllerFactory, ValidationController, ValidationRules, validateTrigger} from 'aurelia-validation';
import {BootstrapFormRenderer} from "../form-renderer/bootstrap-form-renderer";
import {promises} from "dns";
import {Router, RouterConfiguration} from "aurelia-router";
import {DialogService} from 'aurelia-dialog';
import {ErrorPage} from "./error-page";


const httpClient = new HttpClient()
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

const httpClientCountry = new HttpClient()
//$"https://restcountries.eu/rest/v2/name/" + CountryOfOrigin + "?fullText=true"
  .configure(x => {
    x.withBaseUrl('https://restcountries.eu/rest/v2/name/');
    x.withHeader('Accept', 'application/json');
  });

async function tryCountryApi(country) {
  //httpClientCountry.get('Argenatina?fullText=true').then(result => console.log(result.statusCode)).catch(result => console.log(result.statusCode));
  let exist = false;
  await httpClientCountry.get(country + '?fullText=true').then(result => {
    exist = true;
  }).catch(result => {
    exist = false;
  });
  return exist;
}

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
  let response = httpClient.post('Add', applicant);
  return response;
}

function upadteOneApplicant(applicant: Applicant){
  //let applicant = new Applicant(3, "Jhoseph", "Joestar", "Brookling 123", "Argentina", "jhoseph@joestar.com", 23, false);
  return httpClient.put('Update', applicant).then(result => console.log(result.response));
}

function deleteOneApplicant(ID : number){
  return httpClient.delete('Delete?ID=' + ID).then(result => console.log(result.response));
}



//addOneApplicant();

//trylanguajesApi();

getAllApllicants();

//upadteOneApplicant();

//getOneApllicants(1);

//deleteOneApplicant(2);

@inject(I18N, ValidationController, ValidationControllerFactory, Router, DialogService)
export class Applicant {
  @bindable id = 0
  @bindable name = '';
  @bindable familyName  = '';
  @bindable address = '';
  @bindable countryOfOrigin  = '';
  @bindable eMailAdress  = '';
  @bindable age = 0;
  @bindable hired = false;
  @bindable canReset = false;
  @bindable canSave = false;
  //static inject = [I18N];
  //private i18n: I18N;

  constructor(private  i18n: I18N, private controller: ValidationController,private validationControllerFactory : ValidationControllerFactory, private  router: Router, private dialogService:DialogService, ID: number, Name: string, FamilyName: string, Address: string , CountryOfOrigin: string, EMailAdress: string, Age : number, hired : boolean) {
    this.i18n = i18n;
    this.router = router;
    this.dialogService = dialogService;
    this.canReset = false;
    this.canSave = false;
    this.controller = validationControllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.manual;
    this.controller.addRenderer(new BootstrapFormRenderer(this.i18n));
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
  }
  goToSuccess() {
    this.router.navigate("/success")
  }

  async goToError(messages: string) {
    messages = await messages.replace( /\\r\\n/gi , "///////"  )
    messages = await messages.replace( /"/gi , " "  )
    let errormod = { errorMessage: this.i18n.tr('ERRORAPL'), errorSummary: messages  }
    console.log(errormod);
    await this.dialogService.open({viewModel: ErrorPage, model: errormod, lock: false}).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('good');
      } else {
        console.log('bad');
      }
      //await this.router.navigate("/error");
      //document.getElementById("errorsLab").innerHTML = messages;
    })
  }

   submit() {
    if(this.hired === null){
      this.hired = false;
    }
   this.controller.validate()
      .then(async result => {
        if (result.valid) {
         // alert("Success my man");
          const saveApplicant = {ID: this.id, name : this.name, familyName: this.familyName, address : this.address, countryOfOrigin : this.countryOfOrigin, eMailAdress:this.eMailAdress, age: this.age , hired: this.hired};
          let Messageresponse = await addOneApplicant(saveApplicant);
          await console.log(Messageresponse);
          if(Messageresponse.statusCode === 201){
            this.goToSuccess();
          } else {
            let errors = Messageresponse.response;
            await this.goToError(errors);
          }
        } else {
        //  alert("Failure my man");
        }
      });
  }

  checkInputChances(){
    if((this.name === null || this.name === '' || this.name === undefined) &&
       (this.familyName === null || this.familyName === '' || this.familyName === undefined) &&
       (this.address === null || this.address === '' || this.address === undefined) &&
       (this.countryOfOrigin === null || this.countryOfOrigin === '' || this.countryOfOrigin === undefined) &&
       (this.eMailAdress === null || this.eMailAdress === ''  || this.eMailAdress === undefined) &&
       (this.age === null  || this.age === undefined || this.age === 0 || !this.age)) {
      this.canReset = false
    } else {
      this.canReset = true
    }
    if(this.name === null || this.name === '' || this.name === undefined
      || this.familyName === null || this.familyName === '' || this.familyName === undefined
      || this.address === null || this.address === '' || this.address === undefined
      || this.countryOfOrigin === null || this.countryOfOrigin === '' || this.countryOfOrigin === undefined
      || this.eMailAdress === null || this.eMailAdress === ''  || this.eMailAdress === undefined
      || this.age === null  || this.age === undefined || !this.age){
      this.canSave = false
    } else {
      this.controller.validate().then(result => {
        if (result.valid) {
          this.canSave = true
        } else {
          this.canSave = false
        }
      });
    }
  }

  resetForm(){
    const result = confirm(this.i18n.tr('CLEAREDFORM'));
    const butRes = document.getElementById('resButton');
    const form = butRes.closest('form');
    if(result){
      form.reset();
      this.canReset = false
    }
  }



}

ValidationRules.customRule(
  'countryExist',
  (value, obj) => value === null || value === undefined
    || tryCountryApi(value),
  `\${$displayName} must exist`
);


ValidationRules
  .ensure("name").required().withMessage(`this field is required`).minLength(5).withMessage("The name must have at least 5 characters")
  .ensure("familyName").required().withMessage(`this field is required`).minLength(5).withMessage("The family name must contain at least 5 characters")
  .ensure("address").required().withMessage(`this field is required`).minLength(10).withMessage("The adress must have be at least 10 characters long")
  .ensure("countryOfOrigin").required().withMessage(`this field is required`).satisfiesRule('countryExist').withMessage("The country must exist")
  .ensure("eMailAdress").required().withMessage(`this field is required`).email().withMessage("The Email Adress must be valid (it must contain an '@' character)")
  .ensure("age").required().withMessage(`this field is required`).between(20,60).withMessage("The age field must be between 20 and 60 years old")
  .on(Applicant);




