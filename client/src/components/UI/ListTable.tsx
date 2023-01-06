import {
  Avatar,
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Animal, Herd } from '../../Interfaces/Animal';
import { animalPropertyProperNames } from '../../Interfaces/Constants';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface ListTableProps {
  data: Animal[] | Herd[];
  isOwner: boolean;
}

export default function ListTable({ data, isOwner = false }: ListTableProps) {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  function handleShowModal() {
    setShowEditModal(!showEditModal);
  }

  return (
    <>
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <Box className='flex flex-wrap content-center justify-center'></Box>
      </Modal>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {Object.keys(data[0]).map((property, i) => (
                <>
                  {Object.keys(animalPropertyProperNames).includes(
                    property
                  ) && (
                    <TableCell key={i}>
                      {
                        animalPropertyProperNames[
                          property as keyof typeof animalPropertyProperNames
                        ]
                      }
                    </TableCell>
                  )}
                </>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((animal: Animal, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Box className='flex flex-wrap flex-row items-center gap-3'>
                    <Avatar
                      src={animal.photoUrl ? animal.photoUrl : animal.name![0]}
                    ></Avatar>
                    {isOwner && <EditIcon onClick={handleShowModal} />}
                  </Box>
                </TableCell>
                {Object.entries(animal).map((value, i2) => (
                  <>
                    {Object.keys(animalPropertyProperNames).includes(
                      value[0]
                    ) && (
                      <TableCell key={i2}>
                        {value[1] ? value[1] : 'N/A'}
                      </TableCell>
                    )}
                  </>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
