import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Link as LinkIcon, Image as ImageIcon, ShieldCheck, ShieldAlert, ShieldQuestion, Loader2, Info, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { analyzeNews } from '../services/gemini';
import { AnalysisResult } from '../types';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, addDoc, OperationType, handleFirestoreError } from '../firebase';

export const NewsAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeNews({
        text: text || undefined,
        url: url || undefined,
        imageBase64: image?.split(',')[1] || undefined
      });
      
      setResult(analysis);

      // Save to Firebase if user is logged in
      if (user) {
        try {
          const analysisToSave = {
            ...analysis,
            userId: user.uid,
            timestamp: Date.now()
          };
          
          // Firestore doesn't allow undefined values
          const cleanData = JSON.parse(JSON.stringify(analysisToSave));
          
          await addDoc(collection(db, 'analyses'), cleanData);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'analyses');
        }
      }

      if (analysis.verdict === 'REAL' && analysis.confidence > 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6']
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="analyze" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white">Analyze News</h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Paste text, a link, or upload an image to verify the authenticity of any news item using our advanced AI engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <Card className="glass border-border-custom">
          <CardHeader>
            <CardTitle className="text-white font-serif">Input Source</CardTitle>
            <CardDescription className="text-text-secondary">Choose your preferred input method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-white/5">
                <TabsTrigger value="text" className="data-[state=active]:bg-accent-blue">
                  <Search className="w-4 h-4 mr-2" /> Text
                </TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-accent-blue">
                  <LinkIcon className="w-4 h-4 mr-2" /> URL
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-accent-blue">
                  <ImageIcon className="w-4 h-4 mr-2" /> Image
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <textarea
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all resize-none"
                  placeholder="Paste the news content here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="url">
                <div className="space-y-4">
                  <Input
                    placeholder="https://news-source.com/article"
                    className="bg-white/5 border-white/10 text-white h-12"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-text-secondary flex items-center">
                    <Info className="w-3 h-3 mr-1" /> We will fetch and analyze the content from this link.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="image">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-8 bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                  {image ? (
                    <div className="relative w-full aspect-video">
                      <img src={image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => setImage(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-text-secondary mb-4" />
                      <p className="text-text-secondary text-center">Click to upload or drag and drop news poster/screenshot</p>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              className="w-full mt-8 h-12 text-lg font-bold bg-accent-blue hover:bg-blue-600 transition-all neon-glow-blue"
              disabled={isAnalyzing || (!text && !url && !image)}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze News"
              )}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="glass border-border-custom overflow-hidden">
                <div className={`h-2 w-full ${
                  result.verdict === 'REAL' ? 'bg-accent-green' : 
                  result.verdict === 'FAKE' ? 'bg-accent-red' : 'bg-accent-yellow'
                }`} />
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white font-serif text-2xl">{result.title}</CardTitle>
                    <CardDescription className="text-text-secondary">Analysis Result</CardDescription>
                  </div>
                  <Badge className={`text-lg py-1 px-4 ${
                    result.verdict === 'REAL' ? 'bg-accent-green/20 text-accent-green border-accent-green/50' : 
                    result.verdict === 'FAKE' ? 'bg-accent-red/20 text-accent-red border-accent-red/50' : 
                    'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/50'
                  }`}>
                    {result.verdict === 'REAL' ? <ShieldCheck className="w-4 h-4 mr-2" /> : 
                     result.verdict === 'FAKE' ? <ShieldAlert className="w-4 h-4 mr-2" /> : 
                     <ShieldQuestion className="w-4 h-4 mr-2" />}
                    {result.verdict}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Confidence Score</span>
                      <span className="text-white font-bold">{result.confidence}%</span>
                    </div>
                    <Progress value={result.confidence} className="h-2 bg-white/5" />
                  </div>

                  <div className="p-6 rounded-lg bg-white/5 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-4 right-4 vertical-rail">Analysis Report</div>
                    <h4 className="text-sm font-bold text-accent-blue mb-4 flex items-center">
                      <Info className="w-4 h-4 mr-2" /> Detailed Explanation
                    </h4>
                    <div className="text-text-primary text-sm leading-relaxed newspaper-columns drop-cap">
                      {result.explanation}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-xs font-bold text-text-secondary uppercase mb-1">Source Trust</h4>
                      <p className="text-xl font-serif text-white">{result.sourceScore}/100</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-xs font-bold text-text-secondary uppercase mb-1">Status</h4>
                      <p className="text-xl font-serif text-white">Verified</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white">Fact Summary</h4>
                    <p className="text-text-secondary text-sm italic">
                      "{result.factSummary}"
                    </p>
                  </div>

                  {result.url && (
                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 text-text-secondary hover:text-white" 
                      onClick={() => window.open(result.url, '_blank')}
                    >
                      View Original Source <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-xl bg-white/5"
            >
              <ShieldCheck className="w-16 h-16 text-white/10 mb-6" />
              <h3 className="text-xl font-serif text-white/40">Waiting for Analysis</h3>
              <p className="text-text-secondary/40 max-w-xs mt-2">
                Your results will appear here once you submit a news item for verification.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
