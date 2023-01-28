import { Flex, Button, Image } from '@chakra-ui/react';

type TypeName = {};

const OAuthButtons: React.FC<TypeName> = () => {
  return (
    <Flex direction="column" width="100%" mb={3}>
      <Button variant="oauth">
        <Image
          src="/images/googleLogo.png"
          height="50%"
          mr={2}
          alt="Google Logo"
        />
        Continue with Google
      </Button>
    </Flex>
  );
};

export default OAuthButtons;
