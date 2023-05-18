import React, { useEffect } from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from '../utils/firebase'

const Navbar = () => {
    const [user, loading] = useAuthState(auth);
    console.log(user);

  return (
    <div>Navbar</div>
  )
}

export default Navbar