import React, { useEffect, useState } from "react";
import PokeCard from './PokeCard';
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import queries from '../queries';

const BetListing = ({ battle }) => {
  const getTimeLeft = (timestamp) => {
    // Discard the time and time-zone information.
    const MS_PER_SECOND = 1000;
    let end = new Date(timestamp);
    let current = new Date();
    const utc1 = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours(), current.getMinutes(), current.getSeconds());
    const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMinutes(), end.getSeconds());
    let secs = (utc2-utc1) / MS_PER_SECOND;
    return secs;
  };
  const { loading: load, error: err, data: user1Data } = useQuery(queries.GET_USER, {
    fetchPolicy: "network-only",
    variables: { gid: battle.trainerOne }
  });
  const { loading: loading, error: error, data: user2Data } = useQuery(queries.GET_USER, {
    fetchPolicy: "network-only",
    variables: { gid: battle.trainerTwo }
  });
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(battle.timeStamp));
  const [ expired, setExpired ] = useState(false);
  let winner=null;

  console.log(user1Data);
  console.log(user2Data);
  
  useEffect(() => {
    const interval = setInterval(() => {
      let remainder = getTimeLeft(battle.timeStamp);
      if(remainder <= 0){
        setExpired(true);
        // query the database for the winner!!
        clearInterval(interval);
      }
      setTimeLeft(remainder);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if(load || loading){
    return(
      <h2>Loading...</h2>
    )
  }

  else if (user1Data && user2Data && !loading && !load){
    if(user1Data.user.gid==battle.trainerOne){
      winner=user1Data.user.userName;
    }
    else{
      winner=user2Data.user.userName;
    }

  return (
    <Link className="bet-listing" to={`/betting/${battle._id}`}>
      <Container fluid>
        <Row className="row justify-content-center">
          <Col xs={3}>
            <p>{user1Data.user.userName}'s</p>
            <PokeCard pokemon={battle.pokemonOne}/>
          </Col>
          <Col xs={3}>
            <p>vs.</p>
          </Col>
          <Col xs={3}>
            <p>{user2Data.user.userName}'s</p>
            <PokeCard pokemon={battle.pokemonTwo}/>
          </Col>
        </Row>
        <Row>
          {!expired && <p>Expires: {Math.floor(timeLeft/60)}m, {timeLeft%60}s</p>}
          {expired && <p>Expired! Winner: {winner}</p>}
        </Row>
      </Container>
    </Link>
  );
  }
  else{
    return(
    <Link className="bet-listing" to={`/betting/${battle._id}`}>
      <Container fluid>
        <Row className="row justify-content-center">
          <Col xs={3}>
            <p>{battle.trainerOne}'s</p>
            <PokeCard pokemon={battle.pokemonOne}/>
          </Col>
          <Col xs={3}>
            <p>vs.</p>
          </Col>
          <Col xs={3}>
            <p>{battle.trainerTwo}'s</p>
            <PokeCard pokemon={battle.pokemonTwo}/>
          </Col>
        </Row>
        <Row>
          {!expired && <p>Expires: {Math.floor(timeLeft/60)}m, {timeLeft%60}s</p>}
          {expired && <p>Expired! Winner: {battle.winner}</p>}
        </Row>
      </Container>
    </Link>
    )
  }
};

export default BetListing;
