import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SeriesStore } from './series.store';
// import { BaseSeries, Series, DfResource } from './series.model';
import { tap, map } from 'rxjs/operators';
import { API } from '../../../api';
import { ID } from '@datorama/akita';
import { Series, DfResource } from './series.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeriesService {
    constructor(private seriesStore: SeriesStore, private http: HttpClient) {

    }

    getSeriesByParams(keyword: string, filters) {
        let params = new HttpParams();
        let dfParams = '';
        if (keyword) {
            dfParams += 'name contains ' + keyword;
        }
        if (filters.itemTypes && filters.itemTypes.length > 0) {
            if (dfParams) {
                dfParams = dfParams + ' and ' + 'item_type in (' + filters.itemTypes.map(itemType => { return '"' + itemType + '"' }).join(',') + ')';
            } else {
                dfParams = 'item_type in (' + filters.itemTypes.map(itemType => { return '"' + itemType.trim() + '"' }).join(',') + ')';
            }
        }
        if (dfParams) {
            params = params.append('filter', dfParams);
        }
        params = params.append('order', 'item_type');

        return this.http.get<DfResource>(`${API}`, { params }).pipe(
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

    getSeriesNames(keyword: string, filters): Observable<string[]> {
        let params = new HttpParams();
        let dfParams = '';
        if (keyword) {
            dfParams += 'name contains ' + keyword;
        }
        if (filters.itemTypes && filters.itemTypes.length > 0) {
            if (dfParams) {
                dfParams = dfParams + ' and ' + 'item_type in (' + filters.itemTypes.map(itemType => '"' + itemType.trim() + '"').join(',') + ')';
            } else {
                dfParams = 'item_type in (' + filters.itemTypes.map(itemType => '"' + itemType.trim() + '"').join(',') + ')';
            }
        }
        if (dfParams) {
            params = params.append('filter', dfParams);
        }
        params = params.append('order', 'name');
        // params = params.append('fields', 'name');
        return this.http.get<DfResource>(`${API}`, { params }).pipe(
            map(dfResource => dfResource.resource.map(series => series.name))
        );
    }

    /*
    getSeriesByNames(term: string, filters) {
        let params = new HttpParams();
        if (term) {
            term = term.split(',').map(name => '"' + name.trim() + '"').join(',');
            term = 'name in (' + term + ')';
            params = params.append('filter', term);
        }
        return this.http.get<DfResource>(`${DFAPI}&order=name asc,statp asc`, { params }).pipe(
            tap(data => {
                let transformedData = data.resource.reduce((a, c) => {
                    a[c.name] = a[c.name] || {};
                    a[c.name].name = c.name;
                    a[c.name].flag = c.flag;
                    a[c.name].naics = c.naics;
                    a[c.name].item = c.item;
                    a[c.name].topic = c.topic;
                    a[c.name].subtopic = c.subtopic;
                    a[c.name].itemType = c.item_type;
                    a[c.name].dataType = c.data_type;
                    a[c.name].form = c.form;
                    a[c.name].table = c.tbl;
                    a[c.name].view = c.view;
                    a[c.name].lastUpdated = c.last_updated;
                    a[c.name].updatedBy = c.updated_by;
    
                    a[c.name].series = a[c.name].series || [];
                    a[c.name].series.push({name: c.statp, value: c.org_val});
                    return a;
                }, Object.create(null));

                this.seriesStore.set(transformedData);
            })
        );
    }
    */

    /*
    getAll(term: string, filters) {
        let params = new HttpParams();
        if (term) {
            term.split(',').forEach(name => {
                params = params = params.append('name', name.trim());
            })
        }
        if (filters.naics) {
            filters.naics.forEach(code => {
                params = params.append('naics', code);
            })
            params.append('naics', filters.naics);
        }
        if (filters.item) {
            params.append('item', filters.item);
        }
        if (filters.topic) {
            params.append('topic', filters.topic);
        }
        if (filters.subtopic) {
            params.append('subtopic', filters.subtopic);
        }
        if (filters.itemType) {
            params.append('itemType', filters.itemType);
        }
        if (filters.dataType) {
            params.append('dataType', filters.dataType);
        }
        return this.http.get<Series[]>(`${API}/series`, { params }).pipe(
            tap(series => this.seriesStore.set(series))
        );
    }
    */

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