import { useState, useRef } from "react";
import { generateMnemonic } from "bip39";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Copy, Download, Eye, EyeOff, Upload } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

function WalletSetup() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importPhrase, setImportPhrase] = useState<string[]>(
    Array(12).fill("")
  );
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createNewWallet = async () => {
    const newMnemonic = await generateMnemonic();
    setMnemonic(newMnemonic);
    setShowMnemonic(true);
    setShowImport(false);
    toast.success("New wallet created successfully!");
  };

  const copyToClipboard = () => {
    if (mnemonic) {
      navigator.clipboard.writeText(mnemonic);
      toast.success("Recovery phrase copied to clipboard!");
    }
  };

  const downloadRecoveryPhrase = () => {
    if (!mnemonic) return;

    const element = document.createElement("a");
    const file = new Blob(
      [
        `Multi-Chain Wallet Recovery Phrase\n\n` +
          `Created: ${new Date().toLocaleString()}\n\n` +
          `IMPORTANT: Keep this phrase SECURE and NEVER share it with anyone!\n\n` +
          `Your 12-word recovery phrase:\n` +
          mnemonic
            .split(" ")
            .map((word, index) => `${index + 1}. ${word}`)
            .join("\n") +
          `\n\n` +
          `Instructions:\n` +
          `1. Write down these words in exact order\n` +
          `2. Store in a secure location (offline)\n` +
          `3. Never share with anyone\n` +
          `4. Use to restore wallet if needed`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `wallet-recovery-phrase-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Recovery phrase downloaded!");
  };

  const handleNext = () => {
    if (mnemonic) {
      // Store mnemonic in localStorage or context
      localStorage.setItem("mnemonic", mnemonic);
      navigate("/select-network");
      toast.success("Wallet saved! Proceeding to network selection.");
    }
  };

  const handleImportClick = () => {
    setShowImport(!showImport);
    setMnemonic("");
  };

  const handleImportChange = (index: number, value: string) => {
    const newPhrase = [...importPhrase];
    newPhrase[index] = value.toLowerCase().trim();
    setImportPhrase(newPhrase);

    // Auto-focus next input
    if (value.length >= 3 && index < 11) {
      const nextInput = document.getElementById(`word-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleImportSubmit = () => {
    const phrase = importPhrase.join(" ").trim();
    if (phrase.split(" ").filter(Boolean).length === 12) {
      setMnemonic(phrase);
      setShowMnemonic(true);
      setShowImport(false);
      toast.success("Wallet imported successfully!");
    } else {
      toast.error("Please enter all 12 words correctly");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Extract words from text file
        const words = content
          .toLowerCase()
          .replace(/[^a-z\s]/g, " ")
          .split(/\s+/)
          .filter((word) => word.length > 0)
          .slice(0, 12);

        if (words.length === 12) {
          setImportPhrase(words);
          toast.success("Recovery phrase loaded from file!");
        } else {
          toast.error("File must contain exactly 12 valid words");
        }
      } catch (error) {
        toast.error("Failed to read file");
      }
    };
    reader.readAsText(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const words = pastedText
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((word) => /^[a-z]+$/.test(word))
      .slice(0, 12);

    if (words.length === 12) {
      setImportPhrase(words);
      toast.success("12 words pasted successfully!");
      setTimeout(() => {
        document.getElementById("word-0")?.focus();
      }, 100);
    } else {
      toast.error("Please paste exactly 12 words");
    }
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
              Step 1: Create or Import Your Wallet
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Wallet Setup Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl p-8 transition-colors duration-200">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Wallet Setup
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              onClick={createNewWallet}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-lg flex items-center justify-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">+</span>
              </div>
              Create New Wallet
            </button>

            <button
              onClick={handleImportClick}
              className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200 font-medium flex items-center justify-center gap-3"
            >
              <Upload size={20} />
              Import Existing Wallet
            </button>
          </div>

          {/* Import Section */}
          {showImport && (
            <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-xl animate-fadeIn">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                <Upload size={20} />
                Import Recovery Phrase
              </h3>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Enter your 12-word recovery phrase:
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <Upload size={14} />
                    Upload from file
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.text"
                  className="hidden"
                />

                <div
                  className="p-4 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-700 mb-4 cursor-text"
                  onClick={() => document.getElementById("word-0")?.focus()}
                  onPaste={handlePaste}
                >
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 text-center">
                    Paste your phrase here (12 words) or click to upload file
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="relative">
                        <label className="absolute -top-2 left-2 px-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700">
                          {index + 1}
                        </label>
                        <input
                          id={`word-${index}`}
                          type={showMnemonic ? "text" : "password"}
                          value={importPhrase[index]}
                          onChange={(e) =>
                            handleImportChange(index, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 focus:outline-none text-center font-medium"
                          placeholder="..."
                          maxLength={15}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportPhrase(Array(12).fill(""));
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportSubmit}
                  disabled={importPhrase.filter(Boolean).length < 12}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import Wallet
                </button>
              </div>
            </div>
          )}

          {/* Recovery Phrase Display */}
          {mnemonic && !showImport && (
            <div className="mt-8 animate-slideUp">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Recovery Phrase
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMnemonic(!showMnemonic)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
                  >
                    {showMnemonic ? (
                      <>
                        <EyeOff size={16} />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Show
                      </>
                    )}
                  </button>

                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Copy size={16} />
                    Copy
                  </button>

                  <button
                    onClick={downloadRecoveryPhrase}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              {showMnemonic && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-900 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center text-yellow-600 dark:text-yellow-300 shrink-0">
                      ⚠️
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                        Security Warning
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        Never share your recovery phrase! Anyone with these 12
                        words can access your funds.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {mnemonic.split(" ").map((word, index) => (
                      <div
                        key={index}
                        className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-yellow-300 dark:border-yellow-600 rounded-lg px-4 py-3 text-center relative hover:shadow-md transition-shadow group"
                      >
                        <div className="absolute -top-2 left-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 text-xs font-bold rounded-full">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg tracking-wide">
                          {word}
                        </span>
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400 dark:group-hover:border-yellow-500 rounded-lg transition-colors pointer-events-none"></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-yellow-700 font-medium flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Write down in order • Store offline • Never share
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                  Next: Select Network
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!mnemonic && !showImport && (
            <div className="mt-8 p-8 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-2xl text-gray-500">🔐</span>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Wallet Created Yet
              </h3>
              <p className="text-gray-500">
                Create a new wallet or import an existing one to get started
              </p>
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Security Tips
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              Never share recovery phrase with anyone
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              Store offline (paper, metal backup)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              No screenshots or digital copies
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              Test recovery before adding funds
            </li>
          </ul>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default WalletSetup;
