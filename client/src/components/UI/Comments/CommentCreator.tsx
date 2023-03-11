import { Avatar, Typography, TextField, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useState, SyntheticEvent } from "react";
import usePostMutation from "../../../api/Mutations/usePostMutation";
import agent from "../../../service/Agent";

type CommentCreatorProps = {
  postId: string;
  userId: string;
};

export default function CommentCreator({
  postId,
  userId,
}: CommentCreatorProps) {
  const [commentBody, setCommentBody] = useState<string>();

  const { mutate } = usePostMutation({
    userId,
    payload: postId,
    action: async () => await agent.Posts.comment(userId, postId, commentBody!),
  });

  function handleUpdateCommentBody(
    e: SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setCommentBody(e.currentTarget.value);
  }

  async function handleSubmitComment() {
    if (!!commentBody) {
      mutate();
      setCommentBody("");
    } else {
      alert("Please enter a comment");
    }
  }

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.5,
      }}
    >
      <TextField
        className="w-full"
        value={commentBody}
        onChange={(e) => handleUpdateCommentBody(e)}
        variant="outlined"
        label="New Comment"
        sx={{
          "& label.Mui-focused": {
            color: "#588157",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#588157",
            },
          },
          lineBreak: "loose",
        }}
      />
      <Button
        className="w-3/12"
        onClick={() => handleSubmitComment()}
        sx={{ backgroundColor: "#588157", color: "white" }}
      >
        Submit
      </Button>
    </motion.div>
  );
}
