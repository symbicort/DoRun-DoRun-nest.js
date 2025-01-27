import { useEffect, ChangeEvent } from 'react';
import '../assets/css/review.css';
import datas from '../../datas.json';
import { SortDropdown } from '../components/Review/SortDropDown';
import { ReviewList } from '../components/Review/ReviewList';
import { fetchReviews } from '../store/features/action/reveiwAction';
import { setDummyDatas, setSortedBy } from '../store/features/reviewSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';

export default function Review() {
  const dispatch = useAppDispatch();
  const { reviewDatas, dummyDatas, sortedBy } = useAppSelector(state => state.review);

  const uniqueDates: string[] = [
    ...new Set(
      reviewDatas.map((data) => data.createdAt)
    ),
  ];

  useEffect(() => {
    dispatch(fetchReviews());
    dispatch(setDummyDatas(datas.reviewDatas));
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortedBy(e.target.value));
    uniqueDates.slice().sort((a, b) => {
      if (e.target.value === 'latest') {
        return new Date(b).getTime() - new Date(a).getTime();
      } else {
        return new Date(a).getTime() - new Date(b).getTime();
      }
    });
  };

  return (
    <section className='review'>
      <div className='review-container'>
        <h2 className='list-title'>대화내역</h2>
        <div className='conversation-controls'>
          <SortDropdown sortedBy={sortedBy} handleChange={handleChange} />
        </div>
        <ReviewList 
          uniqueDates={uniqueDates} 
          reviewDatas={reviewDatas} 
          dummyDatas={dummyDatas} 
        />
      </div>
    </section>
  );
}
