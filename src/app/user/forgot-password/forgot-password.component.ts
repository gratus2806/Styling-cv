import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from '../../shared/user.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  serverErrorMessages: string;
  constructor(public userService: UserService, public router : Router, public modalService: NgbModal) { }
  model ={
    email :''
    };
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  ngOnInit() {
  }

  onSubmit(form : NgForm) {
    // this.forogtPasswordForm.reset();
    console.log("on submit function called")
    console.log("form " , form.value);
    this.userService.forgotPassword(form.value).subscribe(
      res => {
        console.log("sent")
        // this.data ['userId'] = form.value;
      const modalRef = this.modalService.open(ForgotPasswordModalContent ,{ size: 'lg' });
      // modalRef.componentInstance.meta = "abc";
      modalRef.componentInstance.meta = "abc";
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );
  }

  // On login link click
  onLogin() {
    // this.router.navigate(['login'], { relativeTo: this.route.parent });
    this.router.navigate(['login']);
  }

  // On registration link click
  onRegister() {
    // this.router.navigate(['register'], { relativeTo: this.route.parent });
    this.router.navigate(['signup']);
  }

}


@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="modal-header">

      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <i class="ft-x font-medium-3"></i>
      </button>
    </div>
    <div *ngIf="showMainContent1">
    <form #cloneForm="ngForm">
      <div class="modal-body">
        <p></p>
        <div class = "col-sm-6">
        <a>Link to reset your password has been sent to your email address</a>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-custom right" type="submit" (click)="Ok()">OK</button>
      </div>
    </form>
    </div>
  `
})
export class ForgotPasswordModalContent  {
  @Input() meta;
  @Input() array;

  showMainContent1: Boolean = true;
  showMainContent2: Boolean = true;
  
  Ok(form : NgForm,data) {
    this.activeModal.close();
    this.router.navigate(['/signup']);
  }
  constructor(public activeModal: NgbActiveModal,private userService: UserService,private router: Router) {}
  
}