import { Routes } from '@angular/router';
import {PokemonListComponent} from './pokemon-list/pokemon-list.component';
import { DetailsComponent } from './details-component/details-component';

export const routeConfig: Routes = [
    {
        path: ``,
        component: PokemonListComponent,
        title: 'Pokemons'
    },
    {
      path: 'details/:id',
      component: DetailsComponent,
      title: 'Pokemon Details',
    },
];

export default routeConfig;

