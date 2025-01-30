import { GoHomeFill } from 'react-icons/go';
import { CgMenuGridR } from 'react-icons/cg';
import { BiSolidChat } from 'react-icons/bi';
import { MdLibraryBooks } from 'react-icons/md';
import Wordquiz from './pages/Wordquiz';
import Preview from './pages/Preview';


//NavigationBar
export const navMenu = [
  { id: 0, link: '/', icon: <GoHomeFill />, text: '두런두런' },
  { id: 1, link: '/character', icon: <BiSolidChat />, text: '캐릭터 선택' },
  { id: 2, link: '/review', icon: <CgMenuGridR />, text: '대화목록' },
  { id: 3, link: '/learning#std0', icon: <MdLibraryBooks />, text: '학습하기' },
];

// Previes
export const levelLinks = [
  { id: 'level0', label: 'Lv.0' },
  { id: 'level1', label: 'Lv.1' },
  { id: 'level2', label: 'Lv.2' },
  { id: 'level3', label: 'Lv.3' },
];

//Learn
export const tabs = [
        {
            id: 0,
            label: '문장퀴즈',
            content: <Wordquiz/>,
            description: '단어를 조합해서 맞는 문장을 만들어보세요!'
        },
        {
            id: 1,
            label: '예문100',
            content: <Preview/>,
            description: '난이도별로 준비된 100개의 예문을 익히며 영어 실력을 키워보세요!'
        }
    ];