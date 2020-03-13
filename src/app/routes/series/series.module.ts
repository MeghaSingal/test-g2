import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SeriesRoutingModule } from './series-routing.module';
import { SeriesTableComponent } from './series-table/series-table.component';

const COMPONENTS = [
  SeriesTableComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    SeriesRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SeriesModule { }
