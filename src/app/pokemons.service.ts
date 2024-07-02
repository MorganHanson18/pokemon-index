import {HttpClient} from '@angular/common/http'
import { Injectable, inject } from '@angular/core';
import { Pokemon, PokemonDetails } from './pokemon.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {
  http = inject(HttpClient)

  getPokemons(): Observable<Pokemon> {
    return this.http.get<Pokemon>('https://pokeapi.co/api/v2/pokemon?limit=999');
  }

  getPokemon(pokemonId: number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`https://pokeapi.co/api/v2/pokemon/{{pokemonId}}`);
  }

}
