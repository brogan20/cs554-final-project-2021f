import React, { useState, useEffect } from "react";
import PokeCard from './PokeCard';
import { useQuery } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    grid: {
		flexGrow: 1,
		flexDirection: 'row'
	}
});

const CardPack = () => {
    const classes = useStyles();
	const [ cardData, setCardData ] = useState(undefined);
	let card = null;

    useEffect(
        () => {
            const fetchData = async () =>{
                try{
                    let result = [0, 0, 0];
                    const ids = [Math.floor(Math.random(10220))+1, Math.floor(Math.random(10220)+1, Math.floor(Math.random(10220)+1))];
                    for(let i=0; i<3; i++){
                        // Call cards with useQuery for the id values in the ids array
                        // and push each of these into result
                    }
                    console.log(result);
                    setCardData(result);
                }
                catch(e){
                    console.log(e)
                }
            }
            fetchData()
        },
        []
    )
    
    const CardGrid = (pokemon) => {
        return(
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
                <PokeCard pokemon={pokemon}></PokeCard>
            </Grid>
        )
    }

    const carder = () => {
        card =
        cardData.map((pokemon) => {
            return CardGrid(pokemon);
        })
    }

    return(
        <div>
            <h1>Get a new Card Pack!</h1>
            <br />
            <button onClick={carder}>Claim Card Pack!</button>
            <Grid container className={classes.grid} spacing={5}>
                {card}
            </Grid>
        </div>
    )
}

export default CardPack;