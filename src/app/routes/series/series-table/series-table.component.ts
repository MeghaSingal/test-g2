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
import { NzMessageService, NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd';
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
    private fb: FormBuilder,
    private nzContextMenuService: NzContextMenuService) { }

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
      this.seriesQuery.selectSearchTerm$,
      this.seriesQuery.selectUploadedNames$,
    ]).pipe(switchMap(([filters, term, uploadedNames]) => {
      // return this.seriesService.getAllViaJsonServer(term, filters);
      return this.seriesService.getAllViaDreamFactory(term, uploadedNames, filters);
    }), untilDestroyed(this)).subscribe({
      error() {
      }
    });
  }
  ngOnDestroy() { };

  download(type: string) {
    const fileName = `series-table.${type}`;
    const fileType = this.fileSaverService.genType(fileName);
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
      subscription = this.seriesList$.subscribe(s => {
        let csvData = 'Series, 2015A1, 2016A1, 2017A1, 2018A1 \n';
        s.forEach(series => {
          csvData += series.name.trim() + ',' + series.val2015a1 + ',' + series.val2016a1 + ',' + series.val2017a1 + ',' + series.val2018a1 + '\n';
        })
        const txtBlob = new Blob([csvData], { type: fileType });
        this.fileSaverService.save(txtBlob, fileName);
      });
      subscription.unsubscribe();
    };
  }


  // Below is the code for CRUD operations of a series.
  isVisible = false;

  handleCancel(e: MouseEvent): void {
    e.preventDefault();
    this.isVisible = false;
    this.seriesForm.reset();

  }

  upsert(series?: Series) {
    this.isVisible = true;
    if (!series) {
      this.seriesForm.patchValue({
        id: '',
        name: '',
        flag: '',
        naics: '',
        item: '',
        topic: '',
        subtopic: '',
        item_type: '',
        data_type: '',
        form: '',
        tbl: '',
        view: '',
        last_updated: '',
        val2015a1: '',
        val2016a1: '',
        val2017a1: '',
        val2018a1: ''
      });
    } else {
      this.seriesForm.patchValue(series);
    }
  }

  deleteSeries(series: Series) {
    this.seriesService.deleteSeries(series);
    this.message.create('success', `${series.name} is successfully deleted.`);
  }

  submitSeriesForm(series: Series): void {
    if (series.id) {
      this.seriesService.upsert([series]).subscribe(data => {
        this.message.create('success', `${series.name} is successfully updated.`);
      });
    } else {
      series.id = Math.round(Math.random() * 100) + 200;
      let d = new Date();
      series.last_updated = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ":" + d.getMinutes();
      this.seriesService.upsert([series]);
      this.message.create('success', `${series.name} is successfully created.`);
    }
    this.seriesForm.reset();
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


  // Bulk Editing Begin
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        // this.checkAll(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        // this.listOfDisplayData.forEach((data, index) => (this.mapOfCheckedId[data.id] = index % 2 !== 0));
        // this.refreshStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        // this.listOfDisplayData.forEach((data, index) => (this.mapOfCheckedId[data.id] = index % 2 === 0));
        // this.refreshStatus();
      }
    }
  ];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  // listOfDisplayData: ItemData[] = [];
  // listOfAllData: ItemData[] = [];
  // mapOfCheckedId: { [key: string]: boolean } = {};
  // currentPageDataChange($event: ItemData[]): void {
  //   this.listOfDisplayData = $event;
  //   this.refreshStatus();
  // }
  // refreshStatus(): void {
  //   this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
  //   this.isIndeterminate =
  //     this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  // }
  checkAll(value: boolean): void {
    // this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    // this.refreshStatus();
  }
  // Bulk Enditing End

  // Context Menu Begin
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
  // Context Menu End
}
