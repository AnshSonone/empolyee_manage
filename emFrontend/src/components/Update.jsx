import * as Dialog from "@radix-ui/react-dialog";
import {Cross2Icon } from '@radix-ui/react-icons'
import axios from "axios";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigate} from 'react-router-dom';

export default function Update(props) {
	
	const navigate = useNavigate()

    const FormSchema = z.object({
        assigned_task: z.string().min(1, 'Task is required'),
        deadline_task: z.coerce.date().refine((date) => date > Date.now(), 'Date is required of future')
    })

    const {register, handleSubmit, setError, formState : {errors, isSubmitting}} = useForm({
        defaultValues: {
            assigned_task: props.task.data.assigned_task,
            deadline_date: props.task.data.deadline_date,
        },
        resolver: zodResolver(FormSchema)
    })

    const handleTaskUpdate = async (data) => {
        try{
			const token = Cookies.get('accessToken')
        const res = await axios.patch(
            'http://localhost:8000/api/users/task/',
            {
				task_id: props.task.data.id,
                assigned_task: data.assigned_task,
                deadline_date: data.deadline_date,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
		if (res.status == 200){
			navigate('/taks')
		}
		}catch(error){
			console.log(error)
			setError(error)
		}
    }

    return (
		<Dialog.Root>
		<Dialog.Trigger asChild onSubmit={handleSubmit(handleTaskUpdate)}>
			<button className="inline-flex h-[35px] items-center justify-center rounded bg-white px-[15px] font-medium leading-none text-violet11 shadow-[0_2px_10px] shadow-blackA4 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
			Update task
			</button>
		</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
			<Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
				<Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
					Update task
				</Dialog.Title>
				<Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
					Make changes to your task here. Click save when you're done.
				</Dialog.Description>
				<fieldset className="mb-[15px] flex items-center gap-5 flex-nowrap">
					<label
						className="w-[90px] text-right text-[15px] text-violet11 "
						htmlFor="assigned_task"
					>
						Assigned Task
					</label>
					<textarea
						className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
						id="assigned_task"
                        {...register('assigned_task', {required: true,})}
					/>
					{
						errors.assigned_task && <div><span className="text-sm text-red-500">error</span></div>
					}
				</fieldset>
				<fieldset className="mb-[15px] flex items-center gap-5">
					<label
						className="w-[90px] text-right text-[15px] text-violet11"
						htmlFor="deadline_date"
					>
						Deadline Date
					</label>
					<input
						className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
						id="deadline_date"
                        {...register('deadline_date', {required: true,})}
					/>
					{
						errors.deadline_date && <div><span className="text-sm text-red-500">error</span></div>
					}
				</fieldset>
				<div className="mt-[25px] flex justify-end">
					<Dialog.Close asChild >
						<button className="inline-flex h-[35px] items-center justify-center rounded bg-green-700 px-[15px] font-medium leading-none text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 focus:outline-none" type="submit" disabled={isSubmitting}>
							Save changes
						</button>
					</Dialog.Close>
				</div>
				<Dialog.Close asChild>
					<button
						className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
						aria-label="Close"
					>
						<Cross2Icon />
					</button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
)
};
