import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { ThemeProvider } from "@mui/material/styles";
import { FirebaseAppProvider } from 'reactfire'; 
import 'firebase/auth'; 


// internal imports 
import { Home, Auth, Pokedex, Battle, PokemonSquad} from './components'; 
import './index.css'
import { theme } from './Theme/themes';
import { firebaseConfig } from './firebaseConfig'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ThemeProvider theme = { theme }>
      <Router>
          <Routes>
            <Route path='/' element={<Home title = {"Pokemon Battle"}/>} />
            <Route path='/auth' element={<Auth title = {"Trainers' Regristration"}/>} />
            <Route path='/pokedex' element={<Pokedex />} />
            <Route path='/squad' element={<PokemonSquad />} />
            <Route path='/battle' element={<Battle />} />
          </Routes>
        </Router>
      </ThemeProvider>
      </FirebaseAppProvider>
  </React.StrictMode>,
)