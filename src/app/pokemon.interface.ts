export interface Pokemon {
    "count": number,
    "next": string | null,
    "previous": string | null,
    "results": { name: string; url: string }[]
}

export interface PokemonDetails {
  name: string;
  url: string;
}
