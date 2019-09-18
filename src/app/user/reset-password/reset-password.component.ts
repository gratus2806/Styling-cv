import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UserService } from '../../shared/user.service';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [UserService]
})
export class ResetPasswordComponent implements OnInit {

  constructor(public userService: UserService, public router : Router, public route: ActivatedRoute, public modalService: NgbModal) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log("url id ", id);
  }

  onSubmit(form: NgForm) {

    const id = this.route.snapshot.paramMap.get('id');
    console.log("url id ", id);
    console.log("url id onSubmit", id);
    console.log("url id typeof" + typeof(id));

    console.log("form.value " , form.value.password)
    form.value.id = id;
  
    this.userService.resetPassword(form.value).subscribe(
      res => {
        //Open modal here
        const modalRef = this.modalService.open(ResetPasswordModalContent ,{ size: 'lg' });
        // modalRef.componentInstance.meta = "abc";
        modalRef.componentInstance.meta = "abc";
      },
      err => {
        if (err.status === 422) {
          // this.serverErrorMessages = err.error.join('<br/>');
        }
        else{

        }
        // this.serverErrorMessages = 'Something went wrong.Please contact admin.';
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
        <a>Your password has been reset successfully!</a>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-custom right" type="submit" (click)="Ok()">OK</button>
      </div>
    </form>
    </div>
  `
})
export class ResetPasswordModalContent  {
  @Input() meta;
  @Input() array;

  showMainContent1: Boolean = true;
  showMainContent2: Boolean = true;
  
  Ok(form : NgForm,data) {
    this.activeModal.close();
    this.router.navigate(['/login']);
  }
  constructor(public activeModal: NgbActiveModal,private userService: UserService,private router: Router) {}
  
}