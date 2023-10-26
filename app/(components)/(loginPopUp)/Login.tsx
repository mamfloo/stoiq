"use client"

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { TLoginSchema, loginSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

export default function Login({openRegisterPopUp, afterLoginOrRegister}: {openRegisterPopUp: () => void, afterLoginOrRegister:() => void}) {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  async function login(data: TLoginSchema){
    const signInData = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false
    });
    if(signInData?.error) {
      toast.error("Username or password invalid")
    } else {
      toast.success("Welcome back "+ data.username)
      afterLoginOrRegister()
    }
  }


  return (
    <div className='fixed bg-background/[0.95] rounded-lg top-1/2 left-1/2 transform -translate-y-1/2
      -translate-x-1/2 px-16 py-10 w-full md:w-fit z-10'>
        <h1 className='text-primary mb-10 text-2xl text-center mt-0'>Login</h1>
        <form onSubmit={handleSubmit(login)}  className='flex flex-col gap-8'>
          <div className='flex justify-center'>
            <input 
                {...register("username")}
                name="username" type="text" placeholder='username' 
                className='bg-secondary placeholder:text-center p-3 rounded-lg border-2 border-accent text-lg
                focus:border-primary outline-none' />
                {errors.username && (
                  <p className='text-red-500'>{errors.username.message}</p>
                )}
          </div>
          <div className='flex justify-center'>
            <input 
              {...register("password")}
              name="password" type="password" placeholder='********'
              className='bg-secondary placeholder:text-center p-3 rounded-lg border-2 border-accent text-lg
              focus:border-primary outline-none' />
              {errors.password && (
                <p className='text-red-500'>{errors.password.message}</p>
              )}
          </div>
          <div className='flex justify-center flex-col'>
            <button type='submit' className='bg-primary px-10 py-3 rounded-lg text-black text-lg'>Login</button>
            <button className='mt-3' onClick={openRegisterPopUp}>Don't have an account? Register now!</button>
          </div>
        </form>

    </div>
  )
}
