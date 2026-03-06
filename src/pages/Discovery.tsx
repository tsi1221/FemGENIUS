import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, ArrowRight, RefreshCw } from "lucide-react";
import { getSelfDiscoveryQuiz } from "@/src/services/geminiService";

export default function Discovery() {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const data = await getSelfDiscoveryQuiz();
      setQuiz(data);
      setCurrentStep(0);
      setAnswers([]);
      setResult(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (trait: string) => {
    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);
    
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate result
      const counts: any = {};
      newAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
      const topTrait = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      setResult(topTrait);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-bold text-brand-dark">Self-Discovery Insights</h1>
        <p className="text-slate-500">Uncover your inner potential and strengths.</p>
      </div>

      {!quiz && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12 space-y-6"
        >
          <div className="w-20 h-20 bg-brand-soft-purple rounded-full flex items-center justify-center text-brand-purple mx-auto">
            <Brain size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Ready to discover your strengths?</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Our AI-powered quiz helps you identify your core personality traits and how to leverage them for growth.
            </p>
          </div>
          <button onClick={startQuiz} className="btn-primary">
            Start Discovery Quiz
          </button>
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <RefreshCw className="animate-spin text-brand-purple" size={40} />
          <p className="text-slate-500 font-medium">AI is crafting your personalized quiz...</p>
        </div>
      )}

      {quiz && !result && (
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card space-y-8"
        >
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Question {currentStep + 1} of {quiz.questions.length}</span>
            <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-purple transition-all duration-500" 
                style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <h2 className="text-2xl font-display font-semibold text-brand-dark leading-tight">
            {quiz.questions[currentStep].question}
          </h2>

          <div className="space-y-3">
            {quiz.questions[currentStep].options.map((option: any, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(option.trait)}
                className="w-full p-4 text-left border border-slate-100 rounded-2xl hover:border-brand-purple hover:bg-brand-soft-purple/30 transition-all group flex items-center justify-between"
              >
                <span className="font-medium">{option.text}</span>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-brand-purple transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-10 space-y-6 border-2 border-brand-purple/20"
        >
          <div className="w-24 h-24 bg-brand-purple rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-purple/30">
            <Sparkles size={48} />
          </div>
          <div className="space-y-2">
            <p className="text-brand-purple font-bold uppercase tracking-widest text-xs">Your Core Strength</p>
            <h2 className="text-4xl font-display font-bold text-brand-dark">{result}</h2>
            <p className="text-slate-500 max-w-md mx-auto pt-4">
              Your {result.toLowerCase()} nature is your superpower. Use it to inspire others and achieve your intentional life goals.
            </p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={startQuiz} className="btn-secondary">Retake Quiz</button>
            <button className="btn-primary">View Growth Plan</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
