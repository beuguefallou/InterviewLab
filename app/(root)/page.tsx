import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import InterviewCard from '@/components/InterviewCard'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import { getCurrentUser } from '@/lib/actions/auth.action'

const page = async () => {

  const user = await getCurrentUser();


  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({userId:user?.id!})
  ])
  

// console.log(userInterviews);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length!>0;
  return (
    <>
      <section className='card-cta '>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h3 >
            Interview prep made easy with AI powered support
          </h3>
          <p className='text-lg'>
            Practice  on real interview questions and get instant feedback
          </p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an interview </Link>
          </Button>
        </div>
        <Image src='/robot.png' alt='robot-dude' width={400} height={400} className='max-sm:hidden' />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Intervivews</h2>
        <div className='interviews-section'>
          {
          hasPastInterviews ? (
              userInterviews?.map((interview)=>(
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ) : (
              <p>You haven't taken any interviews yet.</p>
            )
          }

        </div>
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an interview</h2>
        <div className='interviews-section'>
         {
          hasUpcomingInterviews ? (
              latestInterviews?.map((interview)=>(
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ) : (
              <p>There are no intervivews available</p>
            )
          }
        </div>
      </section>
    </>
  )
}

export default page