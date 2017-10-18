import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoinbaseService } from '../services/coinbase.service';
import { SpotPriceQueryReturn, SpotPrice, SpotPriceWithTimeStamp } from '../models/spot-price-dto';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
export class DashboardComponent implements OnInit, OnDestroy {
  public bitCoinSpotPrices: BehaviorSubject<Array<SpotPriceWithTimeStamp>>;
  public etheriumSpotPrices: BehaviorSubject<Array<SpotPriceWithTimeStamp>>;
  private bitCoinStreamOpen: boolean;
  private etheriumStreamOpen: boolean;
  private bitCoinSpotPriceSubscription: Subscription;
  private etheriumSpotPriceSubscription: Subscription;

  constructor(private coinbaseService: CoinbaseService) {
    this.bitCoinSpotPrices = new BehaviorSubject<Array<SpotPriceWithTimeStamp>>(new Array<SpotPriceWithTimeStamp>());
    this.etheriumSpotPrices = new BehaviorSubject<Array<SpotPriceWithTimeStamp>>(new Array<SpotPriceWithTimeStamp>());
    this.bitCoinStreamOpen = true;
    this.etheriumStreamOpen = false;
  }

  ngOnInit(): void {
    this.bitCoinSpotPriceSubscription = this.setBitCoinObservable().subscribe();
    this.etheriumSpotPriceSubscription = this.setEtheriumObservable().subscribe();
  }

  ngOnDestroy(): void {
    if (!this.bitCoinSpotPriceSubscription.closed) { this.bitCoinSpotPriceSubscription.unsubscribe(); }
    if (!this.etheriumSpotPriceSubscription.closed) { this.etheriumSpotPriceSubscription.unsubscribe(); }
  }

  public swapCurrencyStream(chosenStream: BehaviorSubject<Array<SpotPriceWithTimeStamp>>): void {
    this.bitCoinStreamOpen = chosenStream === this.bitCoinSpotPrices ? true : false;
    this.etheriumStreamOpen = !this.bitCoinStreamOpen;
  }

  private addTimeStamp(spotPriceData: SpotPrice): SpotPriceWithTimeStamp {
    (spotPriceData as SpotPriceWithTimeStamp).timeStamp = new Date(Date.now());
    return <SpotPriceWithTimeStamp>spotPriceData;
  }

  private setBitCoinObservable(): Observable<void> {
    return this.getBitcoinSpotPrice()
    .expand(() => Observable.timer(30000)
    .concatMap(() => this.getBitcoinSpotPrice()))
    .skipWhile(() => this.etheriumStreamOpen === true)
    .map((spotPrice: SpotPriceQueryReturn) => {
      const newBitCoinSpotPriceWithTimeStamp: SpotPriceWithTimeStamp = this.addTimeStamp(spotPrice.data);
      const bitCoinSpotPriceValues: Array<SpotPriceWithTimeStamp> = this.bitCoinSpotPrices.value.concat(Array.of(newBitCoinSpotPriceWithTimeStamp));
      this.bitCoinSpotPrices.next(bitCoinSpotPriceValues);
    });
  }

  private setEtheriumObservable(): Observable<void> {
    return this.getEtheriumSpotPrice()
    .expand(() => Observable.timer(30000)
    .concatMap(() => this.getEtheriumSpotPrice()))
    .skipWhile(() => this.bitCoinStreamOpen === true)
    .map((spotPrice: SpotPriceQueryReturn) => {
      const newEtheriumSpotPriceWithTimeStamp: SpotPriceWithTimeStamp = this.addTimeStamp(spotPrice.data);
      const etheriumSpotPriceValues: Array<SpotPriceWithTimeStamp> = this.etheriumSpotPrices.value.concat(Array.of(newEtheriumSpotPriceWithTimeStamp));
      this.etheriumSpotPrices.next(etheriumSpotPriceValues);
    });
  }

  private getBitcoinSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.coinbaseService.getBitcoinSpotPrice();
  }

  private getEtheriumSpotPrice(): Observable<SpotPriceQueryReturn> {
    return this.coinbaseService.getEtheriumSpotPrice();
  }
}
