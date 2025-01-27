import { ReactNode } from 'react';

interface TabContentProps {
  content: ReactNode;
}

export default function TabContent({ content }: TabContentProps) {
  return <div>{content}</div>;
}
