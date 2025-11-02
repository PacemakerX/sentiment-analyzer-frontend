import { useState } from "react";

function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    aspect: string;
    sentiment: string;
    confidence: number;
    reasoning: string;
    text: string;
  } | null>(null);

  const analyzeSentiment = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to analyze");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // MOCK API - Remove this and use real API when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      // Mock sentiment analysis logic
      const text = inputText.toLowerCase();
      let sentiment = "neutral";
      let confidence = 0.7;
      let aspect = "General";
      let reasoning = "The text appears to have a neutral tone.";

      // Simple keyword-based mock logic
      const positiveWords = [
        "great",
        "excellent",
        "amazing",
        "good",
        "love",
        "wonderful",
        "fantastic",
        "best",
        "awesome",
      ];
      const negativeWords = [
        "bad",
        "terrible",
        "awful",
        "hate",
        "worst",
        "poor",
        "disappointing",
        "useless",
      ];

      const hasPositive = positiveWords.some((word) => text.includes(word));
      const hasNegative = negativeWords.some((word) => text.includes(word));

      if (hasPositive && !hasNegative) {
        sentiment = "positive";
        confidence = 0.85;
        reasoning =
          "The text contains positive language and expressions indicating satisfaction.";
      } else if (hasNegative && !hasPositive) {
        sentiment = "negative";
        confidence = 0.82;
        reasoning =
          "The text contains negative language and expressions indicating dissatisfaction.";
      } else if (hasPositive && hasNegative) {
        sentiment = "neutral";
        confidence = 0.65;
        reasoning =
          "The text contains both positive and negative sentiments, resulting in a mixed or neutral overall tone.";
      }

      // Detect aspect from common keywords
      if (text.includes("camera") || text.includes("photo")) aspect = "Camera";
      else if (text.includes("battery") || text.includes("charge"))
        aspect = "Battery";
      else if (text.includes("screen") || text.includes("display"))
        aspect = "Display";
      else if (
        text.includes("speaker") ||
        text.includes("sound") ||
        text.includes("audio")
      )
        aspect = "Audio";
      else if (text.includes("design") || text.includes("look"))
        aspect = "Design";

      setResult({
        aspect,
        sentiment,
        confidence,
        reasoning,
        text: inputText,
      });

      /* REAL API CODE - Uncomment when backend is ready:
      const response = await fetch('http://127.0.0.1:8000/api/v1/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          review_text: inputText,
          include_baseline: true 
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const ragResults = data.rag_results[0];
      
      setResult({
        aspect: ragResults.aspect,
        sentiment: ragResults.sentiment,
        confidence: ragResults.confidence,
        reasoning: ragResults.reasoning,
        text: inputText,
      });
      */
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      alert("Failed to analyze sentiment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200";
      case "negative":
        return "text-red-600 bg-red-50 border-red-200";
      case "neutral":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "😊";
      case "negative":
        return "😞";
      case "neutral":
        return "😐";
      default:
        return "🤔";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-3">
            Sentiment Analyzer
          </h1>
          <p className="text-gray-600 text-lg">
            Analyze the emotional tone of any text instantly
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Input Section */}
          <div className="mb-6">
            <label
              htmlFor="textInput"
              className="block text-sm font-semibold text-gray-700 mb-2">
              Enter text to analyze
            </label>
            <textarea
              id="textInput"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-2">
              {inputText.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={analyzeSentiment}
            disabled={isLoading || !inputText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              "Analyze Sentiment"
            )}
          </button>

          {/* Result Section */}
          {result && (
            <div className="mt-6 pt-6 border-t-2 border-gray-100 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Analysis Result
              </h3>

              {/* Aspect Badge */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Aspect:
                </span>
                <div className="mt-1 inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold ml-2">
                  {result.aspect}
                </div>
              </div>

              {/* Sentiment Badge */}
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 text-lg font-bold mb-4 ${getSentimentColor(
                  result.sentiment
                )}`}>
                <span className="text-2xl">
                  {getSentimentEmoji(result.sentiment)}
                </span>
                <span className="capitalize">{result.sentiment}</span>
              </div>

              {/* Confidence Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Confidence
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${result.confidence * 100}%` }}></div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  💡 Reasoning:
                </p>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {result.reasoning}
                </p>
              </div>

              {/* Analyzed Text */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Analyzed Text:
                </p>
                <p className="text-gray-600 italic">"{result.text}"</p>
              </div>

              {/* Clear Button */}
              <button
                onClick={() => {
                  setResult(null);
                  setInputText("");
                }}
                className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200">
                Analyze Another Text
              </button>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Powered by AI • Fast & Accurate Sentiment Analysis
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;
