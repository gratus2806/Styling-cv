import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { QuillEditorComponent } from 'ngx-quill';

import { debounceTime,  distinctUntilChanged} from 'rxjs/operators';

import Quill from 'quill';
@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {

   //declarations
title = 'Quill works!';
hide = false;
isReadOnly = false;
form: FormGroup;

startDatesArr = [
  { id: 1, name: 'Help Desk' },
  { id: 2, name: 'HR' },
  { id: 3, name: 'IT' },
  { id: 4, name: 'Payroll' }
];

constructor(fb: FormBuilder) {
  this.form = fb.group({
    editor: ['test']
  });
}
@ViewChild('editor') editor: QuillEditorComponent

  ngOnInit() {
    this.form
      .controls
      .editor
      .valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(data => {
        console.log('native fromControl value changes with debounce', data)
      });

    this.editor
      .onContentChanged
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(data => {
        console.log('view child + directly subscription', data)
      });
  }
   //events starts
   setFocus($event) {
    $event.focus();
  }

  patchValue() {
    this.form.controls['editor'].patchValue(`${this.form.controls['editor'].value} patched!`)
  }

  toggleReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }

  logChange($event: any) {
    //your code here
  }

  logSelection($event: any) {
    //your code here
  }
  //events ends
  add = false;
  list = true;

  onAdd(){
    console.log("onAdd function called")
    this.add = true;
  this.list = false;
  }


}
