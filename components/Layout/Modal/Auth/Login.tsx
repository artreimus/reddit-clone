import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { setView } from '@/store/modalSlice';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const dispatch = useDispatch();

  // Firebase logic
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = loginForm;
    signInWithEmailAndPassword(email, password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        name="email"
        placeholder="email"
        type="email"
        onChange={onChange}
        required
        mb={2}
        fontSize={'10pt'}
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        bg="gray.50"
      />
      <Input
        name="password"
        placeholder="password"
        type="password"
        onChange={onChange}
        required
        mb={2}
        fontSize={'10pt'}
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        bg="gray.50"
      />
      {error && (
        <Text textAlign="center" color="red" fontSize="0.7rem">
          {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        type="submit"
        height="36px"
        mt={2}
        mb={2}
        width="100%"
        isLoading={loading}
      >
        Log In
      </Button>
      <Flex fontSize="0.7rem" justifyContent="center" mb={1}>
        <Text mr={1}>Forgot your password?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => dispatch(setView('resetPassword'))}
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize="0.7rem" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => dispatch(setView('signup'))}
        >
          Sign Up
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
