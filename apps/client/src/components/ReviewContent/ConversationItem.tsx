import { IoArrowForward } from 'react-icons/io5';

interface Props {
  talkMessage: {
    userSpeaking: boolean;
    grammarValid: boolean;
    content: string;
    correctedContent: string;
  };
}

export const ConversationItem = ({ talkMessage }: Props) => {
  return (
    <li className={talkMessage.userSpeaking ? 'user' : 'ai'}>
      <div className='profile'>
        <img
          src={talkMessage.userSpeaking ? '/user-default.png' : '/image1.png'}
          alt='프로필 이미지'
        />
      </div>
      <div className='info'>
        <div className='name'>{talkMessage.userSpeaking ? '사용자' : 'AI'}</div>
        {talkMessage.grammarValid ? (
          <div className='message'>{talkMessage.content}</div>
        ) : (
          <div className='message'>
            <div style={{ color: 'red' }} className='wrong-sentence'>
              {talkMessage.content}
            </div>
            <div className='corrected-sentence'>
              <IoArrowForward />
              {talkMessage.correctedContent}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};
