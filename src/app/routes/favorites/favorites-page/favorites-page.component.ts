import { Component, OnInit } from '@angular/core';
import { FavoritesQuery } from '../state/favorites.query';
import { FavoritesService } from '../state/favorites.service';

@Component({
  selector: 'steps-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss']
})
export class FavoritesPageComponent implements OnInit {
  lists$ = this.favoritesQuery.selectAll();
  count$ = this.favoritesQuery.selectCount();

  isVisible=false;
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  constructor(private favoritesQuery: FavoritesQuery,
    private favoritesService: FavoritesService) { }

  ngOnInit() {
  }



}
