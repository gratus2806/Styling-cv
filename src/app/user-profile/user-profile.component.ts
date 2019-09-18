import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../../app/shared/global.service';
import { UserService } from '../../app/shared/user.service';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router,ActivatedRoute ,NavigationExtras  } from "@angular/router";

@Component({
  selector: 'app-user-profile', 
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
}) 
export class UserProfileComponent implements OnInit {

    //Variable Declaration
    currentPage: string = "account";
    userdetails = {firstName: '', lastName:'', email:'', role:'', expiryDate:'', id:'', preiumMonths:'', preiumCounry:'', preiumCity:'', paymentTime:'' };
    
    user = {id: '', email: '', oldPass: '', newPass: '', repeatPass: ''};
    errorMessages: any;
    successMessages: any;

    constructor(public global: GlobalService, public userService: UserService, private modalService: NgbModal){
        this.global.userDetailWatch.subscribe(value => {

            this.userdetails.firstName = value['firstName'];
            this.userdetails.lastName = value['lastName'];
            this.userdetails.email = value['email'];
            this.userdetails.role = value['meta']['role'];
            this.userdetails.id = value['_id'];
            //this.userdetails.expiryDate = value['payment']['expiryDate'];
            // this.userdetails.preiumMonths = value['payment']['months'];
            // this.userdetails.preiumCounry = value['payment']['billingInfo']['country'];
            // this.userdetails.preiumCity = value['payment']['billingInfo']['city'];
            this.user.id = this.userdetails.id;
        })
    }
    ngOnInit() {
        this.userService.getUserProfile().subscribe(
            res => {
                var userDetails = res['user'];
                this.user.id = userDetails._id;
                this.user.email = userDetails.email;
                this.userdetails.firstName = userDetails['firstName'];
                this.userdetails.lastName = userDetails['lastName'];
                this.userdetails.email = userDetails['email'];
                this.userdetails.role = userDetails['meta']['role'];
                this.userdetails.id = userDetails['_id'];
            }, 
            err => { 
              console.log(err); 
            }
          );
        
    }
    ngAfterViewInit(){
        //this.userdetails = this.tempDetails;
        console.log(this.userdetails);
    }
    showPage(page: string) {
        this.currentPage = page;
    }

    resetForm(form: NgForm) {
        console.log(form.value);
      }

    onSubmit(form: NgForm) {
        console.log(form.value);
        this.userService.postChangePassword(form.value).subscribe(
            res => {
                if(res['status'] == false){
                    this.errorMessages = res['message'];
                    this.successMessages = '';
                } else {
                    this.successMessages = res['message'];
                    this.errorMessages = '';
                }
            },
            err => {
              if (err.status === 422) {
                
              }
            }
        );
    }
    deleteConfirmAlert(){
        const modalRef = this.modalService.open(NgbdModalUserDeleteContent);
        // modalRef.componentInstance.meta = "abc";
        modalRef.componentInstance.user_id = this.userdetails.id;
    }
}

@Component({
    selector: 'app-user-profile',
    template: `
      <div class="modal-header">
        <h2 style="color:black">Remove User</h2>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <i class="ft-x font-medium-3"></i>
        </button>
      </div>
      <form #cloneForm="ngForm" (ngSubmit)="cloneForm.valid && onSubmitDelete()">
        <div class="modal-body">
          <p>Are You Sure You want to delete your account?</p>
            <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Cancel</button>
            <button class="btn btn-raised btn-danger right"  type="submit" [disabled]="!cloneForm.valid">Yes, Delete</button>
        </div>
      </form>
      
    `
  })
  
  export class NgbdModalUserDeleteContent  {
    @Input() user_id;
  
    onSubmitDelete(){
        let data = {user_id: this.user_id};
        this.userService.deleteAccount(data).subscribe(
            res => {
                // after deleting, log out
                this.userService.deleteToken();
                this.router.navigate(['/login']);

                this.activeModal.close();
            },
            err => {
              if (err.status === 422) {
                
              }
            }
        );
      console.log(this.user_id);
      // console.log("hello")
    }
    
  
    constructor(public activeModal: NgbActiveModal,private userService: UserService,private router: Router) {}
    
  }