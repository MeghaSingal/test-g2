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
    this.initGroup();
    this.isLoading$ = this.seriesQuery.selectLoading();
    this.seriesList$ = this.seriesQuery.selectAll();
    this.count$ = this.seriesQuery.selectCount();
    this.localSearchTerm$ = this.seriesQuery.selectSearchTerm$;
    combineLatest([
      this.seriesQuery.selectFilters$,
      this.seriesQuery.selectSearchTerm$
    ]).pipe(switchMap(([filters, term]) => {
      return this.seriesService.getAllViaJsonServer(term, filters);
      // return this.seriesService.getAllViaDreamFactory(term, filters);
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

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;

  }

  upsert(series?: Series) {
    this.isVisible = true;
    if (!series) {
      this.seriesForm.patchValue({});
    } else {
      this.seriesForm.patchValue(series);
    }
  }

  deleteSeries(series: Series) {
    // this.seriesService.deleteSeries(series);
  }

  submitSeriesForm(series): void {
    console.log(series);
    this.isVisible = false;
  }

  seriesForm: FormGroup;
  private initGroup() {
    this.seriesForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      flag: ['', Validators.required],
      naics: ['', Validators.required],
      item: ['', Validators.required],
      topic: ['', Validators.required],
      subtopic: [''],
      item_type: ['', Validators.required],
      data_type: ['', Validators.required],
      form: ['', Validators.required],
      tbl: ['', Validators.required],
      view: ['', Validators.required],
      last_updated: [''],
      val2015a1: ['', Validators.required],
      val2016a1: ['', Validators.required],
      val2017a1: ['', Validators.required],
      val2018a1: ['', Validators.required]
    });
  }

}
