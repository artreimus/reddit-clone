import React from 'react';
import Navbar from '../Navbar';

type LayoutProps = {
  children?: JSX.Element | JSX.Element[];
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};
export default Layout;
