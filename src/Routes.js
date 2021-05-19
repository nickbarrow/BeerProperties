import React from 'react'
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'
// Utils
import { auth } from './utils/Firebase'
import AnonRoute from './utils/AnonRoute'
import PrivateRoute from './utils/PrivateRoute'
import { AnimatePresence } from 'framer-motion'

// Routes
import Home from './components/routes/Home'
import Admin from './Admin'
import Login from './components/routes/Login'
import Signup from './components/routes/Signup'
import Gallery from './components/routes/Gallery'
import Property from './Property'

import BeerNav from './components/display/BeerNav'
import BeerFooter from './components/display/BeerFooter'

export default function Routes() {

  return (
    <Router>
      <BeerNav />

      <AnimatePresence>
        <Switch>
          <Route exact path="/" component={Home} />

          <Route path="/gallery" component={Gallery} />
          <Route path="/p/:id" component={Property} />

          <PrivateRoute path="/admin" component={Admin} />

          <Route path="/logout"
            render={() => {
              auth.signOut()
              return <Redirect to="/" />
            }}
          />

          <AnonRoute path="/login" component={Login} />
          <AnonRoute path="/signup" component={Signup} />
        </Switch>

        <BeerFooter />
      </AnimatePresence>
    </Router>
  )
}
