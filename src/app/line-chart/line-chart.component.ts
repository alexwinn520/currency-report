import { Component, AfterViewInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyDataPoint } from '../models/chart-data';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-line-chart',
  styleUrls: ['./line-chart.component.less'],
  template: `<div class="chart-container">
              <section #container class="svg-container"></section>
             </div>`
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('container') viewContainer: ElementRef;
  @Input() public chartData: Array<CurrencyDataPoint>;
  private container: HTMLElement;
  private host: d3.Selection<d3.BaseType, {}, null, undefined>;
  private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
  private width: number;
  private height: number;
  private x: d3Scale.ScaleTime<number, number>;
  private y: d3Scale.ScaleLinear<number, number>;
  private line: d3Shape.Line<[any, any]>;

  constructor() { }

  ngAfterViewInit() {
    this.initHostElement();
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.drawLine();
  }

  private initHostElement(): void {
    this.container = this.viewContainer.nativeElement;
    this.host = d3.select(this.container);
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
  }

  private initSvg(): void {
    this.host.html('');
    this.svg = this.host.append('svg').append('g');
    // this.svg.append('g').attr('class', 'lines');
    // this.svg.append('g').attr('class', 'labels');
    this.svg.attr('transform', `translate(${this.width / 2},${this.height / 2})`);
  }

  private initAxis(): void {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.chartData, (d: CurrencyDataPoint) => d.timeStamp as any ));
    this.y.domain(d3Array.extent(this.chartData, (d: CurrencyDataPoint) => d.value ));
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
        .text('Price ($)');
  }

  private drawLine(): void {
    this.line = d3Shape.line()
      .x((d) => this.x(d) )
      .y((d) => this.y(d) );

    this.svg.append('path')
      .datum(this.chartData)
      .attr('class', 'line')
      .attr('d', this.line);
  }
}
