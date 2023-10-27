"use client"

import { TRegisterSchema, registerSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function Register({openLoginPopUp, afterLoginOrRegister}: {openLoginPopUp: () => void, afterLoginOrRegister: () => void}) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: TRegisterSchema) => {
    const response = await fetch("/api/register", {
      method: "Post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const responseData = await response.json();
    if(!response.ok){
      toast.error("Something went wrong")
      return;
    }
    if(responseData.errors){ 
      const errors = responseData.errors;
      if (errors.email) {
        setError("email", {
          type: "server",
          message: errors.email,
        });
      } else if(errors.username) {
        setError("username", {
          type: "server",
          message: errors.username
        })
      } else if(errors.password) {
        setError("password", {
          type: "server",
          message: errors.password
        })
      } else if(errors.confirmPassword){
        setError("confirmPassword", {
          type: "server",
          message: errors.confirmPassword
        })
      }
    } else if(responseData.error) {

      toast.error(responseData.error)
    } else {
      toast.success("Account created successfully!")
      reset({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
    }
  }
  

  return (
    <div className='fixed bg-background/[0.95] rounded-lg top-1/2 left-1/2 transform -translate-y-1/2
      -translate-x-1/2 px-16 py-10 w-full md:w-fit z-10'>
        <h1 className='text-primary mb-10 text-2xl text-center mt-0'>Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
            <div className='flex justify-center'>
              <input 
                {...register("username")}
                type="text" placeholder='username' 
                className='bg-secondary placeholder:text-center p-3 rounded-lg border-2 border-accent text-lg
                focus:border-primary outline-none' />
                {errors.username && (
                  <p className='text-red-500 -mb-6'>{errors.username.message}</p>
                )}
            </div>
            <div className='flex justify-center'>
              <input 
                {...register("email")}
                type="email" placeholder='email' 
                className='bg-secondary placeholder:text-center p-3 rounded-lg border-2 border-accent text-lg
                focus:border-primary outline-none' />
                {errors.username && (
                  <p className='text-red-500 absolute'>{errors.email?.message}</p>
                )}
              </div>
            <div className='flex justify-center'>
              <input 
                {...register("password")}
                type="password" placeholder='********' 
                className='bg-secondary placeholder:text-center p-3 rounded-lg border-2 border-accent text-lg
                focus:border-primary outline-none' />
                {errors.password && (
                  <p className='text-red-500 absolute'>{errors.password.message}</p>
                )}
            </div>
            <div className='flex justify-center'>
              <input 
                {...register("confirmPassword")}
                type="password" placeholder='********' 
                className='bg-secondary placeholder:text-center p-3 rounded-lg border-2 border-accent text-lg
                focus:border-primary outline-none' />
                {errors.confirmPassword && (
                  <p className='text-red-500'>{errors.confirmPassword.message}</p>
                )}
            </div>
            <label htmlFor="terms" className='text-center'><input type="checkbox" name="terms" 
              /> <span className='ml-1'>Accept terms and conditions</span></label>
            <div className='flex justify-center  flex-col'>
            <button disabled={isSubmitting} 
              type='submit'
              className='bg-primary px-10 py-3 rounded-lg text-black text-lg'>Register</button>
            <button className='mt-3' onClick={openLoginPopUp}>Already have an acount? Login!</button>
          </div>
        </form>     
    </div>
  )
}
