import HeaderNav from './HeaderNav';
import { FaBars } from 'react-icons/fa6';
import '../assets/css/header.css';
import { LogoLink } from './LogoLink';

interface HeaderProps {
  handler: () => void;
}

export default function Header({ handler }: HeaderProps) {
  const clickHandler = () => {
    handler();
  };

  return (
    <header id='header'>
      <div className='container'>
        <div className='header-icon'>
          <button type='button' className='bar' onClick={clickHandler}>
            <FaBars />
          </button>
          <LogoLink path={'/'}>DorunDorun</LogoLink>
        </div>
        <HeaderNav />
      </div>
    </header>
  );
}