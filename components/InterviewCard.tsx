import React from 'react'
import dayjs from "dayjs";
import Image from 'next/image';
import { getRandomInterviewCover } from '@/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';
import { getCurrentUser } from '@/lib/actions/auth.action';


const InterviewCard = async ({ id, userId, role, type, techstack, createdAt }: InterviewCardProps) => {

  const user = await getCurrentUser();
  const feedback = user?.id && id ? await getFeedbackByInterviewId({interviewId:id, userId:user?.id}) :null;
  console.log(feedback);
  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-auto lg:h-96'>
      <div className='card-interview'>
        <div>
          <div className='absolute top-1 right-1 w-fit px-4 py-2 rounder-bl-lg bg-light-600 rounded-xl'>
            <p className='badge-text '>
              {normalizedType}
            </p>
          </div>
          <Image src={getRandomInterviewCover()} alt='cover image'
            width={90} height={90} className='rounded-full 
          object-fit size-[60px]'/>
          <h3 className='mt-5 capitalize'>
            {role} Interview
          </h3>
          <div className='flex- flex-row gap-5 mt-3 '>
            <div className='flex flex-row gap-2 mr-4'>
              <Image src="/calendar.svg" alt='calender' width={22} height={22} />
              <p>
                {formattedDate}
              </p>
              <div className='flex flex-row gap-2 items-center '>
                <Image src="/star.svg" alt='calender' width={22} height={22} />
                <p>
                  {feedback?.totalScore || '---'}/100
                </p>
              </div>
            </div>
            <p className='line-clamp-2 mt-5'>
              {feedback?.finalAssessment ||
                "You haven't taken the interview yet. Take it now to improve your skills."}
            </p>
          </div>
          <div className='flex flex-row justify-between items-center mt-5'>
            <DisplayTechIcons techStack={techstack} />
            <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
              <Button className='btn-primary'>
                {feedback ? 'View feedback' : 'View interview'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard