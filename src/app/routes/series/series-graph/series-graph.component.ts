import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { combineLatest } from 'rxjs';
import { SeriesService } from '../state/series.service';
import { SeriesQuery } from '../state/series.query';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Chart } from '@antv/g2';
import { FileSaverService } from 'ngx-filesaver';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-series-series-series-graph',
  templateUrl: './series-graph.component.html',
})
export class SeriesGraphComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit() {

  }

  sChart: Chart;
  ngAfterViewInit() {
    combineLatest([
      this.seriesQuery.selectFilters$,
      this.seriesQuery.selectSearchTerm$,
      this.seriesQuery.selectUploadedNames$
    ]).pipe(switchMap(([filters, term, uploadedNames]) => {
      // return this.seriesService.getAllViaJsonServer(term, filters);
      return this.seriesService.getAllViaDreamFactory(term, uploadedNames, filters);
    }), untilDestroyed(this)).subscribe({
      error() {
      }
    });

    this.seriesQuery.selectAll().pipe(untilDestroyed(this)).subscribe(seriesList => {
      let formattedSeriesList = [];
      seriesList.filter(s => { return this.seriesQuery.filters.itemTypes.length > 0 ? s.item_type == this.seriesQuery.filters.itemTypes[0] : s.item_type == 'CV' }).forEach(series => {
        formattedSeriesList.push({ name: series.name, statPeriod: '2015', value: parseFloat(series.val2015a1) });
        formattedSeriesList.push({ name: series.name, statPeriod: '2016', value: parseFloat(series.val2016a1) });
        formattedSeriesList.push({ name: series.name, statPeriod: '2017', value: parseFloat(series.val2017a1) });
        formattedSeriesList.push({ name: series.name, statPeriod: '2018', value: parseFloat(series.val2018a1) });
      })
      if (formattedSeriesList.length > 0) {
        if (this.sChart) {
          this.sChart.changeData(formattedSeriesList);
        } else {
          setTimeout(() => this.sChart.changeData(formattedSeriesList), 2000);
        }

      }
    });

    this.sChart = new Chart({
      container: 'sGraph',
      forceFit: true,
      height: window.innerHeight,
      padding: { bottom: 140, top: 20, left: 70, right: 10 }
    });
    this.sChart.line()
      .position('statPeriod*value')
      .color('name')
    // .shape('smooth');
    this.sChart.point()
      .position('statPeriod*value')
      .color('name')
      .shape('circle');
    // this.sChart.tooltip(false);
    this.sChart.axis('statPeriod', {
      title: {}
    });
    this.sChart.axis('value', {
      title: {}
    });
    this.sChart.scale('statPeriod', {
      alias: 'Stat Period'
    });
    this.sChart.render();
  }
  constructor(private seriesService: SeriesService,
    private seriesQuery: SeriesQuery, private fileSaverService: FileSaverService) { }


  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('screen', { static: false }) screen: ElementRef;
  downloadGraph(type: string) {
    html2canvas(this.screen.nativeElement, { height: 1000 }).then(canvas => {
      canvas.toBlob(blob => {
        this.fileSaverService.save(blob, `series-diagram.${type}`);
      })
    });
  }
}