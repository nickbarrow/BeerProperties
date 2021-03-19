import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch
} from 'react-router-dom';
// Utils
import { auth } from '../utils/Firebase'
import AnonRoute from '../utils/AnonRoute'
// Routes
import Home from './components/routes/Home';
import Login from './components/routes/Login';
import Signup from './components/routes/Signup';

export default class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    }

    // Use to prevent memory leaks on component unmount.
    this._isMounted = false;
  }

  updateCurrentUser = (user) => {
    this._isMounted && this.setState({ user })
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && auth().onAuthStateChanged(user => {
      this.updateCurrentUser(user);
    });
  }

  componentWillUnmount()  {
    this._isMounted = false;
  }

  render () {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />

          <AnonRoute path="/login" auth={this.state.user} component={Login} />
          <AnonRoute path="/signup" auth={this.state.user} component={Signup} />
        </Switch>
      </Router>
    );
  }
}
