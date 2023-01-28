import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { selectAuthModalState, setOpen } from '@/store/modalSlice';

const AuthModal: React.FC = () => {
  const { open: isOpen, view } = useSelector(selectAuthModalState);
  const dispatch = useDispatch();

  console.log(view);

  const handleOpen = () => {
    dispatch(setOpen(true));
  };
  const handleClose = () => {
    dispatch(setOpen(false));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {view === 'login' && 'Login'}
            {view === 'signup' && 'Sign Up'}
            {view === 'resetPassword' && 'Reset Password'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
            >
              <OAuthButtons />
              <Text color="gray.500" fontWeight={600} fontSize={'12px'}>
                OR
              </Text>
              <AuthInputs />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
