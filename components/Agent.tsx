"use client"

import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';
import { vapi } from '@/lib/vapi.sdk';
import { cn } from '@/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'



enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}



const Agent = ({ userName, userId, type , interviewId, questions}: AgentProps) => {

  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = React.useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([

  ]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = {
          role: message.role,
          content: message.transcript
        }
        setMessages((prev) => [...prev, newMessage]);
      }
    }

    const speechStart = () => setIsSpeaking(true);
    const speechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log(error);


    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', speechStart);
    vapi.on('speech-end', speechEnd);
    vapi.on('error', onError);


    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', speechStart);
      vapi.off('speech-end', speechEnd);
      vapi.off('error', onError);
    }
  }, [])

  const handleGenerateFeedback = async (messages:SavedMessage[])=>{
    console.log('Generate feed back here.');

    const { success,feedbackId:id} =  await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages
    })

    if(success && id){
      router.push(`/interview/${interviewId}/feedback`);
    }else{
      console.log('Error saving feedback');
      router.push('/');
    }
  }

  useEffect(()=>{
    if(callStatus==CallStatus.FINISHED){
      if(type==='generate'){
        router.push('/');
      }else{
        handleGenerateFeedback(messages);
      }
    }
    if(callStatus==CallStatus.FINISHED) router.push('/');

  },[messages,callStatus,type,userId])


  const handleCall = async ()=>{
    setCallStatus (CallStatus.CONNECTING);

    if(type==='generate'){

      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
        variableValues: {
          username: userName,
          userid: userId
        },
        clientMessages: [],
        serverMessages: []
      })
    }else{
      let formattedQuestions = '';
      if(questions){
        formattedQuestions = questions.map(
          (question) => `-${question}`
        ).join('\n')
      }

      await vapi.start(interviewer,{
        variableValues: {
          questions: questions
        },
        clientMessages: [],
        serverMessages: []
      })
    }

  }

  const handleDisconnect = async () =>{
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  }

  const latestmessage = messages[messages.length - 1]?.content;

  const iaCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
  return (
    <>
      <div className='call-view'>
        <div className='card-interviewer bg-black card-content'>

          <div className='avatar'>
            <Image src="/robot.png" alt='vapi' width={100} height={100} className='object-cover' />
            {isSpeaking && <span className='animate-speak' />}

          </div>
          <h3>AI Interview</h3>
        </div>
        <div className='card-border'>
          <div className='card-content'>
            <Image src="/user-avatar.png" alt='vapi' width={540} height={540} className='object-cover roudnded-full size-[120px]' />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className='transcript-border'>
          <div className='transcript'>
            <p key={latestmessage} className={cn('transition-opacity duration-500 opacity-0 ',
              'animate-fadeIn opacity-100')}>
              {latestmessage}
            </p>
          </div>
        </div>
      )}
      <div className='w-full flex justify-center '>
        {callStatus !== CallStatus.ACTIVE ? (
          <button className='relative btn-call cursor-pointer'  onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== CallStatus.CONNECTING && 'hidden')} />
            <span>
              {iaCallInactiveOrFinished ? 'Call' : '...'}
            </span>
          </button>
        ) : (
          <button className='btn-disconnect cursor-pointer' onClick={handleDisconnect}>End Call</button>
        )}
      </div>
    </>
  )
}

export default Agent