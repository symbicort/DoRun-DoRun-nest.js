import { useState, useEffect } from 'react';
import datas from '../../datas.json';
import { CharacterList } from '../components/Chat/CharacterList';
import { Choice } from '../components/Chat/Choice';
import '../assets/css/chat.css';

export default function Character() {
  const [account] = useState('test');
  const [likedCharacters, setLikedCharacters] = useState([]);
  const [allCharacters] = useState(datas.characters);

  useEffect(() => {
    if (!account) return;

    const user = datas.users.find(user => user.userId === account);
    
    if (!user) return;

    const userLikedCharacters = user.chats
      .map(id => allCharacters.find(character => character.id === id))
      .filter(Boolean);

    setLikedCharacters(userLikedCharacters);
  }, [account, allCharacters]);

  return (
    <>
      <h2 className='list-title'>추천 캐릭터</h2>
      {account ? <CharacterList data={likedCharacters} /> : <Choice />}

      <h2 className='list-title'>전체 캐릭터</h2>
      <CharacterList data={allCharacters} />
    </>
  );
}
