import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Launch from './launch'
import Launches from './launches'
import Cart from './cart'
import Profile from './profile'
import { Footer, PageContainer } from '../components'

export default function Pages() {
  return (
    <Router>
      <PageContainer>
        <Route exact path="/">
          <Launches />
        </Route>
        <Route path="/launch/:launchId">
          <Launch />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </PageContainer>
      <Footer />
    </Router>
  )
}
