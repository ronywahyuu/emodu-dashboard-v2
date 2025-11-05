"use client";

// Ganti nama hook sesuai nama yang benar yang kita set sebelumnya: useGetIntervensionResponseCount
import { ResponseCountData, useGetResponseCount } from "@/hooks/api/manual-service-hooks"; 
import { Loader2 } from "lucide-react";

interface ChartResponseProps {
  meetingId: string; 
  interventionId: string;
}

// Hapus variabel chartData yang tidak perlu
// const chartData = [{ name: "result", response: 25, nonresponse: 10 }]; 

export function ChartResponse({ meetingId, interventionId }: ChartResponseProps) {

  // ✅ Panggil hook, gunakan destructuring untuk data, isLoading
  const { 
      data: responseRate, // Ganti nama data menjadi responseRate
      isLoading,
      isError 
  } = useGetResponseCount(meetingId, interventionId);

  // --- Handling Loading dan Error ---
  if (isLoading) {
    return (
      <div className="flex items-center text-xs text-gray-500">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Memuat...
      </div>
    );
  }

  // Cek jika tidak ada data sama sekali (termasuk kasus error)
  if (!responseRate || isError) {
    return (
      <div className="text-gray-500 text-xs">
        Data N/A
      </div>
    );
  }
  // --- Akhir Handling ---

  // ✅ Gunakan data dari hook yang sudah terambil
  const { totalResponses, totalNonResponses } = responseRate;

  return (
  <div className="">
      <span className="text-green-600">• Response: {totalResponses}  </span>
      <span className="text-red-600">• NonResponse: {totalNonResponses}</span>
  </div>
)
}