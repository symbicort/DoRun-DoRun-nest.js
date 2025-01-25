import { NavLink, Link, useLocation } from 'react-router-dom';
import { navMenu } from '../constance';
import '../assets/css/sidebarNav.css';

export default function SidebarNav() {  

  const {pathname} = useLocation();
  console.log(pathname);
  return (
    <nav className='sidebar-nav'>
      <div className='container'>
        <Link to='/'>
          <h1 className='logo'>
            <span className='nav-logo'>DoRunDoRun</span>
            <span className='nav-logo-tablet'>DD</span>
          </h1>
        </Link>
        <ul className='sidebar-nav-menu'>
          {navMenu.map(({ id, link, icon, text }) => {
            return (
              <li className='sidebar-nav-item' key={id}>
                <NavLink
                  to={link}
                  className={({ isActive }) => (isActive || text=='대화하기' && pathname.includes('talk') ? 'active' : '')}
                >
                  <div className='icon-text-group'>
                    <div className='icon'>{icon}</div>
                    <div className='text'>{text}</div>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
