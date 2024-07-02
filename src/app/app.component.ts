import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {PokemonsService} from './pokemons.service'
import {Pokemon} from './pokemon.interface'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <main>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styles: [],
})
export class AppComponent {
  title = 'pokedex';
}
