import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterLinks: React.FC = () => (
  <div className='signup-link'>
    <span>
      <Link to='/register'>회원가입</Link>
    </span>
  </div>
);
