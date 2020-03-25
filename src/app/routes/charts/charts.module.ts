import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ChartsRoutingModule } from './charts-routing.module';

import { AreaChartsComponent } from './area-charts/area-charts.component';

const DIALOG_COMPONENTS = [];
const COMPONENTS = [AreaChartsComponent];

@NgModule({
    imports: [
        SharedModule,
        ChartsRoutingModule
    ],
    declarations: [
        ...COMPONENTS,
        ...DIALOG_COMPONENTS
    ],
    entryComponents: DIALOG_COMPONENTS
})
export class ChartsModule { }
