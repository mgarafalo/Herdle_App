import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Modal,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NewAnimal from "./NewAnimal";
import NewHerd from "./NewHerd";
import { ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useGetUserInfoQuery } from "../../../api/Queries/useGetUserInfo/useGetUserInfo";
import { Herd } from "../../../Interfaces/Animal";

export default function HerdView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error, invalidateQuery } = useGetUserInfoQuery({
    userId: id!,
  });

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

  async function handleClose() {
    setShowAnimalModal(false);
    setShowHerdModal(false);
    invalidateQuery();
  }

  if (isLoading) return <div>loading</div>;

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
              onClick={() => navigate(`/herdle/${id}`)}
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
            {data?.herds!.map((herd: Herd, i) => (
              <HerdAccordian key={i} {...herd} />
            ))}
          </Box>
        </Box>
      </motion.div>
    </>
  );
}
