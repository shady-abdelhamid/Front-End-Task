import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Hotel } from '../hotel.model';
import { HotelsService } from '../hotels.service';

@Component({
  selector: 'ft-hotel-listing',
  templateUrl: './hotel-listing.component.html',
  styleUrls: ['./hotel-listing.component.scss']
})
export class HotelListingComponent implements OnInit, AfterViewInit {
  faSearch = faSearch;

  hotels$: Observable<Hotel[]>;

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(private hotelsService: HotelsService) { }

  ngOnInit(): void {}

  /**
     * display hotels according to search term. 
     * if not display all hotels
     */
  ngAfterViewInit() {
    this.hotels$ = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event['target'].value),
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadHotels(search))
      );


  }

  /** loads hotels according the search term
   * @param hotelSearchTerm a string with defaults value of empty
   */
  loadHotels(hotelSearchTerm = ''): Observable<Hotel[]> {
    return this.hotelsService.getHotels().pipe(
      map(hotels => hotels
        .filter(h => h.name.trim().toLowerCase()
          .search(hotelSearchTerm.toLowerCase()) >= 0
        )));
  }

}
