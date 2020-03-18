import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SeriesService } from '../state/series.service';
import { SeriesQuery } from '../state/series.query';
import { tap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'series-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  filters = new FormGroup({
    survey: new FormControl(),
    from: new FormControl(),
    to: new FormControl(),
    naics: new FormControl(),
    items: new FormControl(),
    topic: new FormControl(),
    subtopic: new FormControl(),
    itemTypes: new FormControl(),
    dataType: new FormControl(),
    sortBy: new FormControl(),
    seriesNames: new FormControl()
  })
  constructor(private seriesService: SeriesService,
    private seriesQuery: SeriesQuery) { }

  ngOnInit() {
    this.filters.patchValue(this.seriesQuery.filters);

    this.filters.valueChanges.pipe(
      tap(() => this.seriesService.invalidateCache()),
      untilDestroyed(this)
    ).subscribe(filters => {
      this.seriesService.updateFilters(filters);
    })
  }

  ngOnDestroy() { }

  topicOneAllChecked = false;
  topicOneIndeterminate = true;
  topicOne = [
    { label: 'subtopic1-1', value: 'subtopic1-1', checked: true },
    { label: 'subtopic1-2', value: 'subtopic1-2', checked: false },
    { label: 'subtopic1-3', value: 'subtopic1-3', checked: false }
  ]
  updateTopicOneAllChecked(): void {
    this.topicOneIndeterminate = false;
    if (this.topicOneAllChecked) {
      this.topicOne = this.topicOne.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.topicOne = this.topicOne.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }
  updateTopicOneSingleChecked(): void {
    if (this.topicOne.every(item => !item.checked)) {
      this.topicOneAllChecked = false;
      this.topicOneIndeterminate = false;
    } else if (this.topicOne.every(item => item.checked)) {
      this.topicOneAllChecked = true;
      this.topicOneIndeterminate = false;
    } else {
      this.topicOneIndeterminate = true;
    }
  }
  topicTwoAllChecked = false;
  topicTwoIndeterminate = false;
  topicTwo = [
    { label: 'subtopic2-1', value: 'subtopic2-1', checked: false },
    { label: 'subtopic2-2', value: 'subtopic2-2', checked: false },
  ]
  updateTopicTwoAllChecked(): void {
    this.topicTwoIndeterminate = false;
    if (this.topicTwoAllChecked) {
      this.topicTwo = this.topicTwo.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.topicTwo = this.topicTwo.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }
  updateTopicTwoSingleChecked(): void {
    if (this.topicTwo.every(item => !item.checked)) {
      this.topicTwoAllChecked = false;
      this.topicTwoIndeterminate = false;
    } else if (this.topicTwo.every(item => item.checked)) {
      this.topicTwoAllChecked = true;
      this.topicTwoIndeterminate = false;
    } else {
      this.topicTwoIndeterminate = true;
    }
  }
}
