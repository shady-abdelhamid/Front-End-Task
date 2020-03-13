import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelsRoutingModule } from './hotels-routing.module';
import { HotelsComponent } from './hotels.component';
import { HotelListingComponent } from './hotel-listing/hotel-listing.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { HotelsService } from './hotels.service';

@NgModule({
  declarations: [HotelsComponent, HotelListingComponent],
  imports: [
    CommonModule,
    HotelsRoutingModule,
    HttpClientModule,
    NgbAccordionModule,
    FontAwesomeModule,
  ],
  providers: [
    HotelsService
  ]
})
export class HotelsModule { }
