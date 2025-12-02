// Wallets/SolanaWallet.tsx
import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface SolanaWalletProps {
  mnemonic: string;
  showPrivateKeys: { [key: string]: boolean };
  togglePrivateKey: (index: number) => void;
  onAccountSelect?: (
    account: { address: string; privateKey: Uint8Array } | null
  ) => void;
}

function SolanaWallet({
  mnemonic,
  showPrivateKeys,
  togglePrivateKey,
  onAccountSelect,
}: SolanaWalletProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accounts, setAccounts] = useState<
    { address: string; privateKey: Uint8Array }[]
  >([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const generateKeys = async () => {
    if (!mnemonic) return;

    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    // @ts-ignore
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    setAccounts([
      ...accounts,
      {
        address: keypair.publicKey.toBase58(),
        privateKey: secret,
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
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Generate New Solana Address
      </button>

      {accounts.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Accounts</h3>
          <div className="space-y-3">
            {accounts.map((account, index) => (
              <div
                key={index}
                className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:border-purple-300 ${
                  selectedAccount === index
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  setSelectedAccount(index);
                  onAccountSelect?.(account);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
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
                          copyToClipboard(
                            Buffer.from(account.privateKey).toString("hex")
                          );
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-mono text-gray-800 break-all bg-gray-50 p-2 rounded">
                      {Buffer.from(account.privateKey).toString("hex")}
                    </p>
                  </div>
                )}

                {selectedAccount === index && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg font-medium hover:from-purple-100 hover:to-purple-200 transition-colors">
                        Send
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium hover:from-blue-100 hover:to-blue-200 transition-colors">
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

export default SolanaWallet;
