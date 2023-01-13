import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Post } from "@prisma/client";
import { DateTime } from "luxon";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <>
      <Paper elevation={12} className="p-5">
        <Typography>{post.title ? post.title : <></>}</Typography>
        <Typography>{post.body}</Typography>
        <Box className="flex flex-row gap-2">
          <span>Created:</span>
          <span>
            {DateTime.fromISO(post.created.toString())
              .toFormat("yyyy LLL dd")
              .toString()}
          </span>
        </Box>
      </Paper>
    </>
  );
}
