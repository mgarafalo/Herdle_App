import {
  Avatar,
  Badge,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DateTime } from "luxon";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import { PostActions } from "../../Views/Profile/Profile";
import { motion, MotionConfig } from "framer-motion";
import { useState } from "react";
import { Post } from "../../../Interfaces/Posts";
import useMeasure from "react-use-measure";

interface Props {
  post: Post;
  actions: PostActions;
  handleUpdateCommentBody: any;
}

export default function PostCard({
  post,
  actions,
  handleUpdateCommentBody,
}: Props) {
  const [showCommentBox, setShowCommentBox] = useState<Boolean>(false);

  return (
    <>
      <MotionConfig>
        <Box
          sx={{ backgroundColor: "white" }}
          className="pt-5 pl-5 pr-5 w-full rounded-lg"
        >
          <Typography>{post.title ? post.title : <></>}</Typography>
          <Typography>{post.body}</Typography>
          <Box className="flex flex-row justify-between p-2 gap-2">
            <Box className="flex flex-row">
              <Button onClick={() => actions.likePost(post.id)}>
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
                <TextField
                  className="w-full"
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
                  onClick={() => actions.comment(post.id)}
                  sx={{ backgroundColor: "#588157", color: "white" }}
                >
                  Submit
                </Button>
              </Box>
            </motion.div>
          )}
        </Box>
      </MotionConfig>
    </>
  );
}
