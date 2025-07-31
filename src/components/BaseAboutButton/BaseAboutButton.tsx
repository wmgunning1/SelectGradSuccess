import { useDispatch } from 'react-redux';

import { Button } from '@mui/material';

import { error } from '@usi/core-ui';

import { baseAboutButton } from './styles';
import { BaseAboutButtonProps } from './types';

const BaseAboutButton = ({ handleData, label, useGetAboutQuery }: BaseAboutButtonProps) => {
  const { refetch } = useGetAboutQuery();
  const dispatch = useDispatch();

  const handleClick = () => {
    refetch()
      .unwrap()
      .then((data) => handleData(JSON.stringify(data)))
      .catch((exception) => dispatch(error(exception)));
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick} sx={baseAboutButton}>
      {label}
    </Button>
  );
};

export default BaseAboutButton;
