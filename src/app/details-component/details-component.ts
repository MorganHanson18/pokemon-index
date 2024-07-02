import { Component, inject, OnInit,} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import{Pokemon, PokemonDetails} from '../pokemon.interface'
import {PokemonsService} from '../pokemons.service'
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  template:`
    <div *ngIf="pokemon">
      <h1>{{ pokemon.name }}</h1>
      <h2>Details work</h2>
      <a [routerLink]="['']">Back</a>
    </div>
  `,
  styleUrls: [],
})

export class DetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  pokemonsService = inject(PokemonsService);
  pokemon?: PokemonDetails;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log('Extracted ID:', id); // Add this line to debug
    this.pokemonsService.getPokemon(id).subscribe(
      data => this.pokemon = data,
    );
  }
}
