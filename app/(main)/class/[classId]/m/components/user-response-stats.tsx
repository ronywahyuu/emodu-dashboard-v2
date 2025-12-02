"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IndentIncreaseIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
  // ... imports lainnya
} from "lucide-react";
import { ChartResponse } from "@/components/charts/manual-intervention/chart-response-intervensi-manual";
import { EmojiReaction } from "@/components/charts/manual-intervention/emoticon-react";
import {
  // ✅ GANTI: Impor hook baru yang hanya menerima meetingId
  useGetAllInterventionsAndResponses, 
  ManualIntervention,
  Response,
  useCreateManualFeedback,
} from "@/hooks/api/manual-service-hooks"; 

import { useGetMeetingByMeetingCode } from "@/hooks/api/meeting-service-hooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

interface UserDetailThreadProps {
  meetingCode: string;
}

export default function UserDetailThread({
  meetingCode,
}: UserDetailThreadProps) {
  
  const { data: meetingData, isLoading: isLoadingMeeting } =
    useGetMeetingByMeetingCode(meetingCode);
  const currentMeetingId = meetingData?.data?.id;

  const queryClient = useQueryClient();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // --- Socket Logic (Pastikan invalidate key baru) ---
  useEffect(() => {
    if (!currentMeetingId) return;

    const socket = io(baseURL as string);

    socket.on("connect", () => {
      socket.emit("join", `${meetingCode}`);
      console.log(`Dashboard joined room: ${meetingCode}`);
    });

    const queryKey = ["all-interventions-all-responses", meetingCode];
    // ✅ PERBAIKAN: Tambahkan listener untuk Intervensi BARU yang dibuat dosen
    socket.on('manualIntervention', (payload) => { 
        console.log("Received new intervention creation notification. Invalidating queries...");
        // Invalidasi yang sama untuk memuat ulang daftar intervensi
        queryClient.invalidateQueries({ queryKey: queryKey});
    });

    socket.on('manualFeedback', (payload) => {
        console.log(`Received feedback notification for response ${payload.responseId}. Invalidating queries...`);

        // Memaksa refetch data utama dashboard
        queryClient.invalidateQueries({ 
            queryKey: queryKey
        });
    
    });

    socket.on('manualResponse', (payload) => {
      console.log("Received new response notification. Invalidating queries...");

      // ✅ PENTING: Memicu refetch untuk query key yang baru
      queryClient.invalidateQueries({ queryKey: queryKey });
    });

    return () => {
      socket.disconnect();
    };
  }, [meetingCode, queryClient]);


  // ✅ PENGGUNAAN HOOK BARU: Hanya butuh currentMeetingId
  const {
    data: interventions = [],
    isLoading: isLoadingInterventions,
    error,
  } = useGetAllInterventionsAndResponses(currentMeetingId); // Hapus parameter userId


  // --- Fungsi dan State lainnya (getWgctaColor, toggleCard, dsb.) ---
  const getWgctaColor = (type: string) => {
    switch (type) {
      case "INFERENCE": return "bg-purple-100 text-purple-800";
      case "ASSUMPTION": return "bg-indigo-100 text-indigo-800";
      case "DEDUCTION": return "bg-cyan-100 text-cyan-800";
      case "INTERPRETATION": return "bg-orange-100 text-orange-800";
      case "EVALUATION": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  const [openCard, setOpenCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setOpenCard(openCard === id ? null : id);
  };
  // --- Akhir Fungsi dan State lainnya ---


  // --- Logic Loading State ---
  if (error) { /* ... */ }
  if (isLoadingMeeting) { /* ... */ }
  if (!currentMeetingId) { /* ... */ }
  if (isLoadingInterventions) { /* ... */ }
  if (interventions.length === 0) { /* ... */ }
  // --- Akhir Logic Loading State ---
    if (error) {
     return <div className="text-center text-red-600 p-4">{error.message}</div>;
   }

   if (isLoadingMeeting) {
     return (
       <div className="flex justify-center items-center h-48">
         <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat Data Meeting...
       </div>
     );
   }

   if (!currentMeetingId) {
     return (
       <div className="text-center text-red-600 p-4">
         Error: Meeting tidak ditemukan atau ID tidak valid.
       </div>
     );
   }

   if (isLoadingInterventions) {
     return (
       <div className="flex justify-center items-center h-48">
         <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat Intervensi...
       </div>
     );
   }

   if (interventions.length === 0) {
     return (
       <div className="text-center text-gray-500 p-4">
         Belum ada data intervensi manual yang terkirim untuk pertemuan ini.
       </div>
     );
   }
   
  return (
    <div className="space-y-8">
      <Card className="max-h-[500px] overflow-y-auto p-4 space-y-4">
        {interventions.map((intervention: ManualIntervention) => (
          <Card key={intervention.id} className="p-4 space-y-4">
            {/* Intervensi Dosen: Menggunakan flex untuk 2 kolom utama */}
            <div className="flex justify-between items-start w-full">
              {/* Kolom KIRI: Pertanyaan, Badge, dan Detail Intervensi */}
              <div className="flex items-start flex-1 min-w-0 pr-4">
                <IndentIncreaseIcon className="h-4 w-4 mt-1 shrink-0" />
                <div className="flex-col ml-1 flex-1">
                  <span className="font-semibold text-sm text-gray-900">
                    Intervensi Manual
                  </span>
                  <p className="text-sm text-gray-800 break-words">
                    {intervention.text}
                  </p>
                  <Badge
                    className={getWgctaColor(
                      intervention.wgctaType ?? "DEFAULT"
                    )}
                  >
                    {intervention.wgctaType}
                  </Badge>
                </div>
              </div>

              {/* Kolom KANAN: Chart, Date, dan Toggle Button */}
              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                {/* Tanggal */}
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(intervention.createdAt).toLocaleString()}
                </span>

                {/* Chart Response (ASUMSI komponen ini dapat bekerja) */}
                <div className="flex items-center text-xs space-x-2">
                  <ChartResponse meetingId={currentMeetingId} interventionId={intervention.id}/>
                </div>  

                {/* Toggle Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCard(intervention.id)}
                  className="flex items-center gap-1 text-xs h-6 p-1"
                >
                  {openCard === intervention.id ? (
                    <>
                      <ChevronUp className="w-4 h-4" /> Tutup detail
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> Lihat ({intervention.responses.length}) balasan
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Balasan User (expandable + scrollable) */}
            {openCard === intervention.id && (
              <div className="pl-12 border-t pt-4">
                <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
                  
                  {/* Mapping Responses (Data sudah berisi SEMUA respons) */}
                  {intervention.responses.map((resp: Response) => {
                    const userInitial = resp.user.fullname
                      .charAt(0)
                      .toUpperCase();
                    const avatarUrl = resp.user.avatar;

                    // 1. Cek apakah Dosen ini sudah memberi feedback
                    const existingFeedback = resp.feedbacks.find(
                      (f) => f.givenBy === intervention.createdBy
                    );
                    const isFeedbacked = !!existingFeedback;
                    const feedbackEmoji = existingFeedback?.emoji || "";

                    return (
                      <div key={resp.id} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0">
                            {/* AVATAR */}
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={avatarUrl}
                                alt={resp.user.fullname}
                              />
                              <AvatarFallback className="bg-blue-500 text-white font-bold">
                                {userInitial}
                              </AvatarFallback>
                            </Avatar>
                            {isFeedbacked && (
                              <div
                                className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 
                                          text-lg leading-none p-0.5"
                              >
                                {feedbackEmoji}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-gray-900">
                                {resp.user.fullname}
                              </span>
                              {/* Tanggal respons */}
                              <span className="text-xs text-gray-500">
                                {new Date(resp.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">
                              {resp.response}
                            </p>

                            {/* TAMPILKAN TOMBOL REAKSI HANYA JIKA BELUM ADA FEEDBACK */}
                            {!isFeedbacked && (
                              <EmojiReaction
                                responseId={resp.id}
                                meetingId={currentMeetingId}
                                givenBy={intervention.createdBy}
                                isAlreadyFeedbacked={isFeedbacked} // Kirim status persisten
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {intervention.responses.length === 0 && (
                    <div className="text-center text-gray-500 p-4">
                      Belum ada balasan dari siswa.
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </Card>
    </div>
  );
}