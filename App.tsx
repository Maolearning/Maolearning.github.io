import * as React from 'react';
import { useState, useRef, useLayoutEffect } from 'react';
import { GameCard } from './components/GameCard';
import { SnakeGame } from './components/games/SnakeGame';
import { GomokuGame } from './components/games/GomokuGame';
import { SlidePuzzleGame } from './components/games/SlidePuzzleGame';
import { MemoryGame } from './components/games/MemoryGame';
import { ReflexGame } from './components/games/ReflexGame';
import { BreakoutGame } from './components/games/BreakoutGame';
import { MinesweeperGame } from './components/games/MinesweeperGame';
import { ColorPickerGame } from './components/games/ColorPickerGame';
import { SimonGame } from './components/games/SimonGame';
import { TwoZeroFourEightGame } from './components/games/TwoZeroFourEightGame';
import { TicTacToeGame } from './components/games/TicTacToeGame';
import { WhackAMoleGame } from './components/games/WhackAMoleGame';
import { PongGame } from './components/games/PongGame';
import { PinMasterGame } from './components/games/PinMasterGame';
import { MathGame } from './components/games/MathGame';
import { SchulteGridGame } from './components/games/SchulteGridGame';
import { ParticleBackground } from './components/ParticleBackground';

import { GameConfig } from './types';
import { Gamepad2, Sparkles, Circle, Square, Triangle } from 'lucide-react';

