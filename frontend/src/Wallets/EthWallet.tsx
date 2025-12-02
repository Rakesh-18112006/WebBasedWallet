// Wallets/EthWallet.tsx
import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface EthWalletProps {
  mnemonic: string;
  showPrivateKeys: { [key: string]: boolean };
  togglePrivateKey: (index: number) => void;
  onAccountSelect?: (
    account: { address: string; privateKey: string } | null
  ) => void;
}

function EthWallet({
  mnemonic,
  showPrivateKeys,
  togglePrivateKey,
  onAccountSelect,
}: EthWalletProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accounts, setAccounts] = useState<
    { address: string; privateKey: string }[]
  >([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const generateKeys = async () => {
    if (!mnemonic) return;

    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const wallet = new Wallet(child.privateKey);

    setAccounts([
      ...accounts,
      {
        address: wallet.address,
        privateKey: child.privateKey,
      },
    ]);
    setCurrentIndex(currentIndex + 1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <button
        onClick={generateKeys}
        disabled={!mnemonic}
        className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
          mnemonic
            ? "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 shadow-md hover:shadow-lg"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Generate New Ethereum Address
      </button>

      {accounts.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Accounts</h3>
          <div className="space-y-3">
            {accounts.map((account, index) => (
              <div
                key={index}
                className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:border-blue-300 ${
                  selectedAccount === index
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  setSelectedAccount(index);
                  onAccountSelect?.(account);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Account {index + 1}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 font-mono truncate max-w-[200px]">
                          {account.address}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(account.address);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePrivateKey(index);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPrivateKeys[index] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {showPrivateKeys[index] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">
                        Private Key:
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(account.privateKey);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-mono text-gray-800 break-all bg-gray-50 p-2 rounded">
                      {account.privateKey}
                    </p>
                  </div>
                )}

                {selectedAccount === index && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium hover:from-blue-100 hover:to-blue-200 transition-colors">
                        Send
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg font-medium hover:from-green-100 hover:to-green-200 transition-colors">
                        Receive
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default EthWallet;
