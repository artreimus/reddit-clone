import {
  getCommunityPostVote,
  Post,
  selectPostsState,
  setPostVotes,
  setSelectedPost,
  setPosts,
} from '@/store/postsSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCommunityPosts, onDeletePost, onVote } from '@/store/postsSlice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { selectCommunitiesState } from '@/store/communitiesSlice';

const usePosts = () => {
  const { posts, selectedPost, loadingPosts, postVotes } =
    useSelector(selectPostsState);

  const dispatch = useDispatch();

  const { currentCommunity } = useSelector(selectCommunitiesState);

  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user || !currentCommunity) return;
    // @ts-ignore
    dispatch(getCommunityPostVote({ user, communityId: currentCommunity.id }));
  }, [user, currentCommunity, dispatch]);

  useEffect(() => {
    if (!user) dispatch(setPostVotes([]));
  }, [user, dispatch]);

  return {
    loadingPosts,
    posts,
    selectedPost,
    getCommunityPosts,
    onVote,
    getCommunityPostVote,
    setSelectedPost,
    onDeletePost,
    postVotes,
    setPosts,
    setPostVotes,
  };
};
export default usePosts;
