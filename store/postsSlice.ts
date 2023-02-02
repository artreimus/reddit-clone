import { firestore, storage } from '@/firebase/clientApp';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
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
  async ({ post }: { post: Post }, thunkAPI) => {
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
    } catch (error) {}
  }
);

export const onVote = createAsyncThunk(
  'posts/onVote',
  async ({ post }: { post: Post }, thunkAPI) => {}
);

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  loadingPosts: boolean;
  loadingDelete: boolean;
  // postVotes
}

const initialState: PostState = {
  selectedPost: null,
  posts: [],
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
      console.log(action.payload);
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    setLoadingPosts(state, action) {
      state.loadingPosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCommunityPosts.pending, (state) => {
      state.loadingPosts = true;
    });
    builder.addCase(getCommunityPosts.fulfilled, (state) => {
      state.loadingPosts = false;
    });
    builder.addCase(onDeletePost.pending, (state) => {
      state.loadingDelete = true;
    });
    builder.addCase(onDeletePost.fulfilled, (state) => {
      state.loadingDelete = false;
    });
  },
});

export const { setPosts, deletePost } = postsSlice.actions;

export const selectPostsState = (state: AppState) => state.posts;

export default postsSlice.reducer;
