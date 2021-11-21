import logo from '../logo.svg';
import '../App.css';
import login from './login';
import signup from './signup';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <header>

      </header>
      <div>
        <Route exact path="/login" component={login}/>
        <Route exact path="/signup" component={signup}/>
      </div>
    </div>
    </Router>
  );
}

export default App;
