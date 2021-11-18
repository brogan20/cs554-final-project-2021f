import logo from './logo.svg';
import './App.css';

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
