import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/store";
import agent from "../../../service/Agent";
import Dropzone from "react-dropzone";
import { File } from "formidable";

interface Props {
  setUserData: any;
}

export default function PostCreator({ setUserData }: Props) {
  const store = useSelector((state: AppState) => state.appState.user);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [post, setPost] = useState<string>();
  const [file, setFile] = useState<File[]>();

  async function createNewPost() {
    await agent.Posts.newPost(store.id!, post!, file!)
      .then((userData) => {
        setUserData(userData);
      })
      .finally(() => {
        setShowDialog(false);
      });
  }

  function handleChange(
    e: SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setPost(e.currentTarget.value);
  }

  function handleShowDialog() {
    setShowDialog(!showDialog);
  }

  function onDrop(file: any) {
    setFile(file);
  }

  return (
    <>
      <Button
        onClick={handleShowDialog}
        className="flex gap-1"
        sx={{ color: "#588157" }}
      >
        <AddBoxIcon />
        New Post
      </Button>
      <Dialog fullWidth open={showDialog} onClose={handleShowDialog}>
        <DialogTitle>Create a new post to share with your friends!</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-3 pt-3 pb-3">
            <DialogContentText>Add an image</DialogContentText>
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
          <TextField
            className="p-5"
            margin="dense"
            id="name"
            label="New Post"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => handleChange(e)}
            sx={{
              "& label.Mui-focused": {
                color: "#588157",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#588157",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleShowDialog}
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
        </DialogActions>
      </Dialog>
    </>
  );
}
