import { Avatar, Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User } from '../../../Interfaces/Account';
import { Animal } from '../../../Interfaces/Animal';
import agent from '../../../service/Agent';
import { AppState } from '../../../store/store';
import AnimalCard from '../../UI/Animal/AnimalCards';
import ListTable from '../../UI/ListTable';

export default function () {
  const store = useSelector((state: AppState) => state.appState);

  const [userData, setUserData] = useState<User>()
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(true)

  async function getUserInfo() {
    if (
      window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ] !== store.user.id
    ) {
      console.log(store.user.id)
      const user = await agent.Account.getUserInfo(
        window.location.href.split('/')[
          window.location.href.split('/').length - 1
        ]
      );
      console.log(user)
      const tempUser = {...userData, ...user}
      console.log(tempUser)
      setUserData(tempUser)
      // setIsOwner(false)
    } else {
      // setIsOwner(true)
    }
    await agent.Animal.getUsersAnimals(
      window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ]
    )
      .then((userAnimals) => {
        setAnimals(userAnimals);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) return <div>loading</div>;

  return (
    <>
      <Box className='flex flex-wrap min-h-screen content-center justify-center p-7'>
        <Box className='flex flex-wrap flex-col content-center justify-between w-full'>
          <Box className='flex flex-wrap items-center justify-between w-full p-5'>
            <Box className='flex flex-wrap items-center gap-3'>
            <Avatar>{store.user.email[0]}</Avatar>
            <Typography>{store.user.email}'s Herdle - </Typography>
            <Typography>0 Followers</Typography>
            <Typography>0 Following</Typography>
            </Box>
          <Link to={`/user/${store.user.id}/herd`}>
            <Button className='h-full' sx={{ padding: '1.5rem' }}>
              {store.user.id ===
              window.location.href.split('/')[
                window.location.href.split('/').length - 1
              ]
              ? 'Manage Herd'
              : 'View Herd'}
            </Button>
          </Link>
              </Box>
          <Box className='flex flex-wrap flex-row items-center gap-8 p-5'>
          {animals.map((animal, i) => <AnimalCard key={i} animal={animal} isOwner={animal.ownerId === store.user.id} />)}
          </Box>
          </Box>
      </Box>
    </>
  );
}
