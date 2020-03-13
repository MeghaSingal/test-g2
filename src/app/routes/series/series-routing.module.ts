import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesTableComponent } from './series-table/series-table.component';

const routes: Routes = [

  { path: 'series-table', component: SeriesTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }
