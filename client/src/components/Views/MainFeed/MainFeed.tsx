import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/store";
import MainFeedPostCreator from "../../UI/Posts/MainFeedPostCreator";

export default function MainFeed() {
  const store = useSelector((state: AppState) => state.appState.user);

  return (
    <>
      <Box className="flex flex-col items-center w-full">
        <MainFeedPostCreator
          avatar={store.avatar!}
          username={store.email}
          userId={store.id!}
          refreshFeed={() => {
            console.log("poo");
          }}
        />
      </Box>
    </>
  );
}
