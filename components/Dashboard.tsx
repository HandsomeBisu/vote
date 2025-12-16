import React, { useEffect, useState } from 'react';
import { subscribeToVotes } from '../services/voteService';
import { PRESIDENT_CANDIDATES, VICE_PRESIDENT_CANDIDATES, Vote, VoteResult, CHART_COLORS, Candidate } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToVotes((newVotes) => {
      setVotes(newVotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const calculateResults = (candidates: Candidate[], voteKey: 'presidentId' | 'vicePresidentId'): VoteResult[] => {
    const counts: { [key: string]: number } = {};
    
    candidates.forEach(c => counts[c.id] = 0);
    
    votes.forEach(v => {
      const candidateId = v[voteKey];
      if (counts[candidateId] !== undefined) {
        counts[candidateId]++;
      }
    });

    return candidates.map((c, index) => ({
      candidateId: c.id,
      candidateName: `기호 ${c.number}번 ${c.name}`,
      count: counts[c.id] || 0,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    })).sort((a, b) => b.count - a.count);
  };

  const presidentResults = calculateResults(PRESIDENT_CANDIDATES, 'presidentId');
  const vpResults = calculateResults(VICE_PRESIDENT_CANDIDATES, 'vicePresidentId');
  const totalVotes = votes.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500">실시간 집계 중입니다...</p>
      </div>
    );
  }

  const ResultSection = ({ title, results }: { title: string, results: VoteResult[] }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        {title}
      </h3>
      
      {/* Chart */}
      <div className="h-64 w-full mb-6">
        {totalVotes > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={results}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="candidateName"
              >
                {results.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl">
            데이터 없음
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {results.map((data, index) => {
          const percentage = totalVotes === 0 ? 0 : ((data.count / totalVotes) * 100).toFixed(1);
          return (
            <div key={data.candidateId} className="group">
              <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm bg-slate-700"
                  >
                    {index + 1}
                  </div>
                  <div className="font-bold text-slate-700 text-sm">{data.candidateName}</div>
                </div>
                <div className="text-sm font-bold text-slate-600">
                  {data.count}표 ({percentage}%)
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%`, backgroundColor: data.fill }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            실시간 여론조사 현황
           </h2>
           <p className="text-slate-500 text-sm mt-1">
             현재까지 총 <span className="font-bold text-blue-600 text-lg">{totalVotes}</span>명이 참여했습니다.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ResultSection title="회장 후보 득표율" results={presidentResults} />
        <ResultSection title="부회장 후보 득표율" results={vpResults} />
      </div>
      
      <div className="text-center p-4 bg-blue-50 rounded-xl text-blue-700 text-sm font-medium">
        <Users className="inline-block w-4 h-4 mr-2 mb-0.5" />
        본 결과는 실제 개표 결과와 다를 수 있는 단순 예측치입니다.
      </div>
    </div>
  );
};

export default Dashboard;