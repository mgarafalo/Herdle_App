import { Button, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { SyntheticEvent, useState } from "react";
import { useSelector } from "react-redux";
import { Animal } from "../../../Interfaces/Animal";
import agent from "../../../service/Agent";
import { AppState } from "../../../store/store";

interface NewAnimalProps {
  closeFunction: any;
}

export default function NewAnimal({ closeFunction }: NewAnimalProps) {
  const store = useSelector((state: AppState) => state.appState.user);
  const [animal, setAnimal] = useState<Animal>({
    name: "",
  });

  function handleChange(
    e: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) {
    const tempAnimal = {
      ...animal,
      [property.toLowerCase()]: e.currentTarget.value,
    };
    setAnimal(tempAnimal);
  }

  async function handleClick() {
    await agent.Animal.newAnimal(animal!, store.id!).finally(() => {
      closeFunction();
    });
  }

  return (
    <>
      <Box className="flex flex-wrap min-h-screen gap-5 content-center justify-items-center">
        <Paper
          elevation={12}
          className="flex flex-wrap flex-col items-center h-3/6"
        >
          <div className="flex flex-col p-32 h-full items-center justify-center gap-3">
            {["Name", "Breed"].map((type: string, i: number) => (
              <TextField
                key={i}
                onChange={(e) => handleChange(e, type)}
                label={type}
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
            ))}
            <div className="flex gap-3">
              <Button
                sx={{ backgroundColor: "#588157", color: "white" }}
                onClick={handleClick}
              >
                Create
              </Button>
              <Button
                sx={{ backgroundColor: "#588157", color: "white" }}
                onClick={closeFunction}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Paper>
      </Box>
    </>
  );
}
