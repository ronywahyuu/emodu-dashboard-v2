import { BaseResponse } from "@/constants/types";
import apiClient from "@/lib/axios-instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const BASE_URL = process.env.API_URL;



export interface Data {
  id: string
  email: string
  fullname: string
  avatar: string
  isVerified: boolean
  verificationToken: string
  createdAt: string
  updatedAt: string
}

type GetProfileResponse = BaseResponse<Data>


export const useGetProfile = () => {
  return useQuery<GetProfileResponse>({
    queryKey: ["users"],
    queryFn: async () => {
      return apiClient.get('/auth/profile')
        .then((res) => res.data);
    },
  })
};
