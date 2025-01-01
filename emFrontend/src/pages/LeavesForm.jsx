import react, {useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as Form from '@radix-ui/react-form';
import { Button } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


export default function LeavesForm() {

    const navigate = useNavigate()

    const FormSchema = z.object({
        leave_reason: z.string().min(1, 'Leave reason is required'),
        start_leave_date: z.coerce.date().refine((date) => date > Date.now(), 'Enter future date'),
        end_leave_date: z.coerce.date().refine((date) => date > Date.now(), 'Enter future date')
    })

    const { register , handleSubmit, setError, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            leave_reason: '',
            start_leave_date: '',
            end_leave_date: '',
        },
        resolver: zodResolver(FormSchema),
    })

    const handleLeave = async (data) => {
        try {
            const token = Cookies.get('accessToken')
            const decode = jwtDecode(token)
            const csrftoken = Cookies.get('csrftoken')
            let res = await axios.post(
                'api/users/leaves/',
                {
                    user: decode.user_id,
                    leave_reason: data.leave_reason,
                    start_leave_date: data.start_leave_date,
                    end_leave_date: data.end_leave_date,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                }
            }
        )

        if(res.status == 201){
            navigate('/')
        }
        } catch (error) {
            console.log(error)
            setError('root', error)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-[75vh]'>
            	<Form.Root className="w-[260px] sm:w-[50vw] bg-blackA7 px-4 py-4 rounded-md opacity-100 " onSubmit={handleSubmit(handleLeave)}>
		<Form.Field className="mb-2.5 grid" name="question">
			<div className="flex items-baseline justify-between">
				<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
					Leave reason
				</Form.Label>
				{
                    errors.leave_reason && <span
					className="text-[13px] text-red-500 font-semibold opacity-80"
					match="valueMissing"
				>
                    {errors.leave_reason.message}
				</span>
                }
			</div>
			<Form.Control asChild>
				<textarea
					className="box-border inline-flex w-full h-[15vh] resize-none appearance-none items-center justify-center rounded bg-blackA2 p-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                    {...register('leave_reason', { required: true})}
				/>
			</Form.Control>
		</Form.Field>
        <Form.Field className="mb-2.5 grid" name="email">
			<div className="flex items-baseline justify-between">
				<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
					Leave start date
				</Form.Label>
				{
                    errors.start_leave_date && <span
					className="text-[13px] text-red-500 font-semibold opacity-80"
					match="valueMissing"
				>
                    {errors.start_leave_date.message}
				</span>
                }
			</div>
			<Form.Control asChild>
				<input
					className="box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
					type="date"
					{...register('start_leave_date', { required: true})}
				/>
			</Form.Control>
		</Form.Field>
        <Form.Field className="mb-2.5 grid" name="email">
			<div className="flex items-baseline justify-between">
				<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
					Leave end date
				</Form.Label>
                {
                    errors.end_leave_date && <span
					className="text-[13px] text-red-500 font-semibold opacity-80"
					match="valueMissing"
				>
                    {errors.end_leave_date.message}
				</span>
                }
			</div>
			<Form.Control asChild>
				<input
					className="box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
					type="date"
                    {...register('end_leave_date', { required: true})}
				/>
			</Form.Control>
		</Form.Field>
		<Form.Submit asChild  type='submit'>
			<Button variant='surface' disabled={isSubmitting} loading={isSubmitting}>
				Apply leave
			</Button>
		</Form.Submit>
	</Form.Root>
        </div>
    )
}