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


export default function TaskForm() {

	const [submited, setIsSubmited] = useState('')

    const FormSchema = z.object({
        assigned_task: z.string().min(1, 'task is required'),
		deadline_date: z.coerce.date().refine((date) => date > Date.now(), 'enter deadline'),
    })

    const {register, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
			assigned_task: '',
			deadline_date: ''
        },
		resolver: zodResolver(FormSchema),
    })

	const handleTaskForm = async (data) => {
		try{
			console.log('clicked')
			const token = Cookies.get('accessToken')
			const res = await axios.post(
				'http://localhost:8000/api/users/task/',
				{
					assigned_task: data.assigned_task,
					deadline_date: data.deadline_date,
				},{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			)
			res.status == 200 ? setIsSubmited('Task send successfully') : ''

		}catch(error){
			console.log(error)
			setError(error);
		}
	}

  return (
    <div className='relative  top-[15%] sm:flex justify-center items-center'>
        <Form.Root className="sm:min-w-96 bg-blackA7 px-4 py-4 rounded-md opacity-100 " onSubmit={handleSubmit(handleTaskForm)}>
		<Form.Field className="mb-2.5 grid " name="question">
			<div className="flex items-center justify-between">
				<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
					Leave reason
				</Form.Label>
				<Form.Message
					className="text-[13px] text-white opacity-80"
					match="valueMissing"
				>
					Please enter a task
				</Form.Message>
			</div>
			<Form.Control asChild>
				<textarea
					className="box-border inline-flex w-full h-[15vh] resize-none appearance-none items-center justify-center rounded bg-blackA2 p-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-white"
                    {...register('assigned_task', { required: true})}
				/>
			</Form.Control>
		</Form.Field>
        <Form.Field className="mb-2.5 grid" name="email">
			<div className="flex items-baseline justify-between">
				<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
					Deadline date
				</Form.Label>
			</div>
			<Form.Control asChild>
				<input
					className="box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-white"
					type="date"
					{...register('deadline_date', { required: true})}
				/>
				</Form.Control>
			{
				errors.deadline_date && <Form.Message
				className="text-[13px] text-white opacity-80"
				>
                    {errors.deadline_date.message}
				</Form.Message>
                }
		</Form.Field>
        
		<Form.Submit asChild  type='submit'>
			<Button type='submit' variant='surface' disabled={isSubmitting} loading={isSubmitting}>
				Assigned task 
			</Button>
		</Form.Submit>
		{
			submited && <div className='flex justify-center p-2'>
			<span className='text-green-400 text-sm'>{submited}</span>
		</div>
		}
	</Form.Root>
    </div>
    
  )
}
