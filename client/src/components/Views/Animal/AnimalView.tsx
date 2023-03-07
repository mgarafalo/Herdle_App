import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Animal, Herd } from "../../../Interfaces/Animal";
import agent from "../../../service/Agent";

export default function AnimalView() {
  const [animal, setAnimal] = useState<Animal>();
  const { id } = useParams();

  async function loadData() {
    await agent.Animal.getSingleAnimal(id!).then((animalData) => {
      console.log(animalData);
      setAnimal(animalData);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return <></>;
}
