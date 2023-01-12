import { Paper, Typography } from "@mui/material";
import { Post } from "@prisma/client";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <>
      <Paper elevation={12} className="p-5">
        <Typography>{post.title ? post.title : <></>}</Typography>
        <Typography>{post.body}</Typography>
      </Paper>
    </>
  );
}
