import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { User } from "../../../Interfaces/Account";
import agent from "../../../service/Agent";
import { AppState } from "../../../store/store";
import AnimalCard from "../../UI/Animal/AnimalCards";
import { Post } from "@prisma/client";
import PostCard from "../../UI/Posts/PostCard";
import { motion } from "framer-motion";
import PostCreator from "../../UI/Posts/PostCreator";
import { Audio } from "react-loader-spinner";
import Header from "./ProfileHeader/Header";
import { useGetUserInfoQuery } from "../../../api/Queries/useGetUserInfo/useGetUserInfo";

export interface PostActions {
  likePost: any;
  comment?: any;
}

export default function () {
  const { id } = useParams();
  const { data, isLoading } = useGetUserInfoQuery({ userId: id! });
  const store = useSelector((state: AppState) => state.appState);

  const [userData, setUserData] = useState<User>();

  function updateUser(newUserData: User) {
    const tempUserData = { ...userData!, ...newUserData };
    setUserData(tempUserData);
  }

  // async function getUserInfo() {
  //   await agent.Account.getUserInfo(id!).then((userInfo) => {
  //     updateUser(userInfo);
  //   });
  // }

  if (isLoading)
    return (
      <Box className="w-full min-h-screen flex items-center justify-center">
        <Audio
          height="80"
          width="80"
          color="green"
          ariaLabel="three-dots-loading"
        />
      </Box>
    );

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
            <Header userData={data!} updateUser={updateUser} />
            <Box className="flex flex-row justify-between">
              <Box className="flex flex-col pl-5 gap-8 w-3/12">
                <Box className="flex flex-col gap-3">
                  <Box className="flex flex-row gap-3">
                    <Typography variant="h5">Posts</Typography>
                    {store.user.id ===
                      window.location.href.split("/").pop() && (
                      <PostCreator setUserData={setUserData} />
                    )}
                  </Box>
                  <Box className="flex flex-wrap flex-col gap-3 w-full">
                    {data?.posts &&
                      data?.posts.length &&
                      data?.posts?.map((post: Post, i) => (
                        <PostCard
                          key={i}
                          userId={store.user.id!}
                          post={post}
                          updateData={updateUser}
                        />
                      ))}
                  </Box>
                </Box>
              </Box>

              <Box className="flex flex-col w-8/12">
                <Typography className="pl-5" variant="h5">
                  {store.user.email}'s Herdle
                </Typography>
                <Box className="flex flex-wrap flex-row gap-3 p-5">
                  {data!.herdle!.map((animal, i) => (
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
