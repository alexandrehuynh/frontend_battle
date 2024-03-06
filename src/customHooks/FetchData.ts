import * as _React from 'react';
import { useState, useEffect } from 'react'; 

// internal imports
import { serverCalls } from '../api'; 

// WE are creating a custom hook to make API calls every time we go to the Shop page. 

// creaating our interfaces for our shop data & return of our hook

export interface PokemonProps {
    poke_id: string;
    pokemon_name: string;
    image_url: string; // This will map to sprites.front_default
    shiny_image_url?: string; // This will map to sprites.front_shiny
    moves: string; // Assuming this is a comma-separated string or JSON string of moves
    type: string; // Assuming this is a single type or comma-separated string of types
    abilities: string; // Assuming this is a comma-separated string or JSON string of abilities
    date_added: string;
    user_id?: string;
    // Optional: If you want to keep sprites for additional flexibility
    sprites?: {
      front_default?: string;
      front_shiny?: string;
    };
    // Add properties for stats
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
    hp: number;
    base_experience: number; // Optional, if you want to track the base experience
    firebaseKey?: string; // Assuming this is for some Firebase integration
  }
  

interface GetPokemonDataProps {
    PokemonData: PokemonProps[]
    getData: () => void
}

