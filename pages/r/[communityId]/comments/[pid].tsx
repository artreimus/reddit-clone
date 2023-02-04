import About from '@/components/Community/About';
import PageContent from '@/components/Layout/PageContent';
import Comments from '@/components/Posts/Comments';
import PostItem from '@/components/Posts/PostItem';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import usePosts from '@/hooks/usePosts';
import { setSelectedPost } from '@/store/postsSlice';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';

const PostPage: React.FC = () => {
  const {
    loadingPosts,
    selectedPost,
    getCommunityPosts: getPosts,
    posts,
    postVotes,
  } = usePosts();

  const dispatch = useDispatch();
  const router = useRouter();
  const [user] = useAuthState(auth);

  const { currentCommunity } = useCommunityData();

  useEffect(() => {
    const fetchPost = async (postId: string) => {
      try {
        const postDocRef = doc(firestore, 'posts', postId);
        const postDoc = await getDoc(postDocRef);

        dispatch(setSelectedPost({ id: postDoc.id, ...postDoc.data() }));
      } catch (error) {
        console.error('fetchPost', error);
      }
    };

    const { pid } = router.query;
    if (!selectedPost && pid) {
      fetchPost(pid as string);
    }
  }, [router.query, selectedPost, dispatch]);

  return (
    <PageContent>
      <>
        {selectedPost && (
          <PostItem
            post={selectedPost}
            key={selectedPost.id}
            userIsCreator={user?.uid === selectedPost.creatorId}
            userVoteValue={
              postVotes.find((vote) => vote.postId === selectedPost.id)
                ?.voteValue
            }
          />
        )}
        <Comments
          user={user as User}
          selectedPost={selectedPost}
          communityId={selectedPost?.communityId as string}
        />
      </>
      <>{currentCommunity && <About communityData={currentCommunity} />}</>
    </PageContent>
  );
};
export default PostPage;
