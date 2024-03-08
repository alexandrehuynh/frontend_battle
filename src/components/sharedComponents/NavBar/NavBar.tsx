import * as _React from 'react';
import { useState } from 'react'; //useState is a React Hook
import {
    Button,
    Drawer, 
    ListItemButton,
    List,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Stack, //flexbox
    Typography,
    Divider, //this is literally just a line
    CssBaseline,
    Box //this is just a div 
} from '@mui/material'; 
import { useNavigate } from 'react-router-dom'; 
import { SiPokemon } from "react-icons/si";
import PokedexIcon from '@mui/icons-material/TravelExplore';
// import PokedexIcon from '../../../../dist/pikachu.png';
// import BattleIcon from '@mui/icons-material/SportsKabaddi';
import { GiNinjaHeroicStance } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";
// import TeamIcon from '@mui/icons-material/Groups3';
import { GiFamilyHouse } from "react-icons/gi";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { signOut, getAuth } from 'firebase/auth'; 


//internal imports
import { theme } from '../../../Theme/themes'; 


// building a CSS object/dictionary to reference inside our html for styling
const drawerWidth = 200; 


const navStyles = {
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp, //number 
            duration: theme.transitions.duration.leavingScreen //string calculation of the duration
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut, //number 
            duration: theme.transitions.duration.enteringScreen //string calculation of the duration
        })
    },
    menuButton: {
        marginRight: theme.spacing(2) //default to 8px * 2 = 16px
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#f5f5dc'
    },
    drawerHeader: {
        display: 'flex',
        width: drawerWidth,
        alignItems: 'center',
        padding: theme.spacing(1),
        // using the spread operator ... to grab all the properties from the default toolbar in theme
        ...theme.mixins.toolbar, 
        justifyContent: 'flex-end'
    },
    toolbar: {
        display: 'flex'
    },
    toolbarButton: {
        marginLeft: 'auto',
        color: theme.palette.primary.contrastText
    },
    signInStack: {
        position: 'absolute',
        top: '20%',
        right: '50px'
    }
}

export const NavBar = () => {
    // setup all your hooks & variables
    const [ open, setOpen ] = useState(false) //setting initial state to false as in NOT open
    const navigate = useNavigate(); 
    // grabbing our auth boolean whether or not someone is signed in
    const myAuth = localStorage.getItem('auth') 
    const auth = getAuth(); 


    // 2 functions to help us set our hook
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
      };

    // list of dictionary/object for our NavLinks

    const navLinks = [
        {
            text: 'Home',
            icon: <GiFamilyHouse size = '26'/>,
            onClick: () => navigate('/')
        },
        { 
            text: myAuth === 'true' ? 'Pokedex' : '',
            icon: myAuth === 'true' ? <PokedexIcon /> : "",
            onClick: myAuth === 'true' ? () => navigate('/pokedex') : () => {} 
        },
        { 
            text: myAuth === 'true' ? 'Battle' : 'Sign In',
            icon: myAuth === 'true' ? <GiNinjaHeroicStance  size ='26' /> : <FingerprintIcon />,
            onClick: () => navigate(myAuth === 'true' ? '/battle' : '/auth') 
        },
        { 
            text: myAuth === 'true' ? 'Squad' : '',
            icon: myAuth === 'true' ? <RiTeamFill size='26' /> : "",
            onClick: myAuth === 'true' ? () => navigate('/squad') : () => {} 
        }
    ]

    let signInText = 'Sign In'
    if (myAuth === 'true') { 
         signInText = 'Sign Out'
    }

    const signInButton = async () => {
        if (myAuth === 'false') {
            navigate('/auth')
        } else {
            await signOut(auth)
            localStorage.setItem('auth', 'false')
            localStorage.setItem('user', '')
            localStorage.setItem('uuid', '')
            navigate('/'); // Redirect to homepage or login page after sign out
            window.location.reload(); // Alternatively, refresh the page
        } 
    };


    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline />
            <AppBar 
                sx={ open ? navStyles.appBarShift : navStyles.appBar }
                position = 'fixed'
            >
                <Toolbar sx={ navStyles.toolbar }>
                    <IconButton 
                        color='inherit'
                        aria-label='open drawer'
                        onClick = { toggleDrawer(true) }
                        edge='start'
                        sx = { open ? navStyles.hide : navStyles.menuButton }
                    >
                        <SiPokemon size="50" />
                    </IconButton>
                </Toolbar>
                <Stack 
                    direction='row' 
                    justifyContent='space-between' 
                    alignItems='center'
                    sx = { navStyles.signInStack} >
                        <Typography variant='body2' sx={{color: 'inherit'}}>
                            {localStorage.getItem('user')}
                        </Typography>
                        <Button 
                            variant='contained'
                            color = 'info'
                            size = 'large'
                            sx = {{ marginLeft: '20px'}}
                            onClick = { signInButton }
                        >
                            { signInText }
                        </Button>
                    </Stack>
            </AppBar>
            <Drawer
                    sx={{
                        ...open ? navStyles.drawer : navStyles.hide,
                        '& .MuiDrawer-paper': navStyles.drawerPaper, 
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    onClose={toggleDrawer(false)}
                    >
                <Box sx = {navStyles.drawerHeader }>
                    <IconButton onClick={toggleDrawer(false)}>
                        <SiPokemon  size="32" />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    { navLinks.map( (item) => {
                        // using variable deconstruction to deconstruct our object/dictionary
                        const { text, icon, onClick } = item; 
                        return (
                            <ListItemButton key={text} onClick={onClick}>
                                <ListItemText primary={text} />
                                { icon }
                            </ListItemButton>
                        )

                    })}
                </List>
            </Drawer>
        </Box>
    )





}