import { auth, firestore, storage } from '@/firebase/clientApp';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { setOpen, setView } from './modalSlice';
import { AppState } from './store';

export type Post = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  communityImageURL?: string;
  createdAt: Timestamp;
};

export const getCommunityPosts = createAsyncThunk(
  'posts/getCommunityPosts',
  async ({ communityId }: { communityId: string }, thunkAPI) => {
    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityId),
        orderBy('createdAt', 'desc')
      );

      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      thunkAPI.dispatch(setPosts(posts as Post[]));
    } catch (error) {
      console.error('getCommunityPosts', error);
    }
  }
);

export const onDeletePost = createAsyncThunk(
  'posts/onDeletePost',
  async (
    {
      post,
      event,
    }: { post: Post; event: React.MouseEvent<HTMLDivElement, MouseEvent> },
    thunkAPI
  ) => {
    event.stopPropagation();

    try {
      // check if there is an image, delete if exist
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete post document from firestore
      const postDocRef = doc(firestore, 'posts', post.id!);
      await deleteDoc(postDocRef);
      // update post state
      thunkAPI.dispatch(deletePost(post.id));
      // throw new Error('testing error');
      return true;
    } catch (error) {
      console.error('onDeletePost', error);
    }
  }
);

export const onVote = createAsyncThunk(
  'posts/onVote',
  async (
    {
      event,
      post,
      vote,
      communityId,
      user,
    }: {
      event: React.MouseEvent<SVGElement, MouseEvent>;
      post: Post;
      vote: number;
      communityId: string;
      user?: User | null;
    },
    thunkAPI
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      thunkAPI.dispatch(setOpen(true));
      return thunkAPI.dispatch(setView('login'));
    }
    try {
      let voteChange = vote;
      const { voteStatus } = post;
      console.log(voteStatus);
      // Get the copy of state to be modified and updated later on
      const batch = writeBatch(firestore);
      const updatedPost = { ...post };

      // @ts-ignore
      const postsState = thunkAPI.getState().posts;
      const updatedPosts = [...postsState.posts];
      let updatedPostVotes = [...postsState.postVotes];
      let selectedPost = postsState.selectedPost;

      const existingVote = updatedPostVotes.find(
        (vote) => vote.postId === post.id
      );

      if (!existingVote) {
        // Create a new postVote document
        const postVoteRef = doc(
          collection(firestore, 'users', `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote, // 1 or - 1
        };

        batch.set(postVoteRef, newVote);

        // Add or Subtract 1 to post.voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteRef = doc(
          firestore,
          'users',
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        // Removing their vote (upvote to neural or downvote to neutral)
        if (existingVote.voteValue === vote) {
          // Add or Subtract 1 to post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );

          // Delete the postVote document
          batch.delete(postVoteRef);
          voteChange *= -1;
        } else {
          // Flipping their vote between upvote - downvote
          // Add or subtract 2 from post.voteStatus
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIndex = postsState.postVotes.findIndex(
            (vote: PostVote) => vote.id === existingVote.id
          );

          // Updating the existing post.voteStatus
          updatedPostVotes[voteIndex] = { ...existingVote, voteValue: vote };
          batch.update(postVoteRef, { voteValue: vote });
          voteChange = 2 * vote;
        }
      }

      const postRef = doc(firestore, 'posts', post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();

      const postIndex = postsState.posts.findIndex(
        (item: Post) => item.id === post.id
      );

      updatedPosts[postIndex] = updatedPost;

      if (selectedPost) {
        thunkAPI.dispatch(setSelectedPost(updatedPost));
      }

      thunkAPI.dispatch(setPosts(updatedPosts));
      thunkAPI.dispatch(setPostVotes(updatedPostVotes));
    } catch (error) {
      console.error('onVote', error);
    }
  }
);

export const getCommunityPostVote = createAsyncThunk(
  'posts/getCommunityPostVote',
  async (
    { communityId, user }: { communityId: string; user?: User | null },
    thunkAPI
  ) => {
    if (!user) return;
    const postVotesQuery = query(
      collection(firestore, 'users', `${user.uid}/postVotes`),
      where('communityId', '==', communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    thunkAPI.dispatch(setPostVotes(postVotes));
  }
);

export type PostVote = {
  id: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  loadingPosts: boolean;
  loadingDelete: boolean;
  postVotes: PostVote[];
}

const initialState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
  loadingPosts: false,
  loadingDelete: false,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Actions to set the state
    setPosts(state, action) {
      if (action.payload.payload) {
        state.posts = [...action.payload.payload];
      } else {
        state.posts = [...action.payload];
      }
    },

    deletePost(state, action) {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    setPostVotes(state, action) {
      state.postVotes = action.payload;
    },
    setSelectedPost(state, action) {
      state.selectedPost = action.payload;
    },
    setSelectedPostComments(state, action) {
      if (action.payload === 'increment') {
        state.selectedPost!.numberOfComments += 1;
      } else if (action.payload === 'decrement') {
        state.selectedPost!.numberOfComments -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCommunityPosts.pending, (state) => {
      state.loadingPosts = true;
    });
    builder.addCase(getCommunityPosts.fulfilled, (state) => {
      state.loadingPosts = false;
    });
  },
});

export const {
  setPosts,
  deletePost,
  setPostVotes,
  setSelectedPost,
  setSelectedPostComments,
} = postsSlice.actions;

export const selectPostsState = (state: AppState) => state.posts;

export default postsSlice.reducer;
