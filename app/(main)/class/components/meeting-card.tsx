import React, {useEffect, useState} from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import {
  CheckCircle,
  MoreHorizontal,
  CalendarDays,
  Link as LinkIcon,
  GiftIcon,
} from "lucide-react";
import { Meeting } from "@/hooks/api/class-service-hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/hooks/use-modal-store";
import { useGetProfile } from "@/hooks/api/user-service-hooks";
import { RecentMeetings } from "@/hooks/api/dashboard-service-hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllStudentFeedbacksByMeeting } from "@/hooks/api/manual-service-hooks";
import StudentFeedbackModal from "@/components/modals/gift-feedback";
import { date } from "zod";

interface MeetingCardProps {
  meeting: Meeting & RecentMeetings;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const { onOpen } = useModalStore();
  const { data: profileData } = useGetProfile();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [hasNewFeedback, setHasNewFeedback] = useState(false);

  const  { data: feedbacks = [] } = useGetAllStudentFeedbacksByMeeting(
    meeting.isStarted || meeting.isEnded ? meeting.id : undefined
  );


  const isOwner = profileData?.data.id === meeting.createdBy;
  const studentName = profileData?.data.fullname?.split(' ')[0] || 'Anda';

  useEffect(()=> {
    if (feedbacks.length > 0) {
      const lastViewed = localStorage.getItem(`lastViewedFeedback-${meeting.id}`);
      const mostRecentFeedbackTime = new Date(feedbacks[0].createdAt).getTime();

      if (!lastViewed || mostRecentFeedbackTime > new Date(lastViewed).getTime()){
        setHasNewFeedback(true);
      } else {
        setHasNewFeedback(false);
      }
    } else {
      setHasNewFeedback(false);
    }
  }, [feedbacks, meeting.id]);

  const handleOpenFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
    localStorage.setItem(`lastViewedFeedback-${meeting.id}`, new Date().toISOString());
    setHasNewFeedback(false);
  }
  // console.log('isOwner', isOwner);

  return (
    <>
    <StudentFeedbackModal
    isOpen={isFeedbackModalOpen}
    onClose={() => setIsFeedbackModalOpen(false)}
    feedbacks={feedbacks}
    studentName={studentName}
    />
    <Card
      className="w-full  bg-white shadow-lg hover:shadow-xl transition-shadow duration-300
            dark:bg-transparent dark:shadow-none dark:hover:shadow-none dark:text-white dark:border dark:border-gray-700

    "
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                meeting.isStarted
                  ? "bg-green-100 text-green-500"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {meeting.isStarted ? (
                <CheckCircle size={16} />
              ) : (
                <MoreHorizontal size={16} />
              )}
            </div>
            <h3 className="text-lg font-medium">{meeting.name}</h3>
          </div>
          <div className="text-gray-500">
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onOpen("editMeeting", meeting)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onOpen("deleteMeetingDialog", meeting)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CalendarDays size={16} className="text-gray-500" />
            <p className="text-gray-500">
              {format(new Date(meeting.createdAt), "MMM d, yyyy h:mm a")}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <LinkIcon size={16} className="text-gray-500" />
            <a
              href={meeting.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {meeting.link}
            </a>
          </div>
          {!isOwner && (feedbacks.length > 0) && (
            <div className="flex items-center space-x-2 cursor-pointer"
            onClick={handleOpenFeedbackModal} >
              <GiftIcon size={16} 
              className={hasNewFeedback ? "text-green-500 animate-pulse" : "text-gray-500"}/>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className= {hasNewFeedback ? "text-green-500" : "text-gray-500"}>
                    {hasNewFeedback ? "New Gift" : "Open your Gift"}
                    </p>
                </TooltipTrigger>
                <TooltipContent className="text-gray-500">
                  <p>open your gift</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          <p className="text-gray-700">{meeting.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/class/${meeting.classId}/m/${meeting.meetingCode}`}>
          <Button variant="default" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
    </>
  );
};

export default MeetingCard;
