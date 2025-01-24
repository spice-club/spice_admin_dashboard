import React, { ChangeEvent, FormEvent, useState } from "react";
import { postQuiz } from "../api"; // Import the postQuiz function
import "../styles/makeQuiz.css"; // Import the new CSS file

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
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [nextId, setNextId] = useState<number>(1); // Added state for sequential IDs

  // Removed useEffect to start with no questions initially

  // Function to add a new question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: nextId, // Assign the current nextId as the question ID
      options: ["", "", "", ""],
      earnings: 0,
      question: "",
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
    if (field === "options" && optionIndex !== undefined) {
      updatedQuestions[index].options[optionIndex] = e.target.value;
    } else if (field === "earnings") {
      const parsedValue = parseInt(e.target.value, 10);
      updatedQuestions[index][field] = isNaN(parsedValue) ? 0 : parsedValue;
    } else if (field === "question") {
      updatedQuestions[index][field] = e.target.value;
    }
    setQuestions(updatedQuestions);
  };

  // Function to handle selecting the correct option via dropdown
  const handleCorrectOptionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    const optionIndex = parseInt(value, 10);
    updatedQuestions[index].correctOptionIndex = isNaN(optionIndex)
      ? null
      : optionIndex;
    setQuestions(updatedQuestions);
  };

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Extracting form fields
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const difficulty = formData.get("difficulty") as string;
    const liveAtDateInput = formData.get("liveAtDate") as string;

    // Validate and parse the date
    const istDate = new Date(liveAtDateInput);
    if (isNaN(istDate.getTime())) {
      alert("Invalid date format. Please enter a valid date.");
      return;
    }
    const utcDate = new Date(
      istDate.getTime() - istDate.getTimezoneOffset() * 60000
    );
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
      console.log("Quiz posted successfully:", response);
      alert("Quiz posted successfully!");
    } catch (error) {
      console.error("Failed to post quiz:", error);
      alert("Failed to post quiz. Please try again.");
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
        alert("JSON copied to clipboard!");
      },
      (err) => {
        alert("Failed to copy JSON: " + err);
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-4 sm:my-12 p-4 sm:p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl" />

      <div className="relative">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Quiz Data Entry Form
        </h2>

        <form
          id="quizForm"
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-8"
        >
          <div className="space-y-4">
            <label htmlFor="name" className="block text-gray-200 font-medium">
              Quiz Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div id="questionsContainer" className="space-y-6 sm:space-y-8">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 sm:space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-gray-200">
                    Question {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 
                      transition-all duration-300"
                  >
                    Remove
                  </button>
                </div>

                {/* Question input */}
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleInputChange(e, index, "question")}
                  placeholder="Enter question"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                    text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                />

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {question.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleInputChange(e, index, "options", optionIndex)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                        text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                        focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                    />
                  ))}
                </div>

                {/* Correct option selector */}
                <select
                  value={
                    question.correctOptionIndex !== null
                      ? question.correctOptionIndex.toString()
                      : ""
                  }
                  onChange={(e) =>
                    handleCorrectOptionChange(index, e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                    text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                    focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Correct Option</option>
                  {question.options.map((_, optionIndex) => (
                    <option key={optionIndex} value={optionIndex}>
                      Option {optionIndex + 1}
                    </option>
                  ))}
                </select>

                {/* Earnings input */}
                <input
                  type="number"
                  value={question.earnings}
                  onChange={(e) => handleInputChange(e, index, "earnings")}
                  placeholder="Earnings"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                    text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="w-full py-3 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 
              rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/25 
              transition-all duration-300 hover:opacity-90"
          >
            Add Question
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-gray-200 font-medium">
                Category:
              </label>
              <input
                type="text"
                name="category"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                  text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                  focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-gray-200 font-medium">
                Difficulty:
              </label>
              <select
                name="difficulty"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                  text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                  focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-200 font-medium">
              Live At Date (IST):
            </label>
            <input
              type="datetime-local"
              name="liveAtDate"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                focus:border-transparent transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 
              rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/25 
              transition-all duration-300 hover:opacity-90"
          >
            Submit Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
