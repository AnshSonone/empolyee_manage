import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { Button } from "@radix-ui/themes";

export default function Register() {

  const FormSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Email is required"),
    phone_no: z.string().length(10, "Phone Number must have 10 digits"),
    user_role: z.string().min(1, "Designation is required"),
    date_of_birth: z.coerce
      .date()
      .refine((date) => date < new Date(), "enter valid date"),
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
      username: "",
      email: "",
      phone_no: "",
      user_role: "",
      date_of_birth: new Date(),
      password: "",
    },
    resolver: zodResolver(FormSchema),
  });

  const registerSubmit = async (data) => {
    try {
      const csrf = await axios.get("/api/token/csrf/");

      const csrftoken = Cookies.get("csrftoken");
      const res = await axios.post(
        "/api/users/register/",
        {
          email: data.email,
          username: data.username,
          phone_no: data.phone_no,
          user_role: data.user_role,
          date_of_birth: data.date_of_birth,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFtoken": csrftoken,
          },
        }
      );

      if (res.status == 201) {
        setEmailSend(`We have send activation email at ${data.email}`);
      }
    } catch (err) {
      setError("root", { message: data.message });
      console.error(err);
    }
  };

  return (
    <div className="bg-blackA10 w-screen font-sans text-white">
      <div className=" ">
        <div className="mx-auto w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <div className="mx-2 py-12 text-center md:mx-auto md:w-2/3 md:py-20">
            <h1 className="mb-4 text-3xl font-black leading-4 sm:text-5xl xl:text-6xl">
              Sign up
            </h1>
          </div>
        </div>
      </div>
      <div className="md:w-2/3 mx-auto w-full pb-16 sm:max-w-screen-sm md:max-w-screen-md lg:w-1/3 lg:max-w-screen-lg xl:max-w-screen-xl">
        <form className="shadow-lg mb-4 rounded-lg border border-gray-100 py-10 px-8" onSubmit={handleSubmit(registerSubmit)}>

        <div className="mb-4">
        <Label.Root className="mb-2 block text-lg font-bold" htmlFor="username">
              Username
            </Label.Root>
            <input
              className="text-white shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              id="username"
              type="text"
              {...register('username', {required: true})}
              placeholder="username"
            />
            {errors.username && <span className="my-2 block text-red-500">{errors.username.message}</span>}
          </div>

          <div className="mb-4">
            <Label.Root className="mb-2 block text-lg font-bold" htmlFor="email">
              E-mail
            </Label.Root>
            <input
              className="text-white shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              id="email"
              type="email"
              {...register('email', {required: true})}
              placeholder="email"
            />
            {errors.email && <span className="my-2 block text-red-500">{errors.email.message}</span>}
          </div>
          <div className="mb-4">
            <Label.Root className="mb-2 block text-lg font-bold" htmlFor="phone">
              Phone
            </Label.Root>
            <input
              className="text-white shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              id="phone"
              type="phone"
              {...register('phone_no', {required: true})}
              placeholder="Phone"
            />
            {errors.phone_no && <span className="my-2 block text-red-500">{errors.phone_no.message}</span>}
          </div>

          <div className="mb-4">
            <Label.Root className="mb-2 block text-lg font-bold" htmlFor="user_role">
              Designation
            </Label.Root>
            <input
              className="text-white shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              id="user_role"
              type="text"
              {...register('user_role', {required: true})}
              placeholder="Designation"
            />
            {errors.user_role && <span className="my-2 block text-red-500">{errors.user_role.message}</span>}
            </div>

            <div className="mb-4">
            <Label.Root className="mb-2 block text-lg font-bold" htmlFor="date_of_birth">
              Date of birth
            </Label.Root>
            <input
              className="text-white shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              id="date_of_birth"
              type="date"
              {...register('date_of_birth', {required: true})}
              placeholder="DOB"
            />
            {errors.date_of_birth && <span className="my-2 block text-red-500">{errors.date_of_birth.message}</span>}
            </div>
          <div className="mb-4">
            <Label.Root className="mb-2 block text-sm font-bold" htmlFor="password">
              Password
            </Label.Root>
            <input
              className="text-white shadow-sm w-full cursor-text appearance-none rounded border border-gray-300 py-2 px-3 leading-tight outline-none ring-blue-500 focus:ring"
              id="password"
              type="password"
              {...register('password', {required: true})}
              placeholder="******************"
            />
            {errors.password && <span className="my-2 block text-red-500">{errors.password.message}</span>}
          </div>
          <div className="mb-6"></div>
          <div className="flex items-center">
          {errors.root && <span className="my-2 block text-red-500">{errors.root.message}</span>}
            <div className="flex-1"></div>
            <Button
              variant="surface"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              size='3'
            >
              {isSubmitting ? 'Signuping ..' : 'signup'}
            </Button>
          </div>
          <div>
            <p className="font-bold ">Already signup?<Link className="text-blue-500" to={'/login'}>Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
