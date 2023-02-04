import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { Community } from '@/store/communitiesSlice';
import { Post } from '@/store/postsSlice';
import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const {
    loadingPosts,
    selectedPost,
    getCommunityPosts,
    posts,
    setSelectedPost,
    postVotes,
  } = usePosts();
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);

  useEffect(() => {
    // @ts-ignore : dont know how to fix this with Redux-NextJS
    dispatch(getCommunityPosts({ communityId: communityData.id }));
  }, [dispatch, communityData, getCommunityPosts]);

  return (
    <>
      {loadingPosts ? (
        <PostLoader />
      ) : (
        <Stack>
          {posts.map((post: Post) => (
            <PostItem
              post={post}
              key={post.id}
              onSelectPost={setSelectedPost}
              userIsCreator={user?.uid === post.creatorId}
              userVoteValue={
                postVotes.find((vote) => vote.postId === post.id)?.voteValue
              }
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
