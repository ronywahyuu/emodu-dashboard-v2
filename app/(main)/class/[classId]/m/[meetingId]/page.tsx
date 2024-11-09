/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useGetMeetingByMeetingCode,
  useToggleStartMeeting
} from '@/hooks/api/meeting-service-hooks'
import { RecognitionsDetail, RecognitionsOverview, RecognitionsSummary, useGetRecognitionByMeetingCode } from '@/hooks/api/recognition-service-hooks'
import {
  KeyRound, Link, Text, Video,
} from 'lucide-react'
import React from 'react'
import MeetingActions from '../components/meeting-action'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Recognitions from '../components/recognitions'
import Participants from '../components/participants'
import { useGetProfile } from '@/hooks/api/user-service-hooks'
import NotAuthorizedPageComponent from '../components/not-authorized'
import EmovalaroRecognition from '../components/emovalaro-recognition'

interface MeetingDetailPageProps {
  params: {
    meetingId: string
  }
}

function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { data: profile } = useGetProfile()
  // const {
  //   data: meetingDetail,
  //   isLoading
  // } = useGetMeetingById(params.meetingId)
  const {
    data: meetingData,
    isPending: meetingDataPending
  } = useGetMeetingByMeetingCode(params.meetingId)
  const toggleStartMeeting = useToggleStartMeeting()

  const {
    data: recognitionsData,
    isPending: recognitionsDataPending,
    error: recognitionsDataError
  } = useGetRecognitionByMeetingCode(params.meetingId)

  const isOwner = meetingData?.data.createdBy === profile?.data.id

  // console.log('isOwner', isOwner)
  const handleStartMeeting = () => {
    toggleStartMeeting.mutate(params.meetingId)

  }

  if (!isOwner) {
    return (
      <NotAuthorizedPageComponent />
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink >
                  Python Meeting
                </BreadcrumbLink>
              </BreadcrumbItem>
              {/* <BreadcrumbSeparator className="hidden md:block" /> */}
              {/* <BreadcrumbItem>
                <BreadcrumbPage>
                  Class Detail
                </BreadcrumbPage>
              </BreadcrumbItem> */}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Separator />

      {/* MEETING SESSION */}
      <div
        className=" mx-10 flex items-center justify-between mt-10 bg-gradient-to-r from-gray-800 via-slate-600 to-gray-600 text-white rounded-lg p-10 relative">
        {meetingDataPending ? (
          <div className="space-y-2">
            <Skeleton className="w-96 h-8" />
            <Skeleton className="w-96 h-8" />
            <Skeleton className="w-96 h-8" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2 mb-6">
              <h1
                className="text-3xl font-semibold"
              >
                {meetingData?.data.name}
              </h1>
            </div>
            <div className="flex gap-2">
              <KeyRound /> :
              {params.meetingId}
              {/* {isCopyEmoviewCodeSuccess ? (
                "✅ Copied"
              ) : (
                <Copy
                  onClick={copyToClipboardEmoviewCode}
                  className="w-3 h-3 cursor-pointer"
                />

              )} */}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex gap-2">
                <Link /> :
                <a
                  href={meetingData?.data.link || "-"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {meetingData?.data.link || "-"}
                </a>
              </div>
              {/* {isCopySuccess ? (
                "✅ Copied"
              ) : (
                <Copy
                  onClick={copyToClipboard}
                  className="w-3 h-3 cursor-pointer"
                />

              )} */}

            </div>
            <div className="flex gap-2">
              <Text /> {":"} <span>{meetingData?.data.description}</span>
            </div>
          </div>
        )}

        <div className="">
          {recognitionsDataPending ? (
            <Skeleton className="w-96 h-8" />
          ) : (
            meetingData?.data.isStarted ? (
              <MeetingActions
                recognitionsData={recognitionsData as any}
                errorState={recognitionsDataError}
                meetingCode={params.meetingId}
                isEnded={meetingData.data.isEnded}
              />

            ) : (
              <Button
                onClick={handleStartMeeting}
                variant="secondary"
              >
                <Video className="w-4 h-4 mr-2" />

                {recognitionsDataPending || toggleStartMeeting.isPending ? 'Starting...' : 'Start Meeting'}
              </Button>
            )

          )}
          {/* {isRecognitionStarted && (
            <ActionTooltip label="Show Picture in Picture display for realtime emotion recognition" duration={500}>

              <Badge
                variant="outline"
                className="bg-red-600 text-white border-none absolute -top-8 m-10 -right-8 animate-pulse p-2 px-3 flex items-center gap-2"
              >
                <VideoIcon className="w-5" />
                <p className="text-xs">

                  Emotion Recognizing
                </p>
              </Badge>
            </ActionTooltip>

          )} */}

        </div>


      </div>

      <div className="mt-10 mx-10">
        <Tabs defaultValue="recognition" className="w-full">
          <TabsList>
            <TabsTrigger value="recognition">Recognition (Face-api.js)</TabsTrigger>
            {/* <TabsTrigger value="recognition-rangga">Recognition (EmoValaro7)</TabsTrigger> */}
            {/* <TabsTrigger value="valencearousal">Valence Arousal Data</TabsTrigger> */}
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>
          <TabsContent value="recognition">
            {recognitionsDataPending ? (
              <Skeleton className="w-full h-screen" />
            ) : (
              // <div>w</div>
              <Recognitions
                recognitionDetail={
                  recognitionsData?.data.recognitionsDetail as RecognitionsDetail
                }
                recognitionOverview={
                  recognitionsData?.data.recognitionsOverview as RecognitionsOverview
                }
                recognitionSummary={
                  recognitionsData?.data.recognitionsSummary as RecognitionsSummary
                }
              />
            )}
          </TabsContent>
          {/* <TabsContent value="recognition-rangga">
            {recognitionsDataPending ? (
              <Skeleton className="w-full h-screen" />
            ) : (
              <EmovalaroRecognition />
            )}
          </TabsContent> */}
          <TabsContent value="participants">
            {/* {!recognitionsDataPending ? (
              <div className="flex flex-col items-center  min-h-[60vh] justify-center space-y-3">
                <Image
                  src="/images/no_participant_1.svg"
                  width={300}
                  height={300}
                  alt="No participants"
                />
                <p className="text-4xl text-gray-400">No participants</p>
              </div>
            ) : (
            )} */}
            <Participants
              meetingData={meetingData as any}
              recognitionDetail={
                recognitionsData?.data.recognitionsDetail as RecognitionsDetail
              }
              participants={meetingData?.data.participants as any}
            />
          </TabsContent>
        </Tabs>
      </div>


    </>
  )
}


export default MeetingDetailPage