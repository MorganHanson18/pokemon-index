import { RouterModule, Routes } from '@angular/router';
import {PokemonListComponent} from './pokemon-list/pokemon-list.component';
import { DetailsComponent } from './details-component/details-component';
import { NgModule } from '@angular/core';

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

@NgModule({
  imports: [RouterModule.forRoot(routeConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
