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
    Fab,
    Alert } from '@mui/material'; 
import InfoIcon from '@mui/icons-material/Info';
import { getDatabase, ref, onValue, off, remove, set, update } from 'firebase/database';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemonRounded';
import HistoryEduTwoToneIcon from '@mui/icons-material/HistoryEduTwoTone';
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AiOutlineUsergroupDelete } from "react-icons/ai";

// internal imports
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { PokemonProps } from '../../customHooks/FetchData';
import { PokedexStyles } from '../Pokedex';
import { MessageType } from '../Auth'; 
import { AddIcCallTwoTone } from '@mui/icons-material';
// import { ReactComponent as BoxingGlovesIcon } from '../../assets/images/boxing-gloves.svg';




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
      const pokemonArray: PokemonWithKey[] = [];
      const newBattleReadyState: { [key: string]: boolean } = {};
      snapshot.forEach((childSnapshot) => {
        const firebaseKey = childSnapshot.key!;
        const pokemonData = childSnapshot.val() as PokemonProps;
        pokemonArray.push({ ...pokemonData, firebaseKey });
  
        // Initialize the battle ready state based on the firebase data
        newBattleReadyState[firebaseKey] = !!pokemonData.battleReady;
      });
      setPokemonTeam(pokemonArray);
      setBattleReady(newBattleReadyState); // Set the battleReady state with data from Firebase
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
            <Card sx={{...PokedexStyles.card, position: 'relative'}}>
              <CardMedia
                component="img"
                image={pokemon.image_url}
                alt={pokemon.pokemon_name}
                sx={PokedexStyles.cardMedia}
              />
                <Fab
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: theme.spacing(2), // Adjust this value to move the FAB from the bottom of the card
                      right: theme.spacing(2),  // Adjust this value to move the FAB from the right edge of the card
                    }}
                    aria-label="add"
                    onClick={() => toggleBattleStatus(pokemon)}
                  >
                      {battleReady[pokemon.firebaseKey] ? <AiOutlineUsergroupDelete size = '21' /> : <AiOutlineUsergroupAdd size = '21' />} 
                </Fab>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'white', textTransform: 'capitalize' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center' }}>
                    {pokemon.pokemon_name}   
                    {battleReady[pokemon.firebaseKey] && <AiOutlineUsergroupAdd style={{ marginLeft: '0.5rem' }} />}
                  </h2>
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