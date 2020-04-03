import { Injectable } from '@angular/core';
import { FavoritesStore } from './favorites.store';
import { FavoriteList } from './favorites.model';

@Injectable({providedIn: 'root'})
export class FavoritesService {
    constructor(private favoritesStore: FavoritesStore) {}
    
    add(favoriteList: FavoriteList) {
        this.favoritesStore.upsert(favoriteList.name, {
            name: favoriteList.name,
            seriesNames: favoriteList.seriesNames
        });
    }

    remove(listName: string) {
        this.favoritesStore.remove(listName);
    }
}