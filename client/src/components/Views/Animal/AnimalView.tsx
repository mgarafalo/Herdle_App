import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetAnimalInfoQuery } from "../../../api/Queries/useGetAnimalInfoQuery/useGetAnimalInforQuery";

export default function AnimalView() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetAnimalInfoQuery({ animalId: id! });

  if (isLoading) {
    return <>Loading ... </>;
  }

  return (
    <>
      <Box className="flex flex-col">
        {Object.entries(data!).map((item) => (
          <Box className="flex gap-2">
            <span>{item[0]}</span>
            <span>{item[1]}</span>
          </Box>
        ))}
      </Box>
    </>
  );
}
