import { GoHomeFill } from 'react-icons/go';
import { CgMenuGridR } from 'react-icons/cg';
import { BiSolidChat } from 'react-icons/bi';
import { MdLibraryBooks } from 'react-icons/md';

//NavigationBar
export const navMenu = [
  { id: 0, link: '/', icon: <GoHomeFill />, text: '두런두런' },
  { id: 1, link: '/chat', icon: <BiSolidChat />, text: '대화하기' },
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