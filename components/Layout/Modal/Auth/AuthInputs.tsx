import { selectAuthModalState } from '@/store/modalSlice';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import Login from './Login';
import ResetPassword from './ResetPassword';
import SignUp from './SignUp';

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
  const { view } = useSelector(selectAuthModalState);

  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {view === 'login' && <Login />}
      {view === 'signup' && <SignUp />}
      {view === 'resetPassword' && <ResetPassword />}
    </Flex>
  );
};
export default AuthInputs;
