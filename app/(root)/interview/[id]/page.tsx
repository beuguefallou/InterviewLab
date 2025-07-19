import Agent from '@/components/Agent';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewsById } from '@/lib/actions/general.action';
import { getRandomInterviewCover } from '@/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({params}: RouteParams) => {
  const {id} = await params;
  
  const interview = await getInterviewsById(id);
  const user = await getCurrentUser();

  if(!interview) redirect('/')
  
  return (
    <>
      <div className='bg-dark-200 rounded-xl p-6 mb-8 border border-light-600/20 shadow-lg'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center gap-4'>
            <Image 
              src={getRandomInterviewCover()} 
              alt='cover-image' 
              width={64} 
              height={64} 
              className='rounded-full ring-2 ring-primary-200/50' 
            />
            <div>
              <h2 className='capitalize text-2xl font-semibold mb-1'>{interview.role} Interview</h2>
              <div className='flex items-center gap-2'>
                <span className='bg-primary-200/20 text-primary-200 px-3 py-1 rounded-full text-xs font-medium capitalize'>
                  {interview.type}
                </span>
                <DisplayTechIcons techStack={interview.techstack} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='relative'>
        <Agent 
          userName={user?.name || "Guest"} 
          interviewId={id} 
          type="interview" 
          questions={interview.questions} 
          userId={user?.id} 
        />
      </div>
    </>
  )
}

export default Page