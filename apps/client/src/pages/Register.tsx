import '../assets/css/auth.css';
import { LogoLink } from '../components/LogoLink';
import RegisterForm from '../components/RegisterForm';

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
