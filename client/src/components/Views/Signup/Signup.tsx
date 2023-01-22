import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { User } from "../../../Interfaces/Account";
import agent from "../../../service/Agent";
import { motion } from "framer-motion";

export default function SignUp() {
  const [user, setUser] = useState<User>({
    password: "",
    username: "",
    email: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>();

  function handleChange(
    e: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) {
    const tempUser = { ...user, [property]: e.currentTarget.value };
    setUser(tempUser);
  }

  function handleChangeConfirmPassword(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setConfirmPassword(e.target.value);
  }

  async function handleClick(): Promise<void> {
    if (user.password !== confirmPassword) alert("PASSWORDS DO NOT MATCH!");

    await agent.Account.signUp(user);
  }

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
        <Box className="flex flex-row flex-wrap ">
          <Box className="flex flex-col w-full items-center p-8">
            <Typography variant="h1">Create your Herdle</Typography>
            <Typography variant="h5">Bring your herd to the group</Typography>
          </Box>
          <Box className="flex flex-wrap flex-col gap-5 w-full content-center justify-center">
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
              onChange={(e) => handleChange(e, "username")}
              label="Username"
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
            <Box className="flex gap-3 justify-center">
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
              <TextField
                value={confirmPassword}
                onChange={(e) => handleChangeConfirmPassword(e)}
                label="Confirm Password"
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
            </Box>
            <Button
              sx={{ backgroundColor: "#588157", color: "white" }}
              onClick={handleClick}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </motion.div>
    </>
  );
}
