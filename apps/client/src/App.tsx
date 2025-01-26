import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import Review from './pages/Review';
import Talk from './pages/Talk';
import PreviewContent from './components/PreviewContent';
import Chat from './pages/Chat';
import Learn from './pages/Learn';
import Mypage from './pages/Mypage';
import MypagePW from './pages/MypagePW'
import Spinner from './components/Spinner';
import ReviewContent from './components/ReviewContent';
import Wordquiz from './pages/Wordquiz';
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
        <Route path='/chat' element={<Chat />} />
        <Route path='/learning' element={<Learn />} />
        <Route path='/learning/:id' element={<PreviewContent />} />
        <Route path='/wordquiz' element={<Wordquiz />} />
        <Route path='*' element={<NotFound />} />
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
