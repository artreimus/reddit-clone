import PageContent from '@/components/Layout/PageContent';
import NewPostForm from '@/components/Posts/PostForm/NewPostForm';
import { auth } from '@/firebase/clientApp';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor={'white'}>
          <Text fontWeight={600} color="gray.600" letterSpacing={0.5}>
            Create a post
          </Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>{/* <About/> */}</>
    </PageContent>
  );
};
export default SubmitPostPage;
