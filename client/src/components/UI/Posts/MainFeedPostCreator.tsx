import {
  Avatar,
  Box,
  Button,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { File } from "formidable";
import { SyntheticEvent, useState } from "react";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import agent from "../../../service/Agent";

interface Props {
  avatar: string;
  username: string;
  userId: string;
  refreshFeed: any;
}

export default function MainFeedPostCreator({
  avatar,
  username,
  userId,
  refreshFeed,
}: Props) {
  const [post, setPost] = useState<string>();
  const [file, setFile] = useState<File[]>();

  async function createNewPost() {
    await agent.Posts.newPost(userId!, post!, file!).then(() => {
      refreshFeed();
    });
  }

  function handleChange(
    e: SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setPost(e.currentTarget.value);
  }

  function onDrop(file: any) {
    setFile(file);
  }

  return (
    <>
      <Box className="flex flex-row align-center justify-center gap-5 p-8 w-5/12">
        <Link to={`/herdle/${userId}`}>
          <Avatar src={avatar} sx={{ width: 72, height: 72 }} />
        </Link>
        <Box className="flex flex-col content-center justify-start w-full">
          <Typography>{username}</Typography>
          <Box className="flex flex-col gap-3 pt-3 pb-3">
            <Typography>Add an image</Typography>
            <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section
                  className="p-5"
                  style={{
                    backgroundColor: "whitesmoke",
                    border: "3px dotted black",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </Box>
          <Box className="flex flex-col gap-3">
            <TextareaAutosize
              minRows={4}
              maxRows={6}
              onChange={(e) => handleChange(e)}
            />
            <Box className="flex flex-row content-center gap-3">
              <Button
                // onClick={handleShowDialog}
                sx={{ backgroundColor: "#588157", color: "white" }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => createNewPost()}
                sx={{ backgroundColor: "#588157", color: "white" }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
