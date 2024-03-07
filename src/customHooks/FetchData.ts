import * as _React from 'react';
// internal imports
// import { serverCalls } from '../api'; 

// WE are creating a custom hook to make API calls every time we go to the Shop page. 

// creaating our interfaces for our shop data & return of our hook

export interface PokemonProps {
  poke_id: string; // The unique UUID
  pokemon_id: string; // The Pokémon number
  pokemon_name: string;
  image_url: string; // This will map to sprites.front_default
  shiny_image_url?: string; // This will map to sprites.front_shiny
  base_experience: number;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  type: string;
  abilities: string;
  moves: string;
  date_added: string;
  user_id?: string;
  // Optional: If you want to keep sprites for additional flexibility
  sprites?: {
    front_default?: string;
    front_shiny?: string;
  };
  firebaseKey?: string; // Assuming this is for some Firebase integration
}
  

interface GetPokemonDataProps {
    PokemonData: PokemonProps[]
    getData: () => void
}

