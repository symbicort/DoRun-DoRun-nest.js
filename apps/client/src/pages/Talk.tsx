import '../assets/css/talk.css';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import datas from '../../datas.json'; //임시 데이터
import axios from 'axios';

import { PiUserListFill } from 'react-icons/pi';
import { PiUserListDuotone } from 'react-icons/pi';

import { PiMicrophoneFill } from 'react-icons/pi';
import { PiMicrophoneSlash } from 'react-icons/pi';
import { RiSendPlaneFill } from 'react-icons/ri';
import { PiSpeakerHighDuotone } from "react-icons/pi";
import { PiListMagnifyingGlassDuotone } from 'react-icons/pi';
import { RiLoader2Fill } from 'react-icons/ri';

import { Popup } from './(talk)/Popup'; // 팝업
import { ChatHistory } from './(talk)/ChatList'; // 대화 내역
import { firework } from '../utils/firework'; // 미션완료시 폭죽 효과

// 파비콘 출처 : http://si.serverzero.kr/main/pc/index.php#five
// 이미지 출처 : https://m.blog.naver.com/sinnam88/221375405075

export interface Mission {
	missionId: string;
	mission: string;
	meaning: string;
	complete: boolean;
}

export interface AuthUser {
	result: boolean;
	nickname?: string;
	userId?: string;
	newToken?: string | null;
}

interface AiMsg {
	nickname?: string | null;
	userMsg: string;
	result: boolean;
	emotion: string;
	aimsg: string;
}

export interface Character {
	id: string;
	name: string;
	img: string;
	desc: string;
}

