import _React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { getDatabase, ref, onValue, off } from 'firebase/database';

import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { PokemonWithKey } from '../sharedComponents/PokemonCard'; // Adjust the import path as needed
import { PokedexStyles } from '../Pokedex';
import { PokemonCard } from '../sharedComponents/PokemonCard'; // Adjust the import path as needed

export const Battle = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [battleReadyPokemons, setBattleReadyPokemons] = useState<PokemonWithKey[]>([]);

  useEffect(() => {
    const db = getDatabase();
    const user_id = localStorage.getItem('uuid') || 'default_user_id';
    const teamRef = ref(db, `world/${user_id}/team/`);

    onValue(teamRef, snapshot => {
      const pokemons: PokemonWithKey[] = [];
      snapshot.forEach(childSnapshot => {
        const pokemon = childSnapshot.val();
        if (pokemon.battleReady) {
          pokemons.push({
            ...pokemon,
            firebaseKey: childSnapshot.key,
          });
        }
      });
      setBattleReadyPokemons(pokemons);
    });

    return () => off(teamRef);
  }, []);

  // Stub function for toggleBattleStatus to satisfy the PokemonCard props
  const toggleBattleStatus = (pokemon: PokemonWithKey) => {
    console.log(`Toggling battle status for ${pokemon.pokemon_name}`);
    // Implementation would go here
  };

  return (
    <Box sx={PokedexStyles.main}>
      <NavBar />
      <Typography variant="h4" sx={{ ...PokedexStyles.header, marginTop: theme.spacing(10) }}>
        Battle Arena
      </Typography>
      <Grid container spacing={3} sx={PokedexStyles.grid}>
        {battleReadyPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.firebaseKey}
            pokemon={pokemon}
            toggleBattleStatus={toggleBattleStatus}
            releasePokemon={() => {}} // Empty function since we don't want to release from this page
          />
        ))}
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="info">{/* Snackbar message here */}</Alert>
      </Snackbar>
    </Box>
  );
};
