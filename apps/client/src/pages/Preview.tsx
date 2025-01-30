import { useNavigate } from 'react-router-dom';
import { useAppDispatch  } from '../hooks/useRedux';
import '../assets/css/preview.css';
import { levelLinks } from '../constance';
import { setCourseLevel } from '../store/features/action/courseAction';

export default function Preview() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handlePreviewClick = async (linkId: string) => {
    try {
      const levelNum = parseInt(linkId.split('level')[1]);

      if (levelNum > 1) {
        alert('준비 중입니다');
        return;
      }

      const level = 'lv' + linkId[5];
      
      await dispatch(setCourseLevel(level));
      
      navigate(`/learning/${linkId}`);
    } catch (error) {
      console.error('Error setting course level:', error);
    }
  };

  return (
    <ul className='preview-container'>
      {levelLinks.map((link) => (
        <li
          key={link.id}
          className="preview"
          onClick={() => handlePreviewClick(link.id)}
        >
          <span className='preview-sentence-link'>{link.label}</span>
        </li>
      ))}
    </ul>
  );
}
