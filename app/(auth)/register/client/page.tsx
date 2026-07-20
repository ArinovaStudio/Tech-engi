"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
  Briefcase,
  KeyRound,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    text: "Client ke perspective se bolun toh yeh platform engineers aur clients ko connect karne ke liye really smooth hai. Communication clear raha aur delivery time pe mila.",
    avatar: "/users/image copy 8.png",
    name: "Baisakhi",
    role: "Startup Founder",
  },
  {
    text: "From an engineer's perspective, the platform is well-structured. Requirements are clear, and it's easy to collaborate with clients without unnecessary confusion.",
    avatar: "/users/image copy 9.png",
    name: "Sarah Khan",
    role: "Software Engineer",
  },
  {
    text: "We needed quick technical support for a prototype. The matching process was fast and we got someone who understood the requirements immediately.",
    avatar: "/users/image copy 3.png",
    name: "Ankit Sharma",
    role: "Product Manager",
  },
  {
    text: "I've worked on multiple projects here. The client expectations are clear, and payments and communication are handled smoothly.",
    avatar: "/users/image copy 10.png",
    name: "Neha Verma",
    role: "Freelance Developer",
  },
  {
    text: "I collaborated on a simulation project and the requirements were very well explained. It saved a lot of back-and-forth time.",
    avatar: "/users/image copy 5.png",
    name: "Rohit Mehta",
    role: "Mechanical Engineer",
  },
  {
    text: "Good platform for freelance engineers. The projects feel structured and clients are generally responsive and clear.",
    avatar: "/users/image copy 11.png",
    name: "Priya Nair",
    role: "Full Stack Developer",
  },
  {
    text: "I helped a client with structural analysis work. Everything from scope to delivery was properly defined, which made execution easier.",
    avatar: "/users/image copy 6.png",
    name: "Aditya Kulkarni",
    role: "Civil Engineer",
  },
  {
    text: "Even for design-related technical work, the collaboration was smooth. Feedback cycles were quick and clear.",
    avatar: "/users/image copy 13.png",
    name: "Simran Kaur",
    role: "UI/UX Designer",
  },
  {
    text: "APIs and backend tasks were well documented by clients. It made development faster and less frustrating.",
    avatar: "/users/image copy 18.png",
    name: "Vikram Singh",
    role: "Backend Engineer",
  },
  {
    text: "I worked on a data visualization project. The requirements were specific, and I was able to deliver exactly what was needed.",
    avatar: "/users/image copy 14.png",
    name: "Ishita Roy",
    role: "Data Analyst",
  },
  {
    text: "IoT project collaboration was smooth. I got clear instructions and minimal confusion during implementation.",
    avatar: "/users/image copy 19.png",
    name: "Karan Malhotra",
    role: "Electronics Engineer",
  },
  {
    text: "Worked on a machine learning project. The dataset and goals were clearly defined, which helped a lot in model training.",
    avatar: "/users/image copy 15.png",
    name: "Ayesha Khan",
    role: "AI/ML Engineer",
  },
  {
    text: "Good experience working with startups through this platform. Requirements are usually practical and well thought out.",
    avatar: "/users/image copy 20.png",
    name: "Manish Gupta",
    role: "Technical Consultant",
  },
  {
    text: "UI implementation tasks were easy to understand. Clients gave clear references which made execution faster.",
    avatar: "/users/image copy 16.png",
    name: "Jiya Shankar",
    role: "Frontend Developer",
  },
  {
    text: "Dude, your stuff is the bomb! House rent is the real deal! I STRONGLY recommend house rent to EVERYONE interested in running a successful online business!",
    avatar: "https://i.pravatar.cc/100?img=32",
    name: "Lana Bernier",
    role: "Senior Paradigm Strategist",
  },
  {
    text: "Dude, your stuff is the bomb! House rent is the real deal! I STRONGLY recommend house rent to EVERYONE interested in running a successful online business!",
    avatar: "https://i.pravatar.cc/100?img=12",
    name: "Lana Bernier",
    role: "Senior Paradigm Strategist",
  },
];

