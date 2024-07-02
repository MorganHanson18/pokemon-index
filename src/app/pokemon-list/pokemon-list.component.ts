import { Component, computed, inject, signal} from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { Pokemon } from '../pokemon.interface';
import {PokemonItemComponent} from '../pokemon-item/pokemon-item.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {PokemonsService} from '../pokemons.service'


@Component({
    selector: 'app-pokemon-list',
    standalone: true,
    imports: [PokemonItemComponent, CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="header">
      <h1 class="open-sans">Pokedex</h1>
    </div>
    <form [formGroup]="applyForm">
      <div class="search">
        <input type="text" formControlName="searchQuery" placeholder="search..." class="open-sans">
      </div>
    </form>
    <div class="item">
      <ul *ngFor="let pokemon of filteredPokemons">
        <app-pokemon-item [pokemon]="pokemon"></app-pokemon-item>
      </ul>
    </div>`,
    styleUrls: ['./pokemon-list.component.css']
  })

  export class PokemonListComponent {
    pokemons: { name: string; url: string }[] = [];
    filteredPokemons: { name: string; url: string }[] = [];

    applyForm = new FormGroup({
      searchQuery: new FormControl(''),
    });

    constructor(private pokemonsService: PokemonsService) {
      this.pokemonsService.getPokemons().subscribe((response: Pokemon) => {
        this.pokemons = response.results;
        this.filteredPokemons = [...this.pokemons];
      });

      this.applyForm.get('searchQuery')?.valueChanges.subscribe((value: string | null) => {
        if (value !== null) {
          this.filterPokemons(value);
        }
      });
    }

    filterPokemons(query: string): void {
      query = query.toLowerCase().trim();

      if (query === '') {
        this.filteredPokemons = [...this.pokemons]; // Show all pokemons if search query is empty
      } else {
        this.filteredPokemons = this.pokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(query)
        );
      }
    }
  }
