import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesTableComponent } from './series-table/series-table.component';
import { SeriesGraphComponent } from './series/series-graph/series-graph.component';

const routes: Routes = [

  { path: 'tview', component: SeriesTableComponent },
  { path: 'gview', component: SeriesGraphComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }
