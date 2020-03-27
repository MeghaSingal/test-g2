import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SeriesStore } from './series.store';
// import { BaseSeries, Series, DfResource } from './series.model';
import { tap, map } from 'rxjs/operators';
import { API, DFAPI } from '../../../api';
import { ID } from '@datorama/akita';
import { Series, DfResource } from './series.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeriesService {
    constructor(private seriesStore: SeriesStore, private http: HttpClient) {

    }

    // To switch using the services, make the changes in the series-graph and series-table components.

    getAllViaDreamFactory(keyword: string, filters) {
        let params = new HttpParams();
        let dfParams = '';
        if (keyword) {
            dfParams += '(name contains ' + keyword + ')';
        }

        if (filters.itemTypes && filters.itemTypes.length > 0) {
            if (dfParams) {
                dfParams = dfParams + ' and ' + '(item_type in (' + filters.itemTypes.map(itemType => { return '"' + itemType + '"' }).join(',') + '))';
            } else {
                dfParams = 'item_type in (' + filters.itemTypes.map(itemType => { return '"' + itemType.trim() + '"' }).join(',') + ')';
            }
        }

        if (filters.seriesNames && filters.seriesNames.length > 0) {
            if (dfParams) {
                dfParams = dfParams + ' and ' + '(name in (' + filters.seriesNames.map(name => { return '"' + name + '"' }).join(',') + '))';
            } else {
                dfParams = 'name in (' + filters.seriesNames.map(name => { return '"' + name + '"' }).join(',') + ')';
            }
        }

        if (dfParams) {
            params = params.append('filter', dfParams);
        }
        params = params.append('order', 'item_type');

        return this.http.get<DfResource>(`${DFAPI}`, { params }).pipe(
            tap(series => {
                this.seriesStore.set(series.resource);
            })
        );
    }

    getAllViaJsonServer(keyword: string, filters) {
        let params = new HttpParams();
        if (keyword) {
            params = params.append('name_like', keyword);
        }

        if (filters.itemTypes && filters.itemTypes.length > 0) {
            filters.itemTypes.forEach(itemType => {
                params = params.append('item_type', itemType);
            })
        }

        if (filters.seriesNames && filters.seriesNames.length > 0) {
            filters.seriesNames.forEach(name => {
                params = params.append('name', name);
            })
        }

        params = params.append('_sort', 'item_type,name')
        params = params.append('order', 'asc,asc');

        return this.http.get<Series[]>(`${API}/series`, { params }).pipe(
            tap(series => {
                this.seriesStore.set(series);
            })
        );
    }

    getSeriesNamesViaJsonServer(keyword: string, filters): Observable<string[]> {
        let params = new HttpParams();
        let dfParams = '';
        if (keyword) {
            params = params.append('name_like', keyword);
        }
        if (filters.itemTypes && filters.itemTypes.length > 0) {
            filters.itemTypes.forEach(itemType => {
                params = params.append('item_type', itemType);
            })
        }

        if (filters.seriesNames && filters.seriesNames.length > 0) {
            filters.seriesNames.forEach(name => {
                params = params.append('name', name);
            })
        }

        params = params.append('_sort', 'name')
        params = params.append('order', 'asc');

        return this.http.get<Series[]>(`${API}/series`, { params }).pipe(
            map(series => series.map(series => series.name))
        );
    }

    getSeriesNamesViaDreamFactory(keyword: string, filters): Observable<string[]> {
        let params = new HttpParams();
        let dfParams = '';
        if (keyword) {
            dfParams += '(name contains ' + keyword + ')';
        }

        if (filters.itemTypes && filters.itemTypes.length > 0) {
            if (dfParams) {
                dfParams = dfParams + ' and ' + '(item_type in (' + filters.itemTypes.map(itemType => { return '"' + itemType + '"' }).join(',') + '))';
            } else {
                dfParams = 'item_type in (' + filters.itemTypes.map(itemType => { return '"' + itemType.trim() + '"' }).join(',') + ')';
            }
        }

        if (filters.seriesNames && filters.seriesNames.length > 0) {
            if (dfParams) {
                dfParams = dfParams + ' and ' + '(name in (' + filters.seriesNames.map(name => { return '"' + name + '"' }).join(',') + '))';
            } else {
                dfParams = 'name in (' + filters.seriesNames.map(name => { return '"' + name + '"' }).join(',') + ')';
            }
        }

        if (dfParams) {
            params = params.append('filter', dfParams);
        }
        params = params.append('order', 'name');
        return this.http.get<DfResource>(`${DFAPI}`, { params }).pipe(
            map(dfResource => dfResource.resource.map(series => series.name))
        );
    }

    upsert(series: Series) {
        this.seriesStore.upsert(series.id, series);
    }

    deleteSeries(series: Series) {
        this.seriesStore.remove(series.id);
    }

    updateFilters(filters) {
        this.seriesStore.update({ filters });
    }

    invalidateCache() {
        this.seriesStore.setHasCache(false);
    }

    updateSearchTerm(searchTerm: string) {
        this.seriesStore.update({ searchTerm });
        this.invalidateCache();
    }
}