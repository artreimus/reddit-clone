import { Flex, Button } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

export default function index() {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Sorry, this page does not exist
      <Link href="/">
        <Button mt={4} textTransform="uppercase">
          Go Home
        </Button>
      </Link>
    </Flex>
  );
}
