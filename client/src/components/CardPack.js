import React, { useState, useEffect, useContext } from "react";
import PokeCard from './PokeCard';
import { useQuery, useMutation } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import { Container, Row, Col } from 'react-bootstrap';
import queries from '../queries';
import mutations from '../mutations';
import axios from 'axios';
import { AuthContext } from "../firebase/AuthContext";

const useStyles = makeStyles({
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  }
});

const CardPack = () => {
  const classes = useStyles();
  const { currentUser }=useContext(AuthContext);
  const [ cardData, setCardData ] = useState(undefined);
  const [ loading, setLoading ] = useState(false);
  const [ visibleData, setVisible ] = useState(false);
  const [addPokemon, {data}]=useMutation(mutations.ADD_POKEMON);
  let card=null;
  
  const toggleVisible = () => {
    setVisible({
      visibleData: true
    })
  }

  useEffect(
    () => {
      console.log("useEffect fired")
      const fetchData = async () =>{
        console.log("fetchData fired")
        try{
          setLoading(true);
          let result=new Array();
          for(let i=0; i<3; i++){
            const random=Math.floor(Math.random()*898)+1;
            console.log(random)
            const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}/`);
            console.log(pokemon.data)
            const shiny=Math.floor(Math.random()*100);
            if(shiny<=1){
              pokemon.data.isShiny=true;
              result.push(pokemon.data);
            }
            else{
              pokemon.data.isShiny=false;
              result.push(pokemon.data);
            }
          }
          console.log(result);
          setCardData(result);
          setLoading(false);
          setVisible(false);
        }
        catch(e){
          console.log(e)
        }
      }
      if(!loading){
      fetchData();
      }
    },
    []
  )

  if(!currentUser){
    return(
      <h2>A User Must Sign In Before Getting a Card Pack</h2>
    )
  }

  const theCard = (pokemon, username) => {
    console.log(pokemon.pokemonID);
    console.log(pokemon.pokemonName);
    console.log(pokemon.imageLink);
    console.log(pokemon.isShiny);
    console.log(username)
    addPokemon({
      variables: {pokemonID: pokemon.pokemonID.toString(), 
        pokemonName: pokemon.pokemonName, 
        imageLink: pokemon.imageLink, 
        isShiny: pokemon.isShiny, 
        userName: username}
    })
  }
  
  const CardGrid = (pokemon) => {
    console.log("cardgrid")
    const id=pokemon.id;
    pokemon.pokemonID=id;
    const name=pokemon.name;
    pokemon.pokemonName=name;
    const image=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    pokemon.imageLink=image;
    const shiny=pokemon.isShiny;
    const userName=currentUser.displayName // Will be received from firebase
    console.log(pokemon.pokemonID);
    console.log(pokemon.pokemonName);
    console.log(pokemon.imageLink);
    console.log(pokemon.isShiny);
    console.log(userName)
    return(
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
        <PokeCard pokemon={pokemon}></PokeCard>
        <button onClick={() => theCard(pokemon, userName)}>I want this pokemon</button>
      </Grid>
    )
  }

  console.log(cardData);
  console.log(currentUser);

  if(cardData){

  card =
    cardData &&
    cardData.map((pokemon) => {
      return CardGrid(pokemon);
    })

  console.log(card)

  }

  return(
    <div>
      <h1>Get a new Card Pack!</h1>
      { !visibleData ?
        <Container style={{marginTop: '3rem'}}fluid>
              <Row className="justify-content-center">
                <Col xs={2}>
                  <button className="btn-vote" onClick={toggleVisible.bind(this)}>
                    <PokeCard pokemon={{isBack: true, isShiny: true}}/>
                  </button>
                </Col>
              </Row>
        </Container>
        : 
        <p>Card Pack Claimed</p>
      }
      { visibleData ? 
      <Grid container className={classes.grid} spacing={5}>
        {card}
      </Grid>: null
      }
    </div>
  )
}

export default CardPack;