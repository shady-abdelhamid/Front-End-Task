/* tslint:disable */
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Hotel, Sort } from '../hotel.model';
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
  @ViewChild('nameSortInput') nameSortInput: ElementRef;
  @ViewChild('priceSortInput') priceSortInput: ElementRef;

  sort: Sort = {
    active: 'name',
    direction: 'asc',
  };

  constructor(private hotelsService: HotelsService) { }

  ngOnInit(): void { }

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

    const sort1$ = fromEvent(this.nameSortInput.nativeElement, 'click').pipe(map(_ => 'sort'));
    const sort2$ = fromEvent(this.priceSortInput.nativeElement, 'click').pipe(map(_ => 'sort'));


    /**
     * Combine filters and sortable criteria
     */
    this.hotels$ = combineLatest(search$, change$, sort1$, sort2$)
      .pipe(
        distinctUntilChanged(),
        switchMap(([search, change]) => this.loadHotels(search, change)));

  }

  /**
   * loads hotels according the search term
   * @param hotelSearchTerm a string with defaults value of empty
   * @param priceSearchTerm a number with defaults value of -1
   */
  loadHotels(hotelSearchTerm: string = '', priceSearchTerm: number = 80): Observable<Hotel[]> {
    const hotels$ = this.hotelsService.getHotels();
    return hotels$.pipe(
      map(hotels => hotels
        .filter(h =>
          h.name.trim().toLowerCase().search(hotelSearchTerm.toLowerCase()) >= 0
          &&
          h.price <= priceSearchTerm)
        .sort((a, b) => {
          const isAsc = this.sort.direction === 'asc';
          switch (this.sort.active) {
            case 'name': return this.compare(a.name, b.name, isAsc);
            case 'price': return this.compare(+a.price, +b.price, isAsc);
            default: return 0;
          }
        })
      ))
  }


  /**
   * Update sort object with selected criteria
   * @param criteria sort criteria
   */
  sortBy(criteria: string) {
    this.sort.direction = (this.sort.active === criteria && this.sort.direction === 'asc') ?
      'desc' : 'asc';
    this.sort.active = criteria;
  }

  /** Simple sort comparator for example Name/Price columns (for client-side sorting). */
  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
