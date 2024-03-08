import * as React from 'react';
import { PokemonProps } from "../../customHooks/FetchData";
import { useState, useEffect } from 'react';
import { Dialog, Button } from '@mui/material'; 
import { getDatabase, ref, update } from 'firebase/database';

// internal imports
import SelectAllTransferList from './SelectAllTransferList'
import {PokemonWithKey} from './PokemonSquad'


interface EditPokemonMovesProps {
  pokemon: PokemonWithKey;
  firebaseKey: string;
  user_id: string;
}


// Updated helper functions to work with strings instead of numbers
function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}



const getPokemonMoves = async (pokemonName: string): Promise<string[]> => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Assuming 'moveEntry' is of the structure { move: { name: string } }
    return data.moves.map((moveEntry: { move: { name: string } }) => moveEntry.move.name);
  } catch (error) {
    console.error("Failed to retrieve Pokémon moves:", error);
    return [];
  }
};

export const EditPokemonMoves = ({  pokemon, firebaseKey, user_id, }: EditPokemonMovesProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [currentMoves, setCurrentMoves] = useState<string[]>(pokemon.moves.split(','));
  const db = getDatabase();
  const [selectedPokemonForEdit, setSelectedPokemonForEdit] = useState<PokemonWithKey | null>(null);    // State to control the selected Pokemon for editing moves
  const [showEditMoves, setShowEditMoves] = useState<boolean>(false);   // State to control visibility of the "Edit Moves" button
  const [pokemonTeam, setPokemonTeam] = useState<PokemonWithKey[]>([]); // Include the firebase key (whole collection)


  useEffect(() => {
    if (open) {
      getPokemonMoves(pokemon.pokemon_name).then(moves => {
        setAvailableMoves(moves); // Update the list of all available moves
      });
    }
  }, [pokemon, open]);

    // Function to open the dialog and start fetching data
    const handleOpen = async () => {
      setLoading(true);
      setOpen(true);
      const moves = await getPokemonMoves(pokemon.pokemon_name);
      setAvailableMoves(moves);
      setLoading(false);
    };

  const handleClose = () => {
    setOpen(false);
  };

    // Function to handle the save action in EditPokemonMoves
    const handleSave = async (selectedMoves: string[]) => {
      setShowEditMoves(true);
  
      // Update moves in Firebase
      const db = getDatabase();
      const pokemonRef = ref(db, `world/${user_id}/team/${firebaseKey}`);
  
        try {
          await update(pokemonRef, { moves: selectedMoves.join(', ') }); // Saves moves as a comma-separated string
          console.log("Pokemon moves updated successfully in Firebase.");
          
          // Update local state to reflect these changes
          setPokemonTeam(prevTeam => {
            const updatedTeam = prevTeam.map(pokemon => {
              if (pokemon.firebaseKey === firebaseKey) {
                return { ...pokemon, moves: selectedMoves.join(', ') };
              }
              return pokemon;
            });
            return updatedTeam;
          });
        } catch (error) {
          console.error("Failed to update Pokemon moves in Firebase:", error);
        }
  
        setSelectedPokemonForEdit(null); // Assuming this controls the dialog's visibility
      };

  return (
    <>
    <Button onClick={handleOpen}>Edit Moves</Button>
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
    {/* Render a loading indicator while waiting for the data */}
      {loading ? (
        <div>Loading moves...</div>
      ) : (
        <SelectAllTransferList
          allMoves={availableMoves}
          currentMoves={currentMoves}
          setRight={setCurrentMoves}
          onSave={handleSave}
        />
      )}
    </Dialog>
    </>
  );
};