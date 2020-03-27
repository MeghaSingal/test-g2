import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SeriesService } from '../../state/series.service';
import { SeriesQuery } from '../../state/series.query';
import { FileSaverService } from 'ngx-filesaver';

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

  checkedValues: string[] = [];
  writeValue(values: string[]): void {
    if (values !== undefined) {
      this.checkedValues = values;
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
    let checkedSeriesNames = this.seriesNames.filter(seriesName => seriesName.checked == true).map(seriesName => seriesName.label);
    if (this.seriesQuery.filters.seriesNames.sort().join(',') !== checkedSeriesNames.sort().join(',')) {
      this.configureItemTypeButton();
      this.propagateChange(checkedSeriesNames);
    }
  }
  clear(): void {
    this.seriesNames.forEach(seriesNames => seriesNames.checked = false);
  }
  close(): void {
    let checkedSeriesNames = this.seriesNames.filter(seriesName => seriesName.checked == true).map(seriesName => seriesName.label);
    if (this.visible == false) {
      if (this.seriesQuery.filters.seriesNames.sort().join(',') !== checkedSeriesNames.sort().join(',')) {
        this.configureItemTypeButton();
        this.propagateChange(checkedSeriesNames);
      }
    }
  }

  constructor(private seriesService: SeriesService, private seriesQuery: SeriesQuery, private fileSaverService: FileSaverService) { }

  ngOnInit() {
    // this.seriesService.getSeriesNamesViaJsonServer('', {}).subscribe(names => {
    this.seriesService.getSeriesNamesViaDreamFactory('', {}).subscribe(names => {
      this.seriesNames = names.filter((v, i) => names.indexOf(v) === i).map(name => {
        return { label: name, value: name, checked: false }
      });
      this.checkedValues.forEach(val => {
        this.seriesNames.find(name => name.value == val).checked = true;
      });
      this.configureItemTypeButton();
    })
  }

  downloadSeriesNames() {
    const fileName = "series.txt";
    const fileType = this.fileSaverService.genType(fileName);
    const txtBlog = new Blob([this.seriesQuery.filters.seriesNames.join(', ')], { type: fileType });
    this.fileSaverService.save(txtBlog, fileName);
  }
  uploadSeriesNames() {

  }
}
