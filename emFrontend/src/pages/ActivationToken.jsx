import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import { Button } from "@radix-ui/themes";
import Cookies from "js-cookie";

export default function Token(){

    const navigate = useNavigate()
    const {uid, token} = useParams()
    const [user_id, setUser_id] = useState(null)
    const [activateToken, setActivateToken] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')



    useEffect(() => {
        const getData = async () => {
                setUser_id(uid)
                setActivateToken(token)
        }

        getData()
    }, [])

    const handleActivation = async () => {
        setLoading(true)
        try{
            const csrf = axios.get('/api/token/csrf/');
            let res = await axios.patch(
                '/api/users/activate/',
                {
                    uid: user_id,
                    token: activateToken,
                },
                {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken')
                    }
                }
            )
    
            if (res.status == 200){
                navigate('/login')
                setError(res.message)
            }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center space-y-4 h-[90vh]">
            <h1 className="text-3xl font-bold">Activation comfrim</h1>
            <div>
            <p className="my-2 text-sm text-center text-red-500">{error}</p>
            <Button size="3" onClick={handleActivation}>Activate</Button>
            </div>
            </div>
        </div>
    )
}