function Talk() {
	const { id } = useParams();
	const [authuser, setAuthUser] = useState<AuthUser>({ result: false }); //유저정보 상태

	const [mic, setMic] = useState<boolean>(false); //마이크 활성 체크
	const [history, setHistory] = useState<boolean>(false); //대화 내역

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const micRef = useRef<HTMLButtonElement>(null);
	const [playState, setPlayState] = useState<boolean>(false); //오디오 재생 중인지 체크
	const [duration, setDuration] = useState<number>(0); //오디오 재생 중
	const [isPop, setIsPop] = useState<boolean>(false); //대화내역 활성 체크
	const [isTyped, setIsTyped] = useState<boolean>(false); //음성입력(텍스트입력) 완료 체크
	const [correctLoad, setCorrectLoad] = useState<boolean>(false); //교정 fetching 체크
	const [audioLoad, setAudioLoad] = useState<boolean>(false); //오디오 fetching 체크
	const [firstAudioMsg, setFirstAudioMsg] = useState<boolean>(false); //첫 대화시 오디오 파일 체크
	const [emotion, setEmotion] = useState<string>('happy'); //캐릭터 감정 상태
	const [aiMsg, setAiMsg] = useState<AiMsg>({
		nickname: null,
		userMsg: '',
		result: false,
		emotion: '',
		aimsg: '',
	}); //ai 메시지
	const [talkMessages, setTalkMessages] = useState<string[]>([]); //전송의 응답 메세지([user: .., pooh: ..])
	const [correctList, setCorrectList] = useState<string[]>([]); //교정 할 리스트
	const [isFinishPop, setIsFinishPop] = useState<boolean>(false); //대화 종료 팝업 체크
	const [isFinish, setIsFinish] = useState<boolean>(false); //대화 종료

	const [characterInfo] = useState<Character[]>(datas.characters.filter((character: Character) => character.id === id)); //캐릭터 정보 임시
	const [bgNum, setBgNum] = useState<number>(Math.floor(Math.random() * 3));//배경 이미지 3개 랜덤
	const [characterDesc, setCharacterDesc] = useState<boolean>(false);//캐릭터 개요
	const [missions, setMissions] = useState<Mission[]>([]);//미션 리스트
	const [missionsComplete, setMissionsComplete] = useState<string[]>([]); //미션 완료 목록

	// 배포 시 URL 재설정
	// const API_URL = 'https://43.203.227.36.sslip.io/server';
	const API_URL: string = 'http://localhost:3050'
	// 데이터
	// const data: Mission[] = [
	// 	{
	// 		missionId: 'lv1_1',
	// 		mission: 'I am trying to',
	// 		meaning: '~ 해 보려고 하는 중이에요',
	// 		complete: false,
	// 	},
	// 	{
	// 		missionId: 'lv1_2',
	// 		mission: 'I am ready to',
	// 		meaning: '~ 할 준비가 되었어요',
	// 		complete: false,
	// 	},
	// 	{
	// 		missionId: 'lv1_3',
	// 		mission: 'I am just about to',
	// 		meaning: '지금 막 ~ 하려는 참이에요',
	// 		complete: false,
	// 	},
	// ];

	const getMissions = async () => {
		try {
			const response = await axios.get<Mission[]>(`${API_URL}/missions`);
			// console.log('미션 데이터:', response.data);
			setMissions(response.data);
			// setMissions(data); // 더미 데이터
		} catch (error) {
			console.error('Fetch and play audio error:', error);
		}
	};

	useEffect(() => {
		async function auth() {
			const res = await axios.get(`${API_URL}/user/authuser`, { withCredentials: true });
			const result = res.data;
			setAuthUser(result);//유저 상태 추가
		}
		auth();
		setMic(false);
		getMissions();
	}, []);

	const fetchAndPlayAudio = async (inputText: string) => {//ai 데이터 가져오기
		try {
			setAudioLoad(true);

			const response = await axios.post(
				`${API_URL}/chat/SendChat`,
				{
					messages: [`user: ${inputText}`],
				},
				{ withCredentials: true }
			);
			const result = await response.data;
			setEmotion(result.emotion);
			setTalkMessages((prevData) => [...prevData, `pooh: ${result.aimsg}`]);
			setAiMsg((prevData: AiMsg) => ({ ...prevData, ...result }));

			setAudioLoad(false);
			const file = await fetch('/pooh.mp3', { credentials: 'include' });//오디오 파일 가져오기
			const blob = await file.blob();
			const objectURL = URL.createObjectURL(blob);

			if (audioRef.current) {
				audioRef.current.src = objectURL;
			}
			playAudio();//오디오 재생
			setFirstAudioMsg(true);
		} catch (error) {
			console.error('Fetch and play audio error:', error);
		}
	};

	function playAudio() {//오디오 재생/멈춤 함수
		const player = audioRef.current;
		if (player) {
			setPlayState(!playState);
			playState ? player.pause() : player.play();

			player.addEventListener('timeupdate', function () {
				const currentTime = player.currentTime;
				const end = player.duration;
				const percentage = Math.floor((currentTime / end) * 100);
				setDuration(percentage);
				if (percentage >= 100) {
					setPlayState(false); //오디오 재생 중인 상태 체크
					micRef.current && micRef.current.focus();
				}
			});
		}
	}

	// 미션 표현 사용 여부 체크
	const checkMission = async (inputText: string) => {
		//미션 체크
		// const missionData = data.map(item => `missionId: ${item.missionId}\nmission: ${item.mission}\n`).join('\n')
		// const postData =`${missionData}\nchat:${inputText}`;
		// const postData = {
		//  missions: data.map(item => ({ missionId: item.missionId, mission: item.mission })),
		//  chat: inputText
		// };
		const reducedMissions = missions.map(({ missionId, mission }) => ({ missionId, mission }));
		// console.log('postData',reducedMissions);
		try {
			const response = await axios.post(`${API_URL}/checkMission`, {
				missions: reducedMissions,
				chat: inputText,
			});
			const checkData = response.data;

			// 백엔드에서 배열로 데이터를 전송하도록 AI 프롬프팅을 했지만 배열 모양으로만 보내는 경우가 있어
			// 데이터가 배열인지 확인하고 아닐 경우 배열로 변환
			if (Array.isArray(checkData)) {
				// console.log('data는 배열입니다.');
			} else {
				// console.log('data는 배열이 아닙니다.');

				// 미션 표현을 사용하지 않았을 경우에 checkData는 ' none'임
				if (checkData != ' none') {
					let dataArray: string[] = [];
					try {
						dataArray = JSON.parse(checkData.replace(/'/g, '"'));
						// console.log('배열 변환 완료: ', dataArray);

						const updatedMissions = missions.map((mission) => {
							if (dataArray.includes(mission.missionId)) {
								if (!mission.complete) {
									firework();
								}
								return {
									...mission,
									complete: true,
								};
							} else {
								return mission;
							}
						});
						setMissions(updatedMissions);
						const completedMissionIds = updatedMissions
							.filter((mission) => mission.complete)
							.map((mission) => mission.missionId);

						setMissionsComplete(completedMissionIds);
					} catch (error) {
						console.error('배열 변환 에러: ', error);
					}
				}
			}
		} catch (error) {
			console.error('missionError: ', error);
		}
	};

	const sendMessage = async (e: React.FormEvent) => {//메시지 보내기
		e.preventDefault();
		const inputText = textareaRef.current?.value || '';
		if (inputText.trim().length === 0) {
			alert('입력된 대화 내용이 없습니다.');
			return false;
		}
		try {
			setTalkMessages((prevData) => [...prevData, `user: ${inputText}`]);
			await fetchAndPlayAudio(inputText);
			textareaRef.current!.value = '';
			micRef.current!.focus();

			await checkMission(inputText);
		} catch (error) {
			console.log(error);
		}
	};

	const finishChat = async () => {//대화 종료
		const todayMissionLength = missions.length;
		const todayMissionCount = missions.filter((data) => data.complete).length;
		if (
			authuser.result &&
			todayMissionLength > 0 &&
			todayMissionCount < todayMissionLength &&
			!window.confirm('오늘의 학습 미션을 달성하지 못하였습니다. 그만하시겠습니까?')
		)
			return;

		try {
			setCorrectLoad(true);
      //교정 목록 가져오기
			const resCorrect = await axios.post(
				`${API_URL}/chat/getCorrection`,
				{ messages: talkMessages },
				{ withCredentials: true }
			);
			const correctedMsg = await resCorrect.data;
			correctedMsg.forEach(function (msg: string) {
				if (msg.includes('->')) {
					setCorrectList((prevData) => [...prevData, msg]);
				}
			});
			if (correctedMsg.length === 0) {
				setCorrectList(['Perfect Grammar']);
			}
			setIsFinish(true);
			setIsFinishPop(true);

			setCorrectLoad(false);

			if (authuser.result) {//로그인된 유저일때
        //방생성
				await axios
					.post(
						`${API_URL}/room/newRoom`,
						{
							ai: 'pooh',
							messages: correctedMsg,
						},
						{ withCredentials: true }
					)
					.then(function (response) {
						// console.log('대화룸:',response.data);
						// roomid = response.data;
					})
					.catch((error) => {
						console.log('룸생성 에러:', error);
					});

				if (missionsComplete.length > 0) {//미션 완료 목록 보내기
					try {
						const response = await axios.post(
							`${API_URL}/missionComplete`,
							{
								missionId: missionsComplete,
							},
							{
								headers: {
									'Content-Type': 'application/json',
								},
							}
						);
						// console.log('미션 완료 응답:', response.data);
					} catch (error) {
						console.error('미션 완료 에러:', error);
					}
				}
			}
		} catch (error) {
			console.error('에러 발생:', error);
		}
		setFirstAudioMsg(false);
	};
	const inputHandler = () => {
		const parentNode = textareaRef.current!.parentNode as HTMLElement;
		return (parentNode.dataset.value = textareaRef.current!.value);
	};

	// 마이크 캡처
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const handleStartRecording = async () => {
		micRef.current!.focus();
		playState && playAudio();
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			// 마이크 캡처(녹음) 데이터가 생길 때마다 배열에 저장
			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			// 마이크 캡처(녹음) 중지 시 실행될 코드(.stop() 메서드가 실행되면 .onstop() 메서드가 실행됨)
			// 녹음 데이터를 하나의 Blob 객체로 만들고 녹음 데이터 배열 초기화
			mediaRecorder.onstop = () => {
				const recordedBlob = new Blob(chunksRef.current, {
					type: 'audio/ogg',
				});
				chunksRef.current = [];

				sendAudioData(recordedBlob);
			};

			// 마이크 캡처 시작
			mediaRecorder.start();
			setMic(true);
			setIsTyped(true);
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	// 마이크 캡처 중지
	const handleStopRecording = () => {
		const mediaRecorder = mediaRecorderRef.current;
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			setMic(false);
		}
	};

	const sendAudioData = async (audioBlob: Blob) => {
		try {
			// Blob을 File 객체로 변환 (파일 이름은 recording.ogg로 지정)
			const audioFile = new File([audioBlob], 'recording.ogg', {
				type: 'audio/ogg',
			});

			const formData = new FormData();

			formData.append('audio', audioFile);
			const response = await axios.post(`${API_URL}/chat/speech`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				// ,withCredentials: true,
			});
			// console.log('Audio data sent successfully:', response.data);
			
			// Speech-to-Text로 변환된 텍스트를 textarea에 입력
			textareaRef.current!.value = response.data;
			setIsTyped(false);
			textareaRef.current!.focus();
		} catch (error) {
			console.error('Error sending audio data:', error);
		}
	};

	const emoHandler = (idx: number) => {
		setBgNum(idx);
	};

	return (
		<>
			<div className="list-talk bg-cover bg-no-repeat bg-center ">
				<div ref={innerRef} className="inner">
					<div className="bg-char" style={{ backgroundImage: `url(/bg_${bgNum}.jpg)` }}></div>
					<div className="bg-emo">
						<button onClick={() => emoHandler(0)}>
							<img src="/bg_0.jpg" alt="" />
						</button>
						<button onClick={() => emoHandler(1)}>
							<img src="/bg_1.jpg" alt="" />
						</button>
						<button onClick={() => emoHandler(2)}>
							<img src="/bg_2.jpg" alt="" />
						</button>
					</div>

					<button type="button" className="btn-mission " onClick={() => setIsPop(!isPop)}>
						<img src={`/mission/pooh_mission_on.png`} alt="" />{' '}
						{missions?.length > 0 ? `${missions?.filter((data) => data.complete).length}/${missions.length}` : '미션'}
					</button>
					<Popup title={'오늘의 학습 미션'} mssDatas={missions} isPop={isPop} setIsPop={setIsPop} />

					<div className={`profile ${emotion}`}>
						<img src={`/pooh_${emotion}.png`} alt="" />
					</div>
				</div>

				<div className={`history ${history ? '' : 'hidden'}`}>
					<ChatHistory talkMessages={talkMessages} userInfo={authuser} characterInfo={characterInfo} />
				</div>
				{/* foot */}
				<div className="foot-talking-wrap ">
					<div className="progress">
						<div className="bar" style={{ transform: `translateX(${duration}%)` }} />
					</div>
					<div className="talking">
						<dl>
							<dt className="flex justify-between">
								<div className="flex items-center">
									<button id="charName" className="btn-char" onClick={() => setCharacterDesc(!characterDesc)}>
										{characterDesc ? <PiUserListFill className="text-lg" /> : <PiUserListDuotone className="text-lg" />}{' '}
										{characterInfo[0].name}
									</button>
									<button
										className={`voiceContainer ${playState ? 'on' : 'off'}`}
										onClick={playAudio}
										disabled={playState || firstAudioMsg ? false : true}>
										<PiSpeakerHighDuotone />{' '}
										<div>
											<div className="voice voice1"></div>
											<div className="voice voice2"></div>
											<div className="voice voice3"></div>
											<div className="voice voice4"></div>
											<div className="voice voice5"></div>
										</div>
									</button>
									<Popup
										title={'캐릭터 소개'}
										charDatas={characterInfo}
										isPop={characterDesc}
										setIsPop={setCharacterDesc}
									/>
								</div>

								<button className="btn-history" onClick={() => setHistory(!history)}>
									<PiListMagnifyingGlassDuotone
										className={`text-2xl ${talkMessages.length == 0 ? ' text-gray-400' : ''}`}
									/>
								</button>
							</dt>
							<dd className="message">{aiMsg.result ? aiMsg.aimsg : '대화를 시작 해보세요~'}</dd>
							<dd className="hidden">
								<audio id="myAudio" ref={audioRef}></audio>
							</dd>
						</dl>
					</div>
					<form className="form" onSubmit={(e) => sendMessage(e)}>
						<button
							type="button"
							ref={micRef}
							className="btn-mic"
							onClick={mic ? handleStopRecording : handleStartRecording}
							disabled={isFinish}>
							{mic ? <PiMicrophoneFill /> : <PiMicrophoneSlash />}
						</button>
						<div className={`textarea-wrap ${isTyped ? 'mic-on' : ''}`}>
							<textarea
								id="talkInput"
								className="w-full"
								ref={textareaRef}
								onKeyDown={(e) => {
									if (e.nativeEvent.isComposing) return;
									const key = e.key || e.charCode;
									(key === 'Enter' || key === 13) && !e.shiftKey && sendMessage(e);
								}}
								onInput={inputHandler}
								placeholder="마이크 이용 또는 메시지를 입력해 주세요"
							/>
						</div>
						<div className="foot">
							<div className="btns">
								<button type="submit" className="btn-send" disabled={playState || isFinish ? true : false}>
									{audioLoad ? <RiLoader2Fill className="animate-spin" /> : <RiSendPlaneFill />}
								</button>
							</div>

							<div className="shortcuts">
								<button
									type="button"
									className="btn-finishchat"
									onClick={finishChat}
									disabled={firstAudioMsg || isFinishPop ? false : true}>
									대화 종료 {correctLoad && <RiLoader2Fill className="animate-spin" />}
								</button>
								<Popup title={'교정 목록'} correctDatas={correctList} isPop={isFinishPop} setIsPop={setIsFinishPop} />
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default Talk;
