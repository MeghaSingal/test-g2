import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaicsFilterComponent } from './naics-filter.component';

describe('NaicsFilterComponent', () => {
  let component: NaicsFilterComponent;
  let fixture: ComponentFixture<NaicsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaicsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaicsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
