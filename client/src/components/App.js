import logo from "../logo.svg";
import "../App.css";
import SignUp from "./SignUp";
import Portfolio from "./Portfolio";
import Betting from "./Betting";
import Bet from "./Bet";
import Survey from "./Survey";
import PokeNav from "./PokeNav";
import CardPack from "./CardPack";
import Battle from "./Battle";
import Home from "./Home";
import Payment from "./Payment";
import "../css/styles.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { AuthProvider } from "../firebase/AuthContext";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <header>
              <PokeNav />
            </header>
            <div>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="/portfolio" element={<Portfolio />} />
                <Route exact path="/betting" element={<Betting />} />
                <Route exact path="/betting/:id" element={<Bet />} />
                <Route exact path="/survey" element={<Survey />} />
                <Route exact path="/cardpack" element={<CardPack />} />
                <Route exact path="/battle" element={<Battle />} />
                <Route exact path="/payment" element={<Payment />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
