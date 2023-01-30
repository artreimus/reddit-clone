import { Button } from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setOpen, setView } from '@/store/modalSlice';

const AuthButtons: React.FC = () => {
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    dispatch(setOpen(true));
    dispatch(setView('login'));
  };
  const handleSignUpClick = () => {
    dispatch(setOpen(true));
    dispatch(setView('signup'));
  };

  return (
    <>
      <Button
        variant="outline"
        height="30px"
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '90px' }}
        mr={2}
        onClick={handleLoginClick}
      >
        Log In
      </Button>
      <Button
        height="30px"
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '90px' }}
        mr={2}
        onClick={() => handleSignUpClick()}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
