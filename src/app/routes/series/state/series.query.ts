import { Injectable } from '@angular/core';
import { filterNil, ID, QueryEntity } from '@datorama/akita';
import { SeriesStore, SeriesState } from './series.store';
import { Series } from './series.model';
import { filter } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SeriesQuery extends QueryEntity<SeriesState, Series>{
    selectFilters$ = this.select('filters');
    selectSearchTerm$ = this.select('searchTerm');

    get filters() {
        return this.getValue().filters;
    }

    get searchTerm() {
        return this.getValue().searchTerm;
    }

    constructor(protected store: SeriesStore) {
        super(store);
    }
}