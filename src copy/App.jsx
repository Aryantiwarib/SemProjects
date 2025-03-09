import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("Add_your_api_key"); // Replace with your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function App() {
  const [emailInput, setEmailInput] = useState("");
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState(""); // User feedback for refining response
  const [loading, setLoading] = useState(false);

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
      <div className={`flex h-screen w-full p-11 overflow-hidden`}>
      {/* Left Part */}
      <div className={`${response ? "w-1/2" : "w-full h-full ml-96"} p-4`}>
        <h2 className="font-bold mb-4 text-2xl text-black">{response ? "Email Input Box:" : "Email AI Responder" }</h2>
        <textarea
          cols = "80"
          rows="20"
          placeholder="Paste the email content here..."
          value=  {emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="w-full mb-8 border rounded bg-gray-200 text-black p-4 overflow-y-scroll scrollbar-hide"
          readOnly={response ? true : false}
        />
        <div className="flex justify-center">
        <button
          onClick={() => generateResponse("initial")}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 "
        >
        
          {loading ? "Generating..." : "Generate Response"}
        </button>
        </div>
      </div>

      {/* Right Part */}
      {response && (
        <div className={`${response ? "w-1/2 h-screen" : "hidden"} p-4`}>
          <h3 className="text-2xl font-semibold mb-4 text-black">AI Response:</h3>
          <div className="h-3/6 mb-6 overflow-y-scroll scrollbar-hide">
          <p className="text-left bg-gray-100 p-2 mb-4 whitespace-pre-line w-full text-black">
            {response}
          </p>
          </div>
          {/* <div className="flex flex-col justify-center items-center"> */}
          <button
            onClick={() => generateResponse("refine")}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 mb-4"
          >
            {loading ? "Refining..." : "Refine"}
          </button>
          {/* </div> */}
          <div className="flex flex-col fixed bottom-13">
            <h4 className="text-2xl font-semibold mb-2 text-black mb-0">Custom Response:</h4>
            <textarea
              rows="1"
              cols="85"
              placeholder="Describe how you want to refine the response..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="p-2 mb-4 border rounded-lg"
            />
            <button
              onClick={() => generateResponse("custom")}
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
            >
              {loading ? "Applying Changes..." : "Apply Custom Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
