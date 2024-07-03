export interface Pokemon {
    "count": number,
    "next": string | null,
    "previous": string | null,
    "results": PokemonDetails[]
}

export interface PokemonDetails {
  name: string;
  url: string;
  types: PokemonType[];
  base_experience: number;
  weight: number;
  stats: PokemonStats[];
  abilities: PokemonAbilities[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStats {
  base_stat: number;
  effort: number;
  stat: {name: string, url: string};
}

export interface PokemonAbilities {
  ability: {name: string, url: string};
  is_hidden: boolean;
  slot: number;
}
