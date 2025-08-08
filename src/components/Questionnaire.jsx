import React, { useState } from 'react';
import questions from '../data/questions';

const QUESTIONS_PER_PAGE = 10;

/**
 * Questionnaire component renders the paginated MAI survey. Users
 * progress through 10 questions per page (with the final page
 * containing the remaining questions). After the questions are
 * completed, an information form appears to collect the student's
 * identifying details. Once submitted, the `onComplete` callback is
 * invoked with the answers and user info.
 *
 * Props:
 * - onComplete: (answers: number[], info: object) => void
 */
function Questionnaire({ onComplete }) {
  const totalQuestionPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  // currentStep ranges from 0..totalQuestionPages for question pages, and equal to totalQuestionPages for the info form
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [info, setInfo] = useState({ name: '', age: '', school: '', grade: '' });

  const handleAnswer = (questionId, value) => {
    const index = questions.findIndex(q => q.id === questionId);
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const handleNext = () => {
    // Do not allow advancing past the info form.
    setCurrentStep(prev => Math.min(prev + 1, totalQuestionPages));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleInfoChange = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass results to parent component
    onComplete(answers, info);
  };

  // Determine which questions appear on the current step
  const startIndex = currentStep * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  // Check whether the current page is fully answered
  const isPageAnswered = currentQuestions.every((q) => answers[q.id - 1] !== null);

  // Progress bar computation: how many of the 52 questions have been answered
  const totalAnswered = answers.filter((a) => a !== null).length;
  const progressPercent = (totalAnswered / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {currentStep < totalQuestionPages ? (
        <div>
          {/* Progress bar */}
          <div className="mb-4">
            <div
              style={{
                backgroundColor: '#e5e7eb',
                height: '8px',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: '#3b82f6',
                  height: '8px',
                }}
              />
            </div>
          </div>
          <div className="mb-4 flex justify-between items-center text-sm">
            <span>第 {startIndex + 1}–{endIndex} 题，共 52 题</span>
            <span>页面 {currentStep + 1} / {totalQuestionPages}</span>
          </div>
          <div className="space-y-4">
            {currentQuestions.map((q) => (
              <div key={q.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <p className="font-medium mb-2">
                  {q.id}. {q.zh}
                </p>
                <p className="text-sm mb-3">{q.text}</p>
                <div className="flex space-x-4">
                  {/* True button */}
                  <button
                    type="button"
                    onClick={() => handleAnswer(q.id, 1)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      backgroundColor:
                        answers[q.id - 1] === 1 ? '#3b82f6' : '#ffffff',
                      color:
                        answers[q.id - 1] === 1 ? '#ffffff' : '#000000',
                      cursor: 'pointer',
                    }}
                  >
                    True（是）
                  </button>
                  {/* False button */}
                  <button
                    type="button"
                    onClick={() => handleAnswer(q.id, 0)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      backgroundColor:
                        answers[q.id - 1] === 0 ? '#3b82f6' : '#ffffff',
                      color:
                        answers[q.id - 1] === 0 ? '#ffffff' : '#000000',
                      cursor: 'pointer',
                    }}
                  >
                    False（否）
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                上一页
              </button>
            )}
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isPageAnswered}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: isPageAnswered ? '#3b82f6' : '#d1d5db',
                color: isPageAnswered ? '#ffffff' : '#6b7280',
                cursor: isPageAnswered ? 'pointer' : 'not-allowed',
              }}
            >
              {currentStep + 1 === totalQuestionPages ? '去填写信息' : '下一页'}
            </button>
          </div>
        </div>
      ) : (
        // Info form
        <form onSubmit={handleSubmit} className="bg-white shadow-sm p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">填写个人信息</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">姓名</label>
            <input
              type="text"
              value={info.name}
              onChange={(e) => handleInfoChange('name', e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">年龄</label>
            <input
              type="number"
              value={info.age}
              onChange={(e) => handleInfoChange('age', e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">学校</label>
            <input
              type="text"
              value={info.school}
              onChange={(e) => handleInfoChange('school', e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">年级</label>
            <input
              type="text"
              value={info.grade}
              onChange={(e) => handleInfoChange('grade', e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handlePrev}
              style={{
                marginRight: '1rem',
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: '#e5e7eb',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              上一页
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              查看结果
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Questionnaire;