import React, {useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@radix-ui/themes";

export default function EmailForgotPassword(){

    
    const [emailSend, setEmailSend] = useState('')

    const FormSchema = z.object({
        email: z.string().email('email is required'),
    })

    const {register, handleSubmit, setError, formState: {errors, isSubmitting, isSubmitSuccessful}} = useForm({
        defaultValues: {
            email: '',
        },
        resolver: zodResolver(FormSchema),
    })

    const sendForgotEmail = async (data) => {

        try {
        const csrf = await axios.get('api/token/csrf')

        let res = await axios.post(
            '/api/users/forgot/',
            {
                email: data.email,
            },
            {
                headers: {
                    'X-CSRFtoken': Cookies.get('csrftoken')
                }
            }
        )

        if( res.status == 200 ){
            setEmailSend('Reset password link is send to your email')
            setEmail('')
        }
        } catch (error) {
            console.log(error)
            setError('root', error)
        }
        
    }

    return (
        <div className="flex flex-col justify-center items-center h-[80vh]">
            <h2 className="text-3xl font-bold my-4"> Forgot password </h2>
            <form onSubmit={handleSubmit(sendForgotEmail)} className="mx-4 ">
                            <input
                              className=" shadow-sm w-full sm:w-[25vw] cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
                              id="email"
                              type="email"
                              {...register('email', {required: true})}
                              placeholder="Enter email"
                            />
                { errors.email && <div className="font-semibold text-red-500 mt-1">{errors.email.message}</div>}

                { errors.root && <div className="text-sm text-red-500 mt-1">{errors.root.message}</div>}

                <div className="flex flex-col items-center my-4">
                <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>Reset password</Button>
                </div>
                { emailSend && <div className="text-[#10ff1a] font-semibold">{emailSend}</div>}
            </form>
        </div>
    )
}