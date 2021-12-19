import React, { useContext } from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import PokeCard from "./PokeCard";
import { Link } from "react-router-dom";
import { Button, Container, Col, Row, Spinner } from "react-bootstrap";
import { AuthContext } from "../firebase/AuthContext";

const Portfolio = () => {
  // commenting out until functions are made
  const { currentUser } = useContext(AuthContext);
  const { loading, error, data } = useQuery(queries.GET_PORTFOLIO, {
    variables: { gid: currentUser.uid }, 
    fetchPolicy: "network-only",
  });
  let cardList = null;
  console.log(currentUser)
  if (error) {
    return <h2>{error.message}</h2>;
  }
  if (loading) {
    return <Spinner animation="border" />;
  }

  cardList =
    data.portfolio &&
    data.portfolio.map((pokemon) => {
      return (
        <Col xs={2}>
          <PokeCard pokemon={pokemon} />
        </Col>
      );
    });

  return (
    <div>
      <h1>Portfolio</h1>
      <p>{data.length} cards in your collection</p>
      <Container fluid>
        <Row>{cardList}</Row>
      </Container>
    </div>
  );
};

export default Portfolio;
