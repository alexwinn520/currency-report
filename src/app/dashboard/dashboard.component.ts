import { Component, OnDestroy } from '@angular/core';
import { CoinbaseService } from '../services/coinbase.service';
import { SpotPriceQueryReturn, SpotPrice } from '../models/spot-price-dto';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skipWhile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnDestroy {
  public bitCoinSpotPrices: Array<SpotPrice>;
  public etheriumSpotPrices: Array<SpotPrice>;
  public timeStamp: Date;
  private bitCoinStreamOpen: boolean;
  private etheriumStreamOpen: boolean;
  private bitCoinSpotPriceSubscription: Subscription;
  private etheriumSpotPriceSubscription: Subscription;

  constructor(private coinbaseService: CoinbaseService) {
    this.timeStamp = new Date(Date.now());
    this.bitCoinSpotPrices = new Array<SpotPrice>();
    this.etheriumSpotPrices = new Array<SpotPrice>();
    this.bitCoinStreamOpen = true;
    this.etheriumStreamOpen = false;

    this.bitCoinSpotPriceSubscription = this.getBitcoinSpotPrice()
    .distinctUntilChanged()
    .expand(() => Observable.timer(30000)
    .concatMap(() => this.getBitcoinSpotPrice()))
    .skipWhile(() => this.etheriumStreamOpen === true)
    .subscribe((spotPrice: SpotPriceQueryReturn) => { this.bitCoinSpotPrices.push(spotPrice.data); return spotPrice.data; });

    this.etheriumSpotPriceSubscription = this.getEtheriumSpotPrice()
    .distinctUntilChanged()
    .expand(() => Observable.timer(30000)
    .concatMap(() => this.getEtheriumSpotPrice()))
    .skipWhile(() => this.bitCoinStreamOpen === true)
    .subscribe((spotPrice: SpotPriceQueryReturn) => { this.etheriumSpotPrices.push(spotPrice.data); return spotPrice.data; });
  }

  ngOnDestroy() {
    if (!this.bitCoinSpotPriceSubscription.closed) { this.bitCoinSpotPriceSubscription.unsubscribe(); }
    if (!this.etheriumSpotPriceSubscription.closed) { this.etheriumSpotPriceSubscription.unsubscribe(); }
  }

  public swapCurrencyStream(chosenStream: Array<SpotPrice>): void {
   this.bitCoinStreamOpen = chosenStream === this.bitCoinSpotPrices ? true : false;
   this.etheriumStreamOpen = !this.bitCoinStreamOpen;
  }

  private getBitcoinSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.coinbaseService.getBitcoinSpotPrice();
  }

  private getEtheriumSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.coinbaseService.getEtheriumSpotPrice();
  }
}
