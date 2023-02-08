import React, { useState } from 'react';
import { Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setOpen, setView } from '@/store/modalSlice';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import useDirectory from '@/hooks/useDirectory';
import CreateCommunityModal from '../Layout/Modal/CreateCommunity';

interface PersonalHomeProps {
  user?: User | null;
}

const PersonalHome: React.FC<PersonalHomeProps> = ({ user }) => {
  const [communityOpen, setCommunityOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { toggleMenuOpen } = useDirectory();

  const onCreatePostClicked = () => {
    if (!user) {
      dispatch(setOpen(true));
      return dispatch(setView('login'));
    }

    const { communityId } = router.query;
    if (communityId) {
      return router.push(`/r/${communityId}/submit`);
    }

    toggleMenuOpen();
  };

  return (
    <>
      <CreateCommunityModal
        open={communityOpen}
        handleClose={() => setCommunityOpen(false)}
      />
      <Flex
        direction="column"
        bg="white"
        borderRadius={4}
        cursor="pointer"
        border="1px solid"
        borderColor="gray.300"
        position="sticky"
      >
        <Flex
          align="flex-end"
          color="white"
          p="6px 10px"
          bg="blue.500"
          height="34px"
          borderRadius="4px 4px 0px 0px"
          fontWeight={600}
          bgImage="url(/images/redditPersonalHome.png)"
          backgroundSize="cover"
        ></Flex>
        <Flex direction="column" p="12px">
          <Flex align="center" mb={2}>
            <Icon as={FaReddit} fontSize={50} color="brand.100" mr={2} />
            <Text fontWeight={600}>Home</Text>
          </Flex>
          <Stack spacing={3}>
            <Text fontSize="9pt">
              Your personal Reddit frontpage, built for you.
            </Text>
            <Button height="30px" onClick={onCreatePostClicked}>
              Create Post
            </Button>
            <Button
              variant="outline"
              height="30px"
              onClick={() => setCommunityOpen(true)}
            >
              Create Community
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};
export default PersonalHome;
