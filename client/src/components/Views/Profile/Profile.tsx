import { Avatar, Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Animal } from '../../../Interfaces/Animal';
import agent from '../../../service/Agent';
import { AppState } from '../../../store/store';
import ListTable from '../../UI/ListTable';

export default function () {
  const store = useSelector((state: AppState) => state.appState);

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function getUserInfo() {
    let user = {};
    if (
      window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ] !== store.user.id
    ) {
      user = agent.Account.getUserInfo(
        window.location.href.split('/')[
          window.location.href.split('/').length - 1
        ]
      );
    }
    await agent.Animal.getUsersAnimals(
      window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ]
    )
      .then((userAnimals) => {
        console.log(userAnimals);
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
        <Paper
          elevation={12}
          className='flex flex-wrap content-center justify-between w-full h-100'
          sx={{ borderRadius: '16px' }}
        >
          <Box className='flex flex-wrap flex-row items-center gap-3 p-5'>
            <Avatar>{store.user.email[0]}</Avatar>
            <Typography>{store.user.email}'s Herdle</Typography>
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
          <ListTable
            data={animals}
            isOwner={animals[0].ownerId === store.user.id}
          />
        </Paper>
      </Box>
    </>
  );
}
