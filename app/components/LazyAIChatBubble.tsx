'use client';

import dynamic from 'next/dynamic';

const AIChatBubble = dynamic(() => import('./AIChatBubble'), {
  ssr: false,
});

export default function LazyAIChatBubble() {
  return <AIChatBubble />;
}
