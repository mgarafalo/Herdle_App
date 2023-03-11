import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../service/Agent";

export type UsePostMutation = {
  userId: string;
  payload: string;
  action: any;
};

export default function usePostMutation({
  userId,
  payload,
  action,
}: UsePostMutation) {
  const queryClient = useQueryClient();
  const mutate = useMutation(["postMutation"], async () => await action(), {
    onSettled: () => queryClient.invalidateQueries(["userQuery"]),
  });

  return mutate;
}
