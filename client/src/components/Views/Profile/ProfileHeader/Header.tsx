import { Avatar, Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User } from "../../../../Interfaces/Account";
import agent from "../../../../service/Agent";
import { AppState } from "../../../../store/store";

export type HeaderProps = {
  userData: User;
  updateUser: any;
};

export default function Header({ userData, updateUser }: HeaderProps) {
  const store = useSelector((state: AppState) => state.appState);

  async function handleFollowUser() {
    await agent.Account.followUserAction(
      store.user.id!,
      window.location.href.split("/").pop()!
    );
  }

  return (
    <Box className="flex flex-wrap items-center justify-between w-full p-5">
      <Box className="flex flex-wrap items-center gap-3">
        <Link to={`/herdle/profile/${store.user.id}`}>
          <Avatar src={userData!.avatar} sx={{ width: 72, height: 72 }} />
        </Link>
        <Typography variant="h4">{store.user.email}</Typography>
        <Typography sx={{ fontSize: "1rem" }}>
          {userData?.followedByIDs?.length}{" "}
          {userData?.followingIDs?.length === 1 ? "Follower" : "Followers"}
        </Typography>
        <Typography sx={{ fontSize: "1rem" }}>
          {userData?.followedByIDs?.length
            ? userData.followingIDs?.length
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
        <Button className="h-full" sx={{ padding: "1.5rem", color: "#588157" }}>
          {store.user.id ===
          window.location.href.split("/")[
            window.location.href.split("/").length - 1
          ]
            ? "Manage Herd"
            : "View Herd"}
        </Button>
      </Link>
    </Box>
  );
}
