import { Box } from "@mui/material";
import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import agent from "../../../service/Agent";
import { AppState } from "../../../store/store";
import MainFeedPostCreator from "../../UI/Posts/MainFeedPostCreator";
import PostCard from "../../UI/Posts/PostCard";

export default function MainFeed() {
  const store = useSelector((state: AppState) => state.appState.user);

  const [posts, setPosts] = useState<Post[]>();

  async function loadPosts() {
    await agent.Posts.allPosts().then((posts) => {
      setPosts(posts);
    });
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <Box className="flex flex-col justify-center items-center gap-5 w-full">
        <MainFeedPostCreator
          avatar={store.avatar!}
          username={store.email}
          userId={store.id!}
          refreshFeed={() => {
            console.log("poo");
          }}
        />

        <Box className="flex flex-col align-center justify-center gap-5 w-5/12">
          {posts?.length &&
            posts.map((post, i) => (
              <PostCard
                key={i}
                userId={store.id!}
                post={post}
                updateData={loadPosts}
              />
            ))}
        </Box>
      </Box>
    </>
  );
}
