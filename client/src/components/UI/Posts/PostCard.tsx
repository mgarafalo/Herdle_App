import { Avatar, Badge, Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DateTime } from "luxon";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import { motion, MotionConfig } from "framer-motion";
import { useState } from "react";
import { Post } from "../../../Interfaces/Posts";
import agent from "../../../service/Agent";
import CommentCreator from "../Comments/CommentCreator";
import usePostMutation from "../../../api/Mutations/usePostMutation";

interface Props {
  post: Post;
  userId: string;
  updateData: any;
}

export default function PostCard({ userId, post, updateData }: Props) {
  const [showCommentBox, setShowCommentBox] = useState<Boolean>(false);
  const { mutate } = usePostMutation({
    userId,
    payload: post.id,
    action: async () => await agent.Posts.likePost(userId, post.id),
  });

  return (
    <>
      <MotionConfig>
        <Box
          sx={{ backgroundColor: "white" }}
          className="pt-5 pl-5 pr-5 w-full rounded-lg"
        >
          {post.img && <img src={post.img} />}
          <Typography className={post.img ? "pt-3" : ""}>
            {post.title ? post.title : <></>}
          </Typography>
          <Typography>{post.body}</Typography>
          <Box className="flex flex-row justify-between p-2 gap-2">
            <Box className="flex flex-row">
              <Button onClick={() => mutate()}>
                <Badge
                  badgeContent={post.likedByIDs.length}
                  sx={{ color: "#588157" }}
                >
                  <ThumbUpOutlinedIcon fontSize="medium" />
                </Badge>
              </Button>
              <Button onClick={() => setShowCommentBox(!showCommentBox)}>
                <Badge
                  badgeContent={post.comments?.length}
                  sx={{ color: "#588157" }}
                >
                  <AddCommentOutlinedIcon
                    fontSize="medium"
                    sx={{ color: "#588157" }}
                  />
                </Badge>
              </Button>
            </Box>
            <Box>
              <span>Created:</span>
              <span>
                {DateTime.fromISO(post.created.toString())
                  .toFormat("yyyy LLL dd")
                  .toString()}
              </span>
            </Box>
          </Box>
          {showCommentBox && (
            <motion.div
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
              <Box className="p-5 flex flex-col items-end gap-3">
                {post.comments &&
                  post.comments.length > 0 &&
                  post.comments.map((comment, i) => (
                    <Box
                      key={i}
                      className="flex flex-row w-full items-center justify-between"
                    >
                      <Avatar
                        src={comment.user.avatar}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography fontSize={14}>{comment.body}</Typography>
                    </Box>
                  ))}
                <Box className="p-5 flex flex-col justify-start w-full gap-3">
                  <CommentCreator postId={post.id} userId={userId} />
                </Box>
              </Box>
            </motion.div>
          )}
        </Box>
      </MotionConfig>
    </>
  );
}
