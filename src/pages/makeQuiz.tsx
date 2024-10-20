import React, { useState, ChangeEvent, FormEvent } from 'react';
import '../styles/makeQuiz.css'; // Import the new CSS file
import { postQuiz } from '../api'; // Import the postQuiz function

interface Question {
  id: number; // Changed from string to number for sequential IDs
  options: string[];
  earnings: number;
  question: string; // Made required to ensure consistency
  correctOptionIndex: number | null; // Added to track the correct option
}

interface QuizData {
  name: string;
  questions: Question[];
  answers: { [key: string]: string }; // Added answers object
  metadata: {
    category: string;
    difficulty: string;
    earnings: number[];
  };
  live_at_date: string; // Updated to match sample JSON key
}

const QuizForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [nextId, setNextId] = useState<number>(1); // Added state for sequential IDs

  // Removed useEffect to start with no questions initially

  // Function to add a new question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: nextId, // Assign the current nextId as the question ID
      options: ['', '', '', ''],
      earnings: 0,
      question: '',
      correctOptionIndex: null, // Initialize as null
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    setNextId((prevId) => prevId + 1); // Increment nextId for the next question
  };

  // Function to handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: keyof Question,
    optionIndex?: number
  ) => {
    const updatedQuestions = [...questions];
    if (field === 'options' && optionIndex !== undefined) {
      updatedQuestions[index].options[optionIndex] = e.target.value;
    } else if (field === 'earnings') {
      const parsedValue = parseInt(e.target.value, 10);
      updatedQuestions[index][field] = isNaN(parsedValue) ? 0 : parsedValue;
    } else if (field === 'question') {
      updatedQuestions[index][field] = e.target.value;
    }
    setQuestions(updatedQuestions);
  };

  // Function to handle selecting the correct option via dropdown
  const handleCorrectOptionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    const optionIndex = parseInt(value, 10);
    updatedQuestions[index].correctOptionIndex = isNaN(optionIndex) ? null : optionIndex;
    setQuestions(updatedQuestions);
  };

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Extracting form fields
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const difficulty = formData.get('difficulty') as string;
    const liveAtDateInput = formData.get('liveAtDate') as string;

    // Validate and parse the date
    const istDate = new Date(liveAtDateInput);
    if (isNaN(istDate.getTime())) {
      alert('Invalid date format. Please enter a valid date.');
      return;
    }
    const utcDate = new Date(istDate.getTime() - istDate.getTimezoneOffset() * 60000);
    const live_at_date = utcDate.toISOString(); // Updated key name

    // Validate that each question has a correct option selected
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (
        q.correctOptionIndex === null ||
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex >= q.options.length
      ) {
        alert(`Please select a correct option for Question ${i + 1}.`);
        return;
      }
    }

    // Construct the answers object
    const answers: { [key: string]: string } = {};
    questions.forEach((q, idx) => {
      const key = `q${idx + 1}`; // Using sequential numbering for keys
      const selectedAnswer = q.options[q.correctOptionIndex!];
      answers[key] = selectedAnswer;
    });

    // Construct the QuizData object
    const quizData: QuizData = {
      name,
      questions,
      answers, // Include answers
      metadata: {
        category,
        difficulty,
        earnings: questions.map((q) => q.earnings),
      },
      live_at_date, // Updated key name
    };

    try {
      // Call postQuiz and handle the response
      const response = await postQuiz(quizData);
      console.log('Quiz posted successfully:', response);
      alert('Quiz posted successfully!');
    } catch (error) {
      console.error('Failed to post quiz:', error);
      alert('Failed to post quiz. Please try again.');
    }
  };

  // Function to remove a question
  const removeQuestion = (id: number) => {
    const updatedQuestions = questions.filter((question) => question.id !== id);
    setQuestions(updatedQuestions);
  };

  // Function to copy JSON to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput).then(
      () => {
        alert('JSON copied to clipboard!');
      },
      (err) => {
        alert('Failed to copy JSON: ' + err);
      }
    );
  };

  return (
    <div className="quiz-form-container">
      <h1>Quiz Data Entry Form</h1>
      <form id="quizForm" onSubmit={handleSubmit}>
        <label htmlFor="name">Quiz Name:</label>
        <input type="text" id="name" name="name" required />

        <h2>Questions</h2>
        <div id="questionsContainer">
          {questions.map((question, index) => (
            <div key={question.id} className="question-block">
              <label htmlFor={`q${index + 1}`}>Question {index + 1}:</label>
              <input
                type="text"
                id={`q${index + 1}`}
                name={`q${index + 1}`}
                value={question.question}
                onChange={(e) => handleInputChange(e, index, 'question')}
                required
              />

              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="option-block">
                  <label htmlFor={`q${index + 1}o${optionIndex + 1}`}>Option {optionIndex + 1}:</label>
                  <input
                    type="text"
                    id={`q${index + 1}o${optionIndex + 1}`}
                    name={`q${index + 1}o${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleInputChange(e, index, 'options', optionIndex)}
                    required
                  />
                </div>
              ))}

              <label htmlFor={`q${index + 1}correct`}>Select Correct Option:</label>
              <select
                id={`q${index + 1}correct`}
                name={`q${index + 1}correct`}
                value={question.correctOptionIndex !== null ? question.correctOptionIndex.toString() : ''}
                onChange={(e) => handleCorrectOptionChange(index, e.target.value)}
                required
              >
                <option value="">Select Correct Option</option>
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    Option {optionIndex + 1}
                  </option>
                ))}
              </select>

              <label htmlFor={`q${index + 1}earnings`}>Earnings:</label>
              <input
                type="number"
                id={`q${index + 1}earnings`}
                name={`q${index + 1}earnings`}
                value={question.earnings}
                onChange={(e) => handleInputChange(e, index, 'earnings')}
                required
              />
              <button type="button" onClick={() => removeQuestion(question.id)}>
                Remove Question
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>

        <h2>Metadata</h2>
        <label htmlFor="category">Category:</label>
        <input type="text" id="category" name="category" required />

        <label htmlFor="difficulty">Difficulty:</label>
        <select id="difficulty" name="difficulty" required>
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <label htmlFor="liveAtDate">Live At Date (IST):</label>
        <input type="datetime-local" id="liveAtDate" name="liveAtDate" required />

        <button type="submit">Submit Quiz Data</button>
      </form>
      <div id="result"></div>

      {/* The Modal */}
      {modalVisible && (
        <div id="jsonModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalVisible(false)}>
              &times;
            </span>
            <h2>Send this JSON</h2>
            <pre id="jsonOutput">{jsonOutput}</pre>
            <button onClick={handleCopy}>Copy JSON</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizForm;
