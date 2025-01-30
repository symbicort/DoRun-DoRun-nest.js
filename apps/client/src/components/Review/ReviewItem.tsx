import { Link } from 'react-router-dom';
import { ReviewData, DummyData } from './type';

interface Props {
  data: ReviewData;
  dummy: DummyData[];
}

export const ReviewItem = ({ data, dummy }: Props) => {
  const time = data.createdAt.split(' ');
  const selectedDummy = dummy.find((item) => item.name === data.ai);
  const dummyImg = selectedDummy?.img;

  return (
    <Link to={`/review/${data.id}`}>
      <div className='mx-6'>
        <img className='character-img' src={dummyImg} alt={`${data.ai}`} />
      </div>
      <div className='flex flex-col justify-center'>
        <div className='review-character'>
          <span className='character-name'>{data.ai}</span>
          <span className='start-time ml-2'>{time}</span>
        </div>
      </div>
    </Link>
  );
}
