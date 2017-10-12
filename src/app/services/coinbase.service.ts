import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SpotPriceQueryReturn } from '../models/spot-price-dto';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class CoinbaseService {

  constructor(private http: HttpClient) { }

  public getBitcoinSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.http.get('https://api.coinbase.com/v2/prices/BTC-USD/spot')
    .flatMap((response: SpotPriceQueryReturn) => { return Observable.of(response); });
  }

  public getEtheriumSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.http.get('https://api.coinbase.com/v2/prices/ETH-USD/spot')
    .flatMap((response: SpotPriceQueryReturn) => { return Observable.of(response); });
  }
}
