import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STColumnTag } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { SeriesService } from '../state/series.service';
import { Series } from '../state/series.model';
import { Observable, combineLatest } from 'rxjs';
import { SeriesQuery } from '../state/series.query';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NzMessageService } from 'ng-zorro-antd';
import { SeriesEditComponent } from '../series-edit/series-edit.component';
import { XlsxService } from '@delon/abc';

const TAG: STColumnTag = {
  CV: { text: 'CV', color: 'green' },
  EST: { text: 'EST', color: 'red' },
  IMP: { text: 'IMP', color: 'blue' },
  SE: { text: 'SE', color: 'purple' },
  YY: { text: 'YY', color: 'orange' },
};

@Component({
  selector: 'steps-series-table',
  templateUrl: './series-table.component.html',
})
export class SeriesTableComponent implements OnInit {

  constructor(private seriesService: SeriesService,
    private seriesQuery: SeriesQuery,
    private message: NzMessageService,
    private xlsx: XlsxService) { }

  isLoading$: Observable<boolean>;
  seriesList$: Observable<Series[]>;
  count$: Observable<number>;
  localSearchTerm$: Observable<string>;

  isExpanded: string = "C";
  ngOnInit() {
    this.isLoading$ = this.seriesQuery.selectLoading();
    this.seriesList$ = this.seriesQuery.selectAll();
    this.count$ = this.seriesQuery.selectCount();
    this.localSearchTerm$ = this.seriesQuery.selectSearchTerm$;
    combineLatest([
      this.seriesQuery.selectFilters$,
      this.seriesQuery.selectSearchTerm$
    ]).pipe(switchMap(([filters, term]) => {
      return this.seriesService.getAllViaJsonServer(term, filters);
    }), untilDestroyed(this)).subscribe({
      error() {
      }
    });
  }
  ngOnDestroy() { };

  editSeries(series: Series) {
    console.log(series);
  }

  deleteSeries(series: Series) {
    console.log(series);
  }

  download(type: string) {
    if (type == 'xlsx') {

      // this.seriesList$.subscribe(s => {
      //   const data = [this.columns.map(i => i.title)];
      //   s.forEach(i =>
      //     data.push(this.columns.map(c => i[c.index as string]))
      //   )
      //   this.xlsx.export({
      //     sheets: [
      //       {
      //         data: data,
      //         name: 'series'
      //       }
      //     ]
      //   })
      // })

    };
  }
}
