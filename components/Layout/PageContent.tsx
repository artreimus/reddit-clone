import { Flex } from '@chakra-ui/react';
import React from 'react';

type PageContentProps = {
  children?: JSX.Element | JSX.Element[];
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex border="1px solid red" justify="center" p={'16px 0px'}>
      <Flex
        border="1px solid blue"
        width="95%"
        justify="center"
        maxWidth="860px"
      >
        {/* Left Contents */}
        <Flex
          border="1px solid yellow"
          direction="column"
          width={{ base: '100%', md: '65%' }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        {/* Right Contents */}
        <Flex
          border="1px solid green"
          direction="column"
          display={{ base: 'none', md: 'flex' }}
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
