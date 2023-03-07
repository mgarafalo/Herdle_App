import { useQuery } from "@tanstack/react-query";
import agent from "../../../service/Agent";

export type UseGetUserInfoQuery = {
  userId: string;
};

export function useGetUserInfoQuery({ userId }: UseGetUserInfoQuery) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userQuery"],
    queryFn: async () => await agent.Account.getUserInfo(userId),
  });

  return { data, isLoading, error };
}
