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
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemonRounded';
import HistoryEduTwoToneIcon from '@mui/icons-material/HistoryEduTwoTone';

// internal imports
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { PokemonProps } from '../../customHooks/FetchData';
import { PokedexStyles } from '../Pokedex';
import { MessageType } from '../Auth'; 


// Type for the state array to include the firebase key
interface PokemonWithKey extends PokemonProps {
  firebaseKey: string;
}

export const PokemonSquad = () => {
  const db = getDatabase();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<MessageType>('success');
  const [pokemonSquad, setPokemonSquad] = useState<PokemonWithKey[]>([]); // Include the firebase key
  const userId = localStorage.getItem('uuid');
  const teamRef = ref(db, `teams/${userId}/`);

  useEffect(() => {
    onValue(teamRef, (snapshot) => {
      const pokemonArray: PokemonWithKey[] = []; // Explicit type
      snapshot.forEach((childSnapshot) => {
        const firebaseKey = childSnapshot.key!;
        const pokemonData = childSnapshot.val() as PokemonProps;
        pokemonArray.push({ ...pokemonData, firebaseKey });
      });
      setPokemonSquad(pokemonArray);
    });

    return () => off(teamRef);
  }, [userId]);

  const releasePokemon = async (teamItem: PokemonWithKey) => {
    const itemRef = ref(db, `teams/${userId}/${teamItem.firebaseKey}`);
    remove(itemRef)
      .then(() => {
        setMessage(`Successfully removed ${teamItem.pokemon_name} from the team.`);
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
        {pokemonSquad.map((pokemon: PokemonWithKey, index: number) => ( // Explicit type
          // Use the firebaseKey for the key instead of the poke_id
          <Grid item key={pokemon.firebaseKey} xs={12} md={4}> 
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
                  onClick={() => releasePokemon(pokemon)}
                >
                   <Typography sx = {{fontSize: '.90rem'}}>This Concludes Your Chapter With Me</Typography>
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