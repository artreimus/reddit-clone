import Head from 'next/head';
import PageContent from '@/components/Layout/PageContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import usePosts from '@/hooks/usePosts';
import PostLoader from '@/components/Posts/PostLoader';
import { Stack } from '@chakra-ui/react';
import PostItem from '@/components/Posts/PostItem';
import CreatePostLink from '@/components/Community/CreatePostLink';
import { useDispatch } from 'react-redux';
import useCommunityData from '@/hooks/useCommunityData';
import Recommendations from '@/components/Community/Recommendations';
import Premium from '@/components/Community/Premium';
import PersonalHome from '@/components/Community/PersonalHome';

export default function Home() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { setPosts, posts, setSelectedPost, postVotes, setPostVotes } =
    usePosts();

  const { mySnippets, isSnippetsFetched } = useCommunityData();

  const buildNoUserHomeFeed = async () => {
    try {
      setLoading(true);
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      ); // get 10 highest rated posts

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setPosts(posts));
    } catch (error) {
      console.log('buildNoUserHomeFeed', error);
    } finally {
      setLoading(false);
    }
  };

  const buildUserHomeFeed = async () => {
    try {
      if (mySnippets.length) {
        setLoading(true);
        // get posts from users' communities
        const myCommunityIds = mySnippets.map((snippet) => snippet.communityId);
        const postQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', myCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setPosts(posts));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.error('buildUserHomeFeed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    const getUserPostVotes = async () => {
      try {
        const postIds = posts.map((post) => post.id);
        const postVotesQuery = query(
          collection(firestore, `users/${user?.uid}/postVotes`),
          where('postId', 'in', postIds)
        );

        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch(setPostVotes(postVotes));
      } catch (error) {
        console.error('getUserPostVotes', error);
      }
    };

    if (user && posts.length) getUserPostVotes();

    return () => {
      dispatch(setPostVotes([]));
    };
  }, [user, posts, dispatch, setPostVotes]);
  useEffect(() => {
    if (isSnippetsFetched) buildUserHomeFeed();
  }, [isSnippetsFetched]);

  return (
    <>
      <Head>
        <title>Reddit</title>
        <meta name="description" content="A clone of the Reddit Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <PageContent>
        <>
          <CreatePostLink />
          {loading ? (
            <PostLoader />
          ) : (
            <Stack>
              {posts.map((post) => (
                <PostItem
                  key={post.id}
                  onSelectPost={setSelectedPost}
                  post={post}
                  userVoteValue={
                    postVotes.find((item) => item.postId === post.id)?.voteValue
                  }
                  userIsCreator={user?.uid === post.creatorId}
                  isHomePage
                />
              ))}
            </Stack>
          )}
        </>
        <Stack spacing={5}>
          <Recommendations />
          <Premium />
          <PersonalHome user={user} />
        </Stack>
      </PageContent>
    </>
  );
}
