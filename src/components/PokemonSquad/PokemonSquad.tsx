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
    Typography,
    Snackbar,
    Fab,
    Alert } from '@mui/material'; 
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemonRounded';
import { GiDropWeapon } from "react-icons/gi";
import { GiBattleGear } from "react-icons/gi";
// import { ReactComponent as BattleReadyIcon } from '../../assets/images/boxing-gloves.svg';

// internal imports
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { PokemonProps } from '../../customHooks/FetchData';
import { PokedexStyles } from '../Pokedex';
import { MessageType } from '../Auth'; 
import { EditPokemonMoves } from './EditPokemonMoves'




// Type for the state array to include the firebase key
export interface PokemonWithKey extends PokemonProps {
  firebaseKey: string;
}

// interface EditPokemonMovesProps {
//   pokemon: PokemonWithKey | null; // Allow for null
//   firebaseKey: string;
//   userId: string | null; // Allow for null
// }


export const PokemonSquad = () => {
  const db = getDatabase();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<MessageType>('success');
  const [battleReady, setBattleReady] = useState<{ [key: string]: boolean }>({}); // Include the firebase key (team of 6)
  const [pokemonTeam, setPokemonTeam] = useState<PokemonWithKey[]>([]); // Include the firebase key (whole collection)
  // const [selectedPokemonForEdit, setSelectedPokemonForEdit] = useState<PokemonWithKey | null>(null);    // State to control the selected Pokemon for editing moves
  // const [isDialogOpen, setIsDialogOpen] = useState(false); // New state to control dialog visibility


  // Retrieve user_id from localStorage and ensure it is not null
  const user_id = localStorage.getItem('uuid') || 'default_user_id'; // Provide a default value or handle it accordingly
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
        {pokemonTeam.map((pokemon: PokemonWithKey, _index: number) => ( // Explicit type
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
                      top: theme.spacing(2), // Adjust this value to move the FAB from the top of the card
                      right: theme.spacing(2),  // Adjust this value to move the FAB from the right edge of the card
                    }}
                    aria-label="add"
                    onClick={() => toggleBattleStatus(pokemon)}
                  >
                      {battleReady[pokemon.firebaseKey] ? <GiDropWeapon size = '21' /> : <GiBattleGear size = '21' />} 
                </Fab>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: '#f5f5dc', textTransform: 'capitalize' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center' }}>
                    {pokemon.pokemon_name}   
                    {battleReady[pokemon.firebaseKey] && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <GiBattleGear style={{ fontSize: '24px', marginLeft: '1rem', marginRight: '0.25rem', color: "#bc5c2c" }} />
                        <span style={{ fontSize: '11.5px', color: "#bc5c2c"}}>Battle <br/> Ready!</span>
                      </div>
)}                  </h3>
                </Typography>
                <Typography sx={{ mb: 1.5, color: '#f5f5dc' }}>
                  Pokedex #: {pokemon.pokemon_id} <br />
                  Type: {pokemon.type}<br />
                  Abilities: {pokemon.abilities}
                </Typography>
                <Accordion sx={{ color: '#f5f5dc', backgroundColor: theme.palette.secondary.light }}>
                <AccordionSummary expandIcon={<CatchingPokemonIcon />}>
                  <Typography>Stats</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <Typography sx={{ color: '#f5f5dc'}}>
                    HP: {pokemon.hp}<br />
                    Attack: {pokemon.attack}<br />
                    Defense: {pokemon.defense}<br />
                    Special Attack: {pokemon.special_attack}<br />
                    Special Defense: {pokemon.special_defense}<br />
                    Speed: {pokemon.speed}
                  </Typography>
                </AccordionDetails>
                </Accordion>
                <div className="moves-section">
                <Accordion sx={{ color: '#f5f5dc', backgroundColor: theme.palette.secondary.light }}>
                <AccordionSummary expandIcon={<CatchingPokemonIcon />}>
                  <Typography>Moves</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: '#f5f5dc' }}>
                      {pokemon.moves}<br />
                    </Typography>

                {/* Ensure EditPokemonMoves is rendered with the current iterated pokemon */}
                <EditPokemonMoves
                  pokemon={pokemon}
                  firebaseKey={pokemon.firebaseKey}
                  user_id={user_id} // pass the non-null user_id
                />

                  </AccordionDetails>
                </Accordion>
                </div>
                <Button
                  size="medium"
                  variant="outlined"
                  sx={PokedexStyles.button}
                  onClick={() => releasePokemon(pokemon)}
                >
                   <Typography sx = {{fontSize: '.90rem'}}>Honorable Discharge</Typography>
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