import { AppBar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
          <Link to="/">
            <Typography fontSize={18}>Herdle</Typography>
          </Link>
          <div className="flex flex-row align-center justify-items-center gap-4">
            {email === "" ? (
              <>
                <Link to="/login">
                  <Button sx={{ color: "white" }}>Login</Button>
                </Link>
                <Link to="/signup">
                  <Button sx={{ color: "white" }}>Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={`/herdle/${id}`}>
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
