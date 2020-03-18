import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Series } from './series.model';

export interface SeriesState extends EntityState<Series> {
    searchTerm: string;
    filters: {
        survey: string;
        from: string;
        to: string;
        naics: string[];
        items: string[];
        topic: string;
        subtopic: string;
        itemTypes: string[];
        dataType: string;
        sortBy: string;
        seriesNames: string[];
    }
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'series'})
export class SeriesStore extends EntityStore<SeriesState, Series> {
    constructor(){
        super({
            //searchTerm: 'ACSV-BV9901199, ACSV-BV9901132, ACSV-BV9901155',
            searchTerm: '',
            filters: {
                survey: 'SAS',
                from: '2014',
                to: '2018',
                naics: [],
                items: [],
                topic: null,
                subtopic: null,
                itemTypes: [],
                dataType: null,
                sortBy: 'item_type',
                seriesNames: []
            }
        });
    }
}