import React, { useState, useEffect } from "react";
import PokeCard from "./PokeCard";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from '@apollo/client'
import queries from "../queries";
import mutations from "../mutations";
import { Container, Row, Col, Form, Button, Spinner, Modal } from "react-bootstrap";

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


const TrainerButton = ({isSelected, setTrainer, name, pokemon, num}) => {
  let selectText = "Click to select";
  if(isSelected)
    selectText = "Currently Selected";
  
  return (<button
    className={`bet-button ${isSelected && "bet-button-selected"}`}
    onClick={(e) => setTrainer(e, num)}
  >
      <p>{name}'s</p>
      <Col>
        <PokeCard pokemon={pokemon} />
      </Col>
      <p>{selectText}</p>
  </button>)
}

const BetForm = ({submitBet, expired, changeAmount}) => {
  let submitButton = <Button type="submit">Submit Bet</Button>;
  if(expired)
    submitButton = <div className="btn-danger">Expired!</div>;

  return (
    <Form onSubmit={submitBet}>
      <Form.Group>
        <Form.Label>Bet Amount</Form.Label>
        <Form.Control
          onChange={changeAmount}
          type="number"
          name="amount"
          placeholder="enter amount to bet"
        />
      </Form.Group>
      {submitButton}
    </Form>)
}

const Bet = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(-1);
  const [betAmount, setBetAmount] = useState(0);

  const [placeBet, mutResult] = useMutation(mutations.PLACE_BET)

  let { id } = useParams();
  const { loading, error, data } = useQuery(queries.GET_BETTER_BATTLE, {
    variables: {battleId: id},
    fetchPolicy: 'cache-first'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if(data){
        let remainder = getTimeLeft(data.oneBattle.timeStamp);
        if (remainder <= 0) {
          setExpired(true);
          // query the database for the winner!!
          clearInterval(interval);
        }
        setSecondsLeft(remainder);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const setTrainer = (e, num) => {
    e.preventDefault();
    setSelectedTrainer(num);
  };

  const changeAmount = (e) => {
    e.preventDefault();
    setBetAmount(e.target.value);
  };

  const submitBet = (e) => {
    e.preventDefault();
    if (expired) {
      // do error
      return;
    }
    let amt = parseInt(betAmount);
    if (isNaN(amt) || amt <= 0 /*|| amt > max pokeDollars*/) {
      // do error
      return;
    }
    if (selectedTrainer !== 1 && selectedTrainer !== 0) {
      // do error
      return;
    }
    let predictedWinner = selectedTrainer == 0 ? data.oneBattle.trainerOne : data.oneBattle.trainerTwo;
    placeBet({
      variables: {userName: "James"/*replace with firebase stuff*/, betAmount: amt, battleId: id, predictedWinner: predictedWinner}
    });
  };

  if(mutResult.error){
    return <h2>Something went wrong uploading your bet</h2>
  }
  if(error){
    console.log(error);
    return <h2>That battle does not exist or has expired.</h2>
  }
  if(loading){
    return <Spinner animation="border"/>
  }
  const battle = data.oneBattle;
  return (
    <div>
      <h1>Betting</h1>
      <Container fluid>
        <Row className="row justify-content-center">
          <Col xs={2}>
            <TrainerButton isSelected={selectedTrainer===0} name={battle.trainerOne} setTrainer={setTrainer} pokemon={battle.pokemonOne} num={0}/>
          </Col>
          <Col xs={2}>
            <p>vs.</p>
            <BetForm submitBet={submitBet} expired={expired} changeAmount={changeAmount}/>
          </Col>
          <Col xs={2}>
            <TrainerButton isSelected={selectedTrainer===1} name={battle.trainerTwo} setTrainer={setTrainer} pokemon={battle.pokemonTwo} num={1}/>
          </Col>
        </Row>
        <Row>
          {!expired && (
            <p>
              Expires: {Math.floor(secondsLeft / 60)}m, {secondsLeft % 60}s
            </p>
          )}
          {expired && <p>Expired!</p>}
        </Row>
      </Container>

      <Link to="/betting">
        <Button>Back to listings</Button>
      </Link>
    </div>
  );
};

export default Bet;
