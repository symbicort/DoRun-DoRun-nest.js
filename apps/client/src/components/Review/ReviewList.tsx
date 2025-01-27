import { ReviewItem } from './ReviewItem';
import { ReviewData, DummyData } from './type'; 

interface Props {
  uniqueDates: string[];
  reviewDatas: ReviewData[];
  dummyDatas: DummyData[];
}

export const ReviewList = ({ uniqueDates, reviewDatas, dummyDatas }: Props) => {
    return (
      <div className='review-conversation-lists'>
        {uniqueDates.map((date) => {
          const reviewForDate = reviewDatas.find(data => data.createdAt === date);
          return (
            <div key={date}>
              <div className='date'>{date}</div>
              <ul className='review-list'>
                {reviewForDate && (
                  <li key={reviewForDate.id} className='review-item'>
                    <ReviewItem data={reviewForDate} dummy={dummyDatas} />
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }
  