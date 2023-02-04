import React, { useEffect } from 'react';
import {
  fetchMySnippets,
  selectCommunitiesState,
  joinCommunity,
  leaveCommunity,
  Community,
  setCurrentCommunity,
} from '@/store/communitiesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { setOpen, setView } from '@/store/modalSlice';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';

const useCommunityData = () => {
  const dispatch = useDispatch();
  const { mySnippets, loading, currentCommunity } = useSelector(
    selectCommunitiesState
  );
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    // @ts-ignore : dont know how to fix this with Redux-NextJS
    dispatch(fetchMySnippets(user));
  }, [dispatch, user]);

  useEffect(() => {
    async function getCommunityData(communityId: string) {
      try {
        const communityDocRef = doc(firestore, 'communities', communityId);
        const communityDoc = await getDoc(communityDocRef);

        dispatch(
          setCurrentCommunity({ id: communityDoc.id, ...communityDoc.data() })
        );
      } catch (error) {}
    }

    const { communityId } = router.query;

    if (communityId && !currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [dispatch, currentCommunity, router.query]);

  const onJoinOrLeaveCommunity = (community: Community, isJoined?: boolean) => {
    if (!user) {
      dispatch(setOpen(true));
      dispatch(setView('login'));
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

  return { mySnippets, loading, onJoinOrLeaveCommunity, currentCommunity };
};
export default useCommunityData;
