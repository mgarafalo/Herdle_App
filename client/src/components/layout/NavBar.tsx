import { AppBar, Button, Link, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAppState, setUserState, State } from "../../store/slice";

interface props {
  email: string;
  id: string;
}

export default function NavBar({ email, id }: props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/login");
    window.localStorage.removeItem("Herdle/Auth");
    dispatch(setUserState({ email: "", id: "" }));
  }
  return (
    <>
      <AppBar sx={{ backgroundColor: "#588157", padding: 2, height: 65 }}>
        <div className="flex flex-row justify-between align-center">
          <Typography fontSize={18}>Herdle</Typography>
          <div className="flex flex-row align-center justify-items-center gap-4">
            {email === "" ? (
              <>
                <Link href="/login">
                  <Button sx={{ color: "white" }}>Login</Button>
                </Link>
                <Link href="/signup">
                  <Button sx={{ color: "white" }}>Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={`/herdle/${id}`}>
                  <Button sx={{ color: "white" }}>{email}</Button>
                </Link>
                <Button onClick={handleLogout} sx={{ color: "white" }}>
                  Log Out
                </Button>
              </>
            )}
          </div>
        </div>
      </AppBar>
    </>
  );
}
