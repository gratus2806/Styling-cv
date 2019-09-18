import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResumeComponent } from './edit-resume.component';

describe('EditResumeComponent', () => {
  let component: EditResumeComponent;
  let fixture: ComponentFixture<EditResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
