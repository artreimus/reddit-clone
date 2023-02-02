import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Stack,
  Textarea,
  Image,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { AiFillCloseCircle } from 'react-icons/ai';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import TabItem from '../TabItem';
import TextInputs from './TextInputs';
import ImageUpload from './ImageUpload';
import { Post } from '@/store/postsSlice';
import { firestore, storage } from '@/firebase/clientApp';

type NewPostFormProps = {
  user: User;
};

const formTabs: TabItemType[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({ title: '', body: '' });
  const [selectedFile, setSelectedFile] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  const handleCreatePost = async () => {
    // create new post object
    const { communityId } = router.query;
    const { title, body } = textInputs;
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split('@')[0], // ! - we use it in ts: safe value, safe to proceed
      title,
      body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    // store the post in db post collection
    try {
      setLoading(true);
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
      // check for selectedFile
      if (selectedFile) {
        // store the image in storage
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);
        // update post doc by adding imageURL
        await updateDoc(postDocRef, { imageURL: downloadURL });
      }
      router.back();
    } catch (error) {
      console.error('NewPostForm', error);
      setError(true);
    } finally {
      setLoading(false);
    }

    // redirect the user back to communityPage
  };
  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // reader to process the file
    const reader = new FileReader();

    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    // event listener that will trigger when readAsDataUrl completes
    reader.onload = (readerEvent) => {
      // extract the result from the read file
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };
  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = e;

    setTextInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width={'100%'}>
        {formTabs.map((item) => (
          <TabItem
            item={item}
            key={item.title}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === formTabs[0].title && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === formTabs[1].title && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectImage}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription mr={2} fontWeight={600} fontSize={'10pt'}>
            An error was encountered while creating post
          </AlertDescription>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
