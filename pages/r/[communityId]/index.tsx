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
import React, { useEffect, useState, CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import safeJsonStringify from 'safe-json-stringify';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { Flex, Spinner } from '@chakra-ui/react';

type CommunityPageProps = {
  communityData: Community;
};

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

const CommunityPage: React.FC<CommunityPageProps> = () => {
  const router = useRouter();
  const { communityId } = router.query;
  const [communityData, setCommunityData] = useState<Community>();
  const dispatch = useDispatch();
  let [loading, setLoading] = useState(true);
  let [color] = useState('#FF4300');

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

        const data = communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: communityDoc.id,
                ...communityDoc.data(),
              })
            )
          : '';

        setCommunityData(data);

        if (data) dispatch(setCurrentCommunity(communityData));
        setLoading(false);
      } catch (error) {
        console.error('getServerSideProps error', error);
      }
    };

    setLoading(true);

    if (communityId) {
      fetchCommunityData(communityId as string);
    }
  }, [dispatch, communityId, communityData?.id]);

  if (loading) {
    return (
      <Flex minWidth="max-content" minHeight="90vh" alignItems="center">
        <PacmanLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={120}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </Flex>
    );
  }

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
