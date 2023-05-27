import React from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Image,
} from '@chakra-ui/react';
import { TiHome } from 'react-icons/ti';
import Communities from './Communities';
import useDirectory from '@/hooks/useDirectory';

const Directory: React.FC = () => {
  const { isOpen, selectedMenuItem, toggleMenuOpen } = useDirectory();
  const { onSelectMenu } = useDirectory();
  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: 'auto', lg: '200px' }}
        >
          <Flex align="center" onClick={() => {}}>
            {selectedMenuItem.imageURL ? (
              <Image
                src={selectedMenuItem.imageURL}
                alt="community image"
                borderRadius="full"
                boxSize="24px"
                mr={2}
              />
            ) : (
              <Icon
                as={selectedMenuItem.icon}
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                color={selectedMenuItem.iconColor}
              />
            )}

            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text fontWeight={600} fontSize="10pt">
                {selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default Directory;
