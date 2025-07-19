import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewId, getInterviewsById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import React from 'react'
import { Button } from '@/components/ui/button';

const page = async ({params}:RouteParams) => {
  const {id} = await params;

  const user = await getCurrentUser()

  const interview = await getInterviewsById(id);
  if(!interview) redirect('/');


  const feedback = await getFeedbackByInterviewId({
    interviewId:id,
    userId: user?.id!
  })

  return (
    <section className="section-feedback">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Feedback on your<br />
          <span className="capitalize bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-primary-200">
            {interview.role} Interview
          </span>
        </h1>
        
        <div className="flex flex-row gap-6 bg-dark-200 px-6 py-4 rounded-xl border border-light-600/20">
          <div className="flex items-center gap-2">
            <Image src="/star.svg" width={24} height={24} alt="star" className="text-primary-200" />
            <div>
              <p className="text-sm text-light-400">Overall Score</p>
              <p className="text-xl font-bold text-primary-200">
                {feedback?.totalScore}<span className="text-light-400 text-sm font-normal">/100</span>
              </p>
            </div>
          </div>

          <div className="h-full w-px bg-light-600/20"></div>

          <div className="flex items-center gap-2">
            <Image src="/calendar.svg" width={24} height={24} alt="calendar" />
            <div>
              <p className="text-sm text-light-400">Date</p>
              <p className="text-base">
                {feedback?.createdAt
                  ? dayjs(feedback.createdAt).format("MMM D, YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-200 p-6 rounded-xl border border-light-600/20 mb-8">
        <h2 className="text-xl font-semibold mb-3">Final Assessment</h2>
        <p className="text-light-100/90 leading-relaxed">{feedback?.finalAssessment}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-dark-200 p-6 rounded-xl border border-light-600/20">
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success-100">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-light-100/90">
                <span className="text-success-100 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-dark-200 p-6 rounded-xl border border-light-600/20">
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive-100">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="M15 9l-6 6"></path>
              <path d="M9 9l6 6"></path>
            </svg>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="flex items-start gap-2 text-light-100/90">
                <span className="text-destructive-100 mt-1">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-dark-200 p-6 rounded-xl border border-light-600/20 mb-10">
        <h2 className="text-xl font-semibold mb-4">Detailed Breakdown</h2>
        <div className="space-y-6">
          {feedback?.categoryScores?.map((category, index) => (
            <div key={index} className="border-b border-light-600/10 pb-4 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg">{category.name}</p>
                <div className="bg-dark-300 px-3 py-1 rounded-full">
                  <span className={`font-medium ${
                    category.score >= 80 ? 'text-success-100' :
                    category.score >= 60 ? 'text-primary-200' :
                    'text-destructive-100'
                  }`}>
                    {category.score}/100
                  </span>
                </div>
              </div>
              <p className="text-light-100/80">{category.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1 hover:bg-dark-300 transition-colors">
          <Link href="/" className="flex w-full justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M5 12h14"></path>
            </svg>
            <span className="text-sm font-semibold text-primary-200">
              Back to dashboard
            </span>
          </Link>
        </Button>

        <Button className="btn-primary flex-1 hover:brightness-110 transition-all">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path>
            </svg>
            <span className="text-sm font-semibold text-black">
              Retake Interview
            </span>
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default page