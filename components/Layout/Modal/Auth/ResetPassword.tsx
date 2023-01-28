import { auth } from '@/firebase/clientApp';
import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { setView } from '@/store/modalSlice';
import { BsDot, BsReddit } from 'react-icons/bs';
import { Flex, Icon, Input, Button, Text } from '@chakra-ui/react';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const dispatch = useDispatch();

  // Firebase logic
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>
      {success ? (
        <Text mb={4} textAlign="center">
          Please check your email for reset password instruction
        </Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            Enter the email associated with your account and we will send you a
            reset link
          </Text>
          <form onSubmit={onSubmit} style={{ width: '100%' }}>
            <Input
              required
              name="email"
              placeholder="email"
              type="email"
              mb={2}
              onChange={(event) => setEmail(event.target.value)}
              fontSize="10pt"
              _placeholder={{ color: 'gray.500' }}
              _hover={{
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
              }}
              _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
              }}
              bg="gray.50"
            />
            {error && (
              <Text textAlign="center" fontSize="10pt" color="red">
                {error.message}
              </Text>
            )}
            <Button
              width="100%"
              height="36px"
              mb={2}
              mt={2}
              type="submit"
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex
        alignItems="center"
        fontSize="9pt"
        color="blue.500"
        fontWeight={700}
        cursor="pointer"
      >
        <Text onClick={() => dispatch(setView('login'))}>Login</Text>
        <Icon as={BsDot} />
        <Text onClick={() => dispatch(setView('signup'))}>Sign Up</Text>
      </Flex>
    </Flex>
  );
};
export default ResetPassword;
