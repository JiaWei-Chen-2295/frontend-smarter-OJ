import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

interface VeditorProps {
    value: string;
    className?: string;
    enableAnchor?: boolean;
}

const Veditor: React.FC<VeditorProps> = ({ value, className = '', enableAnchor = false }) => {
    let headingIndex = 0;
    
    return (
        <div className={`markdown-body ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // 自定义代码块样式
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <pre className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        ) : (
                            <code className="bg-[#303030] px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                            </code>
                        );
                    },
                    // 自定义标题样式
                    h1: ({ children }) => {
                        const id = enableAnchor ? `heading-${headingIndex++}` : undefined;
                        return <h1 id={id} className="text-2xl font-bold text-white mb-4">{children}</h1>;
                    },
                    h2: ({ children }) => {
                        const id = enableAnchor ? `heading-${headingIndex++}` : undefined;
                        return <h2 id={id} className="text-xl font-bold text-white mb-3">{children}</h2>;
                    },
                    h3: ({ children }) => {
                        const id = enableAnchor ? `heading-${headingIndex++}` : undefined;
                        return <h3 id={id} className="text-lg font-bold text-white mb-2">{children}</h3>;
                    },
                    // 自定义段落样式
                    p: ({ children }) => <p className="text-gray-300 mb-4">{children}</p>,
                    // 自定义列表样式
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300 mb-1">{children}</li>,
                    // 自定义链接样式
                    a: ({ children, href }) => (
                        <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    // 自定义表格样式
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border-collapse border border-gray-700">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-gray-700 px-4 py-2 bg-[#303030] text-white font-semibold">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-gray-700 px-4 py-2 text-gray-300">
                            {children}
                        </td>
                    ),
                }}
            >
                {value}
            </ReactMarkdown>
        </div>
    );
};

export default Veditor; 