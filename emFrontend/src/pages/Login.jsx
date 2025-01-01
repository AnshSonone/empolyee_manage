import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@radix-ui/themes'
import * as Label from '@radix-ui/react-label';

export default function Login() {

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

    const FormSchema = z.object({
        email: z.string().email("Email is required"),
        password: z.string().min(5, "Password must be have 5 characters"),
      });
    
      const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting, isSubmitSuccessful },
      } = useForm({
        defaultValues: {
          email: "",
          password: "",
        },
        resolver: zodResolver(FormSchema),
      });

      useEffect(() => {
        if (localStorage.getItem('refreshToken')){
    
          const reNewAccessToken = async () => {
            let res = await axios.post(
              '/api/token/refresh/',
              {
                refresh: localStorage.getItem('refreshToken')
              }
            )
            
            if (res.status == 200){
              Cookies.set('accessToken', res.data.access)
            }
          } 
    
          reNewAccessToken()
        }
        
      } , [])

      const loginSubmit = async (data) => {
        try {
          await axios.get('/api/token/csrf/')

          const csrftoken = Cookies.get('csrftoken')
          const res = await axios.post(
            '/api/users/login/',
            {
              email: data.email,
              password: data.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFtoken': csrftoken,
              }
            }
           );
    
          // Check if the response is successful
          if (res.status == 200) {
            Cookies.set('accessToken', res.data.token.access)
            localStorage.setItem('refreshToken', res.data.token.refresh)
            navigate('/')
            // Handle successful login (e.g., save token, redirect)
          }
        } catch (err) {
          setError('root', {message: 'Invalid user credential or check your internet'})
          console.error(err);
        }
      };
    
      const handleShowpassword = () => {
        if(showPassword == 'password'){
          setShowPassword('text')
        }
        else{
          setShowPassword('password')
        }
      }

  return (
    <div className=" w-screen font-sans text-white">
      <div className=" ">
        <div className="mx-auto w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <div className="mx-2 py-12 text-center md:mx-auto md:w-2/3 md:py-20">
            <h1 className="mb-4 text-3xl font-black leading-4 sm:text-5xl xl:text-6xl">
              Sign in
            </h1>
          </div>
        </div>
      </div>
      <div className="md:w-2/3 mx-auto w-full pb-16 sm:max-w-screen-sm md:max-w-screen-md lg:w-1/3 lg:max-w-screen-lg xl:max-w-screen-xl">
        <form className="shadow-lg mb-4 rounded-lg border border-gray-100 py-10 px-8" onSubmit={handleSubmit(loginSubmit)}>

          <div className="mb-4">
            <Label.Root className='text-lg mb-2 font-bold' htmlFor='email'>E-mail</Label.Root>
            <input
              className=" shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              id="email"
              type="email"
              {...register('email', {required: true})}
              placeholder="email"
            />
            {errors.email && <span className="my-2 block text-red-500">{errors.email.message}</span>}
          </div>
          
          <div className="mb-4">
            <div className='flex justify-between'>
          <Label.Root className='text-lg font-bold' htmlFor='password'>Password</Label.Root>
            <Link to='/forgot_password'><span className='text-blue-500 hover:underline cursor-pointer'>forgot-password?</span></Link>
            </div>
            <input
              className="shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              id="password"
              type="password"
              {...register('password', {required: true})}
              placeholder="******************"
            />
            {errors.password && <span className="my-2 block text-red-500">{errors.password.message}</span>}
            {errors.root && <span className="my-2 block text-red-500">{errors.root.message}</span>}
          </div>
          <div className="mb-6"></div>
          <div className="flex items-center">
            <div className="flex-1"></div>

            <Button
            className="px-2 py-4 cursor-pointer"
              variant='surface'            
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              size='3'
            >
              {isSubmitting ? 'Signing ..' : 'signin'}
            </Button>
          </div>
          <div>
            <p className="font-bold ">Don't have account?<Link className="text-blue-500" to={'/register'}>Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}
