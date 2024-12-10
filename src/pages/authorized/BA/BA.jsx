import React, { useState } from 'react'

const BA = () => {

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleAddAnswer = () => {
    if (answers.length < 4) {
      setAnswers([...answers, { value: "", isChecked: false }]);
    }
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = answers.map((answer, idx) =>
      idx === index ? { ...answer, [field]: value } : answer
    );
    setAnswers(updatedAnswers);
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = answers.filter((_, idx) => idx !== index);
    setAnswers(updatedAnswers);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!question.trim()) formErrors.question = "Question is required";

    if (answers.length === 0) {
      formErrors.answers = "At least one answer is required";
    } else {
      const filledAnswers = answers.filter((a) => a.value.trim());
      const checkedAnswers = answers.filter((a) => a.isChecked);

      if (filledAnswers.length < answers.length) {
        formErrors.filledAnswers = "Remove extra empty answer fields";
      }

      if (checkedAnswers.length === 0) {
        formErrors.checkedAnswers = "Please check at least one answer field";
      } else if (
        allowMultiple &&
        checkedAnswers.length !== filledAnswers.length
      ) {
        formErrors.checkedAnswers =
          "Please select all answer fields when multiple answers are allowed";
      } else if (!allowMultiple && checkedAnswers.length > 1) {
        formErrors.checkedAnswers =
          "Uncheck multiple answers when multiple answers are not allowed";
      }

      if (!allowMultiple && answers.length > 1) {
        formErrors.allowMultiple =
          "Add only one answer when multiple answers are not allowed";
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log({
        question,
        answers,
        allowMultiple,
        isRequired,
      });
    }
  };

  return (
    <div>
       <div className="modal">
            <h2>Create MCQ</h2>
            <div>
            <input
                type="text"
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            {errors.question && <p className="error">{errors.question}</p>}
            </div>

            {answers.map((answer, index) => (
                <div key={index} className="answer-field">
                    <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={answer.value}
                        onChange={(e) =>
                            handleAnswerChange(index, "value", e.target.value)
                        }
                    />
                    <input
                        type="checkbox"
                        checked={answer.isChecked}
                        onChange={(e) =>
                            handleAnswerChange(index, "isChecked", e.target.checked)
                        }
                    />
                    <button onClick={() => handleRemoveAnswer(index)}>X</button>
                </div>
            ))}

            {errors.answers && <p className="error">{errors.answers}</p>}
            {errors.filledAnswers && <p className="error">{errors.filledAnswers}</p>}
            {errors.checkedAnswers && (
            <p className="error">{errors.checkedAnswers}</p>
            )}
            {errors.allowMultiple && <p className="error">{errors.allowMultiple}</p>}

            <button
            onClick={handleAddAnswer}
            disabled={answers.length >= 4}
            >
            Add Answer
            </button>

            <div>
            <label>
                Allow Multiple Answers
                <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
                />
            </label>
            <label>
                Is Required
                <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                />
            </label>
            </div>

            <button onClick={handleSubmit}>Create</button>
        </div>
    </div>
  )
}

export default BA
