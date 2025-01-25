import '../assets/css/auth.css';
import LoginForm from '../components/LoginForm';
import { LogoLink } from '../components/LogoLink';
import { RegisterLinks } from '../components/RegisterLink';

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
