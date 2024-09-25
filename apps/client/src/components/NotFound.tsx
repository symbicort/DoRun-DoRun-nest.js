import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import notfound from '../../notfound.json';

export default function Notfound() {
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
	};

	return (
		<>
			<div className="flex flex-col items-center text-center">
				<Lottie animationData={notfound} />
				<p className="w-6/12">
					존재하지 않는 주소를 입력하였거나 요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다. 궁금한 점이
					있으시면 언제든 고객센터를 통해 문의해 주시기 바랍니다. 감사합니다.
				</p>
				<div className="flex flex-row justify-center space-x-10 mt-6">
					<button type="button" className="btn-xl" onClick={goBack}>
						이전으로
					</button>
					<Link to="/">
						<button type="button" className="btn-xl">
							메인으로
						</button>
					</Link>
				</div>
			</div>
		</>
	);
}
