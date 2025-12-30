  // hooks/useWgcta.ts
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import apiClient from "@/lib/axios-instance";
  import { BaseResponse } from "@/constants/types";
  import { toast } from "sonner";
  import { useGetProfile } from "@/hooks/api/user-service-hooks";

  export type WgctaTemplates = {
    INFERENCE: string[];
    ASSUMPTION: string[];
    DEDUCTION: string[];
    INTERPRETATION: string[];
    EVALUATION: string[];
  };

  type GetWgctaTemplatesResponse = BaseResponse<WgctaTemplates>;

  // export interface getDataManualIntervention {
  //   user : User[]
  //   feedback: Feedback[]
  //   responses: Response[]
  //   manualIntervention: ManualIntervention[]
  //   createFeedbackDto: CreateFeedbackDto[]
  // }

  export interface User {
    id: string;
    email: string;
    fullname: string;
    avatar: string;
  }

  export interface Feedback {
    id: string;
    content?: string | null;
    emoji?: string | null;
    createdAt: string;
    givenBy: string;
    meetingId: string;
    response: { 
      id: string;
      response: string;
    };
  }

  export interface Response {
    id: string;
    response: string;
    createdAt: string;
    userId: string;
    feedbacks: Feedback[];
    user: User;
  }

  export interface ManualIntervention {
    id: string;
    text: string;
    wgctaType?: string;
    createdBy: string;
    createdAt: string;
    meetingId: string;
    user: User;
    responses: Response[];
  }

  export interface CreateFeedbackDto {
    content?: string | null;
    emoji?: string | null;
    responseId: string;
    givenBy: string;
    meetingId: string;
  }

  // DTO untuk pesan intervensi baru (diperlukan data dari frontend: text, createdBy, meetingId)
  export interface CreateManualInterventionDto {
      text: string;
      wgctaType?: string; // Optional, bisa dikosongkan jika tidak relevan
      createdBy: string;
      meetingId: string;
  }

  //gift feedback
  export interface StudentFeedbackPayload extends Feedback{
    response: Response; 
  }

  export interface ResponseCountData {
    totalResponses: number;
    totalNonResponses: number;
    totalParticipants: number;
  }

  export const useGetResponseCount = (meetingId? : string, interventionId?: string) => {
    console.log("hook useGetResponseCount dipanggil ✅");
    const enable = !!meetingId && !!interventionId;
    return useQuery<ResponseCountData>({
      queryKey: ["manual-response-rate", meetingId, interventionId],
      enabled: enable,
      queryFn: async () => {
        const res = await apiClient.get(`/manual-intervention/response-rate/${meetingId}/${interventionId}`);
        return res.data;
      }
    });
  }

  export const useCreateManualIntervention = () => {
      const queryClient = useQueryClient();

      return useMutation({
          mutationFn: async (dto: CreateManualInterventionDto) => {
              // Memanggil endpoint POST /manual-intervention/create
              const res = await apiClient.post("/manual-intervention/create", dto); 
              return res.data;
          },
          onSuccess: (data: ManualIntervention) => {
              toast.success("Pesan intervensi dikirimkan! 🚀");
              // Optional: Invalidate query untuk memperbarui daftar intervensi jika ada di dashboard
              // queryClient.invalidateQueries({ queryKey: ["manual-interventions"] }); 
              queryClient.invalidateQueries({ 
                queryKey: ["all-interventions-all-responses", data.meetingId] 
            });
          },
          onError: (error) => {
              console.error("Gagal mengirim intervensi manual:", error);
              toast.error("Gagal mengirim pesan.");
          },
      });
    };


  export const useGetWgctaTemplates = () => {
    console.log("hook useGetWgctaTemplates dipanggil ✅");
    return useQuery<GetWgctaTemplatesResponse>({
      queryKey: ["wgcta", "templates"],
      queryFn: async () => {
        const res = await apiClient.get("/wgcta/all");
        return res.data;
      },
    });
  };

  export const useGetAllInterventionsAndResponses = (meetingId?: string) => {
      console.log("hook useGetAllInterventionsAndResponses dipanggil ✅");
      
      // Query hanya dijalankan jika meetingId tersedia
      const enabled = !!meetingId;

      return useQuery<ManualIntervention[]>({
          // Query key: Unik berdasarkan meetingId
          // Kita tidak perlu userId lagi di key ini
          queryKey: ["all-interventions-all-responses", meetingId],
          
          enabled: enabled,
          
          queryFn: async () => {
              console.log(`Hook useGetAllInterventionsAndResponses dipanggil untuk Meeting ID: ${meetingId}`);
              
              // Panggil endpoint Controller yang baru dibuat (asumsi endpoint-nya: /manual-intervention/interventions/all-responses?meetingId=...)
              return apiClient.get(
                  `/manual-intervention/interventions/all-responses?meetingId=${meetingId}`) // Ganti dengan endpoint Anda yang baru              
              // Data yang dikembalikan adalah array ManualIntervention
              .then((res) => res.data);
          },
          refetchOnWindowFocus: true
      });
  };

  //   export const useGetByResponsesIdInterventions = (meetingId?: string) => {
  //   return useQuery<Response[]>({
  //     queryKey: ["Response-interventions", meetingId],
  //     enabled: !!meetingId,
  //     queryFn: async () => {
  //       console.log(`Hook useGetAllManualInterventions dipanggil untuk Meeting ID: ${meetingId} ✅`);
  //       const params = new URLSearchParams();
  //       if (meetingId) {
  //           // params.append('meetingId', meetingId); akan menghasilkan: /manual-intervention?meetingId=ID_MEETING
  //           params.append('meetingId', meetingId); 
  //       }
  //        // Kirim permintaan dengan query parameter
  //       const res = await apiClient.get(`/manual-intervention?${params.toString()}`); 
  //       return res.data;
  //     },
  //     refetchOnWindowFocus: true
  //   });
  // };
        

  export const useCreateManualFeedback = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (dto: CreateFeedbackDto) => {
        const res = await apiClient.post("/manual-intervention/feedback", dto); 
        return res.data;
      },
      onSuccess: (data, variables) => {
        console.log("Feedback berhasil dibuat:", data);
        
        // Invalidasi query agar data intervensi otomatis diperbarui di UI
        queryClient.invalidateQueries({ queryKey: ["manual-interventions"] }); 

        const meetingId = variables.meetingId; 

            // Invalidate query key yang digunakan dashboard
            queryClient.invalidateQueries({
                queryKey: ["all-interventions-all-responses", meetingId],
            });
        
        // Optional: Update cache spesifik jika diperlukan
        // queryClient.setQueryData(["manual-interventions", variables.responseId], (oldData) => { ... }); 
      },
      onError: (error) => {
        console.error("Gagal membuat feedback:", error);
        // Tambahkan logika untuk menampilkan toast/notifikasi error
      },
    });
  };

  export const useGetAllStudentFeedbacksByMeeting = (meetingId?: string) => {
    const { data: profileData } = useGetProfile();
    const userId = profileData?.data?.id;
    const enabled = !!meetingId && !!userId;
    return useQuery<Feedback[]>({
      queryKey: ["student-feedbacks", meetingId, userId],
      enabled: enabled,
      queryFn: async () => {
        console.log(`Hook useGetAllStudentFeedbacks dipanggil untuk Meeting ID: ${meetingId} ✅ dan user ID: ${userId}`);

        const params = new URLSearchParams();
        params.append('meetingId', meetingId!);
        params.append('userId', userId!);
        const res = await apiClient.get(`/manual-intervention/feedbacks/student?${params.toString()}`);
        return res.data;
      },
      refetchOnWindowFocus: true,
      staleTime: 5000
    });
  }

  // export const useGetIntervensionResponseCount = (meetingId?: string) => {
  //   return useQuery<ResponseCountData>({
  //     queryKey: ["manual-response-rate", meetingId],
  //     enabled: !!meetingId,
  //     queryFn: async () => {
  //       console.log(`Hook useGetInterventionResponseCount dipanggil untuk Meeting ID: ${meetingId} ✅`);
  //       // Panggil endpoint baru
  //       const res = await apiClient.get(`/manual-intervention/response-rate/${meetingId}`); 
  //       return res.data;
  //     },
  //     refetchOnWindowFocus: false,
  //     staleTime: 5000
  //   });
  // }

   export enum EmotionEnum {
    HAPPY = 'HAPPY',
    SAD = 'SAD',
    ANGRY = 'ANGRY',
    FEARFUL = 'FEARFUL',
    DISGUSTED = 'DISGUSTED',
    SURPRISED = 'SURPRISED',
    NEUTRAL = 'NEUTRAL',
  }

  export type ConfirmationStatus = EmotionEnum | 'NOT_CONFIRMED' | 'Not Confirmed';

  //intervensi-interaktif (konfirmasi emosi)
  export interface AffectiveInteractiveTextLog{
    emotion1: EmotionEnum;
    emotionValue1: number;
    emotion2: EmotionEnum;
    emotionValue2: number;
    confirmedEmotion: ConfirmationStatus;
    createdAt: string;
    confirmedAt: string | null;
  }

  export interface ConfirmationResponse {
  success: boolean;
  message: string;
  data: AffectiveInteractiveTextLog[];
}

 export const useGetConfirmationEmotionLogs = (meetingId?: string, participantId?: string) => {
  return useQuery<AffectiveInteractiveTextLog[], Error>({
    queryKey: ["confirmation-logs", meetingId, participantId],
    queryFn: async () => {
      if (!meetingId || !participantId) {
        return [];
      }
      
      try {
        // Option 1: Jika API support meetingId langsung
        const response = await apiClient.get<ConfirmationResponse>(
          `/interactive-intervention/${meetingId}/participant/${participantId}`
        );
        return response.data.data;
      } catch (error) {
        console.error("Error fetching confirmation logs:", error);
        throw error;
      }
    },
    enabled: !!meetingId && !!participantId,
  });
};