export default function ClientRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpCode, setOtpCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const existsRes = await fetch("/api/auth/userexist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const existsData = await existsRes.json();

      if (existsData.exists) {
        throw new Error("Email already registered");
      }

      // Send the OTP
      const otpRes = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "VERIFY_EMAIL" }),
      });

      const otpData = await otpRes.json();

      if (!otpRes.ok || !otpData.success) {
        throw new Error("failed to send OTP email.");
      }

      setSuccessMsg("We've sent a 6-digit code to your email.");
      setStep(2);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const verifyRes = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode, type: "VERIFY_EMAIL" }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || "Invalid OTP code");
      }

      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "CLIENT" }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok || !registerData.success) {
        throw new Error(registerData.message || "Registration failed");
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error("Verified, but failed to log in automatically.");
      }

      window.location.href = "/api/auth/role-redirect";

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      document.cookie = `oauth_role=CLIENT; path=/; max-age=120`;

      await signIn("google", { callbackUrl: "/api/auth/role-redirect" });

    } catch {
      setError("Google sign in failed");
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const otpRes = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "VERIFY_EMAIL" }),
      });

      const otpData = await otpRes.json();

      if (!otpRes.ok || !otpData.success) {
        throw new Error("Failed to send OTP email.");
      }

      setSuccessMsg("We've sent a new 6-digit code to your email.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      <div className="w-full lg:w-[50%] h-screen">
        <div className="">
          <button
            onClick={() => router.push('/')}
            className="flex items-center cursor-pointer gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors m-5 dark:text-slate-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
        <div className="min-h-screen flex flex-col justify-center items-center p-4 font-sans relative">
          <div className="w-full flex items-center justify-center bg-white p-8 sm:p-10 relative overflow-hidden dark:bg-card">

            {/* Step 1: Registration Form */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-120">
                <div className="text-center mb-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[#f0b31e] shadow-lg shadow-yellow-500/30 mx-auto mb-4">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                    Onboarding
                  </h1>
                  <p className="text-gray-500 mt-2 text-sm dark:text-slate-400">
                    Join to post projects and hire engineers
                  </p>
                </div>

                {error && (
                  <div className="mb-6 text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1 dark:text-slate-300">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black dark:border-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black dark:border-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black dark:border-slate-800 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#f0b31e] transition-colors dark:text-slate-500"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1 dark:text-slate-300">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 h-12 rounded-xl border border-gray-200 bg-transparent focus:bg-white focus:border-[#f0b31e] focus:ring-1 focus:ring-[#f0b31e] outline-none transition-all text-sm text-black dark:border-slate-800 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#f0b31e] transition-colors dark:text-slate-500"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 mt-4 bg-[#f0b31e] hover:bg-[#e0a61a] text-white rounded-xl text-base font-semibold shadow-md shadow-yellow-500/20 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
                  </button>
                </form>

                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400 text-xs uppercase tracking-wider font-medium dark:bg-card dark:text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-50 dark:bg-card dark:border-slate-800 dark:text-slate-300"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#f0b31e] font-semibold hover:underline">
                      Log In
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification Form */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="absolute top-6 left-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-[#f0b31e] hover:bg-yellow-50 transition-colors dark:bg-background dark:text-slate-500"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="text-center mb-8 mt-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0b31e]/10 mx-auto mb-6">
                    <KeyRound className="h-8 w-8 text-[#f0b31e]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                    Verify your email
                  </h1>
                  <p className="text-gray-500 mt-2 text-sm px-4 dark:text-slate-400">
                    We've sent a 6-digit verification code to<br />
                    <span className="font-semibold text-gray-700 dark:text-slate-300">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full text-center tracking-[1em] text-2xl font-bold h-16 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/10 outline-none transition-all text-gray-800 dark:border-slate-800 dark:bg-background dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    className="w-full h-12 bg-[#f0b31e] hover:bg-[#e0a61a] text-white rounded-xl text-base font-semibold shadow-md shadow-yellow-500/20 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Account"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Didn&apos;t receive the code?{" "}
                    <button
                      onClick={handleResendOtp}
                      className="text-[#f0b31e] font-semibold hover:underline"
                    >
                      Click to resend
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-[50%] rounded-[40px] relative overflow-hidden p-10 flex-col justify-between m-6">

        {/* MAIN YELLOW GRADIENT LIKE REFERENCE IMAGE */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#FFF6D6_0%,#F8D978_18%,#F0B31E_45%,#E8A400_65%,#FFF1C2_100%)]" />

        {/* Soft White Glow Top Left */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white/10 blur-[140px] rounded-full" />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-white/50 blur-[140px] rounded-full" />

        {/* Warm Golden Glow Center */}
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[#FFD65C]/40 blur-[120px] rounded-full" />

        {/* Light Cream Glow Right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFF3CF]/60 blur-[140px] rounded-full" />

        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.12] mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

        {/* Overlay Fade */}
        <div className="absolute inset-0 bg-white/[0.08]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full ">

          <div className="mt-20">
            {/* Logo */}
            <div className="relative w-24 h-24 bg-white rounded-sm shadow-xl overflow-hidden dark:bg-card">
              <Image
                src="/logoImagediff2.PNG"
                alt="Logo"
                fill
                className="object-cover rounded-sm"
              />
            </div>

            {/* Hero */}
            <div className="mt-12">
              <h1 className="text-white text-7xl font-extrabold tracking-tight leading-none">
                TECH ENGI
              </h1>

              <p className="text-white/85 text-lg max-w-xl mt-4 leading-relaxed">
                Post your project, find skilled engineers, and build products faster with
                a trusted network of technical talent at your fingertips.
              </p>
            </div>
          </div>

          {/* Bottom */}
          {/* Bottom Section */}
          <div className="mt-auto pt-28">

            {/* Testimonials */}
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="flex gap-6 w-max animate-marquee">
                {[...testimonials, ...testimonials].map((t, i) => (
                  <div
                    key={i}
                    className="
                        min-w-[420px] max-w-[420px]
                        h-auto min-h-[150px]
                        rounded-[28px]
                        border border-white/15
                        bg-white/[0.08]
                        backdrop-blur-xl
                        p-5
                        shrink-0
                        flex flex-col justify-between
                      "
                  >
                    <p className="text-white/90 text-sm leading-relaxed font-medium line-clamp-3">
                      {t.text}
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                      <img
                        src={t.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-white/30"
                      />

                      <div>
                        <h4 className="text-white font-semibold text-sm">
                          {t.name}
                        </h4>

                        <p className="text-white/70 text-xs">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end mt-16 gap-4 pr-2">
              <div className="w-32 h-[2px] bg-white/70" />

              <p className="text-white text-3xl font-light tracking-tight">
                Build for connectivity
              </p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .animate-marquee { animation: marquee 50s linear infinite; } .animate-marquee:hover { animation-play-state: paused; }" }} />

    </div>
  );
}