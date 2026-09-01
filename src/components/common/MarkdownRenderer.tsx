import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Parse paragraphs, headers, bullet lists, bold text, formulas, and callout blocks
  const lines = content.trim().split('\n');

  const renderedElements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length > 0) {
      renderedElements.push(
        <ul key={key} className="my-4 space-y-2 pl-2">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <span>{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const formatInline = (text: string): React.ReactNode[] => {
    // Replace **bold**, `code`, and $formula$
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$.*?\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-mono text-xs font-semibold">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <span key={i} className="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 font-mono font-bold text-xs border border-brand-200/60 dark:border-brand-800/60">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`list-${index}`);
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listBuffer.push(trimmed.slice(2));
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^\d+\.\s/, ''));
      return;
    }

    flushList(`list-${index}`);

    if (trimmed.startsWith('### ')) {
      renderedElements.push(
        <h3 key={index} className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white mt-8 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-brand-500 inline-block" />
          {trimmed.slice(4)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      renderedElements.push(
        <h2 key={index} className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white mt-10 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          {trimmed.slice(3)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      renderedElements.push(
        <blockquote key={index} className="my-5 p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border-l-4 border-brand-500 text-xs sm:text-sm italic text-slate-800 dark:text-slate-200 shadow-xs">
          {formatInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Standard paragraph
    renderedElements.push(
      <p key={index} className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 my-3">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList('list-end');

  return <div className="space-y-1">{renderedElements}</div>;
};
