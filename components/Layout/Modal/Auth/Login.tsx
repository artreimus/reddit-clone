import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { setView } from '@/store/modalSlice';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const dispatch = useDispatch();

  // Firebase logic
  const onSubmit = () => {};

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
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
      <Button type="submit" height="36px" mt={2} mb={2} width="100%">
        Log In
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
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
