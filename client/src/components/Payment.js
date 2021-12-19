import React, { useState, useEffect, useContext } from "react";
import PokeCard from './PokeCard';
import { useMutation, useQuery } from '@apollo/client';
import { Grid, makeStyles } from '@material-ui/core';
import mutations from '../mutations';
import CreditCardInput from 'react-credit-card-input';
import { Form, Button, FormGroup, FormControl, ControlLabel, Alert } from "react-bootstrap";
import { AuthContext } from "../firebase/AuthContext";

const useStyles = makeStyles({
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  }
});

const Payment = () => {
  const classes = useStyles();
  const [ cardData, setCardData ] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [changeFunds, {fundResults}] = useMutation(mutations.CHANGE_FUNDS);
  const [name, setName] = useState(undefined);
  const [amountBought, setAmountBought] = useState(undefined);
  const { currentUser } = useContext(AuthContext);


  useEffect(
    () => {
      const fetchData = async () =>{
        try{
          setLoading(false);
        }
        catch(e){
          console.log(e)
        }
      }
      fetchData()
    },
    []
  )
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }
  else {
    
    const payOurMan = event => {
      changeFunds({
        variables: {gid: currentUser.uid, toChange: amountBought} // swap "James" with name given from firebase
      });
      alert(`CONGRATULATIONS! You just """earned""" ${amountBought} PokéBucks!!! WE ARE SO PROUD OF YOU!`);
    }

    const handleNameChange = event => {
      setName(event.target.value);
    }
    const handleAmountChange = event => {
      setAmountBought(event.target.value);
    }
  

    return(
      <div>
        <h1>Real winners swipe! Just enter your credit card information below to earn fat PokéBucks</h1>
        <br />
        <Form onSubmit={payOurMan}>
        <label>Card Owner's Name
          <input
           type="text"
           name="name"
           placeholder="Enter Your Name"
           onChange={handleNameChange}
           value={name}
            />
        </label>
        <br />
        <br />
        <br />
        <label>
          <CreditCardInput
            fieldClassName="input"
          />
        </label>
        <br />
        <br />
        <br />
        <label>How much do you want to buy
        <input
           type="number"
           name="amount"
           placeholder="Amount To Buy"
           onChange={handleAmountChange}
           value={amountBought}
            />
        </label>
        <br />
        <input type="submit" value="Submit"/>
        </Form>
      </div>
    )
  }
}

export default Payment;