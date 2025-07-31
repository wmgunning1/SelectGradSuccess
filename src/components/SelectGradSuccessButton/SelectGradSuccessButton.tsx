import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';

import { selectGradSuccessButton } from './styles';
import { SelectGradSuccessButtonProps } from './types';

const SelectGradSuccessButton = ({ onClick }: SelectGradSuccessButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate('/select-grad-success');
  };

  return (
    <Button variant="contained" onClick={handleClick} sx={selectGradSuccessButton}>
      Select Grad Success Tools
    </Button>
  );
};

export default SelectGradSuccessButton;
