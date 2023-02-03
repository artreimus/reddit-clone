import {
  getCommunityPostVote,
  selectPostsState,
  setPostVotes,
} from '@/store/postsSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCommunityPosts, onDeletePost, onVote } from '@/store/postsSlice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { selectCommunitiesState } from '@/store/communitiesSlice';

const usePosts = () => {
  const { posts, selectedPost, loadingDelete, loadingPosts, postVotes } =
    useSelector(selectPostsState);

  const dispatch = useDispatch();

  const { currentCommunity } = useSelector(selectCommunitiesState);

  const [user] = useAuthState(auth);

  const onSelectPost = () => {};

  useEffect(() => {
    if (!user || !currentCommunity) return;
    // @ts-ignore
    dispatch(getCommunityPostVote({ user, communityId: currentCommunity.id }));
  }, [user, currentCommunity, dispatch]);

  useEffect(() => {
    if (!user) dispatch(setPostVotes([]));
  }, [user, dispatch]);

  return {
    loadingDelete,
    loadingPosts,
    posts,
    selectedPost,
    getCommunityPosts,
    onVote,
    getCommunityPostVote,
    onSelectPost,
    onDeletePost,
    postVotes,
  };
};
export default usePosts;
