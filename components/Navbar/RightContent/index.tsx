import { auth } from '@/firebase/clientApp';
import { Flex, Button } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import React from 'react';
import AuthModal from '../../Layout/Modal/Auth/AuthModal';
import AuthButtons from './AuthButtons';

type rightContentProps = {
  user: any;
};

const RightContent: React.FC<rightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <AuthButtons />
        )}
      </Flex>
    </>
  );
};
export default RightContent;
