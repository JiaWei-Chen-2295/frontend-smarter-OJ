import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

type MarkdownPreviewProps = {
  value?: string;
  className?: string;
};

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ value = '', className = '' }) => {
  return (
    <div className={`uiux-md-preview ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: () => null,
          pre: () => null,
          table: () => null,
          h1: ({ children }) => <p className="uiux-md-block uiux-md-heading">{children}</p>,
          h2: ({ children }) => <p className="uiux-md-block uiux-md-heading">{children}</p>,
          h3: ({ children }) => <p className="uiux-md-block uiux-md-heading">{children}</p>,
          h4: ({ children }) => <p className="uiux-md-block uiux-md-heading">{children}</p>,
          p: ({ children }) => <p className="uiux-md-block">{children}</p>,
          ul: ({ children }) => <ul className="uiux-md-block uiux-md-list">{children}</ul>,
          ol: ({ children }) => <ol className="uiux-md-block uiux-md-list">{children}</ol>,
          li: ({ children }) => <span className="uiux-md-li">{children}</span>,
          code({ inline, children, ...props }) {
            if (!inline) return null;
            return (
              <code className="uiux-md-code" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
