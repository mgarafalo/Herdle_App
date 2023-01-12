import { Button, TextField } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { useSelector } from "react-redux";
import agent from "../../../service/Agent";
import { State } from "../../../store/slice";
import { AppState } from "../../../store/store";

export default function PostCreator() {
  const store = useSelector((state: AppState) => state.appState.user);
  const [post, setPost] = useState<string>();

  function handleChange(
    e: SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setPost(e.currentTarget.value);
  }

  async function handleClick() {
    console.log(store);
    await agent.Posts.newPost(store.id!, post!).then((post) => {
      console.log(post);
    });
  }

  return (
    <>
      <div className="flex flex-col p-32 min-h-screen items-center justify-center gap-3">
        <TextField
          onChange={(e) => handleChange(e)}
          label="New Post"
          variant="outlined"
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
        <div className="flex gap-3">
          <Button
            sx={{ backgroundColor: "#588157", color: "white" }}
            onClick={handleClick}
          >
            Create Post
          </Button>
        </div>
      </div>
    </>
  );
}
