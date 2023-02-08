import About from '@/components/Community/About';
import CommunityNotFound from '@/components/Community/CommunityNotFound';
import CreatePostLink from '@/components/Community/CreatePostLink';
import Header from '@/components/Community/Header';
import PageContent from '@/components/Layout/PageContent';
import Posts from '@/components/Posts';
import { firestore } from '@/firebase/clientApp';
import {
  Community,
  selectCommunitiesState,
  setCurrentCommunity,
} from '@/store/communitiesSlice';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import safeJsonStringify from 'safe-json-stringify';

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const dispatch = useDispatch();

  const { currentCommunity } = useSelector(selectCommunitiesState);

  useEffect(() => {
    if (communityData) {
      dispatch(setCurrentCommunity(communityData));
    }
  }, [communityData, dispatch]);

  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      'communities',
      context.query.communityId as string
    );

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: communityDoc.id,
                ...communityDoc.data(),
              })
            )
          : '',
      },
    };
  } catch (error) {
    console.error('getServerSideProps error', error);
  }
}
export default CommunityPage;
