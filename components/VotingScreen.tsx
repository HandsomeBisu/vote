import React, { useState } from 'react';
import { PRESIDENT_CANDIDATES, VICE_PRESIDENT_CANDIDATES, Candidate } from '../types';
import { submitVote } from '../services/voteService';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface VotingScreenProps {
  onVoteSuccess: () => void;
}

const VotingScreen: React.FC<VotingScreenProps> = ({ onVoteSuccess }) => {
  const [selectedPresident, setSelectedPresident] = useState<string | null>(null);
  const [selectedVP, setSelectedVP] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async () => {
    if (!selectedPresident || !selectedVP) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const success = await submitVote(selectedPresident, selectedVP);
      if (success) {
        onVoteSuccess();
      } else {
        setError('이미 투표에 참여하셨습니다.');
      }
    } catch (err) {
      setError('투표 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CandidateCard = ({ 
    candidate, 
    isSelected, 
    onSelect 
  }: { 
    candidate: Candidate; 
    isSelected: boolean; 
    onSelect: (id: string) => void; 
  }) => (
    <div
      onClick={() => onSelect(candidate.id)}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isSelected
          ? 'border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
          : 'border-white bg-white shadow-md hover:border-slate-300 hover:shadow-lg'
        }
      `}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
          <CheckCircle2 size={20} />
        </div>
      )}
      
      <div className="flex flex-col items-center text-center">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white mb-3 shadow-md bg-black"
        >
          {candidate.number}
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          {candidate.name}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in-up pb-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">소중한 한 표를 행사해주세요</h2>
        <p className="text-slate-600">회장과 부회장 후보를 각각 선택해주세요.</p>
      </div>

      {/* President Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-800 border-l-4 border-blue-600 pl-3">
          회장 후보 선택
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRESIDENT_CANDIDATES.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedPresident === candidate.id}
              onSelect={setSelectedPresident}
            />
          ))}
        </div>
      </div>

      {/* Vice President Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-800 border-l-4 border-blue-600 pl-3">
          부회장 후보 선택
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VICE_PRESIDENT_CANDIDATES.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedVP === candidate.id}
              onSelect={setSelectedVP}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 justify-center">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-center pt-6 border-t border-slate-200">
        <button
          onClick={handleVote}
          disabled={!selectedPresident || !selectedVP || isSubmitting}
          className={`
            px-12 py-4 rounded-full text-lg font-bold shadow-lg transition-all
            flex items-center gap-2
            ${(!selectedPresident || !selectedVP || isSubmitting)
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-300/50 transform active:scale-95'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> 처리중...
            </>
          ) : (
            '투표 완료'
          )}
        </button>
      </div>
    </div>
  );
};

export default VotingScreen;