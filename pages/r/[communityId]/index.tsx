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
import { error } from 'console';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import safeJsonStringify from 'safe-json-stringify';

type CommunityPageProps = {
  communityData: Community;
};

// const testFunction = async () => {
//   const context = { query: { communityId: '' } };
//   try {
//     const communityDocRef = doc(
//       firestore,
//       'communities',
//       context.query.communityId as string
//     );

//     const communityDoc = await getDoc(communityDocRef);

//     return {
//       props: {
//         communityData: communityDoc.exists()
//           ? JSON.parse(
//               safeJsonStringify({
//                 id: communityDoc.id,
//                 ...communityDoc.data(),
//               })
//             )
//           : '',
//       },
//     };
//   } catch (error) {
//     console.error('getServerSideProps error', error);
//   }
// };

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const dispatch = useDispatch();

  const communityId2 = 'hello world';
  console.log('  communityId2.length', communityId2.length);
  const communityId = ['hello world'];
  console.log('  communityId.length', communityId.length);

  const { currentCommunity } = useSelector(selectCommunitiesState);

  useEffect(() => {
    if (communityData) {
      dispatch(setCurrentCommunity(communityData));
    }
  }, [communityData, dispatch]);

  if (!communityData) {
    return <CommunityNotFound />;
  }
  // console.log(communityData);

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
  const communityId = context.query.communityId
    ? context.query.communityId.length === 1
      ? context.query.communityId[0]
      : context.query.communityId
    : '';

  try {
    const communityDocRef = doc(firestore, 'communities', 'ArtReimus');

    const communityDoc = await getDoc(communityDocRef);

    if (!communityDoc.exists()) return { props: { communityData: '' } };

    return {
      props: {
        context: { ...context.query },
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
