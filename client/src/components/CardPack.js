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
  const { loading, error, popularData } = useQuery(
    queries.GET_POPULAR,
    {
      fetchPolicy: 'cache-and-network'
    }
  );
  const { load, err, pokemonData } = useQuery(
    queries.GET_ALL_POKEMON,
    {
      fetchPolicy: 'cache-and-network'
    }
  );
  let card = null;

  useEffect(
    () => {
      const fetchData = async () =>{
        try{
          let result=new Array();
          let popular=0;
          let popularNum = Math.floor(Math.random(100))+1;
          if(popularNum==1){
            popular=3;
          }
          else if(popularNum>=2 && popularNum<=4){
            popular=2;
          }
          else if(popularNum>=5 && popularNum<=10){
            popular=1;
          }
          else{
            popular=0;
          }
          let popularIds=new Array();
          for(let poke in popularData){
            popularIds.push(poke.id);
          }
          let ids=new Array();
          for(let i=0; i<3; i++){
            if(popular>0){
              let random=Math.floor(Math.random(popularIds.length));
              ids.push(popularIds[random]);
              popular--;
            }
            else{
              random: while(popular==0){
                let rand=Math.floor(Math.random(898))+1;
                if(popularIds.includes(rand)){
                  continue random;
                }
                else{
                  ids.push(rand);
                  break;
                }
              }
            }
          }
          for(let k=0; k<3; k++){
            const pokemon=pokemonData.find(p => p.id==ids[k]);
            const holo=Math.floor(Math.random(100));
            if(holo<=1){
              pokemon.isHolo=true;
            }
            else{
              pokemon.isHolo=false;
            }
            result.push(pokemon);
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
