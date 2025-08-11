import { Routes } from '@angular/router';
import { CitiesListComponent } from './cities-list/cities-list.component';
import { FilterPageComponent } from './filter-page/filter-page.component';
import { CityResultsComponent } from './city-results/city-results.component';
import { MasterPageComponent } from './master-page/master-page.component';

export const routes: Routes = [
  { path: '', component: MasterPageComponent },
  { path: 'list', component: CitiesListComponent },
  { path: 'filter', component: FilterPageComponent },
  { path: 'list/results/:cityId', component: CityResultsComponent }
];
