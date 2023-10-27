"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import { useForm } from 'react-hook-form';
import { TUpdateAccountSchema, updateAccountSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SettingsComponent() {
  const [ selectedImage, setSelectedImage] = useState<File>();
  const [ previewImage, setPrivewImage ] = useState("");
  const { data: session,status, update } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setValue,
  } = useForm<TUpdateAccountSchema>({
    resolver: zodResolver(updateAccountSchema)
  });

  useEffect(() => {    
    setValue("username", session?.user.username || "");
    setValue("bio", session?.user.bio || "");
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]){
      const file = e.target.files[0];
      setSelectedImage(file)
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onload = () => {
        setPrivewImage(reader.result as string);
      };
    }
  };

  async function updateAccount(data: TUpdateAccountSchema) {
    const tdata = new FormData()
    tdata.set("username", data.username);
    tdata.set("bio", data.bio);
    if(selectedImage) {
      tdata.set("profilePicData", selectedImage);
    }
    const req = await fetch("/api/updateAccount", {
      method: "POST",
      body: tdata,
    });
    const updateResult = await req.json();
    if(updateResult.errors){
      toast.error(updateResult.errors)
    } else if(updateResult.success){
      update();
      toast.success(updateResult.success);
      router.refresh();
    }
  }

  return (
    <div className='border-2 border-accent p-3 rounded-lg'>
      <h1 className='text-2xl ml-4'>Profile Settings</h1>
      <form onSubmit={handleSubmit(updateAccount)}
        className='mt-4'>
        <div className='flex flex-col mt-4'>
          <label htmlFor="username">Username</label>
          <input
            className='p-2 bg-secondary outline-none border-2 border-accent rounded-lg focus:border-primary  mt-2 cursor-pointer'
            type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {previewImage !== "" && <Image src={previewImage} alt="Selected" width={120} height={120} className='rounded-full aspect-square mt-2'/>}
        <div className='flex flex-col mt-3'>
          <label htmlFor="username">Username</label>
          <input 
            {...register("username")}
            name='username' type="text" placeholder='username' 
            className='p-2 bg-secondary outline-none  border-2 border-accent rounded-lg focus:border-primary mt-2'/>
            {errors.username && (
              <p className='text-red-500'>{errors.username.message}</p>
            )}
        </div>
        <div className='flex flex-col mt-4'>
          <label htmlFor="username">Bio</label>
          <input 
            {...register("bio")}
            name='bio' type="text" placeholder='bio' 
            className='p-2 bg-secondary outline-none border-2 border-accent rounded-lg focus:border-primary  mt-2'/>
            {errors.bio && (
              <p className='text-red-500'>{errors.bio.message}</p>
            )}
        </div>
        <button type='submit' disabled={isSubmitting} className='bg-primary p-2 rounded-lg text-black px-6 hover:text-white mt-5 block text-lg'>Submit</button>
      </form>
    </div>
  )
}

