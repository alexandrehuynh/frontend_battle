import _React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { getDatabase, ref, onValue, off } from 'firebase/database';


import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { PokemonWithKey } from '../sharedComponents/PokemonCard'; 
import { PokedexStyles } from '../Pokedex';
import { PokemonCard } from '../sharedComponents/PokemonCard'; 


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
            showBattleButton={false} // Prop to hide battle status button
            showDischargeButton={false} // Prop to hide discharge button
          />
        ))}
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="info">{/* Snackbar message here */}</Alert>
      </Snackbar>
    </Box>
  );
};
