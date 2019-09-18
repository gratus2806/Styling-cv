import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameSectionComponent } from './rename-section.component';

describe('RenameSectionComponent', () => {
  let component: RenameSectionComponent;
  let fixture: ComponentFixture<RenameSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
