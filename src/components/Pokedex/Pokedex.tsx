import * as _React from 'react';
import { useState } from 'react';

export const CatchPokemonForm = () => {
    const [pokemonName, setPokemonName] = useState('');

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
            console.log(data); // Process the response as needed
            // Optionally, provide user feedback here
        } catch (error) {
            console.error('There was an error catching the Pokemon:', error);
            // Optionally, provide user feedback here
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="pokemonName">Enter Pokemon Name:</label>
            <input
                id="pokemonName"
                type="text" // Specifying the type is a good practice.
                value={pokemonName}
                onChange={(e) => setPokemonName(e.target.value)}
                required
            />
            <button type="submit">Catch Pokemon</button>
        </form>
    );
};

export const Pokedex = () => {
    return (
        <div>
            <h1 style={{marginTop: '50px'}}>This is the Pokedex Page</h1>
            <CatchPokemonForm />
        </div>
    )
}