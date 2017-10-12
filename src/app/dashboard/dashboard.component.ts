import { Component, OnDestroy } from '@angular/core';
import { CoinbaseService } from '../services/coinbase.service';
import { SpotPriceQueryReturn, SpotPrice } from '../models/spot-price-dto';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/skipWhile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnDestroy {
  public bitCoinSpotPrices: Array<SpotPriceWithTimeStamp>;
  public etheriumSpotPrices: Array<SpotPriceWithTimeStamp>;
  private bitCoinStreamOpen: boolean;
  private etheriumStreamOpen: boolean;
  private bitCoinSpotPriceSubscription: Subscription;
  private etheriumSpotPriceSubscription: Subscription;

  constructor(private coinbaseService: CoinbaseService) {
    this.bitCoinSpotPrices = new Array<SpotPriceWithTimeStamp>();
    this.etheriumSpotPrices = new Array<SpotPriceWithTimeStamp>();
    this.bitCoinStreamOpen = true;
    this.etheriumStreamOpen = false;

    this.bitCoinSpotPriceSubscription = this.getBitcoinSpotPrice()
    .expand(() => Observable.timer(30000)
    .concatMap(() => this.getBitcoinSpotPrice()))
    .skipWhile(() => this.etheriumStreamOpen === true)
    .subscribe((spotPrice: SpotPriceQueryReturn) => {
      const bitCoinSpotPrice: SpotPriceWithTimeStamp = this.addTimeStamp(spotPrice.data);
      this.bitCoinSpotPrices.push(bitCoinSpotPrice);
    });

    this.etheriumSpotPriceSubscription = this.getEtheriumSpotPrice()
    .expand(() => Observable.timer(30000)
    .concatMap(() => this.getEtheriumSpotPrice()))
    .skipWhile(() => this.bitCoinStreamOpen === true)
    .subscribe((spotPrice: SpotPriceQueryReturn) => {
      const etheriumSpotPrice: SpotPriceWithTimeStamp = this.addTimeStamp(spotPrice.data);
      this.etheriumSpotPrices.push(etheriumSpotPrice);
    });
  }

  ngOnDestroy() {
    if (!this.bitCoinSpotPriceSubscription.closed) { this.bitCoinSpotPriceSubscription.unsubscribe(); }
    if (!this.etheriumSpotPriceSubscription.closed) { this.etheriumSpotPriceSubscription.unsubscribe(); }
  }

  public swapCurrencyStream(chosenStream: Array<SpotPrice>): void {
   this.bitCoinStreamOpen = chosenStream === this.bitCoinSpotPrices ? true : false;
   this.etheriumStreamOpen = !this.bitCoinStreamOpen;
  }

  private addTimeStamp(spotPriceData: SpotPrice): SpotPriceWithTimeStamp {
    (spotPriceData as SpotPriceWithTimeStamp).timeStamp = new Date(Date.now());
    return <SpotPriceWithTimeStamp>spotPriceData;
  }

  private getBitcoinSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.coinbaseService.getBitcoinSpotPrice();
  }

  private getEtheriumSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.coinbaseService.getEtheriumSpotPrice();
  }
}

interface SpotPriceWithTimeStamp extends SpotPrice {
  timeStamp: Date;
}
