import { useState } from 'react'
import PathResult from './components/PathResult'
import './App.css'

const QUESTIONS = [
  {
    text: 'What do you already know about this?',
    key: 'level',
    options: [
      'Nothing — complete beginner',
      'A little (some basics)',
      'Some foundation (intermediate)',
      'Quite a bit (just filling gaps)',
    ],
  },
  {
    text: "What hasn't worked for you before?",
    key: 'what_hasnt_worked',
    options: [
      'Textbooks / reading-heavy content',
      'Video courses (too slow/passive)',
      'Apps like Duolingo (too gamified)',
      "Nothing — I haven't tried yet",
    ],
  },
  {
    text: 'How much time per day can you commit?',
    key: 'time_per_day',
    options: ['15 minutes', '30 minutes', '1 hour', '2+ hours'],
  },
]

export default function App() {
  const [screen, setScreen] = useState('goal')
  const [goal, setGoal] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [path, setPath] = useState(null)

  function handleGoalSubmit() {
    if (!goal.trim()) return
    setScreen('questions')
  }

  async function handleAnswer(value) {
    const question = QUESTIONS[questionIndex]
    const newAnswers = { ...answers, [question.key]: value }
    setAnswers(newAnswers)

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1)
    } else {
      setScreen('loading')
      await generatePath(newAnswers)
    }
  }

  async function generatePath(finalAnswers) {
    try {
      const response = await fetch('http://localhost:8000/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          level: finalAnswers.level,
          what_hasnt_worked: finalAnswers.what_hasnt_worked,
          time_per_day: finalAnswers.time_per_day,
        }),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let raw = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        raw += decoder.decode(value)
      }

      setPath(JSON.parse(raw))
      setScreen('result')
    } catch (err) {
      console.error('Error generating path:', err)
    }
  }

  if (screen === 'goal') {
    return (
      <div className="page">
        <h1 className="logo">Fori</h1>
        <div className="input-group">
          <input
            className="goal-input"
            type="text"
            placeholder="What do you want to learn?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGoalSubmit()}
            autoFocus
          />
          <button
            className="submit-btn"
            onClick={handleGoalSubmit}
            disabled={!goal.trim()}
          >
            Build my path →
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'questions') {
    const question = QUESTIONS[questionIndex]
    return (
      <div className="page">
        <h1 className="logo">Fori</h1>
        <div className="question-group">
          <p className="question-progress">{questionIndex + 1} / {QUESTIONS.length}</p>
          <h2 className="question-text">{question.text}</h2>
          <div className="options-list">
            {question.options.map((option) => (
              <button
                key={option}
                className="option-btn"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'loading') {
    return (
      <div className="page">
        <h1 className="logo">Fori</h1>
        <p className="loading-text">Building your path…</p>
      </div>
    )
  }

  return (
    <div className="page page--top">
      <h1 className="logo">Fori</h1>
      <PathResult data={path} />
    </div>
  )
}