const GAMES: GameConfig[] = [
  {
    id: 'snake',
    title: '贪吃蛇',
    description: '经典的吞噬进化模拟。控制小蛇不断进食成长，千万别撞到墙壁或自己！',
    imageUrl: https://img.ixintu.com/upload/jpg/20210523/907341b8454af197df57f28c40a8d46d_64722_800_800.jpg!con,
    component: SnakeGame,
    color: 'bg-green-500'
  },
  {
    id: '2048',
    title: '2048',
    description: '数字合成益智游戏。滑动方块，合并相同的数字，向着2048的目标进发。',
    imageUrl: 'https://imgcdn.stablediffusionweb.com/2024/4/9/776d26fc-7a4e-4443-98a3-4c100f7e3f3a.jpg',
    component: TwoZeroFourEightGame,
    color: 'bg-orange-500'
  },
  {
    id: 'whack',
    title: '打地鼠',
    description: '手速大考验！在病毒冒头的一瞬间点击消除它们，别让它们感染系统。',
    imageUrl: 'https://img.tukuppt.com/png_preview/02/97/03/CamCrWmUmD.jpg!/fw/780',
    component: WhackAMoleGame,
    color: 'bg-lime-500'
  },
  {
    id: 'gomoku',
    title: '五子棋',
    description: '黑白棋子间的博弈。率先将五颗棋子连成一线即可获胜。',
    imageUrl: 'https://pic.pngsucai.com/00/97/41/eecaee54eff42371.webp',
    component: GomokuGame,
    color: 'bg-stone-500'
  },
  {
    id: 'mines',
    title: '扫雷',
    description: '推理与运气的结合。根据数字提示找出所有地雷，插上旗帜标记危险。',
    imageUrl: 'https://th.bing.com/th/id/R.c729769dba753d603fc4edd1e5a6fc3c?rik=LuEQorVQLdjW7g&riu=http%3a%2f%2fpic.baike.soso.com%2fp%2f20131221%2f20131221060140-2027942049.jpg&ehk=xa2a29r%2biBzOfKJRHm4J01%2byThVdJR%2fnEk1f4w4JBz8%3d&risl=&pid=ImgRaw&r=0',
    component: MinesweeperGame,
    color: 'bg-red-500'
  },
  {
    id: 'slide',
    title: '数字华容道',
    description: '脑力极限拼图。移动方块，按顺序排列数字 1 到 8。',
    imageUrl: 'https://th.bing.com/th/id/OIP.jxK9ly2NVskF8QWgNqInlQHaHa?o=7&cb=ucfimg2&rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
    component: SlidePuzzleGame,
    color: 'bg-blue-500'
  },
  {
    id: 'color',
    title: '找不同',
    description: '谁是火眼金睛？在一大堆色块中找出颜色稍微不同的那一个。',
    imageUrl: 'https://th.bing.com/th/id/R.7a70f5492147d677effb86873dcab187?rik=WPdMeAXh5vtckg&riu=http%3a%2f%2fpic.2265.com%2fupload%2f2020-1%2f2020119935201597.png&ehk=b9w5RaSS5BfnSLl%2f%2f%2bhSqNVP2mzbg%2b449hLrf%2f9F%2b50%3d&risl=&pid=ImgRaw&r=0',
    component: ColorPickerGame,
    color: 'bg-cyan-500'
  },
  {
    id: 'schulte',
    title: '舒尔特方格',
    description: '注意力大挑战。按顺序找出从 1 到 25 的所有数字，看看你用了多久？',
    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple128/v4/81/65/bd/8165bd55-8c4a-e4ff-d1b9-89e4cab076b5/source/512x512bb.jpg',
    component: SchulteGridGame,
    color: 'bg-indigo-500'
  },
  {
    id: 'breakout',
    title: '打砖块',
    description: '弹球击碎屏障！控制挡板反弹小球，消除屏幕上所有的砖块。',
    imageUrl: 'https://preview.qiantucdn.com/freepik/512/1890/1890702.png!w1024_new_small_1',
    component: BreakoutGame,
    color: 'bg-pink-500'
  },
  {
    id: 'memory',
    title: '记忆翻牌',
    description: '考验你的瞬时记忆。翻开卡片，找出两两相同的图案进行配对。',
    imageUrl: 'https://img.ixintu.com/upload/jpg/20210528/9d8a2ea20f29e8180087e78cfb430e39_25914_512_512.jpg!con',
    component: MemoryGame,
    color: 'bg-yellow-500'
  },
  {
    id: 'reflex',
    title: '反应测试',
    description: '你的神经反射有多快？看到绿色信号瞬间点击，测试你的极限毫秒数。',
    imageUrl: 'https://img.tapimg.com/market/images/9bfb6a5fbe2c2e40dcd71f93133e3849.png/appicon?t=1',
    component: ReflexGame,
    color: 'bg-slate-400'
  },
  {
    id: 'simon',
    title: '记忆大师',
    description: '跟随灯光的节奏。记住亮起的颜色顺序，并准确地重复出来。',
    imageUrl: 'https://img.phb123.com/uploads/allimg/240205/1-2402051HJ70-L.jpg',
    component: SimonGame,
    color: 'bg-purple-500'
  },
  {
    id: 'tictactoe',
    title: '井字棋',
    description: '简单却充满策略。在九宫格中连成三点，与AI一决高下。',
    imageUrl: 'https://bpic.588ku.com/element_origin_min_pic/24/01/23/fcb2f9b60d1dd43cbc5cf8f464a335c8.jpg',
    component: TicTacToeGame,
    color: 'bg-indigo-500'
  },
  {
    id: 'pong',
    title: '乒乓对战',
    description: '经典的桌面网球。控制滑块接住飞来的球，击败你的对手。',
    imageUrl: 'https://img95.699pic.com/photo/30094/7186.jpg_wh860.jpg,
    component: PongGame,
    color: 'bg-fuchsia-500'
  },
  {
    id: 'pin',
    title: '见缝插针',
    description: '耐心与时机的终极博弈。在旋转的圆盘上插入所有的针，千万别互相碰撞！',
    imageUrl: 'https://preview.qiantucdn.com/58pic/20240325/00b58PICFWep9bFaNCf2d_PIC2018_PIC2018.jpg!w1024_new_small_1',
    component: PinMasterGame,
    color: 'bg-slate-700'
  },
  {
    id: 'math',
    title: '速算挑战',
    description: '让大脑飞速运转。在限定时间内解出算术题，防止脑力退化！',
    imageUrl: 'https://img1.itbiu.com/website/math24/icon_20190901.jpg',
    component: MathGame,
    color: 'bg-teal-500'
  }
];

