import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { MessageSquareQuote, Sparkles, Heart } from 'lucide-react';

interface SayItem {
  id: string;
  date: string;
  time: string;
  content: string;
  tags?: string[];
  likes?: number;
}

export const Says: React.FC = () => {
  const [likesMap, setLikesMap] = React.useState<Record<string, number>>({
    'say-1': 16,
    'say-2': 28,
    'say-3': 42,
    'say-4': 19,
  });

  const says: SayItem[] = [
    {
      id: 'say-1',
      date: '2026-03-10',
      time: '23:42',
      content:
        '研究 Linux Glibc 2.35 的堆对齐与 Safe Linking 机制时，常常感慨软件工程在性能与内存安全防御之间的精妙权衡。每一个看似繁琐的异或混淆背后，都是数代安全学者与黑客攻防博弈的智慧结晶。',
      tags: ['安全思考', 'Glibc', 'Memory'],
    },
    {
      id: 'say-2',
      date: '2026-02-24',
      time: '18:15',
      content:
        '“What’s left unsaid holds the most weight.” 好的排版与代码架构一样，留白不是空无一物，而是为了让真正有分量的主角自然呼吸。',
      tags: ['美学', '余白', 'Philosophy'],
    },
    {
      id: 'say-3',
      date: '2026-02-14',
      time: '15:20',
      content:
        '尝试用 ABC 记谱法在浏览器端实时渲染五线谱，并用 Python 生成一段马尔可夫链旋律。数学与音乐在时间离散序列上的同构感，令人着迷。',
      tags: ['Music', 'Math', 'ABCJS'],
    },
    {
      id: 'say-4',
      date: '2026-01-18',
      time: '21:05',
      content:
        'React 19 的 use() 和 Actions 确实大幅降低了 useEffect 副作用调度的隐式心智负担。将精力聚焦于声明式 UI 与数据流本身，是一种返璞归真的优雅。',
      tags: ['React 19', 'Frontend'],
    },
  ];

  const handleLike = (id: string) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <PageShell>
      <Container size="narrow">
        {/* 顶部标题 */}
        <div className="mb-10 pb-6 border-b border-stone-200/70 dark:border-stone-800/70 text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-mono text-stone-600 dark:text-stone-400 mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>THOUGHTS &bull; 一言思考</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            碎语与微思考
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 font-serif italic max-w-md mx-auto">
            捕捉那些稍纵即逝的灵感火花、深夜随想与调试心得。
          </p>
        </div>

        {/* 动态时间轴卡片流 */}
        <div className="space-y-6">
          {says.map((say) => (
            <div
              key={say.id}
              className="p-6 rounded-3xl paper-card space-y-3 transition-all duration-200"
            >
              {/* 时间与作者 */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 dark:text-stone-500">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400" />
                  <span>
                    {say.date} {say.time}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-stone-400" />
                  <span>Perimsx</span>
                </div>
              </div>

              {/* 内容 */}
              <p className="font-serif text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-normal">
                {say.content}
              </p>

              {/* 标签与点赞互动 */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-200/50 dark:border-stone-800/50 text-xs font-mono">
                <div className="flex flex-wrap gap-1.5">
                  {say.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800/70 text-stone-500 dark:text-stone-400 text-[11px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleLike(say.id)}
                  className="flex items-center space-x-1 text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                  title="留下印记"
                >
                  <Heart className="w-3.5 h-3.5 fill-current opacity-70 hover:opacity-100" />
                  <span>{likesMap[say.id] || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </PageShell>
  );
};
