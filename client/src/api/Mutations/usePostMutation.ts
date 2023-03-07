import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../service/Agent";

export type UsePostMutation = {
  userId: string;
  payload: string;
};

export default function usePostMutation({ userId, payload }: UsePostMutation) {
  const queryClient = useQueryClient();
  const mutate = useMutation(
    ["postMutation"],
    async () => await agent.Posts.likePost(userId, payload),
    {
      onSettled: () => queryClient.invalidateQueries(["userQuery"]),
    }
  );

  return mutate;
}
