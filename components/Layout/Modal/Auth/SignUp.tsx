import { setView } from '@/store/modalSlice';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const SignUp: React.FC = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();

  // Firebase logic
  const onSubmit = () => {};

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        name="email"
        placeholder="Email"
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
        placeholder="Password"
        type="password"
        onChange={onChange}
        required
        mb={2}
        fontSize={'10pt'}
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        bg="gray.50"
      />
      <Input
        name="confirmPassword"
        placeholder="Confirm Password"
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
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => dispatch(setView('login'))}
        >
          Log In
        </Text>
      </Flex>
    </form>
  );
};
export default SignUp;
