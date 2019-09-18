import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../shared/user.service';
import { data } from 'app/shared/data/smart-data-table';
import { Subscription } from 'rxjs';
// import { ModalDirective } from 'ng-uikit-pro-standard';


@Component({
    selector: 'ngbd-modal-content',
    template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <i class="ft-x font-medium-3"></i>
      </button>
    </div>
    <div class="modal-body">
      <p>Hello, {{name}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary btn-raised" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})

export class NgbdModalContent {
    @Input() name;
    constructor(public activeModal: NgbActiveModal) { }
}


@Component({
    selector: 'app-modals',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ModalsComponent implements OnInit {
    userId: number = 0;

    closeResult: string;
    subscription: Subscription;
    message: any;
    constructor(private modalService: NgbModal,public userService : UserService) {
        // this.getUser();

        // this.subscription = this.userService.getMessage().subscribe(message => { this.message = message; 
        //     console.log(this.message);
        //     // this.resumeIdArray = this.message;
        //     // console.log(this.resumeIdArray);
        //     // this.ngOnInit()
        //   });

          // this.subscription = this.userService.getabcMessage().subscribe(message => { this.message = message; 
          //   console.log(this.message);
          //   // this.resumeIdArray = this.message;
          //   // console.log(this.resumeIdArray);
          //   // this.ngOnInit()
          // });
     }

    ngOnInit() {
        // this.getUser();

        console.log("hello u enter modal comp")
        this.userService.currentMessage.subscribe(message => {
          this.message = message
          console.log(this.message)
        })


    }

    // Open default modal
    open(content) {
      console.log(content)
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    // This function is used in open
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    // Open modal with dark section
    openModal(customContent) {
        this.modalService.open(customContent, { windowClass: 'dark-modal' });
    }

    // Open content with dark section
    openContent() {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name = 'World';
    }
}

