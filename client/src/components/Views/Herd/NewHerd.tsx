import { Button, Paper, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { SyntheticEvent, useState } from 'react';
import { Herd } from '../../../Interfaces/Animal';
import agent from '../../../service/Agent';

interface NewHerdProps {
  closeFunction: any;
}

export default function NewHerd({ closeFunction }: NewHerdProps) {
  const [newHerd, setNewHerd] = useState<Herd>({ name: '' });

  function handleChange(
    e: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) {
    const tempHerd = { ...newHerd, [property]: e.currentTarget.value };
    setNewHerd(tempHerd);
  }

  async function handleClick() {
    await agent.Herd.createNewHerd(newHerd.name);
    closeFunction();
  }

  return (
    <>
      <Box className='flex flex-wrap min-h-screen gap-5 content-center justify-items-center'>
        <Paper
          elevation={12}
          className='flex flex-wrap flex-col items-center h-3/6'
        >
          <div className='flex flex-col p-32 h-full items-center justify-center gap-3'>
            <TextField
              onChange={(e) => handleChange(e, 'name')}
              label='Herd Name'
              variant='outlined'
              sx={{
                '& label.Mui-focused': {
                  color: '#588157',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#588157',
                  },
                },
              }}
            />
            <div className='flex gap-3'>
              <Button
                sx={{ backgroundColor: '#588157', color: 'white' }}
                onClick={handleClick}
              >
                Create
              </Button>
              <Button
                sx={{ backgroundColor: '#588157', color: 'white' }}
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
