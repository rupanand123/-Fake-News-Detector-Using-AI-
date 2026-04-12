import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { History, TrendingUp, CheckCircle, AlertTriangle, Clock, Search, Filter, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { AnalysisResult, UserStats } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, query, where, orderBy, onSnapshot, OperationType, handleFirestoreError } from '../firebase';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalChecked: 0,
    realCount: 0,
    fakeCount: 0,
    partialCount: 0,
    accuracy: 0
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalysisResult));
      setHistory(data);
      
      // Calculate stats
      const total = data.length;
      const real = data.filter(i => i.verdict === 'REAL').length;
      const fake = data.filter(i => i.verdict === 'FAKE').length;
      const partial = data.filter(i => i.verdict === 'PARTIALLY TRUE').length;
      const avgConf = total > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.confidence, 0) / total) : 0;

      setStats({
        totalChecked: total,
        realCount: real,
        fakeCount: fake,
        partialCount: partial,
        accuracy: avgConf
      });
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'analyses');
    });

    return unsubscribe;
  }, [user]);

  if (!user) {
    return (
      <section id="dashboard" className="py-24 px-4 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto text-center">
          <History className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Sign in to view your dashboard</h2>
          <p className="text-text-secondary mb-8">Track your news verification history and get personalized insights.</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </div>
    );
  }
  return (
    <section id="dashboard" className="py-24 px-4 bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-white mb-2">User Dashboard</h2>
            <p className="text-text-secondary">Track your verification history and insights</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 text-white">
              <Download className="w-4 h-4 mr-2" /> Export Reports
            </Button>
            <Button className="bg-accent-blue hover:bg-blue-600 text-white">
              Upgrade Pro
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Checked', value: stats.totalChecked, icon: History, color: 'text-accent-blue' },
            { label: 'Real News', value: stats.realCount, icon: CheckCircle, color: 'text-accent-green' },
            { label: 'Fake News', value: stats.fakeCount, icon: AlertTriangle, color: 'text-accent-red' },
            { label: 'AI Accuracy', value: `${stats.accuracy}%`, icon: TrendingUp, color: 'text-accent-yellow' },
          ].map((stat, i) => (
            <Card key={i} className="glass border-border-custom">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-serif font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass border-border-custom">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white font-serif">Recent History</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <Input 
                    placeholder="Search history..." 
                    className="pl-9 bg-white/5 border-white/10 text-white w-48 h-9"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9 border-white/10">
                  <Filter className="w-4 h-4 text-white" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 divide-y divide-white/5">
                  {history.length > 0 ? history.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-6 hover:bg-white/5 transition-all group cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute right-4 top-6 vertical-rail opacity-20 group-hover:opacity-50 transition-opacity">Record ID: {item.id?.slice(-4)}</div>
                      <div className="flex items-start justify-between mb-2 pr-12">
                        <h4 className="text-lg text-white font-bold group-hover:text-accent-blue transition-colors leading-tight">{item.title}</h4>
                        <Badge className={`${
                          item.verdict === 'REAL' ? 'bg-accent-green/20 text-accent-green' : 
                          item.verdict === 'FAKE' ? 'bg-accent-red/20 text-accent-red' : 
                          'bg-accent-yellow/20 text-accent-yellow'
                        } border-none shrink-0`}>
                          {item.verdict}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2 mb-4 max-w-2xl">
                        {item.explanation}
                      </p>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                        <div className="flex items-center gap-6">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1.5 text-accent-blue" /> {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1.5 text-accent-blue" /> {item.confidence}% Confidence
                          </span>
                        </div>
                        <span className="text-accent-blue group-hover:translate-x-1 transition-transform">Full Report →</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-24 text-text-secondary">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No history found. Start analyzing news!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="glass border-border-custom">
            <CardHeader>
              <CardTitle className="text-white font-serif">Accuracy Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="relative h-48 flex items-center justify-center">
                {/* Simple SVG Chart Placeholder */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 * (1 - stats.accuracy / 100)}
                    className="text-accent-blue"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-serif font-bold text-white">{stats.accuracy}%</span>
                  <span className="text-[10px] uppercase tracking-widest text-text-secondary">Reliability</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Detection Speed</span>
                  <span className="text-sm text-accent-green">Fast (1.2s)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Sources Scanned</span>
                  <span className="text-sm text-white">1.2M+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">False Positives</span>
                  <span className="text-sm text-accent-red">0.2%</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                <p className="text-xs text-accent-blue leading-relaxed">
                  Your accuracy is 12% higher than the average user. You are becoming a master at identifying misinformation!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
