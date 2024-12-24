import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export default function ProtectedRoute() {

    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthenticated(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        try{
            const res = await axios.post(
                '/api/token/refresh/',
                {
                    refresh: refreshToken,
                }
            )

            if ( res.status == 200){
                Cookies.set('accessToken', res.data.access)
                setIsAuthenticated(true)
            }else {
                setIsAuthenticated(false)
            }
        }catch(error){
            console.log(error)
            setIsAuthenticated(false)
        }
    }

    const auth =  async () => {
        const token = Cookies.get('accessToken')

        if (token) {
            setIsAuthenticated(true)
            return;
        }

        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now * 1000

        if (tokenExpiration < now){
            await refreshToken();
        }else {
            setIsAuthenticated(true)
        }
    }

    if (isAuthenticated === null) {
        return <div>Loading ...</div>
    }

    return isAuthenticated ? 
    <div className="bg-[url('https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] h-[150vh] bg-no-repeat bg-cover bg-center ">
    <Navbar />
    <Outlet />
    </div>
    :
    <Navigate to={'/login'} />
};


/*

const isAuthenticated = Cookies.get('accessToken')

    return isAuthenticated ? 
    <div className="bg-[url('https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] ">
    <Navbar />
    <Outlet />
    </div>
    : <Navigate to={'/login'} replace/>

*/