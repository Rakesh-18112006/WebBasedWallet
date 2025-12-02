import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SolanaWallet from "../Wallets/SolanaWallet";
import EthWallet from "../Wallets/EthWallet";
import {
  fetchSolanaBalance,
  fetchEthereumBalance,
} from "../utils/balanceUtils";
import { ThemeToggle } from "../components/ThemeToggle";

function GenerateAccounts() {
  const navigate = useNavigate();
  const [mnemonic, setMnemonic] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<"solana" | "ethereum">(
    "solana"
  );
  const [showPrivateKeys, setShowPrivateKeys] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedAccount, setSelectedAccount] = useState<{
    address: string;
    balance: number;
  } | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");
    const storedNetwork = localStorage.getItem("selectedNetwork") as
      | "solana"
      | "ethereum"
      | null;

    if (!storedMnemonic || !storedNetwork) {
      navigate("/");
      return;
    }

    setMnemonic(storedMnemonic);
    setSelectedNetwork(storedNetwork);
  }, [navigate]);

  const togglePrivateKey = (index: number) => {
    setShowPrivateKeys((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAccountSelect = async (
    account: { address: string; privateKey?: any } | null
  ) => {
    if (!account) {
      setSelectedAccount(null);
      return;
    }

    setBalanceLoading(true);
    try {
      let balance = 0;
      if (selectedNetwork === "solana") {
        balance = await fetchSolanaBalance(account.address);
      } else {
        balance = await fetchEthereumBalance(account.address);
      }
      setSelectedAccount({ address: account.address, balance });
    } catch (error) {
      console.error("Error fetching balance:", error);
      setSelectedAccount({ address: account.address, balance: 0 });
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/select-network");
  };

  const handleChangeNetwork = () => {
    navigate("/select-network");
  };

  if (!mnemonic) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-900 dark:from-gray-900 dark:to-gray-950 p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header with Theme Toggle */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Multi-Chain Wallet
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Step 3: Generate and Manage Accounts
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Network Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Active Network
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-900 rounded-xl p-4 mb-4 border border-blue-100 dark:border-blue-800">
                <p className="text-center text-xl font-semibold text-blue-700 dark:text-blue-300 capitalize">
                  {selectedNetwork}
                </p>
              </div>
              <button
                onClick={handleChangeNetwork}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 font-medium"
              >
                Change Network
              </button>
            </div>

            {/* Mnemonic Display */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Recovery Phrase
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300 mb-3">
                  🔒 Your secret recovery phrase
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {mnemonic.split(" ").map((word, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-center"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {index + 1}.{" "}
                      </span>
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Accounts */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {selectedNetwork === "solana" ? "Solana" : "Ethereum"}{" "}
                  Accounts
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Wallet Connected
                </div>
              </div>

              {/* Account Generation */}
              <div className="mb-8">
                {selectedNetwork === "solana" ? (
                  <SolanaWallet
                    mnemonic={mnemonic}
                    showPrivateKeys={showPrivateKeys}
                    togglePrivateKey={togglePrivateKey}
                    onAccountSelect={handleAccountSelect}
                  />
                ) : (
                  <EthWallet
                    mnemonic={mnemonic}
                    showPrivateKeys={showPrivateKeys}
                    togglePrivateKey={togglePrivateKey}
                    onAccountSelect={handleAccountSelect}
                  />
                )}
              </div>

              {/* Account Details Section */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Account Details
                </h3>
                {selectedAccount ? (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Balance
                        </p>
                        <div className="flex items-center gap-2">
                          {balanceLoading && (
                            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                          )}
                          <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {balanceLoading
                              ? "Loading..."
                              : `${selectedAccount.balance.toFixed(4)} ${
                                  selectedNetwork === "solana" ? "SOL" : "ETH"
                                }`}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Network
                        </p>
                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
                          {selectedNetwork}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Status
                        </p>
                        <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                          Connected
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300 break-all font-mono">
                        {selectedAccount.address}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6">
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                      <p className="text-lg">
                        👈 Select an account to view details and balance
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleBack}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all duration-200 font-medium"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default GenerateAccounts;
