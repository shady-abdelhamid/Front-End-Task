import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Hotel } from './hotel.model';
import { HotelsService } from './hotels.service';

describe('HotelsService', () => {
  let service: HotelsService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(HotelsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected hotels (HttpClient called once)', () => {
    const expectedHotels: Hotel[] =
      [
        { name: 'A', price: 1, city: 'A', availability: [{ from: 'a', to: 'a' }] },
        { name: 'B', price: 2, city: 'B', availability: [{ from: 'b', to: 'b' }] },
      ];
    const responseMock = { hotels: expectedHotels };

    service.getHotels().subscribe(
      heroes => expect(heroes).toEqual(expectedHotels, 'expected heroes')
    );

    const request = httpTestingController.expectOne((req: HttpRequest<any>) => {
      return req.method === 'GET'
    }, 'get hotels');
    expect(request.request.method).toEqual('GET');

    request.flush(responseMock);
  });

  it('should return 404 error', () => {
    const emsg = 'deliberate 404 error';
    const testUrl = 'https://api.myjson.com/bins/tl0bp';

    service.getHotels().subscribe(
      _ => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(emsg, 'message');
      }
    );

    const req = httpTestingController.expectOne(testUrl);

    // Respond with mock error
    req.flush(emsg, { status: 404, statusText: 'Not Found' });
  });
});
