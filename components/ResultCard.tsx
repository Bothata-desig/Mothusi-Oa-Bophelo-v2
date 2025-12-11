import React from 'react';
import { MedicalAnalysis, SeverityLevel } from '../types';

interface ResultCardProps {
  analysis: MedicalAnalysis;
}

const getSeverityColor = (severity: SeverityLevel) => {
  switch (severity) {
    case SeverityLevel.LOW:
      return 'bg-green-100 text-green-800 border-green-200';
    case SeverityLevel.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case SeverityLevel.HIGH:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case SeverityLevel.CRITICAL:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ analysis }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-4 space-y-6">
      
      {/* Transcription */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Re utloile (Transcription)</h3>
        <p className="text-slate-700 italic">"{analysis.transcription}"</p>
      </div>

      {/* Main Diagnosis Block */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <div className={`p-4 border-b ${getSeverityColor(analysis.severity)} flex justify-between items-center`}>
            <div>
                <h3 className="font-bold text-lg">Mohlomong ke (Possible Condition)</h3>
                <p className="text-xl font-semibold">{analysis.possible_condition}</p>
            </div>
            <div className="text-right">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/50 border border-white/20`}>
                    {analysis.severity} Risk
                 </span>
            </div>
        </div>

        <div className="p-6 space-y-6">
            {/* Advice Section */}
            <div>
                <h4 className="flex items-center gap-2 font-bold text-teal-800 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.077.898-.521.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.287 9.483 4.111 8.965 5 8.965h.909c.445 0 .719.498.523.898a9.68 9.68 0 0 0-.272.602m5.748 8.283ZM12.75 21a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                    Keletso ea lapeng (Self-care)
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    {analysis.self_care_advice.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Red Flags Section */}
            <div>
                <h4 className="flex items-center gap-2 font-bold text-red-700 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    Ela hloko (Red Flags)
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-red-800 bg-red-50 p-4 rounded-lg">
                    {analysis.red_flags.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Doctor Recommendation */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    Ngaka (Doctor)
                </h4>
                <p className="text-blue-900 font-medium">{analysis.doctor_recommendation}</p>
            </div>
        </div>
      </div>
    </div>
  );
};