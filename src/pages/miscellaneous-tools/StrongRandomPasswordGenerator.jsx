import { useState, useEffect } from "react";
import BuyMeACoffee from "../../components/BuyMeACoffee";
import CommentsSection from "../../components/CommentsSection";
import BrowserExtensionBanner from "../../components/BrowserExtensionBanner";
import SimilarTools from "../../components/SimilarTools";
import CustomSelect from "../../components/CustomSelect";
import toast from 'react-hot-toast';
import ToolsDetailPageHeader from "../../components/ToolsDetailPageHeader";
import strongRandomPasswordGenerator from "../../images/detail-page-images/strongRandomPasswordGenerator.svg";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:'\",.<>/?`~";

const CONFUSING = "il1Lo0O";
const AMBIGUOUS = "{}[]()/\\'\"`~,;:.<>";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeConfusing: false,
    excludeAmbiguous: false,
  });

  // Options for CustomSelect
  const lengthOptions = [8, 10, 12, 14, 16, 20, 24, 32].map(num => ({
    value: num.toString(),
    name: `${num} characters`
  }));

  const generatePassword = () => {
    let charset = "";

    if (options.lowercase) charset += LOWERCASE;
    if (options.uppercase) charset += UPPERCASE;
    if (options.numbers) charset += NUMBERS;
    if (options.symbols) charset += SYMBOLS;

    if (options.excludeConfusing) {
      charset = charset
        .split("")
        .filter((c) => !CONFUSING.includes(c))
        .join("");
    }

    if (options.excludeAmbiguous) {
      charset = charset
        .split("")
        .filter((c) => !AMBIGUOUS.includes(c))
        .join("");
    }

    if (!charset) {
      toast.error("Please select at least one character set!", { duration: 1500 });
      return;
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charset.length;
      result += charset[randomIndex];
    }

    setPassword(result);
    calculateStrength(result);
    toast.success("Password generated!", { duration: 1500 });
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    setStrength(score);
  };

  const copyToClipboard = async () => {
    if (!password) {
      toast.error("No password to copy!", { duration: 1500 });
      return;
    }
    await navigator.clipboard.writeText(password);
    toast.success("Password copied!", { duration: 1500 });
  };

  useEffect(() => {
    if (password) calculateStrength(password);
  }, [length, password]);

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB] overflow-x-hidden">
        <ToolsDetailPageHeader title="Strong Random Password Generator" icon={strongRandomPasswordGenerator} />
        {/* ===== Password Generator Card ===== */}
        <div className="max-w-5xl mx-auto p-8 font-manrope">

          {/* Length + Strength */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
            {/* Length - CustomSelect */}
            <div className="w-48">
              <label className="block text-xs font-bold text-[#6B7280] uppercase mb-2">
                Password Length
              </label>
              <CustomSelect
                label=""
                value={length.toString()}
                onChange={(e) => setLength(Number(e.target.value))}
                options={lengthOptions}
                searchable={false}
                size="md"
              />
            </div>

            {/* Strength */}
            <div>
              <label className="block text-xs font-bold text-[#6B7280] uppercase mb-2">
                Password Strength
              </label>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 w-7 rounded-sm ${i < strength
                        ? i >= 6 ? "bg-[#10B981]"
                          : i >= 4 ? "bg-[#F59E0B]"
                            : "bg-[#EF4444]"
                        : "bg-[#E5E7EB]"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8 text-sm">
            {[
              ["lowercase", "Include lowercase letters", "a b c d ..."],
              ["uppercase", "Include uppercase letters", "A B C D ..."],
              ["numbers", "Include numbers", "1 2 3 4 ..."],
              ["symbols", "Include symbols", "! # $ % & * ..."],
              [
                "excludeConfusing",
                "Exclude confusing characters",
                "i l 1 L o 0 O",
              ],
              [
                "excludeAmbiguous",
                "Exclude ambiguous characters",
                "{ } [ ] ( ) / \\",
              ],
            ].map(([key, label, example]) => (
              <label
                key={key}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() =>
                    setOptions({
                      ...options,
                      [key]: !options[key],
                    })
                  }
                  className="mt-1 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6]"
                />
                <span>
                  <span className="font-medium text-[#111827] group-hover:text-[#3B82F6] transition-colors">{label}</span>
                  <span className="text-[#6B7280] ml-2">→ {example}</span>
                </span>
              </label>
            ))}
          </div>

          {/* Generate + Output */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={generatePassword}
              className="flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2776f5] transition-all"
            >
              🔒 Generate Password
            </button>

            <input
              value={password}
              readOnly
              placeholder="Your password will appear here..."
              className="flex-1 min-w-55 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 text-[#111827] placeholder-[#9CA3AF]"
            />

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-[#FFFFFF] text-[#3B82F6] border border-[#E5E7EB] px-5 py-3 rounded-xl text-sm font-medium hover:bg-[#FFFFFF] hover:border-[#3B82F6] transition-all"
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* ===== Extra Sections (Centered with same max-width) ===== */}
        <div className="max-w-5xl mx-auto p-8 space-y-8">
          <CommentsSection toolId="strong-random-password-generator" />
          <BuyMeACoffee />
          <SimilarTools />
          <BrowserExtensionBanner />
        </div>

        {/* ===== Information Section ===== */}
        <div className="max-w-5xl mx-auto p-8 bg-white border border-[#E5E7EB] rounded-xl shadow-sm mt-8">
          <h3 className="font-bold text-xl text-[#111827] mb-4">
            What is Online Strong Random Password Generator
          </h3>
          <div className="space-y-4 text-[#0B1220] leading-relaxed">
            <p>
              Strong Random Password Generator is a free online tool for
              generating strong random passwords in which you can set the length
              and character set of the password. It works like a password
              generator and password strength meter at the same time. People
              generally use weak passwords that includes their names, surnames,
              birthdays, and other personal information. The reason is to remember
              it easily but with advanced password hacking methods, it makes it
              easier for hackers to crack the passwords within seconds. It is very
              crucial to have a strong password to protect your account especially
              if you are not using 2FA (2 Factor Authentication) like SMS or email
              verification.
            </p>

            <p>
              Here you can see an easy versus strong password together. It is even
              visually clear that the strong password is much more secure than the
              easy password.
            </p>

            <div className="my-8 p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FEF2F2] rounded border-2 border-[#FECACA]">
                  <p className="font-semibold text-[#EF4444] mb-2">
                    Weak Password:
                  </p>
                  <p className="font-mono text-lg text-[#111827]">john1990</p>
                </div>
                <div className="p-4 bg-[#F0FDF4] rounded border-2 border-[#BBF7D0]">
                  <p className="font-semibold text-[#10B981] mb-2">
                    Strong Password:
                  </p>
                  <p className="font-mono text-lg text-[#111827]">8K#mT9$pL2@nQ5x</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p>
                <span className="font-bold text-[#111827]">Brute Force Attack:</span>{" "}
                <span className="text-[#0B1220]">This is a method that iterates over all possible passwords by using character sets and checks if they are correct. If the website that you use the password for is not secure and does not have protection for multiple login attempts, hackers may use this method. For protecting yourself from such attacks, you need to use different character types like lowercase letters, uppercase letters, numbers, and special characters. If diversity of the characters used in the password is high and total number of characters in the character set is big, it becomes a time and energy consuming process for the attacker and it becomes difficult to crack the password.</span>
              </p>

              <p>
                <span className="font-bold text-[#111827]">Dictionary and Rainbow Table Attacks:</span>{" "}
                <span className="text-[#0B1220]">These methods are very close to each other. In both methods, the attacker tries to guess the password by using a dictionary of words and common password list. The difference is that in the dictionary attack, the attacker uses a common password list and tries to login to your account with these passwords programmatically. In rainbow table attack, the attacker has already obtained the database of the credentials stored. In general, passwords are stored as hashes like MD5, SHA256 or SHA512. Rainbow tables contain common passwords and their hash equivalents. The hacker tries to guess the password by using the hash values of the passwords. For protecting your account from these attacks, you need to avoid using words, common patterns, consecutive numbers, and personal information in your passwords.</span>
              </p>

              <p>
                <span className="font-bold text-[#111827]">Social Engineering:</span>{" "}
                <span className="text-[#0B1220]">Another method that is not stated above is social engineering. It is a technique used by people who know your identity and want to exploit your account. Attackers make a deep study on search engines and social media sites about the victim and gather as much information as possible like the name of your mother or father, the name of your pet, your birthdate, your birthplace, the schools you attended, or the companies you worked for. The attacker then uses this information to try to guess the password. There are tools that take all this information as input and make combinations by using them to narrow down the possibilities about your password. Therefore, using anything related to yourself in your passwords is not a good idea.</span>
              </p>

              <p>
                <span className="font-bold text-[#111827]">Phishing:</span>{" "}
                <span className="text-[#0B1220]">It is important to mention phishing when talking about passwords and password creation. It is a technique used by hackers to steal your personal information including passwords by using fake websites. Thus, it is very important to check the landing URL before clicking any link. If you want to navigate an important link, it is better to use a bookmark instead of clicking a link from an unknown website or email.</span>
              </p>

              <p>
                <span className="font-bold text-[#111827]">2FA (2-Factor Authentication):</span>{" "}
                <span className="text-[#0B1220]">It is very important to use 2FA if possible as it is nearly impossible for someone to login to your account even if they know your password. In addition to SMS, voice or email verification, there are many authenticator apps like Google Authenticator, Authy, or Microsoft Authenticator for protecting you from such malicious activities.</span>
              </p>
            </div>
          </div>

          <h3 className="font-bold text-xl text-[#111827] mt-8 mb-4">
            How to use Online Strong Random Password Generator?
          </h3>

          <div className="space-y-4 text-[#0B1220]">
            <p>You can create your strong password by following these steps:</p>
            <ol className="list-decimal list-inside mt-4 space-y-3">
              <li>
                Set your desired password length using the length dropdown. Longer passwords are generally more secure.
              </li>
              <li>
                Select the character types you want to include in your password:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-[#6B7280]">
                  <li>Lowercase letters (a-z)</li>
                  <li>Uppercase letters (A-Z)</li>
                  <li>Numbers (0-9)</li>
                  <li>Special characters (!@#$%^&*)</li>
                </ul>
              </li>
              <li>
                Click the "Generate Password" button to create a new random password.
              </li>
              <li>
                Review the generated password and check the password strength indicator.
              </li>
              <li>
                Click the "Copy" button to copy the password to your clipboard.
              </li>
              <li>
                You can regenerate as many times as you want until you get a password you're satisfied with.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}