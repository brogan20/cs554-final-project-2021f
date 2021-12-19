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
import PrivateRoute from "./PrivateRoute";
import "../css/styles.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WalletContext from "../contexts/walletCon";
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
    uri: "http://localhost:4000/",
  }),
});
let startWallet = { userWallet: null };
function App() {
  return (
    <ApolloProvider client={client}>
      <WalletContext.Provider value={startWallet}>
        <AuthProvider>
          <BrowserRouter>
            <div className="App">
              <header>
                <PokeNav />
              </header>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route
                  exact
                  path="/portfolio"
                  element={
                    <PrivateRoute>
                      <Portfolio />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/betting"
                  element={
                    <PrivateRoute>
                      <Betting />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/betting/:id"
                  element={
                    <PrivateRoute>
                      <Bet />
                    </PrivateRoute>
                  }
                />
                <Route exact path="/survey" element={<Survey />} />
                <Route
                  exact
                  path="/cardpack"
                  element={
                    <PrivateRoute>
                      <CardPack />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/battle"
                  element={
                    <PrivateRoute>
                      <Battle />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/payment"
                  element={
                    <PrivateRoute>
                      <Payment />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </WalletContext.Provider>
    </ApolloProvider>
  );
}

export default App;
