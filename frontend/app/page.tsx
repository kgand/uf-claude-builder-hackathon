"use client"

import React from 'react';
import Layout from '../components/layout/Layout';
import ChatContainer from '../components/chat/ChatContainer';
import { ChatProvider } from '../context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <Layout>
        <ChatContainer />
      </Layout>
    </ChatProvider>
  );
}