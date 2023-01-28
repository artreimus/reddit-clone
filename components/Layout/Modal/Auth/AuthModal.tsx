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
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { selectAuthModalState, setOpen } from '@/store/modalSlice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebase/clientApp';

const AuthModal: React.FC = () => {
  const { open: isOpen, view } = useSelector(selectAuthModalState);
  const [user, loading, error] = useAuthState(auth);

  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(setOpen(true));
  };

  const handleClose = () => {
    dispatch(setOpen(false));
  };

  useEffect(() => {
    if (user) {
      console.log('closing...');
      handleClose();
    }
  }, [user, handleClose]);

  console.log(user);
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
              {(view === 'login' || view === 'signup') && (
                <>
                  <OAuthButtons />
                  <Text color="gray.500" fontWeight={600} fontSize={'12px'}>
                    OR
                  </Text>
                </>
              )}

              <AuthInputs />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
