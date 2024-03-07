import * as _React  from 'react'; 
import { useState, useEffect } from 'react'; 
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Stack,
    Typography,
    Snackbar,
    Alert } from '@mui/material'; 
import InfoIcon from '@mui/icons-material/Info';
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';

// internal imports
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { PokemonProps } from '../../customHooks/FetchData';
import { PokedexStyles } from '../Pokedex';
import { MessageType } from '../Auth'; 


export const PokemonSquad = () => {
  const db = getDatabase();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentTeam, setCurrentTeam] = useState<PokemonProps[]>([]);
  const userId = localStorage.getItem('uuid');
  const teamRef = ref(db, `teams/${userId}/`);

useEffect(() => {
    onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teamList: PokemonProps[] = Object.values(data).map((item) => {
          // Here we need to check that each property exists and is the correct type
          // If your `PokemonProps` interface is simple, this might be straightforward
          // If it's complex, you may need a more sophisticated method of validation
          // For now, I'll assume a simple validation

          // Example simple validation:
          const isPokemonProps = (object: any): object is PokemonProps => {
            // check for necessary properties and types, e.g.:
            return 'poke_id' in object && typeof object.poke_id === 'string';
          };

          if (isPokemonProps(item)) {
            return item;
          } else {
            throw new Error('Invalid data structure received from Firebase');
          }
        });
        setCurrentTeam(teamList);
      } else {
        setCurrentTeam([]); // Handle the case where no data exists
      }
    });

    return () => {
      off(teamRef);
    };
  }, []);

  const removeFromTeam = async (pokemonId: string) => {
    const itemRef = ref(db, `teams/${userId}/${pokemonId}`);
    remove(itemRef)
      .then(() => {
        setMessage('Successfully removed Pokémon from your team');
        setMessageType('success');
        setOpen(true);
      })
      .catch((error) => {
        setMessage(error.message);
        setMessageType('error');
        setOpen(true);
      });
  };

  return (
    <Box sx={PokedexStyles.main}>
      <NavBar />
      <Typography variant="h4" sx={PokedexStyles.header}>
        Your Pokémon Squad
      </Typography>
      <Grid container spacing={3} sx={PokedexStyles.grid}>
        {currentTeam.map((pokemon, index) => (
          <Grid item key={pokemon.poke_id || index} xs={12} md={4}>
            <Card sx={PokedexStyles.card}>
              <CardMedia
                component="img"
                image={pokemon.image_url}
                alt={pokemon.pokemon_name}
                sx={PokedexStyles.cardMedia}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'white', textTransform: 'capitalize' }}>
                  {pokemon.pokemon_name}          
                </Typography>
                <Typography sx={{ mb: 1.5, color: 'white' }}>
                  Pokedex #: {pokemon.pokemon_id} <br />
                  Type: {pokemon.type}<br />
                  Abilities: {pokemon.abilities}
                </Typography>
                <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
                <AccordionSummary expandIcon={<CatchingPokemonIcon />}>
                  <Typography>Stats</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <Typography sx={{ color: 'white'}}>
                    HP: {pokemon.hp}<br />
                    Attack: {pokemon.attack}<br />
                    Defense: {pokemon.defense}<br />
                    Special Attack: {pokemon.special_attack}<br />
                    Special Defense: {pokemon.special_defense}<br />
                    Speed: {pokemon.speed}
                  </Typography>
                </AccordionDetails>
                </Accordion>
                <Button
                  size="medium"
                  variant="outlined"
                  sx={PokedexStyles.button}
                  onClick={() => removeFromTeam(pokemon.poke_id)}
                >
                  Remove from Team
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity={messageType}>{message}</Alert>
      </Snackbar>
    </Box>
  );
};