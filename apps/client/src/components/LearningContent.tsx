import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuRepeat } from 'react-icons/lu';
import Spinner from './common/Spinner';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { getAiExample, getSentences, learnSentence } from '../store/features/action/learningAction';

export default function LearningContent() {
  const { id: urlID } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sentences, selectedSentenceData, isLoading } = useAppSelector((state) => state.learning);

  useEffect(() => {
    if (urlID) {
      const level = 'lv' + urlID[5];
      dispatch(getSentences(level));
    }
  }, [dispatch, urlID]);

  useEffect(() => {
    if (sentences.length > 0 && !sentences[0].learned) {
      dispatch(getAiExample({ sentence: sentences[0], level: Number(urlID![5]) }));
    }
  }, [sentences, dispatch, urlID]);

  const handleLearnedButtonClick = async () => {
    if (selectedSentenceData) {
      const index = sentences.findIndex(
        (sentence) => sentence.mission === selectedSentenceData.sentence.substring(5)
      );
      if (index !== -1) {
        await dispatch(learnSentence(sentences[index].missionId));
        
        const remainingUnlearnedSentences = sentences.filter((sentence) => !sentence.learned);
        if (remainingUnlearnedSentences.length === 0) {
          if (confirm('오늘 학습 완료! 캐릭터와 오늘 배운 내용을 사용해보세요!')) {
            navigate('/chat');
          }
        } else {
          dispatch(getAiExample({ sentence: remainingUnlearnedSentences[0], level: Number(urlID![5]) }));
        }
      }
    }
  };

  return (
    <section className='preview-sentence'>
      <div className='preview-sentence-container'>
        {isLoading ? (
          <div className='flex m-auto w-2/3 h-1/3 justify-center items-center mt-10 mb-20'>
            <Spinner loadingText='AI가 예문을 생성중...' />
          </div>
        ) : (
          <div className='sample-sentence-area'>
            <div className='key-sentence-english'>
              <p>{selectedSentenceData && selectedSentenceData.sentence}</p>
              <p>
                {selectedSentenceData &&
                  selectedSentenceData.sentence_translation}
              </p>
            </div>
            <div className='sample-sentence'>
              {selectedSentenceData && (
                <div className='example' key={selectedSentenceData.id}>
                  <div className='pattern-sentence'>
                    <div className='flex p-0'>
                      <p className='sentence-sub-title'>문장 패턴</p>
                      <button type='button'>
                        <LuRepeat
                          onClick={() => {
                            const index = sentences.findIndex(
                              (sentence) =>
                                sentence.mission ===
                                selectedSentenceData?.sentence.substring(5)
                            );
                            dispatch(getAiExample({ sentence: sentences[index], level: Number(urlID![5]) }));
                          }}
                        />
                      </button>
                    </div>
                    <ul>
                      {selectedSentenceData.similar.map((similar, index) => (
                        <li key={index}>
                          <p className='english'>{similar}</p>
                          <p className='korean'>
                            {selectedSentenceData.similar_translation[index]}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className='dialog'>
                    <p className='sentence-sub-title'>대화문</p>
                    <p className='english'>
                      {selectedSentenceData.dialogue[0]}
                    </p>
                    <p className='korean'>
                      {selectedSentenceData.dialogue_translation[0]}
                    </p>
                    <p className='english'>
                      {selectedSentenceData.dialogue[1]}
                    </p>
                    <p className='korean'>
                      {selectedSentenceData.dialogue_translation[1]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <button
          type='button'
          className='bg-[var(--highlight-color)] text-white'
          onClick={handleLearnedButtonClick}
        >
          학습 완료
        </button>

        <div className='three-sentence-area'>
          <h3 className='sentence-sub-title'>하루 3문장</h3>
          <ul>
            {sentences.map((sentence, i) => (
              <li
                key={i}
                onClick={() => {
                  dispatch(getAiExample({ sentence, level: Number(urlID![5]) }));
                }}
              >
                <span
                  className={`number-btn cursor-pointer ${
                    sentence.learned ? 'active' : ''
                  }`}
                >
                  {i + 1}
                </span>
                <span>{sentence.mission}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
