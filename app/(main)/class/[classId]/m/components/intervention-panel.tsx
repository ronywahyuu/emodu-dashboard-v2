"use client";

import { useEffect, useState } from "react";
// Import semua hooks yang dibutuhkan
import { useGetWgctaTemplates, useCreateManualIntervention, CreateManualInterventionDto } from "@/hooks/api/manual-service-hooks";
import { useGetMeetingByMeetingCode } from "@/hooks/api/meeting-service-hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Send, MessageCircle, MessageSquareDiff, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface InterventionPanelProps {
  meetingCode: string;
}

export function InterventionPanel({ meetingCode }: InterventionPanelProps) {
  const [customMessage, setCustomMessage] = useState("");
  // State untuk menyimpan tipe WGCTA yang dipilih saat memilih template
  const [selectedWgctaType, setSelectedWgctaType] = useState<string | undefined>(undefined); 
  
  // 1. Ambil data Konteks Meeting (ID Meeting & CreatedBy)
  const { data: meetingData } = useGetMeetingByMeetingCode(meetingCode);
  
  // 2. Gunakan ID Meeting & User ID Pengajar dari data Meeting yang terverifikasi
  // meetingData.data.id adalah currentMeetingId
  const currentMeetingId = meetingData?.data?.id || ''; 
  // meetingData.data.createdBy adalah ID Pengajar/Admin yang membuat meeting (createdBy)
  const currentUserId = meetingData?.data?.createdBy || ''; 

  // 3. Hook data dan mutasi
  const { data: templateData, isLoading: isLoadingTemplates } = useGetWgctaTemplates();
  const createInterventionMutation = useCreateManualIntervention();
  const isSending = createInterventionMutation.isPending;

  const quickMessages = templateData?.data ? Object.values(templateData.data).flat() : [];
  
  // Fungsi untuk memilih pesan dari template
  const handlePickTemplate = (msg: string, type: string) => {
    setCustomMessage((prev) => (prev ? prev + " " + msg : msg));
    setSelectedWgctaType(type);
  };

  const handleSendIntervention = () => {
    if (!customMessage.trim()) {
      toast.warning("Pesan tidak boleh kosong.");
      return;
    }

    // Validasi data krusial
    if (!currentUserId || !currentMeetingId) {
      toast.error("Data Meeting/User ID pengirim tidak lengkap. Gagal mengirim.");
      return;
    }

    // Payload DTO
    const payload: CreateManualInterventionDto = {
      text: customMessage.trim(),
      wgctaType: selectedWgctaType,
      createdBy: currentUserId, 
      meetingId: currentMeetingId,
    };

    // 4. Kirim Mutasi
    createInterventionMutation.mutate(payload, {
      onSuccess: () => {
        setCustomMessage("");
        setSelectedWgctaType(undefined);
      },
    });
  };

  useEffect(() => {
    if (!customMessage) {
      setSelectedWgctaType(undefined);
    }
  }, [customMessage]);

  // Handle errors
  if (isLoadingTemplates) {
    return <Card className="h-fit p-6 text-center">Memuat template...</Card>;
  }
  if (!currentMeetingId) {
    return <Card className="h-fit p-6 text-center text-red-500">Meeting ID belum tersedia.</Card>;
  }


  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Panel Intervensi Manual
        </CardTitle>
        <CardDescription>
          Kirim pesan ke meeting secara langsung.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            {/* Quick Messages Popover */}
            <Tooltip>
              <Popover>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 w-8 bg-transparent"
                      disabled={isSending}
                    >
                      <MessageSquareDiff
                        className={`h-5 w-5 ${
                          selectedWgctaType
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Quick Messages</p>
                </TooltipContent>

                <PopoverContent
                  side="top"
                  className="w-72 max-h-60 overflow-y-auto p-1"
                >
                  {/* Mapping template WGCTA */}
                  {Object.entries(templateData?.data || {}).map(
                    ([type, messages]: [string, any]) => (
                      <div key={type} className="mb-2">
                        <p className="text-xs font-bold text-gray-500 mb-1">
                          {type}
                        </p>
                        {messages.map((msg: string, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => handlePickTemplate(msg, type)} // ✅ Kirim tipe WGCTA
                            className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors
                              ${
                                customMessage.includes(msg)
                                  ? "bg-blue-100 text-blue-900 font-semibold"
                                  : "text-gray-800 hover:bg-blue-50 hover:text-blue-800"
                              }`}
                          >
                            {msg}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </PopoverContent>
              </Popover>
            </Tooltip>

            {/* Textarea */}
            <Textarea
              placeholder="Tulis pesan untuk siswa..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="flex-1"
              disabled={isSending}
            />
          </div>
          {selectedWgctaType && (
            <p className="text-xs text-green-600 font-medium">
              Type Quick Message: {selectedWgctaType}
            </p>
          )}
        </div>

        {/* Tombol Kirim */}
        <Button
          onClick={handleSendIntervention}
          // Validasi: pesan tidak kosong, tidak sedang mengirim, ID Meeting & User ada
          disabled={!customMessage.trim() || isSending || !currentMeetingId || !currentUserId} 
          className="w-full"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Kirim Pesan Intervensi
        </Button>
      </CardContent>
    </Card>
  );
}
