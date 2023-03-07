import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
// import { Animal as AnimalInterface } from "../../../Interfaces/Animal";
import ShareIcon from "@mui/icons-material/Share";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import EditIcon from "@mui/icons-material/Edit";
import PedigreeTree from "./PedigreeTree";
import { useState } from "react";
import { Animal as AnimalInterface } from "@prisma/client";
import { Link } from "react-router-dom";

interface Props {
  animal: AnimalInterface;
  isOwner?: boolean;
}

export default function AnimalCard({ animal, isOwner = false }: Props) {
  const [showPedigree, setShowPedigree] = useState(false);

  return (
    <>
      <Modal open={showPedigree} onClose={() => setShowPedigree(!showPedigree)}>
        <Paper elevation={12} className="flex content-center justify-center">
          <PedigreeTree />
        </Paper>
      </Modal>
      <Card sx={{ width: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={animal.photoUrl ? animal.photoUrl : "../../../goatTemp.jpeg"}
          title={animal.name}
        />
        <CardContent>
          <Box className="flex flex-wrap flex-row gap-3 items-baseline">
            <Typography gutterBottom fontSize={22}>
              {animal.name} - {animal.breed}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Fill this content with the animal's data
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setShowPedigree(true)}>
            <ViewTimelineIcon sx={{ color: "#588157" }} />
          </Button>
          <Button size="small">
            <ShareIcon sx={{ color: "#588157" }} />
          </Button>
          {isOwner && (
            <Link to={`/animal/view/${animal.id}`}>
              <Button size="small">
                <EditIcon sx={{ color: "#588157" }} />
              </Button>
            </Link>
          )}
        </CardActions>
      </Card>
    </>
  );
}
