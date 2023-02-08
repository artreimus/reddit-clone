import CreateCommunityModal from '@/components/Layout/Modal/CreateCommunity';
import useCommunityData from '@/hooks/useCommunityData';
import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaReddit } from 'react-icons/fa';
import { GrAdd } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import MenuListItem from './MenuListItem';

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const { mySnippets } = useCommunityData();

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text
          textTransform="uppercase"
          pl={3}
          mb={1}
          fontSize="7pt"
          fontWeight={500}
          color="gray.500"
        >
          Moderating
        </Text>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              iconColor="brand.100"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text
          textTransform="uppercase"
          pl={3}
          mb={1}
          fontSize="7pt"
          fontWeight={500}
          color="gray.500"
        >
          My Communities
        </Text>
        <MenuItem
          width={'100%'}
          fontSize="10pt"
          _hover={{ bg: 'gray.100' }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon as={GrAdd} fontSize={20} mr={2} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets
          .filter((snippet) => !snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              iconColor="blue.500"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
    </>
  );
};
export default Communities;
