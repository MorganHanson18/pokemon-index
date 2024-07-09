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
      <img class="pic" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{{id}}.png" alt="{{pokemon.name}}">
    </div>
    <h4 class="open-sans">#{{id}}</h4>
    <h3 class="open-sans">{{pokemon.name}}</h3>
    <div class="row">
      <img class="type" [src]="getUrl(pTypes[0].type.name)">
      <img *ngIf="pTypes[1]" class="type" [src]="getUrl(pTypes[1].type.name)">
    </div>
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
    this.fetchPokemonDetails();
  }

  fetchPokemonDetails(): void {
    this.pokemonsService.getPokemon(this.id.toString()).subscribe((response: PokemonDetails) => {
      this.pokemon = response;
      this.pokemon.name = this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1);
      if (response.types && response.types.length > 0) {
        this.pTypes = response.types;
      }
      this.updateBackground();
    });
  }

  getUrl(type: string): string {
    const typeImgs: { [key: string]: string } = {
      normal: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/0-normalpng.png',
      fire: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/1-firepng.png',
      water: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/2-waterpng.png',
      electric: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/4-electricpng.png',
      grass: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/3-grasspng.png',
      ice: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/5-icepng.png',
      fighting: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/6-fightingpng.png',
      poison: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/7-poisonpng.png',
      ground: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/8-groundpng.png',
      flying: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/9-flyingpng.png',
      psychic: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/a-psychicpng.png',
      bug: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/b-bugpng.png',
      rock: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/c-rockpng.png',
      ghost: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/d-ghostpng.png',
      dragon: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/e-dragonpng.png',
      dark: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/f-darkpng.png',
      steel: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/g-steelpng.png',
      fairy: 'https://tiermaker.com/images/chart/chart/pokmon-type-symbols-724065/h-fairypng.png'
    }
    return typeImgs[type.toLowerCase()];
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#deccb4',
      fire: '#f5cdb8',
      water: '#dcdff7',
      electric: '#f5f2ae',
      grass: '#c5e3cc',
      ice: '#d5e8eb',
      fighting: '#f2b6b6',
      poison: '#ead1ed',
      ground: '#f5e0ae',
      flying: '#c5d9eb',
      psychic: '#ebbed1',
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
