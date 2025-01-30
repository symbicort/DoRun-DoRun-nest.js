import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Review from './pages/Review';
import Talk from './pages/Talk';
import LearningContent from './components/LearningContent';
import Character from './pages/Character';
import Learn from './pages/Learn';
import Mypage from './pages/Mypage';
import MypagePW from './pages/MypagePW'
import ReviewContent from './pages/ReviewContent';
import Wordquiz from './pages/Wordquiz';
import Notfound from './components/common/NotFound';
import Spinner from './components/common/Spinner';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/talk/:id' element={<Talk />} />
        <Route path='/review' element={<Review />} />
        <Route path='/review/:id' element={<ReviewContent />} />
        <Route path='/character' element={<Character />} />
        <Route path='/learning' element={<Learn />} />
        <Route path='/learning/:id' element={<LearningContent />} />
        <Route path='/wordquiz' element={<Wordquiz />} />
        <Route path='*' element={<Notfound />} />
      </Route>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/mypage' element={<Mypage />} />
      <Route path='/mypagepw' element={<MypagePW />} />
      <Route path='/spinner' element={<Spinner loadingText='잠시만 기다려주세요...'/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
