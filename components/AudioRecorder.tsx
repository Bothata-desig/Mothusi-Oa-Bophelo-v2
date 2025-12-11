import React, { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob) => void;
  isProcessing: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Use a widely supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        onAudioRecorded(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Stop stream
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Re sitiloe ho fumana maekrofono. Ka kopo lumella 'browser' ho e sebelisa. (Could not access microphone)");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 w-full max-w-md mx-auto mt-6">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-slate-800">
            {isRecording ? "Ea Mamela..." : "Tlaleha Matšoao"}
        </h2>
        <p className="text-sm text-slate-500">
            {isRecording ? "Listening..." : "Record Symptoms"}
        </p>
      </div>

      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
            ${isProcessing ? 'bg-gray-200 cursor-not-allowed' : ''}
            ${!isProcessing && isRecording ? 'bg-red-500 shadow-lg scale-110 animate-pulse' : ''}
            ${!isProcessing && !isRecording ? 'bg-teal-600 hover:bg-teal-700 shadow-md hover:scale-105' : ''}
          `}
        >
            {isProcessing ? (
                <div className="h-8 w-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : isRecording ? (
             <div className="wave-animation h-8 flex gap-1 items-center justify-center">
                 <span></span><span></span><span></span><span></span><span></span>
             </div>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
            )}
        </button>
      </div>

      <div className="mt-4 h-6 text-slate-600 font-mono text-lg font-medium">
        {isRecording ? formatTime(recordingTime) : isProcessing ? "Analyzing..." : "Tobetsa ho bua"}
      </div>
      
      {!isRecording && !isProcessing && (
         <p className="text-xs text-slate-400 mt-2">Press the microphone to start speaking in Sesotho.</p>
      )}
    </div>
  );
};