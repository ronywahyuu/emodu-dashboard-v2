import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreVertical, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGetProfile } from '@/hooks/api/user-service-hooks';
import { useModalStore } from '@/hooks/use-modal-store';
import { ClassData } from '@/hooks/api/class-service-hooks';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ClassCard = ({ classData }: {
  classData: ClassData;
}) => {
  const { onOpen } = useModalStore();
  const formattedDate = new Date(classData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const {
    data: profileData,
  } = useGetProfile();

  const isOwner = profileData?.data.id === classData.userId;

  console.log('classData', classData);

  return (
    <Card className="flex flex-col h-full bg-white shadow-sm hover:shadow-md transition-shadow
      dark:bg-transparent dark:shadow-none dark:hover:shadow-none dark:text-white dark:border dark:border-gray-700
    ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
        <CardTitle className="text-lg font-semibold text-gray-900 truncate 
          dark:text-gray-100 dark:text-opacity-90 dark:truncate 
        ">
          {classData.name}
        </CardTitle>
        {isOwner && (

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onOpen('editClass', classData)}
              >Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600"
                onClick={() => onOpen('deleteClassDialog', classData)}
              >Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {classData.description || "No description provided"}
        </p>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <span className="font-sm">Class Code:</span>
          <code className="bg-gray-100 px-2 py-0.5 rounded *:
            dark:bg-gray-700 dark:text-gray-100 dark:bg-opacity-50 dark:rounded-lg truncate
          ">
            {classData.classCode}
          </code>
        </div>
        <div className="flex  items-center gap-2 text-sm text-gray-600 mt-5">
          {/* <span className="font-sm">Create By:</span> */}
          <Avatar >
            <AvatarImage src={classData.user.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="truncate">{classData.user.fullname}</span>
          {/* if owner, then use badge 'you are the owner' */}
          {
            isOwner && (
              <Badge variant="secondary" className='text-gray-400'>You are the owner</Badge>
            )
          }
        </div>

      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="text-xs text-gray-500">
          Created {formattedDate}
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <Users className="h-4 w-4 mr-1" />
                {classData.members?.length || 0}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[200px] p-2">
              {classData.members?.length === 0 ? (
                <div className="text-sm text-gray-500 p-2">No students yet</div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
                  {/* Teachers Section */}
                  <div className="text-xs font-semibold text-gray-500 px-2">Teachers</div>
                  {classData.members
                    ?.filter(member => member.role === "TEACHER")
                    .map((member) => (
                      <div key={member.userId} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.user.avatar} />
                          <AvatarFallback>{member.user.fullname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate text-sm flex-1">{member.user.fullname}</span>
                        {/* <Badge variant="secondary" className="text-xs">Teacher</Badge> */}
                      </div>
                    ))}

                  <div className="h-px bg-gray-200 my-2" />

                  {/* Students Section */}
                  <div className="text-xs font-semibold text-gray-500 px-2">Students</div>
                  {classData.members
                    ?.filter(member => member.role === "STUDENT")
                    .map((member) => (
                      <div key={member.userId} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.user.avatar} />
                          <AvatarFallback>{member.user.fullname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate text-sm flex-1">{member.user.fullname}</span>
                        {/* <Badge variant="outline" className="text-xs">Student</Badge> */}
                      </div>
                    ))}
                </div>
              )}
            </PopoverContent>
          </Popover>

          <Link href={`/class/${classData.id}`}>
            <Button
              variant="default"
              size="sm"
              className="dark:text-gray-600 hover:text-gray-900"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          {/* {classData.defaultMeetingLink && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => window.open(classData.defaultMeetingLink, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Meeting
            </Button>
          )} */}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClassCard;