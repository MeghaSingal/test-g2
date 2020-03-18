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
    private message: NzMessageService) { }

  isLoading$: Observable<boolean>;
  seriesList$: Observable<Series[]>;
  count$: Observable<number>;

  ngOnInit() {
    this.isLoading$ = this.seriesQuery.selectLoading();
    this.seriesList$ = this.seriesQuery.selectAll();
    this.count$ = this.seriesQuery.selectCount();

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

  columns: STColumn[] = [
    { title: 'Name', index: 'name' },
    { title: 'Item Type', index: 'item_type', type: 'tag', tag: TAG },
    { title: '2015', index: 'val2015a1' },
    { title: '2016', index: 'val2016a1' },
    { title: '2017', index: 'val2017a1' },
    { title: '2018', index: 'val2018a1' },
    {
      title: 'Action',
      buttons: [
        {
          text: 'Edit', icon: 'edit', type: 'modal',
          modal: {
            component: SeriesEditComponent
          },
          click: (record, modal) => this.message.success(`You have edited <${record.name}>`)
        },
        {
          text: 'Delete', icon: 'delete', type: 'del',
          pop: {
            title: 'Are you sure?',
            okType: 'danger',
            icon: 'star'
          },
          click: (record, _modal, comp) => {
            this.message.success(`Successfully deleted <${record.name}>`);
          }
        }
      ]
    }
  ]
}
