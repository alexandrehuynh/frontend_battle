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
    Fab,
    Link
} from '@mui/material'; 
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemonTwoTone';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { getDatabase, ref, push } from 'firebase/database';



// internal imports
// import { useGetShop, PokemonProps } from '../../customHooks';
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { PokemonProps } from '../../customHooks/FetchData';
import { MaterialUISwitch } from '../../Theme/themes';
import wildImage from '../../assets/images/wild.jpg'; 

// creating our Shop CSS style object 
export const PokedexStyles = {
    main: {
        backgroundColor: theme.palette.secondary.main,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)), url(${wildImage})`,
        height: '100%',
        width: '100%',
        color: '#f5f5dc',
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
        width: '100%', /* take as much width as possible, up to the container's width */
        height: 'auto', /* scale the height automatically to maintain aspect ratio */
        margin: '10px auto', // Center image
        // border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    button: {
        color: '#f5f5dc', 
        borderRadius: '50px',
        height: '45px',
        width: '250px',
        marginTop: '20px'
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
        marginLeft: '12.5vw', // Controls the left margin of the text
        color: "#f5f5dc", // The color of the text
        marginTop: '100px' // The top margin of the text
    },
    header: {
        color: "#f5f5dc",
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        // You can add more style properties as needed
      }

}

interface CatchPokemonFormProps {
    onPokemonCapture: (pokemon: PokemonProps) => void;
}

interface PokemonCardProps {
    pokemon: PokemonProps;
    onAddToTeam: (pokemon: PokemonProps) => void;
  }
  

// CatchPokemonForm component
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
                setSnackbarMessage('Pokémon Found successfully!');
                setAlertSeverity('success');
                if (data.pokemon) {  // Make sure the `pokemon` key exists in the response
                    console.log('Data to capture:', data.pokemon); // This should be the actual Pokémon data
                    onPokemonCapture(data.pokemon);
                } else {
                    console.error('Pokemon data is missing in the response');
                }
            } else {
                setSnackbarMessage('Failed to find Pokémon. Try again!');
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
          <Box component="form" onSubmit={handleSubmit} sx={{ ...PokedexStyles.stack, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
            <Typography component="label" htmlFor="pokemonName" sx={{ color: '#f5f5dc', paddingTop: '10px',fontSize: '1rem', mr: 1.5, fontWeight: 'bold' }}>
              Enter Pokémon Name:
            </Typography>
            <input
              id="pokemonName"
              type="text"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              required
              style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '250px', marginBottom: '10px' }}
            />
            <Button type="submit" sx={{ ...PokedexStyles.button, backgroundColor: theme.palette.primary.main, width: '200px', height: '40px' }}>
              Search Pokémon
            </Button>
          </Box>
          <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={alertSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      );
    };

// PokemonCard component
export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onAddToTeam }) => {
    const [showShiny, setShowShiny] = useState(false);
    
    // Function to handle adding Pokemon to team
    const handleAddToTeamClick = () => {
    const pokemonWithShinyStatus = { ...pokemon, isShiny: showShiny };
    onAddToTeam(pokemonWithShinyStatus);
  };

    return (
      <Card sx={PokedexStyles.card}>
        <CardMedia
          component="img"
          image={showShiny ? pokemon.shiny_image_url || pokemon.image_url : pokemon.image_url}
          alt={pokemon.pokemon_name}
          sx={PokedexStyles.cardMedia}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ color: '#f5f5dc', textTransform: 'capitalize' }}>
            {pokemon.pokemon_name}          
            <MaterialUISwitch
                checked={showShiny}
                onChange={() => setShowShiny(!showShiny)}
                name="toggleShiny"
            />
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
        <Fab variant="extended" size="medium" color="primary"  aria-label="add" onClick={handleAddToTeamClick} sx={{ mt: 2 }}>
            <GroupAddIcon sx={{ mr: 1 }} />
            Add To Team
        </Fab>
        </CardContent>
      </Card>
    );
  };


// Pokedex component
export const Pokedex = () => {
    const [capturedPokemons, setCapturedPokemons] = useState<PokemonProps[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const pokedexLink = "https://www.pokemon.com/us/pokedex/";

    const handlePokemonCapture = (pokemon: PokemonProps) => {
      setCapturedPokemons((prevPokemons) => [...prevPokemons, pokemon]);
    };
  
    const handleAddToTeam = async (pokemon: PokemonProps & { isShiny: boolean }) => {
        const user_id = localStorage.getItem('uuid');
        const teamRef = ref(getDatabase(), `world/${user_id}/team/`);
      
        try {
          await push(teamRef, {
            ...pokemon,
            // Save the image based on the isShiny status
            image_url: pokemon.isShiny ? pokemon.shiny_image_url : pokemon.image_url
          });
          setSnackbarMessage(`Successfully caught and added ${pokemon.pokemon_name} to the team `);
          setSnackbarSeverity('success');
        } catch (error) {
          setSnackbarMessage('Failed to catch Pokémon.');
          setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
      };
  
    return (
      <Box sx={PokedexStyles.main}>
        <NavBar />
        <Typography variant="h4" sx={PokedexStyles.typography}>
          Pokedex 
        <Link href={pokedexLink}
            target="_blank" rel="noopener" // for security
            sx={{ color: 'maroon', textDecoration: 'none', ml: 2, 
                fontSize: '1rem', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
          need help finding one?
        </Link>
        </Typography>
        <CatchPokemonForm onPokemonCapture={handlePokemonCapture} />
        <Grid container spacing={2} sx={PokedexStyles.grid}>
          {capturedPokemons.length > 0 ? (
            capturedPokemons.map((pokemon, index) => (
              <Grid item xs={12} sm={6} md={4} key={pokemon.poke_id || index}>
                <PokemonCard pokemon={pokemon} onAddToTeam={handleAddToTeam} />
              </Grid>
            ))
          ) : 
          (<Typography sx={{ color: '#f5f5dc' }}>The World Awaits... patiently</Typography>)
          }
        </Grid>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
      <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
    </Snackbar>
      </Box>
    );
  };