'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeFootnoteHover from '../../rehype-footnote-hover';

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState(`# Markdown 编辑器

这是一个使用 **react-markdown** 和 **remark-gfm** 构建的 Markdown 编辑器。

## 功能特性

- ✅ 实时预览
- ✅ GitHub 风格的 Markdown (GFM)
- ✅ 语法高亮
- ✅ 表格支持
- ✅ 任务列表

## 示例内容

### 代码块

\`\`\`javascript
function hello() {
  console.log('Hello, Markdown!');
}
\`\`\`

### 表格

| 功能 | 状态 | 描述 |
|------|------|------|
| 编辑 | ✅ | 支持实时编辑 |
| 预览 | ✅ | 实时预览效果 |
| 导出 | 🚧 | 计划中 |

### 任务列表

- [x] 创建基础编辑器
- [x] 添加预览功能
- [ ] 添加工具栏
- [ ] 添加文件导入/导出

### 链接和图片

[React Markdown](https://github.com/remarkjs/react-markdown)

[自定义协议链接](ushu-Wnr6PQO4://example-resource)

### 脚注示例

这是一个包含脚注的段落[^1]。你也可以使用命名脚注[^note]。

[^1]: 这是第一个脚注的内容。
[^note]: 这是一个命名脚注的内容。

> 这是一个引用块，用于突出显示重要信息。
`);

  return (
    <div className="h-screen flex flex-col">
      {/* 标题栏 */}
      <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Markdown 编辑器
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          使用 react-markdown 和 remark-gfm 构建
        </p>
      </div>

      {/* 编辑器主体 */}
      <div className="flex-1 flex">
        {/* 编辑区域 */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              编辑器
            </h2>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 p-4 font-mono text-sm resize-none border-none outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            placeholder="在这里输入 Markdown 内容..."
          />
        </div>

        {/* 预览区域 */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              预览
            </h2>
          </div>
          <div className="flex-1 p-4 overflow-auto bg-white dark:bg-gray-800">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeFootnoteHover]}
                urlTransform={(url) => {
                  // 允许自定义协议 ushu-Wnr6PQO4://
                  if (url.startsWith('ushu-Wnr6PQO4://')) {
                    return url;
                  }
                  // 对于其他 URL，使用默认的转换逻辑
                  if (
                    url.startsWith('http://') ||
                    url.startsWith('https://') ||
                    url.startsWith('mailto:') ||
                    url.startsWith('/') ||
                    url.startsWith('#')
                  ) {
                    return url;
                  }
                  // 对于不安全的 URL，返回空字符串
                  return '';
                }}
                components={{
                  // 自定义代码块样式
                  code: ({ className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return !isInline ? (
                      <pre className="bg-gray-100 dark:bg-gray-900 rounded-md p-3 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code
                        className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // 自定义表格样式
                  table: ({ children }) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-left font-medium">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                      {children}
                    </td>
                  ),
                  // 自定义任务列表样式
                  input: ({ type, checked, ...props }) => {
                    if (type === 'checkbox') {
                      return (
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          className="mr-2"
                          {...props}
                        />
                      );
                    }
                    return <input type={type} {...props} />;
                  },
                  // 自定义脚注样式 - 简化版本，配合 rehype-footnote-hover 插件
                  sup: ({ children, ...props }) => {
                    return (
                      <sup 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-help" 
                        {...props}
                      >
                        {children}
                      </sup>
                    );
                  },
                  section: ({ children, ...props }: any) => {
                    // 检查是否是脚注区域
                    if (props['data-footnotes']) {
                      return (
                        <section className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-600" {...props}>
                          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            脚注
                          </h2>
                          {children}
                        </section>
                      );
                    }
                    return <section {...props}>{children}</section>;
                  },
                  // 自定义脚注列表样式
                  ol: ({ children, ...props }) => {
                    // 检查父元素是否是脚注区域
                    return (
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300" {...props}>
                        {children}
                      </ol>
                    );
                  },
                  // 自定义链接样式，支持自定义协议
                  a: ({ href, children, ...props }) => {
                    // 检查是否是自定义协议链接
                    if (href && href.startsWith('ushu-Wnr6PQO4://')) {
                      return (
                        <a
                          href={href}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 underline font-medium"
                          title={`自定义协议链接: ${href}`}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`点击了自定义协议链接: ${href}`);
                          }}
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    }
                    // 普通链接样式
                    return (
                      <a
                        href={href}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="bg-gray-100 dark:bg-gray-800 px-6 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
          <span>字符数: {markdown.length}</span>
          <span>行数: {markdown.split('\n').length}</span>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;