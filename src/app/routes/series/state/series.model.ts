import { ID } from '@datorama/akita';

export interface Series {
    id: ID;
    name: string;
    flag: string;
    naics: string;
    item: string;
    topic: string;
    subtopic: string;
    item_type: string;
    data_type: string;
    form: string;
    tbl: string;
    view: string;
    last_updated: string;
    val2018a1: string;
    val2017a1: string;
    val2016a1: string;
    val2015a1: string;
}

export interface DfResource {
    resource: Series[]
}