import { useQuery } from "@tanstack/react-query";
import agent from "../../../service/Agent";

export type UseGetDashboardInfoQuery = {
  userId: string;
};

export function useGetDashboardInfoQuery({ userId }: UseGetDashboardInfoQuery) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getDashboardInfoQuery"],
    queryFn: async () => await agent.Dashboard.getDashboardInfo(userId),
  });

  return { data, isLoading, error };
}
