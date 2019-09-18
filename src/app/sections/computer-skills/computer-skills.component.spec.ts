import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerSkillsComponent } from './computer-skills.component';

describe('ComputerSkillsComponent', () => {
  let component: ComputerSkillsComponent;
  let fixture: ComponentFixture<ComputerSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComputerSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
