import React from 'react';
import { Cpu, Lock, TerminalSquare, Layers } from 'lucide-react';

export const TechRadarCard: React.FC = () => {
  const skills = [
    {
      category: '系统与二进制',
      icon: Cpu,
      items: ['C / C++', 'x86_64 / ARM64', 'Glibc Ptmalloc', 'GDB / Pwndbg'],
    },
    {
      category: '安全与攻防',
      icon: Lock,
      items: ['Heap Pwn', 'Frida Hooking', 'ECC 密码学', 'Web 漏洞链'],
    },
    {
      category: '工程与构建',
      icon: Layers,
      items: ['Python 3', 'React 19 / TS', 'Rsbuild / Vite', 'Tailwind CSS'],
    },
  ];

  return (
    <div className="p-6 rounded-3xl paper-card flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <TerminalSquare className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            技术栈与研究矩阵
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.category}
                className="p-3.5 rounded-2xl bg-stone-100/50 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-700/50"
              >
                <div className="flex items-center space-x-1.5 text-xs font-semibold font-serif text-stone-800 dark:text-stone-200 mb-2">
                  <Icon className="w-3.5 h-3.5 text-stone-500" />
                  <span>{skill.category}</span>
                </div>
                <div className="space-y-1">
                  {skill.items.map((item) => (
                    <div
                      key={item}
                      className="text-[11px] font-mono text-stone-600 dark:text-stone-400"
                    >
                      &bull; {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800/50 text-[11px] text-stone-400 font-mono flex items-center justify-between">
        <span>全栈与安全深耕中</span>
        <span>Linux / Arch / Debian</span>
      </div>
    </div>
  );
};
