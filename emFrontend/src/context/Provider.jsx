import React, { createContext, useState } from 'react'
import { data } from 'react-router-dom'

const context = createContext()

function Provider({children}) {

    const [user, setUser] = useState([])

    const handleData = (data) => {
      setUser(data)
    }

  return (
    <context.Provider value={{user, handleData}}>
        {children}
    </context.Provider>
  )
}

export {Provider, context};
