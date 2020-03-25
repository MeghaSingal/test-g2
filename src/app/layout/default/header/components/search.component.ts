import { Component, HostBinding, Input, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { SeriesService } from 'src/app/routes/series/state/series.service';
import { SeriesQuery } from 'src/app/routes/series/state/series.query';
import { FormControl } from '@angular/forms';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'header-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSearchComponent implements AfterViewInit {
  qIpt: HTMLInputElement;

  @HostBinding('class.alain-default__search-focus')
  focus = false;

  @HostBinding('class.alain-default__search-toggled')
  searchToggled = false;

  @Input()
  set toggleChange(value: boolean) {
    if (typeof value === 'undefined') return;
    this.searchToggled = true;
    this.focus = true;
    setTimeout(() => this.qIpt.focus(), 300);
  }

  constructor(private el: ElementRef, private seriesService: SeriesService,
    private seriesQuery: SeriesQuery) { }

  searchControl = new FormControl();
  ngOnInit() {
    this.searchControl.patchValue(this.seriesQuery.searchTerm);
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      map(val => this.runAutoComplete(val)),
      distinctUntilChanged()
    ).subscribe((term) => this.seriesService.updateSearchTerm(term));
  }

  ngAfterViewInit() {
    this.qIpt = (this.el.nativeElement as HTMLElement).querySelector('.ant-input') as HTMLInputElement;
  }

  qFocus() {
    this.focus = true;
  }

  qBlur() {
    this.focus = false;
    this.searchToggled = false;
  }

  filteredSeries: { value: string, label: string }[] = [];
  runAutoComplete(val: string) {
    if (val.length >= 2) {
      // this.seriesService.getSeriesNamesViaJsonServer(val, this.seriesQuery.filters).subscribe(filteredNames => {
      this.seriesService.getSeriesNamesViaDreamFactory(val, this.seriesQuery.filters).subscribe(filteredNames => {
        this.filteredSeries = filteredNames.filter((v, i) => filteredNames.indexOf(v) === i)
          .map(fSeries => {
            return {
              value: fSeries, label: fSeries.replace(new RegExp(val, "gi"), match => {
                return '<a target="_blank">' + match + '</a>';
              })
            };
          });
      });
    } else {
      this.filteredSeries = [];
    }
    return val;
  }
}
