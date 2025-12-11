import React, { useState } from 'react';
import { Header } from './components/Header';
import { AudioRecorder } from './components/AudioRecorder';
import { ResultCard } from './components/ResultCard';
import { analyzeSymptoms } from './services/geminiService';
import { MedicalAnalysis } from './types';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<MedicalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudioRecorded = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeSymptoms(audioBlob);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Re kopa tšoarelo, ho bile le phoso. Ka kopo leka hape. (Sorry, an error occurred. Please try again.)");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 mt-6">
        
        {/* Intro Text */}
        {!analysis && !isProcessing && (
          <div className="text-center mb-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Lumela! Re mona ho thusa.
            </h2>
            <p className="text-slate-600">
              Bua matšoao a hau ka Sesotho. Re tla u fa keletso ea bophelo bo botle.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              (Speak your symptoms in Sesotho. We will provide health advice.)
            </p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Main Interaction Area */}
        {!analysis ? (
          <AudioRecorder 
            onAudioRecorded={handleAudioRecorded} 
            isProcessing={isProcessing} 
          />
        ) : (
          <div className="animate-fade-in">
            <ResultCard analysis={analysis} />
            <div className="text-center mt-8">
              <button 
                onClick={reset}
                className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-teal-700 transition-colors"
              >
                Qala Hape (Start Over)
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center max-w-2xl mx-auto border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong>TEMOSO:</strong> Sesebelisoa sena ke sa thuso feela 'me ha se nke sebaka sa ngaka ea sebele. 
            Haeba u ikutloa u kula haholo, ka kopo e-ea tleliniking kapa sepetlele hang-hang.
          </p>
          <p className="text-[10px] text-slate-300 mt-2">
            DISCLAIMER: This tool is for informational purposes only and does not provide medical diagnosis. 
            Always seek professional medical advice for serious conditions.
          </p>
        </div>

      </main>
    </div>
  );
}

export default App;