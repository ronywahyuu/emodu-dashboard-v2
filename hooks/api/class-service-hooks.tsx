import apiClient from "@/lib/axios-instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const BASE_URL = process.env.API_URL;

interface Class {
  id: number;
  name: string;
}

interface ClassError {
  message: string;
}

export const useGetClass = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      return apiClient.get('/class')
        .then((res) => res.data);
    },
  })
};
export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      return apiClient.post(`${BASE_URL}/class`, data)
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};