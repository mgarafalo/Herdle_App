import {
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Herd } from "../../../Interfaces/Animal";
import agent from "../../../service/Agent";
import { AppState } from "../../../store/store";
import NewAnimal from "./NewAnimal";
import NewHerd from "./NewHerd";

export default function HerdView() {
  const store = useSelector((state: AppState) => state.appState);
  const navigate = useNavigate();

  const [herds, setHerds] = useState<Herd[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showHerdModal, setShowHerdModal] = useState<boolean>(false);
  const [showAnimalModal, setShowAnimalModal] = useState<boolean>(false);

  async function getUserHerds() {
    await agent.Herd.getUserHerds(store.user.id!)
      .then((userHerds) => {
        setHerds(userHerds);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function handleClose() {
    setShowAnimalModal(false);
    setShowHerdModal(false);
    setLoading(true);
    await getUserHerds();
  }

  useEffect(() => {
    getUserHerds();
  }, []);

  if (loading) return <div>loading</div>;

  return (
    <>
      <Box className="flex flex-wrap flex-col content-center justify-center min-h-screen">
        <Box className="flex flex-wrap justify-between pr-8">
          <Box className="flex gap-8 pl-8">
            <Button onClick={() => setShowHerdModal(!showHerdModal)}>
              New Herd
            </Button>
            <Button onClick={() => setShowAnimalModal(!showAnimalModal)}>
              New Animal
            </Button>
          </Box>
          <Button onClick={() => navigate(`/herdle/${store.user.id}`)}>
            Animals
          </Button>
        </Box>
        <Modal open={showHerdModal} onClose={() => setShowHerdModal(false)}>
          <Box className="flex flex-wrap content-center justify-center">
            <NewHerd closeFunction={handleClose} />
          </Box>
        </Modal>
        <Modal open={showAnimalModal} onClose={() => setShowAnimalModal(false)}>
          <Box className="flex flex-wrap content-center justify-center">
            <NewAnimal closeFunction={handleClose} />
          </Box>
        </Modal>
        <TableContainer component={Paper} sx={{ width: "85%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Herd</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {herds.map((herd) => (
                <TableRow key={herd.id}>
                  <TableCell>{herd.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
