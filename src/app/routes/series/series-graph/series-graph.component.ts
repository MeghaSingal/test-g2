import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/table';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-series-series-series-graph',
  templateUrl: './series-graph.component.html',
})
export class SeriesGraphComponent {
  render(el: ElementRef) {
    let data = [
      { month: 'Jan', city: 'Tokyo', temperature: 7 },
      { month: 'Jan', city: 'London', temperature: 3.9 },
      { month: 'Feb', city: 'Tokyo', temperature: 6.9 },
      { month: 'Feb', city: 'London', temperature: 4.2 },
      { month: 'Mar', city: 'Tokyo', temperature: 9.5 },
      { month: 'Mar', city: 'London', temperature: 5.7 }
    ];
    const chart = new G2.Chart({
      container: el.nativeElement,
      forceFit: true,
      height: window.innerHeight,
      padding: [20, 120, 95]
    });
    chart.source(data);
    chart.scale({
      month: {
        range: [0, 1]
      },
      temperature: {
        nice: true
      }
    });
    chart.tooltip({
      showCrosshairs: true,
      shared: true
    })
    chart.axis('temperature', {
      label: {
        formatter: (val) => {
          return val += ' "C';
        }
      }
    })

    chart.line()
      .position('month*temperature')
      .color('city')
      .shape('smooth');

    chart.point()
      .position('month*temperature')
      .color('city')
      .shape('circle');
    chart.render();
  }

}
