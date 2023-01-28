import { Flex } from '@chakra-ui/react';
import React from 'react';
import AuthModal from '../../Layout/Modal/Auth/AuthModal';
import AuthButtons from './AuthButtons';

type rightContentProps = {
  //user: any
};

const RightContent: React.FC<rightContentProps> = () => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        <AuthButtons />
      </Flex>
    </>
  );
};
export default RightContent;
