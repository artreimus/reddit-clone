import React, { useState } from 'react';
import { Post } from '@/store/postsSlice';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { NextRouter, useRouter } from 'next/router';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { ActionCreatorWithPayload, AnyAction } from '@reduxjs/toolkit';
import usePosts from '@/hooks/usePosts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onSelectPost?: ActionCreatorWithPayload<any, 'posts/setSelectedPost'>;
  isHomePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onSelectPost,
  isHomePage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { onVote, onDeletePost } = usePosts();
  const [user] = useAuthState(auth);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const singlePostPage = !onSelectPost;

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    try {
      setLoadingDelete(true);
      // @ts-ignore
      const result = dispatch(onDeletePost({ post, event }));
      let success = true;

      await result.catch(() => {
        success = false;
      });

      if (!success) throw new Error('Failed to delete post');
      if (singlePostPage) router.push(`/r/${post.communityId}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSelectPost = () => {
    if (onSelectPost) {
      dispatch(onSelectPost(post));
      router.push(`/r/${post.communityId}/comments/${post.id}`);
    }
  };
  console.log(userVoteValue);

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostPage ? 'white' : 'gray.300'}
      borderRadius={singlePostPage ? '4px 4px 0px 0px' : '4px'}
      _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
      cursor={singlePostPage ? 'unset' : 'pointer'}
      onClick={handleSelectPost}
    >
      <Flex
        direction={'column'}
        align="center"
        bg={singlePostPage ? 'none' : 'gray.100'}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? ' none' : ' 3px 0px 0px 3px'}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          fontSize={22}
          onClick={(event) => {
            dispatch(
              // @ts-ignore
              onVote({
                event,
                post,
                vote: 1,
                communityId: post.communityId,
                user,
              })
            );
          }}
          cursor="pointer"
        />
        <Text fontSize="9pt">{post.voteStatus}</Text>{' '}
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
          fontSize={22}
          onClick={(event) => {
            dispatch(
              //@ts-ignore
              onVote({
                event,
                post,
                vote: -1,
                communityId: post.communityId,
                user,
              })
            );
          }}
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription mr={2} fontWeight={600} fontSize={'10pt'}>
              {error}
            </AlertDescription>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing="0.6" align="center" fontSize="9pt">
            {isHomePage && (
              <>
                {post.communityImageURL ? (
                  <Image
                    src={post.communityImageURL}
                    alt="community logo"
                    borderRadius="full"
                    boxSize="18px"
                    mr={2}
                  />
                ) : (
                  <Icon as={FaReddit} fontSize="18pt" mr={1} color="blue.500" />
                )}
                <Link href={`r/${post.communityId}`}>
                  <Text
                    fontWeight={700}
                    _hover={{ textDecoration: 'underline' }}
                    onClick={(event) => event.stopPropagation()}
                  >{`r/${post.communityId}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
            <Text>
              Posted by u/{post.creatorDisplayName}
              <Text as="span" ml={1}>
                {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
              </Text>
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center" padding={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                maxHeight="460px"
                alt="Post image"
                display={loadingImage ? 'none' : 'unset'}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize={'9pt'}>{post.numberOfComments}</Text>
          </Flex>{' '}
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize={'9pt'}>Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize={'9pt'}>Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize={'9pt'}>Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
