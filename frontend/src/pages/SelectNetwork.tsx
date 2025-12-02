import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";

function SelectNetwork() {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<
    "solana" | "ethereum" | null
  >(null);

  const handleNext = () => {
    if (selectedNetwork) {
      localStorage.setItem("selectedNetwork", selectedNetwork);
      navigate("/generate-accounts");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-900 dark:from-gray-900 dark:to-gray-950 p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        {/* Header with Theme Toggle */}
        <header className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Multi-Chain Wallet
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Step 2: Select Your Network
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Network Selection Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl p-8 transition-colors duration-200">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8">
            Which network would you like to use?
          </h2>

          <div className="space-y-4 mb-8">
            {/* Solana Option */}
            <div
              onClick={() => setSelectedNetwork("solana")}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedNetwork === "solana"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950 dark:border-purple-400"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  {selectedNetwork === "solana" && (
                    <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Solana
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fast, scalable blockchain
                  </p>
                </div>
              </div>
            </div>

            {/* Ethereum Option */}
            <div
              onClick={() => setSelectedNetwork("ethereum")}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedNetwork === "ethereum"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  {selectedNetwork === "ethereum" && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Ethereum
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Most widely used blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 font-medium"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedNetwork}
              className={`flex-1 px-6 py-3 rounded-xl transition-all duration-200 font-medium text-white ${
                selectedNetwork
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              Next: Generate Accounts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectNetwork;
