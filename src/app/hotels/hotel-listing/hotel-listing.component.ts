import { Component, OnInit } from '@angular/core';
import { Hotel } from '../hotel.model';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { HotelsService } from '../hotels.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ft-hotel-listing',
  templateUrl: './hotel-listing.component.html',
  styleUrls: ['./hotel-listing.component.scss']
})
export class HotelListingComponent implements OnInit {
  faSearch = faSearch;
  
  hotels$: Observable<Hotel[]>;

  constructor(private hotelsService: HotelsService) { }

  ngOnInit(): void {
    this.hotels$ = this.hotelsService.getHotels();
  }

}
