import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

const CommunityNotFound: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Sorry, that community does not exist or has been banned
      <Link href="/">
        <Button mt={4} textTransform="uppercase">
          Go Home
        </Button>
      </Link>
    </Flex>
  );
};
export default CommunityNotFound;
