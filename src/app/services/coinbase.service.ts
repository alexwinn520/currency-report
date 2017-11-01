import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SpotPriceQueryReturn } from '../models/spot-price-dto';
import { HistoricalPriceData } from '../models/historic-price-dto';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CoinbaseService {

  constructor(private http: HttpClient) { }

  public getBitcoinSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.http.get('https://api.coinbase.com/v2/prices/BTC-USD/spot')
    .map((response: SpotPriceQueryReturn) => response)
    .catch((error: Error) => Observable.throw(error));
  }

  public getEtheriumSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.http.get('https://api.coinbase.com/v2/prices/ETH-USD/spot')
    .map((response: SpotPriceQueryReturn) => response)
    .catch((error: Error) => Observable.throw(error));
  }

  public getCurrencyHistoricalData(currencyType: string, period: string): Observable<Array<HistoricalPriceData>> {
    return this.http.get(`https://apiv2.bitcoinaverage.com/indices/local/history/${currencyType}?period=${period}&format=json`)
    .map((response: Array<HistoricalPriceData>) => response)
    .catch((error: Error) => Observable.throw(error));
  }
}
