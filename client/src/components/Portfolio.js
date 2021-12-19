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
  let gid;
  if(currentUser)
    gid = currentUser.uid;
  const { loading, error, data } = useQuery(queries.GET_PORTFOLIO, {
    skip: !currentUser,
    variables: { gid: gid }, 
    fetchPolicy: "network-only",
  });
  let cardList = null;
  
  if(!currentUser){
    return(
      <div>
        <h2>You must log in to see your portfolio.</h2>
        <Link className="btn btn-primary" to="/signup">Login / Signup</Link>
      </div>
    )
  };
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
      <Link className="btn btn-secondary" to="/cardpack">Get more cards</Link>
      <Container fluid>
        <Row>{cardList}</Row>
      </Container>
    </div>
  );
};

export default Portfolio;
