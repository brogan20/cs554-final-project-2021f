import React, { useEffect, useState } from "react";
import PokeCard from './PokeCard';
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const BetListing = ({ battle }) => {
  const getTimeLeft = (timestamp) => {
    // Discard the time and time-zone information.
    const MS_PER_SECOND = 1000;
    let end = new Date(timestamp);
    let current = new Date();
    const utc1 = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours(), current.getMinutes(), current.getSeconds());
    const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), current.getHours(), end.getMinutes(), end.getSeconds());
    let secs = (utc2-utc1) / MS_PER_SECOND;
    // console.log(secs);
    return {
      minutes: Math.floor(secs/60),
      seconds: secs%60
    }
  };
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(battle.timeStamp));
  const [ expired, setExpired ] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      let remainder = getTimeLeft(battle.timeStamp);
      if(remainder.minutes <= 0 && remainder.seconds <= 0){
        setExpired(true);
        // query the database for the winner!!
        clearInterval(interval);
      }
      setTimeLeft(remainder);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link className="bet-listing" to={`/betting/${battle._id}`}>
      <Container fluid>
        <Row className="row justify-content-center">
          <Col xs={2}>
            <p>{battle.trainerOne}'s</p>
            <PokeCard pokemon={battle.pokemonOne}/>
          </Col>
          <Col xs={2}>
            <p>vs.</p>
          </Col>
          <Col xs={2}>
            <p>{battle.trainerTwo}'s</p>
            <PokeCard pokemon={battle.pokemonTwo}/>
          </Col>
        </Row>
        <Row>
          {!expired && <p>Expires: {timeLeft.minutes}m, {timeLeft.seconds}s</p>}
          {expired && <p>Expired!</p>}
        </Row>
      </Container>
    </Link>
  );
};

export default BetListing;
