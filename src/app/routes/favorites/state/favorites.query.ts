import { Injectable } from "@angular/core";
import { QueryEntity } from '@datorama/akita';
import { FavoritesState, FavoritesStore } from './favorites.store';
import { FavoriteList } from './favorites.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class FavoritesQuery extends QueryEntity<FavoritesState, FavoriteList> {
    selectTotal$ = this.selectAll().pipe(
        map(lists => lists.length)
    );
    constructor(protected store: FavoritesStore) {
        super(store);
    }
}