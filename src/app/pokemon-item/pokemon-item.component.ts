import { Component, inject, Input, input, signal} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Pokemon, PokemonDetails } from '../pokemon.interface';
import { PokemonsService } from '../pokemons.service';

@Component({
  selector: 'app-pokemon-item',
  standalone: true,
  imports: [RouterModule],
  template: `
  <div class="item" [routerLink]="['/details', id]">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{{id}}.png" alt="{{pokemon.name}}">
    <h4 class="open-sans">#{{id}}</h4>
    <h3 class="open-sans">{{pokemon.name}}</h3>
  </div>
    `,
  styleUrls: ['./pokemon-item.component.css']
})
export class PokemonItemComponent {
  @Input() pokemon!: PokemonDetails;
  id: number = 1;

  ngOnInit() {
    const urlParts = this.pokemon.url.split('/');
    this.id = Number(urlParts[urlParts.length - 2]);
    this.pokemon.name = this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1);
  }
}
