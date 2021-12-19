import React, { useState, useEffect, useContext } from "react";
import PokeCard from "./PokeCard";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from '@apollo/client'
import queries from "../queries";
import mutations from "../mutations";
import { Container, Row, Col, Form, Button, Spinner, Modal } from "react-bootstrap";
import { AuthContext } from "../firebase/AuthContext";


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
      <Form.Group controlId="betForm">
        <Form.Label for="betForm">Bet Amount</Form.Label>
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
  const [ modal, setModal ] = useState({show: false, title: "", message: ""});

  const [placeBet, mutResult] = useMutation(mutations.PLACE_BET)
  const { currentUser } = useContext(AuthContext);


  let { id } = useParams();
  const { loading, error, data } = useQuery(queries.GET_BETTER_BATTLE, {
    variables: {battleId: id},
    fetchPolicy: 'cache-first'
  });

  // Start the countdown timer
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

  // Set which trainer the user wants to bet on
  const setTrainer = (e, num) => {
    e.preventDefault();
    setSelectedTrainer(num);
  };

  // Change the bet amount
  const changeAmount = (e) => {
    e.preventDefault();
    setBetAmount(e.target.value);
  };

  // Close modal
  const handleClose = () => setModal({...modal, show: false});

  const submitBet = (e) => {
    e.preventDefault();
    if (expired) {
      setModal({show: true, title: "Battle Ended", message: "This battle has ended, please choose another to bet on"});
      return;
    }
    let amt = parseInt(betAmount);
    if (isNaN(amt) || amt <= 0 /*|| amt > max pokeDollars*/) {
      setModal({show: true, title: "Bad Input", message: "The bet amount must be a number"});
      return;
    }
    if (selectedTrainer !== 1 && selectedTrainer !== 0) {
      setModal({show: true, title: "Select Trainer", message: "A trainer from this battle must be selected"});
      return;
    }
    let predictedWinner = selectedTrainer == 0 ? data.oneBattle.trainerOne : data.oneBattle.trainerTwo;
    try{
      placeBet({
        variables: {gid: currentUser.uid, betAmount: amt, battleId: id, predictedWinner: predictedWinner}
      });
    }
    catch(e){
      setModal({show: true, title: "Betting Error", message: "Something went wrong placing your bet."});
      return;
    }
  };

  if(mutResult.error){
    setModal({show: true, title: "Betting Error", message: "Something went wrong placing your bet."});
  }
  if(mutResult.data){
    return (
      <Modal show={true} backdrop="static" onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your bet has been placed.</Modal.Body>
        <Modal.Footer>
          <Link className="btn btn-secondary" to="/betting">
            Return to Listings
          </Link>
        </Modal.Footer>
      </Modal>
    )
  }
  if(expired){
    return (
      <Modal show={true} backdrop="static" onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Expired</Modal.Title>
        </Modal.Header>
        <Modal.Body>This bet has expired</Modal.Body>
        <Modal.Footer>
          <Link className="btn btn-danger" to="/betting">
            Return to Listings
          </Link>
        </Modal.Footer>
      </Modal>
    )
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
      <Modal show={modal.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Bet;