export default function App() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);

  const activeGame = GAMES.find(g => g.id === activeGameId);

  const handleGameOpen = (id: string) => {
    scrollPositionRef.current = window.scrollY;
    setActiveGameId(id);
    window.scrollTo(0, 0);
  };

  const handleGameClose = () => {
    setActiveGameId(null);
  };

  useLayoutEffect(() => {
    if (!activeGameId) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [activeGameId]);

  return (
    <div className="min-h-screen w-full bg-arcade-bg text-arcade-text transition-colors duration-500 relative overflow-x-hidden">
      {/* 视觉升级：流光背景层 */}
      {!activeGame && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="bg-pattern absolute inset-0"></div>
          
          {/* 动态 Mesh Gradient 装饰块 */}
          <div className="blob bg-blue-400 w-[500px] h-[500px] -top-24 -left-24 animate-blob opacity-20"></div>
          <div className="blob bg-purple-400 w-[600px] h-[600px] top-1/2 -right-32 animate-blob opacity-20" style={{ animationDelay: '2s' }}></div>
          <div className="blob bg-rose-400 w-[400px] h-[400px] bottom-0 left-1/4 animate-blob opacity-10" style={{ animationDelay: '4s' }}></div>
          <div className="blob bg-emerald-400 w-[550px] h-[550px] -bottom-32 -right-24 animate-blob opacity-10" style={{ animationDelay: '6s' }}></div>

          {/* 悬浮装饰元素 (Glassmorphism) */}
          <div className="absolute top-[15%] left-[10%] opacity-20 animate-float">
             <Circle size={120} className="text-blue-500" strokeWidth={0.5} />
          </div>
          <div className="absolute top-[60%] right-[15%] opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>
             <Square size={160} className="text-purple-500 rotate-12" strokeWidth={0.5} />
          </div>
          <div className="absolute bottom-[20%] left-[20%] opacity-15 animate-float" style={{ animationDelay: '3s' }}>
             <Triangle size={100} className="text-rose-500 -rotate-12" strokeWidth={0.5} />
          </div>
          <div className="absolute top-[40%] left-[45%] opacity-10 animate-float" style={{ animationDelay: '4.5s' }}>
             <Gamepad2 size={200} className="text-slate-400 rotate-6" strokeWidth={0.5} />
          </div>
        </div>
      )}
      
      {/* 粒子背景层 */}
      {!activeGame && <ParticleBackground />}

      {!activeGame && (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur-xl shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg">
                 <Gamepad2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-black tracking-tight text-slate-800">
                  快乐<span className="text-arcade-primary">游戏盒</span>
                </h1>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-500">
               <span className="flex items-center gap-1"><Sparkles size={14} className="text-yellow-500" fill="currentColor"/> 休闲时光</span>
               <span className="bg-slate-200/50 px-2 py-1 rounded-full border border-slate-300/30">v4.5.0</span>
            </div>
          </div>
        </header>
      )}

      <main className="relative z-10 mx-auto max-w-7xl">
        {activeGame ? (
          <div className="fixed inset-0 z-50 flex h-full w-full flex-col bg-slate-50 animate-in fade-in zoom-in-95 duration-300">
             <activeGame.component onBack={handleGameClose} />
          </div>
        ) : (
          <div className="px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex items-center justify-between">
                <div className="relative">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">选择游戏</h2>
                    <p className="text-lg text-slate-500">挑选一个开始你的快乐时光吧！</p>
                    <div className="absolute -left-4 top-0 w-1 h-full bg-arcade-primary rounded-full"></div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-20">
              {GAMES.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onClick={handleGameOpen} 
                />
              ))}
            </div>

            <div className="mt-12 border-t border-slate-200 py-8 text-center text-xs text-slate-400">
               <p className="mb-2">© 2024 快乐游戏盒 | 动效交互升级版</p>
               <p>Happy Arcade Systems · Interactive Experience</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
