import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Resumes } from  './resume.model';
import { Download } from  './download.model';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { $ } from 'protractor';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { subSeconds } from 'date-fns';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private abc = new Subject<any>();
  private subject = new Subject<any>();
  apiURL: string = 'http://localhost:3000/order';

  
  private modal_data = new Subject<any>();

  // private userIdSource = new BehaviorSubject<number>(0);
  // currentUser = this.userIdSource.asObservable();

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();


  // modal_data_variable = this.modal_data.asObservable();
  
  selectedUser: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    preferred_language: ''
  };

  selectedDownload: Download = {
    resumeId: '',
      pageSize: '',
      userId: ''
  }

  // selectedResume : Resumes = {

  // }; 

  public hero: any

  selectedResume: Resumes;
  resume: Resumes[];
  data: {};

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  userID ;  
  //HttpMethods
  payment(cardinfo){
    return this.http.post(environment.apiBaseUrl+'/order',cardinfo);
  }
  paypalpayment(paypalcardInfo){
    return this.http.post(environment.apiBaseUrl+'/paypalorder',paypalcardInfo);
  }
  cancelsubscription(cancelcardInfo){
    return this.http.post(environment.apiBaseUrl+'/cancelsubscription',cancelcardInfo);
  }
  createAgreement(paypalcardInfo){
    return this.http.post(environment.apiBaseUrl+'/createAgreement',paypalcardInfo);
  }
  stripecheckout(userName){
    return this.http.post(environment.apiBaseUrl+'/stripecheckout',userName);
  }
  stripesuccess(stripecardInfo){
    return this.http.post(environment.apiBaseUrl+'/stripesuccess',stripecardInfo);
  }

  postUser(user: User){
    return this.http.post(environment.apiBaseUrl+'/register',user,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials,this.noAuthHeader);
   
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }
  
  getResumeList(){
    return this.http.get(environment.apiBaseUrl + '/resumeList' + `/${this.userID}`);
  }

  renderTemplate(userSlug: string, resumeSlug: string){
    return this.http.get(environment.apiBaseUrl + '/renderTemplate' + `/${userSlug}` + `/${resumeSlug}`);
  }
  getTemplates(){
    return this.http.get(environment.apiBaseUrl + '/getTemplates');
  }
  getResume(id: string){
    return this.http.get(environment.apiBaseUrl + '/getResume' + `/${id}`);
  }
 
  forgotPassword(user: User){
    return this.http.post(environment.apiBaseUrl+'/forgotPassword',user,this.noAuthHeader);
  }


  resetPassword(user: User){
    return this.http.post(environment.apiBaseUrl+'/resetPassword',user,this.noAuthHeader);
  }

  deleteResume(_id: string) {
    return this.http.delete(environment.apiBaseUrl + '/resumeDelete'  + `/${_id}`);
  }

  resumeSave (resume){
    return this.http.post(environment.apiBaseUrl + '/resumesave',resume);
  }

  updateresume (id : string, resume){
    return this.http.put(environment.apiBaseUrl + '/updateResume' + `/${id}`, resume); 
  }

  download (downloadData: Download){
    return this.http.post(environment.apiBaseUrl + '/download', downloadData, this.noAuthHeader); 
  }

  updateresumegeneric (id : string, resume){
    return this.http.put(environment.apiBaseUrl + '/updateResumeGeneric' + `/${id}`, resume);
  }
  updateresumetemplate (id : string, template){
    return this.http.put(environment.apiBaseUrl + '/updateResumeTemplate' + `/${id}`, template);
  }
  saveBase64File(subsection : any){
    // console.log("IN SERVICES", subsection);
    return this.http.post(environment.apiBaseUrl+ '/upload-base64-file',  subsection);
  }
  saveBase64PersonalLogo(data:any){
    console.log(data);
    return this.http.post(environment.apiBaseUrl+ '/upload-base64-personal-logo',  data);
  }
  updatePersonalLogo(data:any){
    return this.http.post(environment.apiBaseUrl+ '/updatePersonalLogo',  data);
  }
  updateresumegenericsubject(id : string, resume){
    this.subject.next(resume);

    return this.http.put(environment.apiBaseUrl + '/updateResumeGeneric' + `/${id}`, resume);
  }
  downloadResume(urlSearchParams){
    return this.http.post(environment.apiBaseUrl +'/download', urlSearchParams, { responseType: 'arraybuffer' })
  }
  postChangePassword(user:any){
    return this.http.post(environment.apiBaseUrl + '/changePassword', user);
  }

  deleteAccount(data:any){
    return this.http.post(environment.apiBaseUrl + '/deleteAccount', data);
  }
  // modaldata(id  : string,sectionicon : string , sectionname : string , sectionArray,resumeIdArray,iconsArray){
  modaldata(message){
    this.modal_data.next(message)

  }


  // setUser(userid: number) {
  //   console.log("message")
  //   this.userIdSource.next(userid)
  // }
  changeMessage(message: string) {
    this.messageSource.next(message)
  }
 





  sendMessage(message: string){
    this.abc.next({ text: message });
  }

  getabcMessage(): Observable<any> {
    return this.abc.asObservable();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  getModaldata(): Observable<any> {
    return this.modal_data.asObservable();
  }



  savePreferredLangugage (user : User){
    return this.http.post(environment.apiBaseUrl+'/savePreferredLanguage', user);
    
  }
  linkedinlogin(){
    console.log("linkedinlogin service called")
    // let url = 'http://localhost:3000/api/auth/linkedin';
    // let url = 'http://localhost:3000/api/user'; 
    var callback = console.log;
    let url = 'http://127.0.0.1:3000/api/auth/linkedin';
    // window.callback = () => console.log('');
    // let headers = new HttpHeaders({'Access-Control-Allow-Origin':'*'});
    // return this.http.get('http://127.0.0.1:3000/api/auth/linkedin',headers);
    // return this.http.get(url,this.noAuthHeader);
    return this.http.jsonp(url, 'callback');
  }
  callback = console.log;
  

  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      this.userID = (JSON.parse(userPayload)._id);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }
  

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }

  getSingleSection(sectionId){
    return this.http.get(environment.apiBaseUrl + '/sections' + `/${sectionId}`);
  }

  getApiUrl(){
    return environment.baseUrl;
  }
  
  setCurrentTab(res:any, type:any){
    var data = res['data'][0].sections;

    data.forEach((element, key) => {
        if(element.type == type){
          localStorage.setItem("currentTab", key);
        }
    });
  }
}