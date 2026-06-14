// layout/index.tsx

'use client';

import React from 'react';
import { MotionConfig } from 'framer-motion';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
};

export default MainLayout;
