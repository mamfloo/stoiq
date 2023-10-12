"use client"

import React, { useState } from 'react'
import Register from '../(registerPopUp)/Register';
import { useForm } from 'react-hook-form';

export default function Login({openRegisterPopUp}: {openRegisterPopUp: () => any}) {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
    getValues,
  } = useForm();



  return (
    <div className='fixed bg-background/[0.95] rounded-lg top-1/2 left-1/2 transform -translate-y-1/2
      -translate-x-1/2 px-16 py-10 w-full md:w-fit z-10'>
        <h1 className='text-primary mb-10 text-2xl text-center mt-0'>Login</h1>
        <form  className='flex flex-col gap-8'>
            <input 
              {...register("username", {
                required: "Username is reqired"
              })}
              name="username" type="text" placeholder='username' 
              className='bg-secondary placeholder:text-center p-3 rounded-lg border-2 border-accent text-lg
              focus:border-primary outline-none' />
            <input 
              {...register("password", {
                required: "Password is required"
              })}
              name="password" type="password" placeholder='********'
              className='bg-secondary placeholder:text-center p-3 rounded-lg border-2 border-accent text-lg
              focus:border-primary outline-none' />
            <div className='flex justify-center flex-col'>
              <button className='bg-primary px-10 py-3 rounded-lg text-black'>Login</button>
              <button className='mt-3' onClick={openRegisterPopUp}>Don't have an account? Register now!</button>
            </div>
        </form>

    </div>
  )
}
