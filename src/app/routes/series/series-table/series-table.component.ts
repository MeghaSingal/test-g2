import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STColumnTag } from '@delon/abc/table';
import { SFSchema } from '@delon/form';
import { SeriesService } from '../state/series.service';
import { Series } from '../state/series.model';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { SeriesQuery } from '../state/series.query';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NzMessageService } from 'ng-zorro-antd';
import { SeriesEditComponent } from '../series-edit/series-edit.component';
import { XlsxService } from '@delon/abc';
import { FileSaverService } from 'ngx-filesaver';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
    private xlsx: XlsxService,
    private fileSaverService: FileSaverService,
    private fb: FormBuilder) { }

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
      // return this.seriesService.getAllViaJsonServer(term, filters);
      return this.seriesService.getAllViaDreamFactory(term, filters);
    }), untilDestroyed(this)).subscribe({
      error() {
      }
    });
  }
  ngOnDestroy() { };

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

    } else if (type == 'csv') {
      let subscription: Subscription;
      console.log('csv');
      subscription = this.seriesList$.subscribe(s => {
        console.log(s);
      })
      subscription.unsubscribe();
    };
  }


  // Below is the code for CRUD operations of a series.
  isVisible = false;
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  editSeries(series: Series) {
    this.isVisible = true;
    this.validateSeriesForm = this.fb.group({
      name: [series.name, Validators.required],
      flag: [series.flag, Validators.required],
      naics: [series.naics, Validators.required],
      item: [series.item, Validators.required],
      topic: [series.topic, Validators.required],
      subtopic: [series.subtopic, Validators.required],
      itemType: [series.item_type, Validators.required],
      dataType: [series.data_type, Validators.required],
      form: [series.form, Validators.required],
      tbl: [series.tbl, Validators.required],
      view: [series.view, Validators.required],
      lastUpdated: [series.last_updated, Validators.required],
      val2015a1: [series.val2015a1, Validators.required],
      val2016a1: [series.val2016a1, Validators.required],
      val2017a1: [series.val2017a1, Validators.required],
      val2018a1: [series.val2018a1, Validators.required]
    });
  }

  deleteSeries(series: Series) {
    console.log(series);
  }

  submitSeriesForm(): void {

  }
  validateSeriesForm: FormGroup = this.fb.group({
    name: [null, Validators.required],
    flag: [null, Validators.required],
    naics: [null, Validators.required],
    item: [null, Validators.required],
    topic: [null, Validators.required],
    subtopic: [null, Validators.required],
    itemType: [null, Validators.required],
    dataType: [null, Validators.required],
    form: [null, Validators.required],
    tbl: [null, Validators.required],
    view: [null, Validators.required],
    lastUpdated: [null, Validators.required],
    val2015a1: [null, Validators.required],
    val2016a1: [null, Validators.required],
    val2017a1: [null, Validators.required],
    val2018a1: [null, Validators.required]
  });
}
