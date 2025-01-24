// src/pages/Login.tsx
import { MeshDistortMaterial, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Lock, Sparkle, SpinnerGap, User } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
}

const AnimatedInput = ({ icon: Icon, ...props }: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <Icon
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? "text-purple-500" : "text-gray-400"
        }`}
        size={20}
      />
      <input
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-10 w-full px-4 py-3 bg-white/5 border border-gray-700 text-gray-100 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300
          backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)]"
      />
      <div
        className={`absolute inset-0 -z-10 bg-purple-500/20 rounded-xl blur-xl ${
          isFocused ? "opacity-100 scale-100" : "opacity-0 scale-0"
        } transition-all duration-300`}
      />
    </div>
  );
};

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user-referrals");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_Server_URL}/public/admin_login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        console.log(data.token);
        navigate("/user-referrals");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0F172A] overflow-hidden">
      <div className="absolute inset-0">
        <Canvas className="w-full h-full">
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
          <Sphere args={[1, 100, 200]} scale={2.5}>
            <MeshDistortMaterial
              color="#4c1d95"
              attach="material"
              distort={0.5}
              speed={2}
              roughness={0.2}
            />
          </Sphere>
        </Canvas>
      </div>

      <div className="relative max-w-md w-full space-y-8 p-10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl" />

        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-0.5">
            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
              <Sparkle size={32} weight="fill" className="text-purple-400" />
            </div>
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Please sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <AnimatedInput
              icon={User}
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
            <AnimatedInput
              icon={Lock}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl leading-none flex items-center justify-center">
              {loading ? (
                <SpinnerGap
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  weight="bold"
                />
              ) : null}
              <span className="text-white font-medium">
                {loading ? "Signing in..." : "Sign in"}
              </span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
