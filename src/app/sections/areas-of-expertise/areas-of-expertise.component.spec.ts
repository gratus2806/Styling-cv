import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasOfExpertiseComponent } from './areas-of-expertise.component';

describe('AreasOfExpertiseComponent', () => {
  let component: AreasOfExpertiseComponent;
  let fixture: ComponentFixture<AreasOfExpertiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasOfExpertiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasOfExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
