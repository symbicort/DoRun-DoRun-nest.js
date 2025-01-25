import { Link  } from 'react-router-dom';
import '../assets/css/auth.css';
import LoginForm from '../components/LoginForm';
import { RegisterLinks } from '../components/RegisterLink';

export default function Login() {  
  return (
    <div className='form-container'>
      <div className='form-area'>
        <div className='form-elements'>
          <div className='form-title'>
            <Link to='/'>
              <h1 className='logo'>DoRun-DoRun</h1>
            </Link>
          </div>
          <div className='form-box'>
            <LoginForm/>
          </div>
          <RegisterLinks/>
        </div>
      </div>
    </div>
  );
}
