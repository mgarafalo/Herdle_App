import { Avatar, Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User } from "../../../Interfaces/Account";
import agent from "../../../service/Agent";
import { AppState } from "../../../store/store";
import AnimalCard from "../../UI/Animal/AnimalCards";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Post } from "@prisma/client";
import PostCard from "../../UI/Posts/PostCard";

export default function () {
  const store = useSelector((state: AppState) => state.appState);

  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  async function getUserInfo() {
    await agent.Account.getUserInfo(
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ]
    )
      .then((userInfo) => {
        console.log(userInfo);
        const tempUser = { ...userData, ...userInfo };
        setUserData(tempUser);
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

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) return <div>loading</div>;

  return (
    <>
      <Box className="flex flex-wrap min-h-screen content-center justify-center p-7">
        <Box className="flex flex-wrap flex-col content-center justify-between w-full">
          <Box className="flex flex-wrap items-center justify-between w-full p-5">
            <Box className="flex flex-wrap items-center gap-3">
              <Avatar>{store.user.email[0]}</Avatar>
              <Typography>{store.user.email}</Typography>
              <Typography>
                {userData?.followers?.length ? userData.followers.length : "0"}{" "}
                Followers
              </Typography>
              <Typography>
                {userData?.following?.length ? userData.following.length : "0"}{" "}
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
          <Box className="flex flex-col">
            <Box className="flex flex-col pl-5 gap-8">
              <Box className="flex flex-col gap-3">
                <Box className="flex flex-row gap-3">
                  <Typography variant="h5">Posts</Typography>
                  {store.user.id ===
                    window.location.href.split("/")[
                      window.location.href.split("/").length - 1
                    ] && (
                    <Link to={"/posts/new"}>
                      <Button className="flex gap-1" sx={{ color: "#588157" }}>
                        <AddBoxIcon />
                        New Post
                      </Button>
                    </Link>
                  )}
                </Box>
                <Box className="flex flex-wrap gap-3">
                  {userData?.posts && userData?.posts.length ? (
                    userData?.posts?.map((post: Post) => (
                      <PostCard post={post} />
                    ))
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
              <Typography variant="h5">{store.user.email}'s Herdle</Typography>
            </Box>
            <Box className="flex flex-wrap flex-row items-center gap-8 p-5">
              {userData!.herdle.map((animal, i) => (
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
    </>
  );
}
