import '../assets/css/auth.css';
import RegisterForm from '../components/auth/RegisterForm';
import { LogoLink } from '../components/common/LogoLink';

export default function Register() {

  return (
    <div className='form-container'>
      <div className='form-area signup'>
        <div className='form-elements'>
          <div className='form-title signup'>
            <LogoLink path={'/'}>DorunDorun</LogoLink>
          </div>
          <div className='form-box'>
            <RegisterForm/>
          </div>
        </div>
      </div>
    </div>
  );
}
