import { Link } from 'react-router-dom';
import '../assets/css/auth.css';
import RegisterForm from '../components/RegisterForm';

export default function Register() {

  return (
    <div className='form-container'>
      <div className='form-area signup'>
        <div className='form-elements'>
          <div className='form-title signup'>
            <Link to='/'>
              <h1 className='logo'>DoRun-DoRun</h1>
            </Link>
          </div>
          <div className='form-box'>
            <RegisterForm/>
          </div>
        </div>
      </div>
    </div>
  );
}
