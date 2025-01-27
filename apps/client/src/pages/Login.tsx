import '../assets/css/auth.css';
import { LogoLink } from '../components/common/LogoLink';
import { RegisterLinks } from '../components/auth/RegisterLink';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {  
  return (
    <div className='form-container'>
      <div className='form-area'>
        <div className='form-elements'>
          <div className='form-title'>
           <LogoLink path={'/'}>DorunDorun</LogoLink>
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
