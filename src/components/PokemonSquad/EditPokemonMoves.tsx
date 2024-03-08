import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getDatabase, ref, update } from 'firebase/database';
import SelectAllTransferList from './SelectAllTransferList';
import { PokemonWithKey } from './PokemonSquad'; // Ensure this import path is correct


interface EditPokemonMovesProps {
  pokemon: PokemonWithKey;
  firebaseKey: string;
  user_id: string;
}


const getPokemonMoves = async (pokemonName: string): Promise<string[]> => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Define an explicit type for the moveEntry parameter
    return data.moves.map((moveEntry: { move: { name: string } }) => moveEntry.move.name);
  } catch (error) {
    console.error("Failed to retrieve Pokémon moves:", error);
    return [];
  }
};



export const EditPokemonMoves = ({ pokemon, firebaseKey, user_id }: EditPokemonMovesProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [currentMoves, setCurrentMoves] = useState<string[]>(pokemon.moves.split(','));

  useEffect(() => {
    if (open) {
      setLoading(true);
      getPokemonMoves(pokemon.pokemon_name).then(moves => {
        setAvailableMoves(moves);
        setLoading(false);
      });
    }
  }, [pokemon, open]);

  const handleSave = async (selectedMoves: string[]) => {
    // Update moves in Firebase
    const pokemonRef = ref(getDatabase(), `world/${user_id}/team/${firebaseKey}`);

    try {
      await update(pokemonRef, { moves: selectedMoves.join(', ') });
      console.log("Pokemon moves updated successfully in Firebase.");
    } catch (error) {
      console.error("Failed to update Pokemon moves in Firebase:", error);
    }

    setOpen(false); // Close the dialog after saving
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit Moves</Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Moves for {pokemon.pokemon_name}</DialogTitle>
        <DialogContent>
          {loading ? (
            <div>Loading moves...</div>
          ) : (
            <SelectAllTransferList
              allMoves={availableMoves}
              currentMoves={currentMoves}
              setRight={setCurrentMoves}
              onSave={handleSave} // This function must return a Promise<void>
              />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};