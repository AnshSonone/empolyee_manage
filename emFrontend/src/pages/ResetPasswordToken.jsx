import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import * as Tabs from '@radix-ui/react-tabs';
import { Button } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
 
export default function ResetPasswordToken(){

    const navigate = useNavigate()

    const {uid, token} = useParams()
    const [emailSend, setEmailSend] = useState('')
    const [user_id, setUser_id] = useState(null)
    const [resetToken, setResetToken] = useState(null)

    const FormSchema = z.object({
        password: z.string().min(5, 'Password must have 5 charcter'),
        conf_passowrd: z.string().min(5, 'Password must have 5 charcter'),
    })

    const {register, handleSubmit, setError, getValues, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            password: '',
        conf_passowrd: '',
        checkPassword: 'Password and confrim password should be same.'
        },
        resolver: zodResolver(FormSchema),
    })


    useEffect(() => {
        const getData = async () => {
            setUser_id(uid)
            setResetToken(token)
    }

    getData()
    }, [])

    const handleLogout = async () => {
		try {
		  // Send logout request to the backend
		  await axios.post(
			"http://127.0.0.1:8000/api/users/logout/",
			{},
			{
			  headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken"),
				Authorization: `Bearer ${Cookies.get("accessToken")}`,
			  },
			}
		  );
	
		  // Remove authentication cookies
		  Cookies.remove('accessToken');
		  localStorage.removeItem('refreshToken');
		  Cookies.remove('csrftoken');
		  Cookies.remove("sessionid");
	
		  // Redirect to login page after logout
		  navigate("/login");
		} catch (err) {
		  console.error("Logout failed:", err);
		}
	  };

    const handleResetPasword = async (data) => {
        if ( data.password != data.conf_passowrd) return;

        try{

            
            await axios.get('/api/token/csrf/')

            let res = await axios.patch(
                '/api/users/reset_password/',
                {
                    password: data.password,
                    conf_passowrd: data.conf_passowrd,
                    uid: user_id,
                    token: resetToken,
                },
                {
                    headers: {
                        'content-type': 'application/json',
                        'X-CSRFtoken': Cookies.get('csrftoken')
                    }
                }
            )

            if (res.status == 200){
                setEmailSend('Passowrd reset successfully')
                handleLogout()
                navigate('/login')
            }else{
                setError(res.data.message)
            }

        }catch(error){
            setError('Invalid token')
            console.log(error)
        }
    }

    return (
        <div className="flex justify-center relative top-[12rem]">

            	<Tabs.Root
		className="flex w-[300px] flex-col shadow-[0_2px_10px] shadow-blackA2"
		defaultValue="tab1"
        
	>
		<Tabs.List
			className="flex shrink-0 border-b border-mauve6"
			aria-label="Manage your account"
		>
			
			<div
				className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
				value="tab2"
			>
				Password
			</div>
		</Tabs.List>
		
		<form
			className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
			value="tab2"
            onSubmit={handleSubmit(handleResetPasword)}
		>
			<p className="mb-5 text-[15px] leading-normal text-mauve11">
				Change your password here. After saving, you'll be logged out.
			</p>
			<fieldset className="mb-[15px] flex w-full flex-col justify-start">
				
			</fieldset>
			<fieldset className="mb-[15px] flex w-full flex-col justify-start">
				<label
					className="mb-2.5 block text-[13px] leading-none text-violet12"
					htmlFor="newPassword"
				>
					New password
				</label>
				<input
					className="h-[35px] bg-white shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
					id="newPassword"
					type="password"
                    {...register('password', {required: true})}
				/>

{ errors.password && <div className="font-semibold text-red-500 mt-1">{errors.password.message}</div>}
			</fieldset>
			<fieldset className="mb-[15px] flex w-full flex-col justify-start">
				<label
					className="mb-2.5 block text-[13px] leading-none text-violet12"
					htmlFor="confirmPassword"
				>
					Confirm password
				</label>
				<input
					className="h-[35px] bg-white shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
					id="confirmPassword"
					type="password"
                    {...register('conf_passowrd', {required: true})}
				/>

{ errors.conf_passowrd && <div className="font-semibold text-red-500 mt-1">{errors.conf_passowrd.message}</div>}

{
    getValues('password') != getValues('conf_passowrd') ? <div className="text-red-500 font-semibold">Password and confirm Password should be same</div> : ''
}

			</fieldset>
			<div  className="mt-5 flex justify-end">
				<Button type="sumbit" disabled={isSubmitting} loading={isSubmitting} className="inline-flex h-[35px] cursor-default items-center justify-center rounded bg-green4 px-[15px] text-[15px] font-medium leading-none text-green11 outline-none hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7">
					Change password
				</Button>
			</div>
		</form>
        {
            emailSend && <div className="text-[#10ff1a] font-semibold mt-2">{emailSend}</div>
        }
	</Tabs.Root>

        </div>
    )
}