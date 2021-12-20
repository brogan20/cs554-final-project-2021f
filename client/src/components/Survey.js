import React, { useState, useEffect, useContext } from "react";
import PokeCard from './PokeCard';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import mutations from '../mutations';
import { AuthContext } from "../firebase/AuthContext";

const Survey = () => {
  const [ cardData, setCardData ] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [ error, setError ] = useState(null);
  const [ modal, setModal ] = useState({show: false, title: "", message: "", func: null});
  const [changePopularity, {popResults}] = useMutation(mutations.CHANGE_POPULARITY);
  const [changeFunds, {fundResults}] = useMutation(mutations.CHANGE_FUNDS);
  const { currentUser } = useContext(AuthContext);
  let card = null;

  const closeModal = () => {
    setModal({...modal, show: false});
  }

  const fetchData = async () => {
    setLoading(true);
    setModal({...modal, show: false});
    try{
      let result = [];
      let randOne = Math.floor(Math.random() * 898) + 1
      let pokemonOne = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randOne}/`);
      let randTwo = Math.floor(Math.random() * 898) + 1
      let pokemonTwo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randTwo}/`);
      pokemonOne.data.name = pokemonOne.data.name.toLowerCase();
      pokemonTwo.data.name = pokemonTwo.data.name.toLowerCase();
      result.push(pokemonOne);
      result.push(pokemonTwo);
      setCardData(result);
    }
    catch(e){
      console.log(e)
    }
    setLoading(false);
  } 

  useEffect(
    () => {
      fetchData()
    },
    []
  )

  if (loading) {
    return (
      <Spinner animation="border" />
    );
  }
  if(error){
    return (
      <h2>Error</h2>
    )
  }
  const ourUsersCards = (pokemon) => {
    if(pokemon.pokemonName == cardData[0].data.name){
      changePopularity({
        variables: {pokemonName: cardData[1].data.name, toChange: -2}
      });
    }
    if(pokemon.pokemonName == cardData[1].data.name){
      changePopularity({
        variables: {pokemonName: cardData[0].data.name, toChange: -2}
      });
    }
    changePopularity({
      variables: {pokemonName: pokemon.pokemonName, toChange: 2}
    });
    if(!currentUser){
      setModal({show:true, title: "Success", message: `You voted for ${pokemon.pokemonName}! You must log in to earn any PokéDollars`, func: fetchData});
    }
    else{
      changeFunds({
        variables: {gid: currentUser.uid, toChange: 5} // swap "James" with name given from firebase
      });
      setModal({show:true, title: "Success", message: `You voted for ${pokemon.pokemonName}! You just earned 5 PokéDollars`, func: fetchData});
    }
  }


    
  const CardGrid = (pokemon) => {
    console.log(pokemon.data);
    let pokeCardData = {
      pokemonID: pokemon.data.id,
      pokemonName: pokemon.data.name,
      imageLink: pokemon.data.sprites.front_default,
      isShiny: false
    };
    return(
      <Col style={{margiLeft: '1rem', marginRight: '1rem'}} xs={12} sm={6} md={4} lg={2} xl={2} key={pokeCardData.pokemonID}>
        <button className="btn-vote" onClick={() => ourUsersCards(pokeCardData)}>
          <PokeCard pokemon={pokeCardData}></PokeCard>
        </button>
      </Col>
    )
  }

  card =
    cardData.map((pokemon) => {
      return CardGrid(pokemon);
  })

  return(
    <div>
      <h1>Pick your favorite Pokémon!</h1>
      <Button className="btn-secondary" onClick={() => setModal({show: true, title: 'About this page', message: 
      'By voting on a pokémon, you help fuel our ranking system. To award you for your help, you receive 5 free PokéDollars. (You must be logged in to recieve any money)', 
      func: closeModal})}>
        ?
      </Button>
      <Container fluid>
        <Row style={{paddingTop: '4rem'}} className="justify-content-center">
          {card}
        </Row>
      </Container>
      <Modal show={modal.show} onHide={modal.func}>
        <Modal.Header closeButton>
          <Modal.Title>{modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={modal.func}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Survey;