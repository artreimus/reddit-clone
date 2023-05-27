import About from '@/components/Community/About';
import CommunityNotFound from '@/components/Community/CommunityNotFound';
import CreatePostLink from '@/components/Community/CreatePostLink';
import Header from '@/components/Community/Header';
import PageContent from '@/components/Layout/PageContent';
import Posts from '@/components/Posts';
import { firestore } from '@/firebase/clientApp';
import { Community, setCurrentCommunity } from '@/store/communitiesSlice';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import safeJsonStringify from 'safe-json-stringify';

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = () => {
  const router = useRouter();
  const { communityId } = router.query;
  const [communityData, setCommunityData] = useState<Community>();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCommunityData = async (communityId: string) => {
      const context = { query: { communityId: communityId } };
      try {
        const communityDocRef = doc(
          firestore,
          'communities',
          context.query.communityId as string
        );

        const communityDoc = await getDoc(communityDocRef);

        setCommunityData(
          communityDoc.exists()
            ? JSON.parse(
                safeJsonStringify({
                  id: communityDoc.id,
                  ...communityDoc.data(),
                })
              )
            : ''
        );
      } catch (error) {
        console.error('getServerSideProps error', error);
      }
    };

    if (communityId) {
      fetchCommunityData(communityId as string);
    }

    if (communityData) {
      dispatch(setCurrentCommunity(communityData));
    }
  }, [dispatch, communityId]);

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

export default CommunityPage;
