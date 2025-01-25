import { Outlet } from 'react-router-dom';
import SidebarNav from './components/SidebarNav';
import Header from './components/Header';
import Footer from './components/Footer';
import { useRef, useState, useEffect } from 'react';

export default function Layout() {
  
  const [navToggle, setNavToggle] = useState<boolean>(false);
  const navOpen = () => {
    setNavToggle(!navToggle);
  };

  const asideRef = useRef<HTMLElement | null>(null);
  const aside = asideRef.current;

  const onClickOutside = (event: Event) => {
    if (!aside?.contains(event.target as Node)) {
      return setNavToggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', onClickOutside, true);
    return () => {
      aside?.classList.remove('on');
    };
  }, []);

  return (
    <>
      <div id='wrap'>
        <aside ref={asideRef} className={`${navToggle ? 'on' : ''}`}>
          <SidebarNav />
          <Footer />
        </aside>
        <main>
          <Header handler={navOpen} />
          <div className='content relative'>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
