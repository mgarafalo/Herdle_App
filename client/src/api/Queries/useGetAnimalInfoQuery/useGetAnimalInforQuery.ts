import { Animal } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import agent from "../../../service/Agent";

export type UseGetAnimalInfoQuery = {
  animalId: string;
};

export function useGetAnimalInfoQuery({ animalId }: UseGetAnimalInfoQuery) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["singleAnimalQuery"],
    queryFn: async () => await agent.Animal.getSingleAnimal(animalId),
  });

  return { data, isLoading, error };
}
