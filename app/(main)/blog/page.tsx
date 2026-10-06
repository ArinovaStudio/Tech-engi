"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function page() {
    const router = useRouter()
    const redirect = () => {
        router.push('/blog/freelance-engineering-without-issues')
    }
    
    useEffect(() => {
        redirect()
    }, [])
  return <></>
}

export default page