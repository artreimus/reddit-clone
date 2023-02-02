import { selectPostsState } from '@/store/postsSlice';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCommunityPosts, onDeletePost, onVote } from '@/store/postsSlice';

const usePosts = () => {
  const { posts, selectedPost, loadingDelete, loadingPosts } =
    useSelector(selectPostsState);

  const onSelectPost = () => {};

  return {
    loadingDelete,
    loadingPosts,
    posts,
    selectedPost,
    getCommunityPosts,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
