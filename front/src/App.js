import logo from './logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';


import Main from './Main/Main';
import Top from './Top/Top';
import Home from './User/Home';
import { useState } from 'react';
import UserInfoContext from './context';

function App() {
  const [userInfo, setUserInfo] = useState({
    user_id: "user_id",
    thema: "normal"
    // token?
  })

 
  return (
    <div>
      <UserInfoContext.Provider value={{userInfo,setUserInfo}}>
        <Router>
          <div>
            <header className="App-header">
              <Link to='/main' className="header-link">
                <img src={logo} className="header-logo" alt="memotube" />
              </Link>
              <Link to='/login' className="App-login">
                Login
          </Link>
              <Link to='/home'>User</Link>
            </header>
          </div>

          <div>
            <Route exact path='/home' component={Home} />
            <Route path='/login' component={Top} />
            <Route path='/main' component={Main} />
          </div>

          <div>
            <footer className="App-footer">
              <h3>Memotube</h3>
              <p>made by "Yokei-na-kotomade"</p>
            </footer>
          </div>
        </Router>

      </UserInfoContext.Provider>
    </div>
  );
}

export default App;
