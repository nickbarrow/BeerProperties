import React from 'react'
import Routes from './Routes'
import UserProvider from './providers/UserProvider'

export default function App() {
  return (
    <div className="App">
      <UserProvider>
        <Routes />
      </UserProvider>
    </div>
  )
}
