import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Myroom (){
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = '';
                const response = await axios.get(API_URL);
                setData(response.data);
            } catch (error) {
                console.error(error);
                throw error;
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2 className='list-title'>My room</h2>
            <ul className='list-char'>
                <h3>캐릭터 대화</h3>
                {/* {data.map((item) => {
                    return (
                        <li key={item.id}>
                            <Link to={`/talk/${item.id}`}>
                                <p className="img">
                                    <img src={item.img} alt="" />
                                </p>
                                <strong className="name">{item.name}</strong>
                                <p className="desc truncate-2">{item.desc}</p>
                            </Link>
                        </li>
                    );
                })} */}
            </ul>
            <ul className='list-char'>
                <h3>영단어 학습장</h3>
            </ul>
            <Link to={'/quiz'}>
                <button>영어 퀴즈</button>
            </Link>
            
        </div>
    );
}
