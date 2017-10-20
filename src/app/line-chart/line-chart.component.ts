import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SpotPriceWithTimeStamp } from '../models/spot-price-dto';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Time from 'd3-time-format';

@Component({
  selector: 'line-chart',
  styleUrls: ['./line-chart.component.less'],
   template: `<div class="chart-container">
              <section #container class="svg-container"></section>
             </div>`
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('container') viewContainer: ElementRef;
  private chartData: Array<CurrencyDataPoint>;
  private container: HTMLElement;
  private host: d3.Selection<d3.BaseType, {}, null, undefined>;
  private svg: d3.Selection<d3.BaseType, {}, HTMLElement, undefined>;
  private width: number;
  private height: number;
  private x: d3Scale.ScaleTime<number, number>;
  private y: d3Scale.ScaleLinear<number, number>;
  private line: d3Shape.Line<CurrencyDataPoint>;
  private margin: Margin = {top: 50, right: 20, bottom: 30, left: 50};

  constructor() { }

  @Input() set spotPriceData(spotPriceData: Array<SpotPriceWithTimeStamp>) {
    this.chartData = spotPriceData.map((spotPrice: SpotPriceWithTimeStamp) => { return {timeStamp: spotPrice.timeStamp, value: parseFloat(spotPrice.amount)}; });
    if (this.chartData.length > 1) {
      this.host.html('');
      this.initHostElement();
      this.initSvg()
      this.initAxis();
      this.drawAxis();
      this.drawLine();
    }
  }

  ngAfterViewInit() {
    this.container = this.viewContainer.nativeElement;
    this.initHostElement();
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawLine();
  }

  private initHostElement(): void {
    this.host = d3.select(this.container);
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
  }

  private initSvg(): void {
    this.svg = this.host.append('svg')
      .attr('viewBox', `10 40 ${this.width + 50} ${this.height + 40}`)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    // this.svg.append('g').attr('class', 'lines');
    // this.svg.append('g').attr('class', 'labels');
  }

  private initAxis(): void {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(<Array<Date>>d3Array.extent(this.chartData, (d: CurrencyDataPoint) => d.timeStamp));
    this.y.domain(d3Array.extent(this.chartData, (d: CurrencyDataPoint) => d.value));
  }

  private drawAxis(): void {
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.svg.append('g')
      .attr('class', 'axis axis-y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Price (USD)');
  }

  private drawLine(): void {
    this.line = d3Shape.line<CurrencyDataPoint>()
      .x((d: CurrencyDataPoint) => { return this.x(d.timeStamp); })
      .y((d: CurrencyDataPoint) => { return this.y(d.value); });

    this.svg.append('path')
      .datum(this.chartData)
      .attr('class', 'line')
      .attr('d', this.line as d3.ValueFn<d3.BaseType, Array<ThisType<CurrencyDataPoint>>, string | number | boolean>);
  }
}

interface CurrencyDataPoint {
  timeStamp: Date;
  value: number;
}

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
