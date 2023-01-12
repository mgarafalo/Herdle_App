import { useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useState } from "react";
import { User } from "../../../Interfaces/Account";
import agent from "../../../service/Agent";
import { setToken, setUserState } from "../../../store/slice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ email: "", password: "" });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) {
    const tempUser = { ...user, [property]: e.target.value };
    setUser(tempUser);
  }

  async function handleLogin() {
    await agent.Account.login(user)
      .then((response) => {
        console.log(response);
        dispatch(setUserState({ email: response.email, id: response.id }));
        dispatch(setToken(response.token!));
        window.localStorage.setItem("Herdle/Auth", JSON.stringify(response));
      })
      .then(() => {
        const user = JSON.parse(window.localStorage.getItem("Herdle/Auth")!);
        navigate(`/herdle/${user.id}`);
      });
  }

  return (
    <Box className="flex flex-wrap flex-col gap-5 justify-center content-center min-h-screen">
      <TextField
        onChange={(e) => handleChange(e, "email")}
        label="Email"
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
      <TextField
        onChange={(e) => handleChange(e, "password")}
        label="Password"
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
      <Button
        sx={{ backgroundColor: "#588157", color: "white" }}
        onClick={handleLogin}
      >
        Submit
      </Button>
    </Box>
  );
}
