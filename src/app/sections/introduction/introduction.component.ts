import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../shared/user.service';
import { QuillEditorComponent } from 'ngx-quill';
import { debounceTime,  distinctUntilChanged} from 'rxjs/operators';

import Quill from 'quill';
const Clipboard = Quill.import('modules/clipboard')
const Delta = Quill.import('delta')

class PlainClipboard extends Clipboard {
  onPaste (e) {
    e.preventDefault()
    const range = this.quill.getSelection()
    const text = e.clipboardData.getData('text/plain')
    const delta = new Delta()
    .retain(range.index)
    .delete(range.length)
    .insert(text)
    const index = text.length + range.index
    const length = 0
    this.quill.updateContents(delta, 'silent')
    this.quill.setSelection(index, length, 'silent')
    this.quill.scrollIntoView()
  }
}

Quill.register('modules/clipboard', PlainClipboard, true)

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  title = 'Quill works!';
  hide = false;
  isReadOnly = false;
  form: FormGroup;
  public id :any;
 resumeIdArray;
 about;
 summaryArray;

  constructor(fb: FormBuilder,private userService: UserService) { 
    this.form = fb.group({
      editor: ['test']
    });
  }
  @ViewChild('editor') editor: QuillEditorComponent

  ngOnInit() {
    this.id = localStorage.getItem('resumeId');

    this.userService.getResume(this.id).subscribe((res) => {
        
      this.resumeIdArray = res['data'][0];
      this.userService.setCurrentTab(res, "section-introduction");
      var data = res['data'][0].sections;
      data.forEach(element => {
        // console.log(element)
        if(element['name'] == "Introduction" || element['name'] == "المقدمة"){
          this.summaryArray = element;
          this.about =  element.about;
        }
      });
      // console.log(this.summaryArray)
    });


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

  summaryChange(newValue) {
    console.log(newValue);
    this.summaryArray.about = newValue;
    // console.log(this.summaryArray)
    console.log(this.resumeIdArray)
    this.userService.updateresumegeneric(this.id,this.resumeIdArray).subscribe((res : any) => {
      // console.log("updateresume", res.doc._id);
      console.log(res)
      // location.reload();
    });
    
  }

  setFocus($event) {
    console.log($event);
    
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

  config = {
    toolbar : [
      ['bold', 'italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }, { 'direction': 'rtl' }, { 'align': [] }, 'clean', 'link']
    ]
  }

}
