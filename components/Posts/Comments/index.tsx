import { firestore } from '@/firebase/clientApp';
import { Post, setSelectedPostComments } from '@/store/postsSlice';
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CommentInput from './CommentInput';
import CommentItem, { Comment } from './CommentItem';

type CommentsProps = {
  user?: User;
  selectedPost: Post | null;
  communityId: string | null;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState('');
  const dispatch = useDispatch();

  const onCreateComment = async (commentText: string) => {
    // create a comment document
    try {
      setCreateLoading(true);
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, 'comments'));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user?.uid!,
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        creatorDisplayText: user?.email!.split('@')[0] as string,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      // Timestamp is only created in the Firebase Servers
      // We need to manually fix format timestamp to be usable for the client side
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;
      // update post numberOfcomments
      const postDocRef = doc(firestore, 'posts', selectedPost?.id!);

      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });
      await batch.commit();
      // update state
      setCommentText('');
      setComments((prev) => [newComment, ...prev]);
      dispatch(setSelectedPostComments('increment'));
    } catch (error) {
      console.error('onCreateComment', error);
    } finally {
      setCreateLoading(false);
    }
  };
  const onDeleteComment = async (comment: Comment) => {
    try {
      setLoadingDeleteId(comment.id);
      const batch = writeBatch(firestore);
      // delete a comment document
      const commentDocRef = doc(firestore, 'comments', comment.id);
      batch.delete(commentDocRef);
      // update post numberOfcomments
      const postDocRef = doc(firestore, 'posts', selectedPost?.id!);
      batch.update(postDocRef, { numberOfComments: increment(-1) });
      await batch.commit();

      // update state
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
      dispatch(setSelectedPostComments('decrement'));
    } catch (error) {
      console.error('onDeleteComment', error);
    } finally {
      setLoadingDeleteId('');
    }
  };

  useEffect(() => {
    const getPostComments = async () => {
      try {
        setFetchLoading(true);
        const commentsQuery = query(
          collection(firestore, 'comments'),
          where('postId', '==', selectedPost?.id),
          orderBy('createdAt', 'desc')
        );

        const commentDocs = await getDocs(commentsQuery);

        const comments = commentDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComments(comments as Comment[]);
      } catch (error) {
        console.error('getPostComments', error);
      } finally {
        setFetchLoading(false);
      }
    };

    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex
        direction={'column'}
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (
          <CommentInput
            comment={commentText}
            setComment={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} padding={2}>
        {fetchLoading ? (
          <>
            {/* 3 skeleton loaders */}
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <>
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  borderTop="1px solid"
                  borderColor="gray.100"
                  p={20}
                >
                  <Text fontWeight={700} opacity={0.3}>
                    No Comments Yet
                  </Text>
                </Flex>
              </>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user?.uid as string}
                    key={comment.id}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
