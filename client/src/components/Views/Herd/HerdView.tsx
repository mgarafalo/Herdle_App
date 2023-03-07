import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Modal,
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
import { ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function HerdView() {
  const store = useSelector((state: AppState) => state.appState);
  const navigate = useNavigate();

  const [herds, setHerds] = useState<Herd[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showHerdModal, setShowHerdModal] = useState<boolean>(false);
  const [showAnimalModal, setShowAnimalModal] = useState<boolean>(false);

  const HerdAccordian = ({ name, animals }: Herd) => (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {animals && animals.length ? (
            animals.map((animal) => <Typography>{animal.name}</Typography>)
          ) : (
            <Typography>No animals in {name}</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );

  async function getUserHerds() {
    await agent.Herd.getUserHerds(
      window.location.href.split("/")[
        window.location.href.split("/").length - 2
      ]
    )
      .then((userHerds) => {
        console.log(userHerds);
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
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.25,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <Box className="flex flex-wrap flex-col content-center justify-center min-h-screen">
          <Box className="flex flex-wrap justify-between pr-8">
            <Box className="flex gap-8 pl-8">
              <Button
                onClick={() => setShowHerdModal(!showHerdModal)}
                sx={{ color: "#588157" }}
              >
                New Herd
              </Button>
              <Button
                onClick={() => setShowAnimalModal(!showAnimalModal)}
                sx={{ color: "#588157" }}
              >
                New Animal
              </Button>
            </Box>
            <Button
              onClick={() =>
                navigate(
                  `/herdle/${
                    window.location.href.split("/")[
                      window.location.href.split("/").length - 2
                    ]
                  }`
                )
              }
              sx={{ color: "#588157" }}
            >
              Animals
            </Button>
          </Box>
          <Modal open={showHerdModal} onClose={() => setShowHerdModal(false)}>
            <Box className="flex flex-wrap content-center justify-center">
              <NewHerd closeFunction={handleClose} />
            </Box>
          </Modal>
          <Modal
            open={showAnimalModal}
            onClose={() => setShowAnimalModal(false)}
          >
            <Box className="flex flex-wrap content-center justify-center">
              <NewAnimal closeFunction={handleClose} />
            </Box>
          </Modal>
          <Box className="flex flex-col">
            {herds.map((herd, i) => (
              <HerdAccordian key={i} name={herd.name} animals={herd.animals} />
            ))}
          </Box>
        </Box>
      </motion.div>
    </>
  );
}
