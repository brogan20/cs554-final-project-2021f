import logo from '../logo.svg';
import '../App.css';
import Login from './login';
import Portfolio from './Portfolio';
import Ranking from './Ranking';
import '../css/styles.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
})


function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
      <div className="App">
        <header>
        </header>
        <div>
          <Routes>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/portfolio" element={<Portfolio/>}/>
            <Route exact path="/rankings" element={<Ranking/>}/>
          </Routes>
        </div>
      </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
