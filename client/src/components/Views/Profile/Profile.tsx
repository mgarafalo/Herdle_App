import { Avatar, Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { SyntheticEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User } from "../../../Interfaces/Account";
import agent from "../../../service/Agent";
import { AppState } from "../../../store/store";
import AnimalCard from "../../UI/Animal/AnimalCards";
import { Post } from "@prisma/client";
import PostCard from "../../UI/Posts/PostCard";
import { motion } from "framer-motion";
import PostCreator from "../../UI/Posts/PostCreator";

export interface PostActions {
  likePost: any;
  comment: any;
}

export default function () {
  const store = useSelector((state: AppState) => state.appState);

  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [commentBody, setCommentBody] = useState<string>();

  function updateUser(newUserData: User) {
    const tempUserData = { ...userData!, ...newUserData };
    setUserData(tempUserData);
  }

  async function getUserInfo() {
    await agent.Account.getUserInfo(
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    )
      .then((userInfo) => {
        updateUser(userInfo);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function handleFollowUser() {
    await agent.Account.followUserAction(
      store.user.id!,
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    ).then((user) => {
      console.log(user);
    });
  }

  function handleUpdateCommentBody(
    e: SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setCommentBody(e.currentTarget.value);
  }

  const postActions: PostActions = {
    likePost: async (postId: string) =>
      await agent.Posts.likePost(store.user.id!, postId).then((newUserData) => {
        updateUser(newUserData);
      }),
    comment: async (postId: string) =>
      await agent.Posts.comment(store.user.id!, postId, commentBody!).then(
        (newUserData) => {
          updateUser(newUserData);
        }
      ),
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) return <div>loading</div>;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.25,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <Box className="flex flex-wrap h-full content-center justify-center p-5">
          <Box className="flex flex-wrap flex-col content-center justify-between w-full">
            <Box className="flex flex-wrap items-center justify-between w-full p-5">
              <Box className="flex flex-wrap items-center gap-3">
                <Link to={`/herdle/profile/${store.user.id}`}>
                  <Avatar
                    src={userData!.avatar}
                    sx={{ width: 72, height: 72 }}
                  />
                </Link>
                <Typography variant="h4">{store.user.email}</Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  {userData?.followers?.length}{" "}
                  {userData?.followers?.length === 1 ? "Follower" : "Followers"}
                </Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  {userData?.following?.length
                    ? userData.following.length
                    : "0"}{" "}
                  Following
                </Typography>
                {store.user.id !==
                  window.location.href.split("/")[
                    window.location.href.split("/").length - 1
                  ] && (
                  <Button onClick={handleFollowUser} sx={{ color: "#588157" }}>
                    Follow
                  </Button>
                )}
              </Box>
              <Link to={`/herdle/${store.user.id}/herd`}>
                <Button
                  className="h-full"
                  sx={{ padding: "1.5rem", color: "#588157" }}
                >
                  {store.user.id ===
                  window.location.href.split("/")[
                    window.location.href.split("/").length - 1
                  ]
                    ? "Manage Herd"
                    : "View Herd"}
                </Button>
              </Link>
            </Box>
            <Box className="flex flex-row justify-between">
              <Box className="flex flex-col pl-5 gap-8 w-3/12">
                <Box className="flex flex-col gap-3">
                  <Box className="flex flex-row gap-3">
                    <Typography variant="h5">Posts</Typography>
                    {store.user.id ===
                      window.location.href.split("/")[
                        window.location.href.split("/").length - 1
                      ] && <PostCreator setUserData={setUserData} />}
                  </Box>
                  <Box className="flex flex-wrap flex-col gap-3 w-full">
                    {userData?.posts && userData?.posts.length ? (
                      userData?.posts?.map((post: Post, i) => (
                        <PostCard
                          key={i}
                          post={post}
                          actions={postActions}
                          handleUpdateCommentBody={handleUpdateCommentBody}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box className="flex flex-col w-8/12">
                <Typography className="pl-5" variant="h5">
                  {store.user.email}'s Herdle
                </Typography>
                <Box className="flex flex-wrap flex-row gap-3 p-5">
                  {userData!.herdle!.map((animal, i) => (
                    <AnimalCard
                      key={i}
                      animal={animal}
                      isOwner={animal.ownerId === store.user.id}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </>
  );
}
