import React, { useEffect } from 'react';
import {
  fetchMySnippets,
  selectCommunitiesState,
  joinCommunity,
  leaveCommunity,
  Community,
} from '@/store/communitiesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

const useCommunityData = () => {
  const dispatch = useDispatch();
  const { mySnippets, loading } = useSelector(selectCommunitiesState);
  const [user] = useAuthState(auth);

  useEffect(() => {
    // @ts-ignore : dont know how to fix this with Redux-NextJS
    dispatch(fetchMySnippets(user));
  }, [dispatch, user]);

  const onJoinOrLeaveCommunity = (community: Community, isJoined?: boolean) => {
    if (!user) {
      //   setAuthModalState({ open: true, view: 'login' });
      console.log('no user');
      return;
    }

    if (isJoined) {
      console.log('leaving....');
      // @ts-ignore
      return dispatch(leaveCommunity({ communityId: community.id, user }));
    }
    // @ts-ignore
    dispatch(joinCommunity({ communityData: community, user }));
  };

  return { mySnippets, loading, onJoinOrLeaveCommunity };
};
export default useCommunityData;
