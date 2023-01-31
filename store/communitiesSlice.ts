import { firestore } from '@/firebase/clientApp';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  increment,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { AppState } from './store';

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private';
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface CommunityState {
  mySnippets: CommunitySnippet[];
  loading: boolean;
  //   visitedCommunities
}

const initialState: CommunityState = { mySnippets: [], loading: false };

export const fetchMySnippets = createAsyncThunk(
  'communities/fetchMySnippets',
  async (user: User | null | undefined, thunkAPI) => {
    try {
      if (!user) {
        return thunkAPI.dispatch(setMySnippets([]));
      }

      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      thunkAPI.dispatch(setMySnippets(snippets));
    } catch (error) {
      console.error(error);
    }
  }
);

export const joinCommunity = createAsyncThunk(
  'communities/joinCommunity',
  async (
    {
      communityData,
      user,
    }: {
      communityData: Community;
      user: User | null | undefined;
    },
    thunkAPI
  ) => {
    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || '',
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      const newMySnippets = [
        // @ts-ignore
        ...thunkAPI.getState().communities.mySnippets,
        newSnippet,
      ];
      batch.update(doc(firestore, `communities`, communityData.id), {
        numberOfMembers: increment(1),
      });

      console.log(newMySnippets);

      await batch.commit();
      thunkAPI.dispatch(
        setMySnippets(thunkAPI.dispatch(setMySnippets(newMySnippets)))
      );
    } catch (error) {
      console.error(error);
    }
  }
);

export const leaveCommunity = createAsyncThunk(
  'communities/leaveCommunity',
  async (
    {
      communityId,
      user,
    }: {
      communityId: string;
      user: User | null | undefined;
    },
    thunkAPI
  ) => {
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      batch.update(doc(firestore, `communities`, communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // @ts-ignore
      const newMySnippets = thunkAPI
        .getState()
        .communities.mySnippets.filter(
          (item: CommunitySnippet) => item.communityId !== communityId
        );

      console.log(newMySnippets);

      thunkAPI.dispatch(
        setMySnippets(thunkAPI.dispatch(setMySnippets(newMySnippets)))
      );
    } catch (error) {
      console.error(error);
    }
  }
);

export const communitiesSlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    // Actions to set the state
    setMySnippets(state, action) {
      if (action.payload.payload) {
        state.mySnippets = [...action.payload.payload];
      } else {
        state.mySnippets = [...action.payload];
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchMySnippets.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMySnippets.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(joinCommunity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(joinCommunity.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(leaveCommunity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(leaveCommunity.fulfilled, (state) => {
      state.loading = false;
    });
  },
});

export const { setMySnippets } = communitiesSlice.actions;

export const selectCommunitiesState = (state: AppState) => state.communities;

export default communitiesSlice.reducer;
