import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, fromEvent, Observable } from 'rxjs';
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
  @ViewChild('rangeInput') rangeInput: ElementRef;
  
  prvFilters: any[] = ['', -1];

  constructor(private hotelsService: HotelsService) { }

  ngOnInit(): void {}

  /**
     * display hotels according to search term. 
     * if not display all hotels
     */
  ngAfterViewInit() {
    const search$ = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map(event => event['target'].value),
        debounceTime(400),
        startWith(''),
      );

    const change$ = fromEvent(this.rangeInput.nativeElement, 'change')
      .pipe(
        map(event => event['target'].value),
        startWith(999)
      );

    this.hotels$ = combineLatest(search$, change$)
      .pipe(
        distinctUntilChanged(),
        switchMap(([search, change]) => this.loadHotels(search, change)));

  }

  /**
   * loads hotels according the search term
   * @param hotelSearchTerm a string with defaults value of empty
   * @param priceSearchTerm a number with defaults value of -1
   */
  loadHotels(hotelSearchTerm: string = '',priceSearchTerm: number = 80): Observable<Hotel[]> {
    const hotels$ = this.hotelsService.getHotels();
      return hotels$.pipe(
        map(hotels => hotels
          .filter(h => 
              h.name.trim().toLowerCase().search(hotelSearchTerm.toLowerCase()) >= 0 
              && 
              h.price <= priceSearchTerm)))
  }

}
