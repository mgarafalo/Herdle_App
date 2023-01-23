import {
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

interface Props {
  setUserData: any;
}

export default function PostCreator({ setUserData }: Props) {
  const store = useSelector((state: AppState) => state.appState.user);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [post, setPost] = useState<string>();

  async function createNewPost() {
    await agent.Posts.newPost(store.id!, post!).then((userData) => {
      setUserData(userData);
      setShowDialog(false);
    });
  }

  function handleChange(
    e: SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setPost(e.currentTarget.value);
  }

  // async function handleClick() {}

  function handleShowDialog() {
    setShowDialog(!showDialog);
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
        <DialogTitle>New post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new post to share with your friends!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Post"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => handleChange(e)}
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
