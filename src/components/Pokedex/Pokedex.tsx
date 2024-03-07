import * as _React from 'react'; 
// import React from 'react'; 
import { useState } from 'react';
import {
    Box,
    Typography,
    Snackbar,
    Alert,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme
} from '@mui/material'; 
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';



// internal imports
// import { useGetShop, PokemonProps } from '../../customHooks';
import { NavBar, InputText } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { MessageType } from '../Auth';
import { PokemonProps } from '../../customHooks/FetchData';

// creating our Shop CSS style object 
export const PokedexStyles = {
    main: {
        backgroundColor: theme.palette.secondary.main,
        height: '100%',
        width: '100%',
        color: 'white',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: 'fixed',
        position: 'absolute',
        overflow: 'auto',
        paddingBottom: '100px'
    },
    grid: {
        marginTop: '25px', 
        marginRight: 'auto', 
        marginLeft: 'auto', 
        width: '70vw', // Consider using max-width to make this more responsive
        display: 'flex', // Added to align cards in a grid fashion
        justifyContent: 'center', // Center cards horizontally
        flexWrap: 'wrap' // Wrap the cards to the next line when the width is not enough
    },
    card: {
        width: "300px", // Fixed width for consistency
        padding: '10px',
        display: "flex",
        flexDirection: "column",
        justifyContent: 'space-between', // Space out the child elements
        backgroundColor: theme.palette.secondary.light,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px',
        marginBottom: '20px', // Add space between the cards when they wrap
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' // Add a subtle shadow for depth
    },
    cardMedia: {
        height: '200px', // Fixed height for consistency
        width: '200px', // Fixed width for consistency
        margin: '10px auto', // Center image
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    button: {
        color: 'white', 
        borderRadius: '50px',
        height: '45px',
        width: '250px',
        marginTop: '10px'
    },
    stack: {
        width: '75%', 
        marginLeft: 'auto', 
        marginRight: 'auto'
    },
    stack2: {
        border: '1px solid', 
        borderColor: theme.palette.primary.main, 
        borderRadius: '50px', 
        width: '100%',
        marginTop: '10px'
    },
    typography: { 
        marginLeft: '5vw', // Controls the left margin of the text
        color: "white", // The color of the text
        marginTop: '100px' // The top margin of the text
    },

}

interface PokedexProps {
    pokemon: PokemonProps; // The Pokémon data to display
  }

interface CatchPokemonFormProps {
    onPokemonCapture: (pokemon: PokemonProps) => void;
}

export const CatchPokemonForm: React.FC<CatchPokemonFormProps> = ({ onPokemonCapture }) => {
    const [pokemonName, setPokemonName] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backend-battle.onrender.com/api/catch-pokemon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pokemon_name: pokemonName }),
            });
            const data = await response.json();
            console.log('Fetched data:', data); // Check the fetched data structure
            if (response.ok) {
                // Assuming the actual Pokemon data is in the `data.pokemon` property
                setSnackbarMessage('Pokémon caught successfully!');
                setAlertSeverity('success');
                if (data.pokemon) {  // Make sure the `pokemon` key exists in the response
                    console.log('Data to capture:', data.pokemon); // This should be the actual Pokémon data
                    onPokemonCapture(data.pokemon);
                } else {
                    console.error('Pokemon data is missing in the response');
                }
            } else {
                setSnackbarMessage('Failed to catch Pokémon. Try again!');
                setAlertSeverity('error');
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while catching Pokémon.');
            setAlertSeverity('error');
            console.error('There was an error catching the Pokemon:', error);
        }
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="pokemonName">Enter Pokemon Name:</label>
                <input
                    id="pokemonName"
                    type="text"
                    value={pokemonName}
                    onChange={(e) => setPokemonName(e.target.value)}
                    required
                />
                <button type="submit">Catch Pokemon</button>
            </form>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={alertSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};
const PokemonDisplay: React.FC<{ pokemon: PokemonProps }> = ({ pokemon }) => {
    const [showShiny, setShowShiny] = useState(false);
    const theme = useTheme();
  
    return (
      <Box sx={ PokedexStyles.main}>
        <Card sx={PokedexStyles.card}>
          <CardMedia
            component="img"
            image={showShiny ? pokemon.shiny_image_url || pokemon.image_url : pokemon.image_url}
            alt={pokemon.pokemon_name}
            sx={PokedexStyles.cardMedia}
            />
          <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="div" sx={{ color: 'white', textTransform: 'capitalize' }}>
              {pokemon.pokemon_name} (#{pokemon.pokemon_id})
            </Typography>
            <Typography sx={{ mb: 1.5, color: 'white' }}>
              Type: {pokemon.type}<br />
              Abilities: {pokemon.abilities}
            </Typography>
            <Button sx={{mb: 2}} variant="outlined" onClick={() => setShowShiny(!showShiny)}>
              Toggle Shiny Image
            </Button>
            <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
              <AccordionSummary expandIcon={<CatchingPokemonIcon />}>
                <Typography>Moves</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {pokemon.moves}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
              <AccordionSummary expandIcon={<CatchingPokemonIcon />}>
                <Typography>Stats</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  HP: {pokemon.hp}<br />
                  Attack: {pokemon.attack}<br />
                  Defense: {pokemon.defense}<br />
                  Special Attack: {pokemon.special_attack}<br />
                  Special Defense: {pokemon.special_defense}<br />
                  Speed: {pokemon.speed}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </Box>
    );
  };
  
  export const Pokedex = () => {
    const [capturedPokemons, setCapturedPokemons] = useState<PokemonProps[]>([]);
  
    const handlePokemonCapture = (pokemon: PokemonProps) => {
      setCapturedPokemons(prevPokemons => [...prevPokemons, pokemon]);
    };
  
    return (
      <Box sx={PokedexStyles.main}>
        <NavBar />
        <Typography variant='h4' sx={PokedexStyles.typography}>
          Pokedex
        </Typography>
        <CatchPokemonForm onPokemonCapture={handlePokemonCapture} />
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {capturedPokemons.length > 0 ? (
            capturedPokemons.map((pokemon, index) => (
              <Grid item xs={12} sm={6} md={4} key={pokemon.poke_id || index}>
                <PokemonDisplay pokemon={pokemon} />
              </Grid>
            ))
          ) : (
            <Typography sx={{ color: 'white' }}>No Pokémon captured yet.</Typography>
          )}
        </Grid>
      </Box>
    );
  };