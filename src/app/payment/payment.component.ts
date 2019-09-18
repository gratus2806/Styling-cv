import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { data } from 'app/shared/data/smart-data-table';
import {isEmpty} from 'lodash';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  userName;
  cardInfo;
  paypalcardInfo;
  cancelcardInfo
  stripecardInfo;
  windows_detail;
  alert={};
  total;
  amount;
  months;
  recursive;
  responseAmount;
  window_stripe;
  transactionId;
  constructor(public userService: UserService,private activatedRoute: ActivatedRoute) { 
    
  }

  ngOnInit() {
    this.windows_detail= window;​
    this.windows_detail.TCO.loadPubKey('sandbox')
   this.window_stripe = this.windows_detail.stripe;
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("params 2",params)
      
      if(params.type=="one_month"){
        this.amount = 17.99;
        this.months = 1;
        this.total = "17.99";
      }
      if(params.type=="three_months"){
        this.amount = 29.79;
        this.months = 3;
        this.total = 29.79 * 3;
        console.log("in 3 months",this.total)
      }
      if(params.type=="yearly"){
        this.amount = 4.99;
        this.months = 12;
        this.total = 4.99 * 12;
        console.log("in 12 months",this.total)
      }
      // this.responseAmount = params.total_amount
     this.onPaymentResponse(params['response_type']);
      this.callStripe(params)
  });

  }
  
  callStripe(params){
    if(params.payment_mode=='stripe'){
      
      //request tya subcribtion varti close live
      // /console.log("stripe par",mode['payment_mode'])
      this.stripecardInfo = {
        transactionId:params.transactionId,
        total_amount:this.total,
        months : params.response_type
      }
      this.userService.stripesuccess(this.stripecardInfo).subscribe((data) => {
        console.log("data", data);
        
        window.location.href = data['redirect_to'];
        this.close();
      }, (data)=>{
        console.log("error", data);
        window.location.href = data['error']['redirect_to'];

      })
    }
  }

  onPaymentResponse(type){
    if(type== "success"){
      
      console.log("in success if")
      this.alert ={
        type: 'success',
        message: 'Transaction Successful',
      }
      this.close();

    }
    else if(type=="error"){
      console.log("in failure if")
      this.alert ={
        type: 'danger',
        message: 'Transaction Failed Please Try Again',
      } 
      this.close()
    }
    else if (type && type.length){
      this.alert ={
        type: 'warning',
        message: 'transaction in progress.. please donot refresh!',
      }
    }
    
  }
  // close(alert: Alert) {
  //   //this.alerts.splice(this.alerts.indexOf(alert), 1);
  // 
  close(){
    setTimeout(() => this.alert = {}, 8000);
  }

  successCallback= (data)=>{
    console.log("successfuldata",data)
    this.cardInfo['token'] = data.response.token;

    this.userService.payment(this.cardInfo).subscribe(finaldata => {
      if(finaldata['status']== 1){
        this.alert ={
          type: 'success',
          message: 'Transaction Successful',
        }
      } else{
        this.alert ={
          type: 'danger',
          message: 'Transaction Failed Please Try Again',
        } 
      }
      this.close()
      
      console.log("finaldata 1",finaldata['status'])
      
    })
    
  }

  errorCallback = (data)=>{
    console.log("unsuccessfuldata",data)
    this.alert = {
      type : 'danger',
      message : data.errorMsg || "Something went wrong!"

    }
    this.close();
  }
 
  tokenRequest(){
    // Setup token request arguments
    
    this.cardInfo['publishableKey'] = environment.Towcheckout_publishableKey;
    this.cardInfo['sellerId'] =  environment.Towcheckout_sellerId;
    console.log(this.cardInfo)
    // Make the token request
    let check = this.windows_detail.TCO.requestToken(this.successCallback, this.errorCallback, this.cardInfo);
    
    // console.log("check", check);
  }
  
  onSubmit(form: NgForm) {
    this.userName = localStorage.getItem('userName');
    console.log("onSubmit function called")
    
    this.cardInfo = {
      
      ccNo: form.value.ccNumber,
      expMonth:form.value.expMonth,
      expYear:form.value.expYear,
      cvv:form.value.cvv,
      firstname:form.value.firstname,
      lastname:form.value.lastname,
      address:form.value.address,
      phone:form.value.phone,
      city:form.value.city,
      state:form.value.state,
      zipcode:form.value.zipcode,
      email:form.value.email,
      country:form.value.country,
      username:this.userName,
      months:this.months,
      total_amount:this.total,
    }
    this.tokenRequest();
    form.reset();
  }
  paypalSubmit(form: NgForm){
    this.userName = localStorage.getItem('userName');
    console.log("paypalSubmit function called")
    this.recursive = form.value.recursive
    console.log("recursive",this.recursive);
    this.paypalcardInfo = {
      billingaddress: form.value.billingaddress,
      city:form.value.city,
      phoneno:form.value.phoneno,
      country:form.value.country,
      firstname:form.value.firstname,
      lastname:form.value.lastname,
      amount_per_months: this.amount,
      total_amount:this.total,
      months:this.months,
      username:this.userName
    }
    this.alert ={
      type: 'warning',
      message: 'transaction in progress.. please donot refresh!',
    }
    // form.reset();
    console.log("paypalSubmit function called",this.paypalcardInfo)
    if(this.months == 1  ||  this.months == 12){
      this.userService.createAgreement(this.paypalcardInfo).subscribe(data => {
        this.close();
        console.log("data",data)
        if(data['approved_url']){
          console.log(data['approved_url'])
          this.windows_detail.location.href = data['approved_url'];
        }
      })
    } else{
      this.userService.paypalpayment(this.paypalcardInfo).subscribe(data => {
        this.close();
        console.log("data",data)
        if(data['approved_url']){
          console.log(data['approved_url'])
          this.windows_detail.location.href = data['approved_url'];
  
        }
  
      })
    }
    
  }

  openStripeCheckout() {
    this.userName = localStorage.getItem('userName');
    console.log("username",this.userName)
    this.paypalcardInfo = {
      username: this.userName,
      total_amount:this.total,
      months:this.months
    }
    
    this.userService.stripecheckout(this.paypalcardInfo)
    .subscribe(finaldata => {
      console.log("finaldata", finaldata);
      this.window_stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: finaldata['session']['id']
      }).then(function (result) {
        console.log("result", result);
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      });  

    });
    
  }
  cancelsubscription(){
    console.log("in cancel subscription")
    this.userName = localStorage.getItem('userName');
    this.cancelcardInfo = {
      username: this.userName,
    }
    this.userService.cancelsubscription(this.cancelcardInfo).subscribe(data => {
      console.log(">>>>>>>>>>data<<<<<<<<<",data)
      // if(data['approved_url']){
      //   console.log(data['approved_url'])
      //   this.windows_detail.location.href = data['approved_url'];

      // }

    })

  }

}
