import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Sesuaikan path jika perlu
import { Feedback } from "@/hooks/api/manual-service-hooks"; // Sesuaikan path import interface Feedback
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area"; // Sesuaikan path jika perlu
import { GiftIcon, MessageSquare } from 'lucide-react';

interface StudentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbacks: Feedback[];
  studentName: string;
}

const StudentFeedbackModal: React.FC<StudentFeedbackModalProps> = ({ isOpen, onClose, feedbacks, studentName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <GiftIcon size={20} className='text-green-500'/>
            <span>Feedback untuk {studentName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className='text-md font-semibold mb-3 border-b pb-1'>Feedback dari Pengajar:</h3>
          {feedbacks.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada feedback dari pengajar di meeting ini.</p>
          ) : (
            <ScrollArea className="h-[250px] w-full p-2">
              <div className='space-y-4'>
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-3 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <p className="text-xs">{feedback.response.response}</p>
                      <span className="text-1xl text-right">{feedback.emoji}</span>
                      {/* <p className="text-xs text-gray-300 dark:text-gray-400 text-right">
                        {format(new Date(feedback.createdAt), "MMM d, yyyy HH:mm")}
                      </p> */}
                    </div>
                    {feedback.content && (
                      <div className="mt-2 flex items-start space-x-2 p-2 bg-white rounded-md border dark:bg-gray-700">
                        <MessageSquare size={16} className="text-blue-500 flex-shrink-0 mt-1"/>
                        <p className="text-sm text-gray-700 dark:text-gray-200 italic">
                            {feedback.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default StudentFeedbackModal;