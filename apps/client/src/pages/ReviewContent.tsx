import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchConversation } from '../store/features/action/conversationAction';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { ConversationList } from '../components/ReviewContent/ConversationList';
import '../assets/css/reviewContent.css';

export default function ReviewContent() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { conversationData } = useAppSelector((state) => state.reviewContent);

  useEffect(() => {
    if (id) {
      dispatch(fetchConversation({ id }));
    }
  }, [dispatch, id]);

  if (!conversationData) {
    return <div>대화를 찾을 수 없습니다.</div>;
  }

  return (
    <div className='list-talk'>
      <div className='history !min-h-none !max-h-none'>
        <ConversationList conversationData={conversationData} />
      </div>
    </div>
  );
}
