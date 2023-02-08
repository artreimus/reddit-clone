import { useDispatch, useSelector } from 'react-redux';
import { getCommunityPosts, onDeletePost, onVote } from '@/store/postsSlice';
import { selectCommunitiesState } from '@/store/communitiesSlice';
import {
  DirectoryMenuItem,
  selectDirectoryMenuState,
  setIsOpen,
  setSelectedMenuItem,
} from '@/store/directoryMenuSlice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa';

const useDirectory = () => {
  const { isOpen, selectedMenuItem } = useSelector(selectDirectoryMenuState);
  const { currentCommunity } = useSelector(selectCommunitiesState);

  const dispatch = useDispatch();
  const router = useRouter();

  const toggleMenuOpen = () => {
    dispatch(setIsOpen(!isOpen));
  };

  const onSelectMenu = (menuItem: DirectoryMenuItem) => {
    dispatch(setSelectedMenuItem(menuItem));
    router.push(menuItem.link);
    if (isOpen) toggleMenuOpen();
  };

  useEffect(() => {
    if (currentCommunity) {
      const menuItem: DirectoryMenuItem = {
        displayText: `r/${currentCommunity.id}`,
        link: `/r/${currentCommunity.id}`,
        imageURL: currentCommunity.imageURL,
        icon: FaReddit,
        iconColor: 'blue.500',
      };
      dispatch(setSelectedMenuItem(menuItem));
    }
  }, [currentCommunity, dispatch]);

  return {
    isOpen,
    selectedMenuItem,
    toggleMenuOpen,
    onSelectMenu,
  };
};
export default useDirectory;
