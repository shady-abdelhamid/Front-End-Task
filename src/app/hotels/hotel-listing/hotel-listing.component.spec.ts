import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HotelListingComponent } from './hotel-listing.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('HotelListingComponent', () => {
  let component: HotelListingComponent;
  let fixture: ComponentFixture<HotelListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        NgbAccordionModule,
        FontAwesomeModule,
      ],
      declarations: [HotelListingComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should modify sort object when sort button clicked', () => {

    expect(component.sort.direction).toBe('asc', 'default value');
    component.sortBy('name');
    expect(component.sort.direction).toBe('desc', 'changed after click');
    component.sortBy('price');
    expect(component.sort.direction).toBe('asc', 'changed to \'asc\'');
  });
});
