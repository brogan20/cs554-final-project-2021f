import React from "react";
import queries from '../queries';
import { useQuery } from '@apollo/client';
import PokeCard from "./PokeCard";
import { Link } from 'react-router-dom';
import { Button, Container, Col, Row, Spinner } from 'react-bootstrap';

const Portfolio = (props) =>{
  // commenting out until functions are made
  const { loading, error, data } = useQuery(queries.GET_PORTFOLIO, {
    variables: {userName: "James"}, // swap "James" with name given from firebase
    fetchPolicy: "network-only"
  });
  let cardList = null; 

  if(error){
    return <h2>{error.message}</h2>
  }
  if(loading){
    return(
      <Spinner animation="border"/>
    )
  }

  cardList =
    data.portfolio &&
    data.portfolio.map((pokemon) => {
      return(
        <Col xs={2}>
          <PokeCard pokemon={pokemon}/>
        </Col>
      )
    });

  return(
    <div>
      <h1>Portfolio</h1>
      <p>{data.length} cards in collection</p>
      <Container fluid>
        <Row>
          {cardList}
        </Row>
      </Container>
    </div>
  )
}

export default Portfolio;
