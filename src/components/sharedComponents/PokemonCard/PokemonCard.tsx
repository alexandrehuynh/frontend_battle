import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Button, Accordion, AccordionSummary, AccordionDetails, Fab } from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemonRounded';
import { GiBattleGear, GiDropWeapon } from "react-icons/gi";
import { theme } from '../../../Theme/themes';
import { PokedexStyles } from '../../Pokedex';
import { PokemonProps } from '../../../customHooks/FetchData';


export interface PokemonWithKey extends PokemonProps {
    firebaseKey: string;
  }
  
  interface PokemonCardProps {
    pokemon: PokemonWithKey;
    toggleBattleStatus: (pokemon: PokemonWithKey) => void;
    releasePokemon: (pokemon: PokemonWithKey) => void;
  }
  
  export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, toggleBattleStatus, releasePokemon }) => {
    const isBattleReady = pokemon.battleReady === true;
  
    return (
      <Grid item xs={12} md={4}>
        <Card sx={{ ...PokedexStyles.card, position: 'relative' }}>
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
              top: theme.spacing(2),
              right: theme.spacing(2),
            }}
            aria-label={isBattleReady ? "unset battle status" : "set battle status"}
            onClick={() => toggleBattleStatus(pokemon)}
          >
            {isBattleReady ? <GiDropWeapon size={21} /> : <GiBattleGear size={21} />}
          </Fab>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" sx={{ color: '#f5f5dc', textTransform: 'capitalize' }}>
              {pokemon.pokemon_name}
            </Typography>
            <Typography sx={{ mb: 1.5, color: '#f5f5dc' }}>
              Pokedex #: {pokemon.pokemon_id}<br />
              Type: {pokemon.type}<br />
              Abilities: {pokemon.abilities}
            </Typography>
            <Accordion sx={{ color: '#f5f5dc', backgroundColor: theme.palette.secondary.light }}>
              <AccordionSummary expandIcon={<CatchingPokemonIcon />}>
                <Typography>Stats</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: '#f5f5dc' }}>
                  HP: {pokemon.hp}<br />
                  Attack: {pokemon.attack}<br />
                  Defense: {pokemon.defense}<br />
                  Special Attack: {pokemon.special_attack}<br />
                  Special Defense: {pokemon.special_defense}<br />
                  Speed: {pokemon.speed}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ color: '#f5f5dc', backgroundColor: theme.palette.secondary.light }}>
              <AccordionSummary expandIcon={<CatchingPokemonIcon />}>
                <Typography>Moves</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: '#f5f5dc' }}>
                  {pokemon.moves}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Box textAlign="center" sx={{ mt: 2 }}>
                <Button
                  size="medium"
                  variant="outlined"
                  sx={PokedexStyles.button}
                  onClick={() => releasePokemon(pokemon)}
                >
                   <Typography sx = {{fontSize: '.90rem'}}>Honorable Discharge</Typography>
                </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };