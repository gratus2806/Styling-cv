import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  public changeTemplateWatch = new Subject<Boolean>();
  public userDetailWatch = new Subject<JSON>();
  public personalInfoWatch = new Subject<JSON>();
  public languageChangeWatch = new Subject<string>();
  public emitTemplateChange(val) {
		this.changeTemplateWatch.next(val);
  }

  public emitProfile(val){
    this.userDetailWatch.next(val);
  }

  public emitPersonalInfo(val){
    this.personalInfoWatch.next(val);
  }

  public emitLanuage(val){
    this.languageChangeWatch.next(val);
  }
  
}
