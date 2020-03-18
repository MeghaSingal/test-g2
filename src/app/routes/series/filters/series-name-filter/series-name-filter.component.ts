import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SeriesService } from '../../state/series.service';

@Component({
  selector: 'series-name-filter',
  templateUrl: './series-name-filter.component.html',
  styleUrls: ['./series-name-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SeriesNameFilterComponent),
      multi: true
    }
  ]
})
export class SeriesNameFilterComponent implements OnInit, ControlValueAccessor {

  seriesNames: { label: string, value: string, checked: boolean }[] = [];

  seriesNamesButtonText: string = "Series Names";
  seriesNamesButtonStyle: 'selected' | 'default' = 'default';
  configureItemTypeButton() {
    const selectedItemTypes = this.seriesNames.filter(name => name.checked == true).map(name => name.label);
    if (selectedItemTypes.length == 1) {
      this.seriesNamesButtonText = selectedItemTypes[0];
      this.seriesNamesButtonStyle = 'selected';
    } else if (selectedItemTypes.length > 1) {
      this.seriesNamesButtonText = `Series Names: ${selectedItemTypes.length}`;
      this.seriesNamesButtonStyle = 'selected';
    } else {
      this.seriesNamesButtonText = 'Series Names';
      this.seriesNamesButtonStyle = 'default';
    }
  }

  writeValue(values: string[]): void {
    if (values !== undefined) {
      values.forEach(val => {
        this.seriesNames.find(name => name.value == val).checked = true;
      });
      this.configureItemTypeButton();
    }
  }
  propagateChange = (_: any) => { };
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error("Method not implemented.");
  }

  visible: boolean;
  save(): void {
    this.visible = false;
    this.configureItemTypeButton();
    this.propagateChange(this.seriesNames.filter(seriesNames => seriesNames.checked == true).map(seriesNames => seriesNames.label));
  }
  clear(): void {
    this.seriesNames.forEach(seriesNames => seriesNames.checked = false);
  }
  close(): void {
    this.configureItemTypeButton();
    this.propagateChange(this.seriesNames.filter(seriesNames => seriesNames.checked == true).map(seriesNames => seriesNames.label));
  }

  constructor(private seriesService: SeriesService) { }

  ngOnInit() {
    this.seriesService.getSeriesNamesViaJsonServer('', {}).subscribe(names => {
      this.seriesNames = names.filter((v, i) => names.indexOf(v) === i).map(name => {
        return { label: name, value: name, checked: false }
      });
    })
  }

}
