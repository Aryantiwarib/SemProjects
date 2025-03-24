import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaMagic, FaEnvelope, FaPaperPlane, FaCommentDots } from "react-icons/fa"; // Import icons

const genAI = new GoogleGenerativeAI("Api_key"); // Replace with your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function App() {
  const [emailInput, setEmailInput] = useState("");
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to toggle functionality

  const generateResponse = async (type) => {
    setLoading(true);

    let prompt = "";
    if (type === "initial") {
      prompt = `Write a professional, well-formatted, and line-separated response to this email. Ensure proper paragraphing and avoid providing multiple options:\n\n"${emailInput}"`;
    } else if (type === "refine") {
      prompt = `Refine and improve this response, ensuring professional tone, accurate information, and proper formatting:\n\n"${response}"`;
    } else if (type === "custom") {
      prompt = `Modify the response based on the given user feedback while keeping it professional and well-structured:\n\nOriginal Response:\n"${response}"\n\nUser Feedback:\n"${feedback}"`;
    }

    try {
      const result = await model.generateContent(prompt);
      const reply = result.response.candidates[0].content.parts[0].text;
      setResponse(reply);
    } catch (error) {
      setResponse("Error generating response.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full p-8 bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden">
      {/* Floating Chatbot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? "hidden" : "fixed bottom-8 right-8 p-6 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all animate-pulse"
        }`}
      >
       <FaEnvelope className="text-2xl" />{/* Chatbot icon */}
      </button>

      {/* Main Functionality (Visible only when isOpen is true) */}
      {isOpen && (
        <div className="flex w-full h-full">
          {/* Left Part - Email Input */}
          <div
            className={`${
              response ? "w-1/2" : "w-full mx-96"
            } p-8 bg-white rounded-xl shadow-2xl transition-all duration-300`}
          >
            {/* Header with Icon */}
            <div className="flex flex-col items-center mb-8">
              <FaEnvelope className="text-6xl text-blue-500 mb-4" /> {/* Email icon */}
              <h2 className="font-bold text-4xl text-blue-900 text-center">
                {response ? "Email Input" : "Email AI Responder"}
              </h2>
              <p className="text-gray-600 text-lg mt-2 text-center">
                Paste your email content below, and let AI craft a professional
                response for you.
              </p>
            </div>

            {/* Email Input Textarea */}
            <textarea
              cols="80"
              rows="12"
              placeholder="Paste the email content here..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full mb-8 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 p-4 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all overflow-y-scroll scrollbar-hide"
              readOnly={!!response}
            />

            {/* Generate Response Button */}
            <div className="flex justify-center">
              <button
                onClick={() => generateResponse("initial")}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <FaPaperPlane className="text-lg" /> {/* Send icon */}
                {loading ? "Generating..." : "Generate Response"}
              </button>
            </div>
          </div>

          {/* Right Part - AI Response */}
          {response && (
            <div className="w-1/2 p-8 ml-8 bg-white rounded-xl shadow-2xl transition-all duration-300">
              <h3 className="text-3xl font-bold mb-6 text-purple-900">
                AI Response
              </h3>
              <div className="h-96 mb-6">
                <p className="text-left bg-gray-50 p-4 h-80 rounded-lg whitespace-pre-line text-gray-700 border-2 border-gray-200 mb-4 overflow-y-scroll scrollbar-hide">
                  {response}
                </p>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => generateResponse("refine")}
                    disabled={loading}
                    className="px-64 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Refining..." : "Refine Response"}
                  </button>
                </div>
              </div>

              {/* Customize Response Section with Icon */}
              <div className="custom-response-container mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <FaMagic className="text-blue-500 text-xl" />{" "}
                  {/* Magic wand icon */}
                  <h4 className="text-xl font-semibold text-blue-900">
                    Customize Response
                  </h4>
                </div>
                <textarea
                  rows="1"
                  placeholder="Describe how you want to refine the response..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-4 overflow-y-scroll scrollbar-hide border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <button
                  onClick={async () => {
                    await generateResponse("custom");
                    setFeedback("");
                  }}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                >
                  {loading ? "Applying Changes..." : "Apply Custom Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
