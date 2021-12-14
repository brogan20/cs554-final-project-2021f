import React, { useState, useEffect, useRef } from "react";
import BetListing from "./BetListing";
import { useQuery } from "@apollo/client";
import axios from "axios";

const Betting = (props) => {
  const [data, setData] = useState(null);
  let betList = null;
  
  const tempData = [{
    id: "1",
    player1: {displayName: "ash"},
    player2: {displayName: "gary"},
    pokemon1: {id: 25, name:"pikachu", isHolo: false},
    pokemon2: {id: 133, name: "eevee", isHolo: false},
    winner: null,
    timestamp: new Date(Date.now()+120000)
  }];

  useEffect(() => {
    const fetchData = async () => {
    };
    fetchData();
  }, []);

  if (tempData) {
    console.log(tempData)
    betList =
      tempData &&
      tempData.map((bet) => {
        if(bet.player1.id == 'userid' || bet.player2.id == 'userid') // replace this with the actual id later
          return;
        else
          return <BetListing key={bet.id} battle={bet} />;
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
