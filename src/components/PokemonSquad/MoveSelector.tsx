import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Chip, Button, Dialog, List, ListItem, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// interal imports
import { PokemonProps } from '../../customHooks/FetchData';



interface MoveSelectorProps {
  pokemon: {
    moves: string[];
    // ... other properties of the pokemon
  };
  onSaveMoves: (moves: string[]) => void;
}



// Assume you have a moves object which contains all possible moves
const allPossibleMoves = ["Tackle", "Thunderbolt", "Quick Attack", "Hyper Beam"];

export const MoveSelector: React.FC<MoveSelectorProps> = ({ pokemon, onSaveMoves }) => {
  const [selectedMoves, setSelectedMoves] = useState(pokemon.moves.slice(0, 4));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempSelectedMoves, setTempSelectedMoves] = useState(selectedMoves);

  const handleDelete = (moveToDelete) => {
    setSelectedMoves(selectedMoves.filter(move => move !== moveToDelete));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setTempSelectedMoves(selectedMoves);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMoveChange = (move) => {
    if (tempSelectedMoves.includes(move)) {
      setTempSelectedMoves(tempSelectedMoves.filter(m => m !== move));
    } else if (tempSelectedMoves.length < 4) {
      setTempSelectedMoves([...tempSelectedMoves, move]);
    }
  };

  const handleDialogConfirm = () => {
    setSelectedMoves(tempSelectedMoves);
    setDialogOpen(false);
    // Update backend here if necessary
  };

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div>Moves</div>
        </AccordionSummary>
        <AccordionDetails>
          {selectedMoves.map((move, index) => (
            <Chip key={index} label={move} onDelete={() => handleDelete(move)} />
          ))}
          {selectedMoves.length < 4 && (
            <Button onClick={handleDialogOpen}>Add Move</Button>
          )}
        </AccordionDetails>
      </Accordion>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <List>
          {allPossibleMoves.map((move, index) => (
            <ListItem key={index}>
              <Checkbox
                edge="start"
                checked={tempSelectedMoves.includes(move)}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': `checkbox-list-label-${move}` }}
                onChange={() => handleMoveChange(move)}
              />
              {move}
            </ListItem>
          ))}
        </List>
        <Button onClick={handleDialogConfirm}>Confirm</Button>
      </Dialog>
    </>
  );
}
