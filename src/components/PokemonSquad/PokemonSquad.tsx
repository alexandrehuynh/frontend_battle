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
    Chip,
    Alert } from '@mui/material'; 
import InfoIcon from '@mui/icons-material/Info';
import { getDatabase, ref, onValue, off, remove, set, update } from 'firebase/database';
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
  const [battleReady, setBattleReady] = useState<{ [key: string]: boolean }>({}); // Include the firebase key (team of 6)
  const [pokemonTeam, setPokemonTeam] = useState<PokemonWithKey[]>([]); // Include the firebase key (whole collection)
  const user_id = localStorage.getItem('uuid');
  const teamRef = ref(db, `world/${user_id}/team/`);

  useEffect(() => {
    onValue(teamRef, (snapshot) => {
      const pokemonArray: PokemonWithKey[] = []; // Explicit type
      snapshot.forEach((childSnapshot) => {
        const firebaseKey = childSnapshot.key!;
        const pokemonData = childSnapshot.val() as PokemonProps;
        pokemonArray.push({ ...pokemonData, firebaseKey });
      });
      setPokemonTeam(pokemonArray);
    });

    return () => off(teamRef);
  }, [user_id]);


  const releasePokemon = async (teamItem: PokemonWithKey) => {
    const itemRef = ref(db, `world/${user_id}/team/${teamItem.firebaseKey}/`);
    remove(itemRef)
      .then(() => {
        setMessage(`With a sad heart, ${teamItem.pokemon_name} has been release from the squad.`);
        setMessageType('success');
        setOpen(true);
      })
      .catch((error) => {
        setMessage(error.message);
        setMessageType('error');
        setOpen(true);
      });
  };

  const toggleBattleStatus = async (pokemon: PokemonWithKey) => {
    // Calculate the number of Pokemon currently marked as battle ready
    const battleReadyCount = Object.values(battleReady).filter(isBattleReady => isBattleReady).length;
    
    // Check if the Pokemon is already battle ready
    const isCurrentlyBattleReady = battleReady[pokemon.firebaseKey];
  
    // If trying to add and the battle ready count is already 6, return early.
    if (battleReadyCount >= 6 && !isCurrentlyBattleReady) {
      setMessage("You can't add more than 6 Pokémon to your battle team!");
      setMessageType('error');
      setOpen(true);
      return;
    }
  
    // Toggle the battle ready state for the selected Pokémon
    setBattleReady((prevState) => ({
      ...prevState,
      [pokemon.firebaseKey]: !prevState[pokemon.firebaseKey],
    }));
  
    // Update Firebase with the new status (assuming you have a 'battleReady' field in Firebase)
    const pokemonRef = ref(db, `world/${user_id}/team/${pokemon.firebaseKey}`);
    await update(pokemonRef, { battleReady: !battleReady[pokemon.firebaseKey] });
  };


  return (
    <Box sx={PokedexStyles.main}>
      <NavBar />
      <Typography variant="h4" sx={{ ...PokedexStyles.header, marginTop: theme.spacing(10) }}>
        Your Pokémon Squad
      </Typography>
      <Grid container spacing={3} sx={PokedexStyles.grid}>
        {pokemonTeam.map((pokemon: PokemonWithKey, index: number) => ( // Explicit type
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
                <Button
                size="medium"
                variant="outlined"
                sx={PokedexStyles.button}
                onClick={() => toggleBattleStatus(pokemon)}
              >
                Reporting for Duty!
              </Button>
              {battleReady[pokemon.firebaseKey] && (
                <Chip
                  icon={<CatchingPokemonIcon />}
                  label="Battle Ready"
                  color="success"
                  size="small"
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                />
              )}
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