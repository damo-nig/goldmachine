'use client';

import { useState, useEffect } from 'react';

interface GoldMachineLoaderProps {
  onComplete?: () => void;
}

interface LineData {
  text: string;
  type: 'brand' | 'info' | 'dim' | 'success' | 'hex' | 'title' | 'ready' | 'blank';
  delay?: number;
}

interface ModuleState {
  percent: number;
}

type Phase = 'typing' | 'loading' | 'ready';

const GoldMachineLoader: React.FC<GoldMachineLoaderProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<LineData[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [loadingModules, setLoadingModules] = useState<Record<string, ModuleState>>({});
  const [phase, setPhase] = useState<Phase>('typing');
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  const scriptLines: LineData[] = [
    { text: 'GoldMachine', type: 'brand', delay: 15 },
    { text: '', type: 'blank', delay: 20 },
    { text: 'GM Protocol v1.0 // Automated Gold Distribution System', type: 'info', delay: 4 },
    { text: 'GM Distribution Engine v1', type: 'dim', delay: 5 },
    { text: 'Checking Distribution Systems : 14000 OK', type: 'success', delay: 4 },
    { text: '', type: 'blank', delay: 30 },
    { text: '0x47 0x4D 0x50 0x52 0x4F 0x54 0x4F 0x43 0x4F 0x4C', type: 'hex', delay: 2 },
    { text: '', type: 'blank', delay: 40 },
    { text: 'LOADING PROTOCOL MODULES', type: 'title', delay: 6 },
    { text: '', type: 'blank', delay: 20 },
  ];

  const moduleNames = [
    'contractCore',
    'tokenomicsEngine',
    'distributionModule',
    'XAUMintegration',
    'redemptionGateway',
    'dashboardInterface',
    'walletConnector',
    'protocolInit',
  ];

  useEffect(() => {
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    return () => {
      if (navbar) navbar.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== 'typing') return;
    if (currentLineIndex >= scriptLines.length) {
      setPhase('loading');
      return;
    }
    const currentLine = scriptLines[currentLineIndex];
    if (currentLine.type === 'blank') {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, { text: '', type: 'blank' }]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, currentLine.delay || 20);
      return () => clearTimeout(timer);
    }
    if (currentCharIndex < currentLine.text.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, currentLine.delay || 5);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, { text: currentLine.text, type: currentLine.type }]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [phase, currentLineIndex, currentCharIndex]);

  useEffect(() => {
    if (phase !== 'loading') return;
    let moduleIndex = 0;
    const loadNextModule = () => {
      if (moduleIndex >= moduleNames.length) {
        setTimeout(() => {
          setPhase('ready');
          setLines((prev) => [
            ...prev,
            { text: '', type: 'blank' },
            { text: 'Protocol Memory Test : 1048576K OK', type: 'dim' },
            { text: 'BNB Chain Connection : ACTIVE', type: 'dim' },
            { text: 'Distribution Status : RUNNING', type: 'dim' },
            { text: '', type: 'blank' },
            { text: 'All Systems Ready - Launching GoldMachine v1.0', type: 'ready' },
          ]);
          // Auto-continue after 500ms
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
        }, 80);
        return;
      }
      const moduleName = moduleNames[moduleIndex];
      setLoadingModules((prev) => ({ ...prev, [moduleName]: { percent: 0 } }));
      let currentPercent = 0;
      const percentInterval = setInterval(() => {
        currentPercent += Math.floor(Math.random() * 25) + 20;
        if (currentPercent >= 100) {
          currentPercent = 100;
          clearInterval(percentInterval);
          setLoadingModules((prev) => ({ ...prev, [moduleName]: { percent: 100 } }));
          moduleIndex++;
          setTimeout(loadNextModule, 15);
        } else {
          setLoadingModules((prev) => ({ ...prev, [moduleName]: { percent: currentPercent } }));
        }
      }, 10);
    };
    setTimeout(loadNextModule, 50);
  }, [phase, onComplete]);

  const getCurrentTypingText = (): { text: string; type: LineData['type'] } | null => {
    if (phase !== 'typing' || currentLineIndex >= scriptLines.length) return null;
    const currentLine = scriptLines[currentLineIndex];
    if (currentLine.type === 'blank') return null;
    return { text: currentLine.text.substring(0, currentCharIndex), type: currentLine.type };
  };

  const typingLine = getCurrentTypingText();

  const getLineClasses = (type: LineData['type']): string => {
    const base = 'font-vt323 text-lg leading-relaxed min-h-[28px]';
    switch (type) {
      case 'brand': return base + ' text-gold text-2xl font-bold mb-4';
      case 'info': return base + ' text-gold/85';
      case 'dim': return base + ' text-gold/45';
      case 'success': return base + ' text-green-400';
      case 'hex': return base + ' text-gold/30 font-mono text-sm tracking-wider';
      case 'title': return base + ' text-gold/85 mt-2';
      case 'ready': return base + ' text-gold mt-4';
      case 'blank': return 'h-3.5';
      default: return base + ' text-gold';
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9999]">
      <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245, 166, 35, 0.006) 2px, rgba(245, 166, 35, 0.006) 4px)' }} />
      <div className="relative z-20 p-12 md:p-16 max-w-4xl">
        <div className="absolute top-12 right-12 md:right-16 font-vt323 text-lg text-gold/50">GMBIOS v1.0.0</div>
        {lines.map((line, index) => (<div key={index} className={getLineClasses(line.type)}>{line.text}</div>))}
        {typingLine && (<div className={getLineClasses(typingLine.type)}>{typingLine.text}<span className={'text-gold ' + (cursorVisible ? 'opacity-100' : 'opacity-0')}>█</span></div>)}
        {phase !== 'typing' && Object.keys(loadingModules).length > 0 && (
          <div className="mt-2">
            {moduleNames.map((moduleName) => {
              const moduleState = loadingModules[moduleName];
              if (!moduleState) return null;
              return (<div key={moduleName} className="font-vt323 text-[17px] text-gold/70 leading-relaxed flex"><span className="min-w-[340px]">    Loaded {moduleName}</span><span className="opacity-40">   ... </span><span className="min-w-[50px] text-right">{moduleState.percent}%</span></div>);
            })}
          </div>
        )}
        {phase === 'ready' && (
          <div className="mt-6">
            <div className="font-vt323 text-[17px] text-gold/60 flex items-center">CA: COMING SOON ON BNB CHAIN<span className={'ml-2 text-gold ' + (cursorVisible ? 'opacity-70' : 'opacity-0')}>█</span></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoldMachineLoader;
