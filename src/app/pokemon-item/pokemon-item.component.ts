import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { PokemonDetails, PokemonType } from '../pokemon.interface';
import { NgFor, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonsService } from '../pokemons.service';
import chroma from 'chroma-js';
@Component({
  selector: 'app-pokemon-item',
  standalone: true,
  imports: [RouterModule, NgFor, CommonModule],
  template: `
  <div class="item" [routerLink]="['/details', id]">
    <div class="pokemon-img">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{{id}}.png" alt="{{pokemon.name}}">
    </div>
    <h4 class="open-sans">#{{id}}</h4>
    <h3 class="open-sans">{{pokemon.name}}</h3>
  </div>
    `,
  styleUrls: ['./pokemon-item.component.css']
})
export class PokemonItemComponent implements OnInit{
  @Input() pokemon!: PokemonDetails;
  @Input() pTypes!: PokemonType[];
  pokemonsService = inject(PokemonsService);
  id: number = 1;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const urlParts = this.pokemon.url.split('/');
    this.id = Number(urlParts[urlParts.length - 2]);
    this.pokemon.name = this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1);
    this.fetchPokemonDetails();
  }

  fetchPokemonDetails(): void {
    this.pokemonsService.getPokemon(this.id.toString()).subscribe((response: PokemonDetails) => {
      this.pokemon = response;
      if (response.types && response.types.length > 0) {
        this.pTypes = response.types;
      }
      this.updateBackground();
    });
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#deccb4',
      fire: '#f0c4bb',
      water: '#dcdff7',
      electric: '#f5f2ae',
      grass: '#c5e3cc',
      ice: '#d5e8eb',
      fighting: '#dbcbc1',
      poison: '#ead1ed',
      ground: '#f5e0ae',
      flying: '#c5d9eb',
      psychic: '#e0c1d5',
      bug: '#eaf7b5',
      rock: '#dbd6d0',
      ghost: '#c3b4d1',
      dragon: '#d1d5e6',
      dark: '#acacad',
      steel: '#a8aaad',
      fairy: '#f7d7f5'
    };
    return typeColors[type.toLowerCase()];
  }

  updateBackground(): void {
    let topColor = 'white';
    let bottomColor = 'white';
    let dark = 'grey';

    if (this.pTypes && this.pTypes.length > 0) {
      topColor = this.getTypeColor(this.pTypes[0].type.name);
      bottomColor = topColor;
      dark = chroma(topColor).darken(0.25).hex();
      if (this.pTypes.length > 1) {
        bottomColor = this.getTypeColor(this.pTypes[1].type.name);
      }
    }
    this.elementRef.nativeElement.style.setProperty('--bg-top', topColor);
    this.elementRef.nativeElement.style.setProperty('--bg-bottom', bottomColor);
    this.elementRef.nativeElement.style.setProperty('--border', dark);

  }
}
