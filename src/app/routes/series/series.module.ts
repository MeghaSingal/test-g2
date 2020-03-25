import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SeriesRoutingModule } from './series-routing.module';
import { SeriesTableComponent } from './series-table/series-table.component';
import { FiltersComponent } from './filters/filters.component';
import { ItemTypeFilterComponent } from './filters/item-type-filter/item-type-filter.component';
import { SeriesNameFilterComponent } from './filters/series-name-filter/series-name-filter.component';
import { NaicsFilterComponent } from './filters/naics-filter/naics-filter.component';
import { SeriesEditComponent } from './series-edit/series-edit.component';
import { SeriesGraphComponent } from './series-graph/series-graph.component';

import { HighlightSearch } from './series-table/highlight-keyword.pipe';

const DIALOG_COMPONENTS = [SeriesEditComponent];
const COMPONENTS = [
  SeriesTableComponent,
  FiltersComponent,
  ItemTypeFilterComponent,
  SeriesNameFilterComponent,
  NaicsFilterComponent,
  SeriesGraphComponent,
  HighlightSearch];

@NgModule({
  imports: [
    SharedModule,
    SeriesRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...DIALOG_COMPONENTS
  ],
  entryComponents: DIALOG_COMPONENTS
})
export class SeriesModule { }
