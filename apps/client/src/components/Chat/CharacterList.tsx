import { Link } from 'react-router-dom';

export const CharacterList = ({ data }) => {
  return (
    <ul className='list-char'>
      {data.map((article) => (
        <li key={article.id}>
          <Link
            to={`/talk/${article.id}`}
            className={article.id !== 'aaa111' ? `none` : null}
            onClick={(e) => article.id !== 'aaa111' && e.preventDefault()}
          >
            <div className='img'>
              <img src={article.img} alt='' />
            </div>
            <dl>
              <dt className='name'>{article.name}</dt>
              <dd className='text truncate-2'>{article.desc}</dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
};
