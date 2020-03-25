import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AreaChartsComponent } from './area-charts/area-charts.component';

const routes: Routes = [

    { path: 'area', component: AreaChartsComponent },
    //   { path: 'gview', component: SeriesGraphComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChartsRoutingModule { }
