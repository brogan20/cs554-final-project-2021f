import React, { useState, useEffect, useRef } from "react";
import BetListing from "./BetListing";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import { Spinner } from "react-bootstrap";
import axios from "axios";

const Betting = () => {
  // const [data, setData] = useState(null);
  const { loading, error, data } = useQuery(queries.GET_ALL_BATTLES, {
    fetchPolicy: "network-only"
  });
  let betList = null;

  if(error){
    console.log(error)
    return <h2>Error</h2>
  }
  if(loading){
    betList = <Spinner animation="border"/>
  }

  if (data) {
    betList =
      data.battles &&
      data.battles.map((battle) => {
        if(battle.trainerOne == 'userid' || battle.trainerTwo == 'userid') // replace this with the actual id later
          return;
        else
          return <BetListing key={battle._id} battle={battle} />;
      });
  }

  return (
    <div>
      <h1>Ongoing Bets</h1>
      <div className="bet-container">{betList}</div>
    </div>
  );
};

export default Betting;
