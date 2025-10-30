"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useCreateManualFeedback,
  CreateFeedbackDto,
  Feedback,
} from "@/hooks/api/manual-service-hooks";
import { toast } from "sonner";
// Daftar Emoji yang akan ditampilkan
const ReactionEmojis = ["👍", "👌", "💯"];

interface EmojiReactionProps {
  responseId: string;
  meetingId: string;
  givenBy: string;
  isAlreadyFeedbacked?: boolean;
}
export function EmojiReaction({
  responseId,
  meetingId,
  givenBy,
  isAlreadyFeedbacked
}: EmojiReactionProps) {

  // State lokal hanya melacak keberhasilan pengiriman di sesi saat ini
  const [feedbackSentLocal, setFeedbackSentLocal] = useState(false);
  
  const createFeedbackMutation = useCreateManualFeedback();
  
  // Tentukan apakah tombol harus disembunyikan/dinonaktifkan
  const isHidden = isAlreadyFeedbacked || feedbackSentLocal;
  const handleReaction = (emoji: string) => {
    if (!responseId || !meetingId || !givenBy) {
      toast.error("Data pengiriman feedback tidak lengkap.");
      return;
    }
    // Payload DTO untuk API Anda
    const payload: CreateFeedbackDto = {
      // Konten text (content) dan emoji dikirim terpisah.
      // Jika Anda hanya ingin mengirim emoji, content bisa null/undefined
      content: null,
      emoji: emoji,
      responseId: responseId, // ID Response pelajar yang di-feedback
      givenBy: givenBy, // ID Dosen
      meetingId: meetingId, // ID Meeting
    };

    createFeedbackMutation.mutate(payload, {
      onSuccess: () => {
        // Toast ini hanya untuk feedback UI Dosen
        setFeedbackSentLocal(true); 
        toast.success(`Feedback ${emoji} berhasil dikirim ke pelajar.`, {
          duration: 2000,
        });
        // API akan secara otomatis mengirim broadcast Socket.IO ke pelajar
      },
      onError: (error) => {
        console.error("Gagal mengirim feedback:", error);
        toast.error("Gagal mengirim feedback.");
      },
    });
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className="flex space-x-1.5">
      {ReactionEmojis.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          // Set disabled saat proses pengiriman sedang berlangsung
          disabled={createFeedbackMutation.isPending}
          className="text-lg p-1.5 h-auto leading-none hover:bg-gray-100 transition-colors"
          onClick={() => handleReaction(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}
