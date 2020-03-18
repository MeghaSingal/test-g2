import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesNameFilterComponent } from './series-name-filter.component';

describe('SeriesNameFilterComponent', () => {
  let component: SeriesNameFilterComponent;
  let fixture: ComponentFixture<SeriesNameFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesNameFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesNameFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
