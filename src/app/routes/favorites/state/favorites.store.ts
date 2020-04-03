import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { FavoriteList } from './favorites.model';
import { Injectable } from '@angular/core';

export interface FavoritesState extends EntityState<FavoriteList> { };

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'favorites' })
export class FavoritesStore extends EntityStore<FavoritesState, FavoriteList> {
    constructor() {
        super();
    }
}