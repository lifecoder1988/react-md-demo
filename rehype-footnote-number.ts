import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'

/**
 * 从ID或href中提取原始脚注标签
 * @param idOrHref - 脚注的ID或href属性值
 * @returns 提取的脚注编号，如果无法提取则返回空字符串
 */
function extractOriginalLabel(idOrHref: string | undefined): string {
  if (!idOrHref) return ''
  
  // 处理href格式: #user-content-fn-5 或 #user-content-fnref-5
  if (idOrHref.startsWith('#')) {
    const match = idOrHref.match(/#user-content-fn(?:ref)?-(.+)$/)
    return match ? match[1] : ''
  }
  
  // 处理id格式: user-content-fn-5 或 user-content-fnref-5
  const match = idOrHref.match(/user-content-fn(?:ref)?-(.+)$/)
  return match ? match[1] : ''
}

/**
 * Rehype插件：保留脚注的原始编号
 * 该插件会遍历AST，找到脚注引用和脚注定义，并保留其原始编号
 */
const rehypeFootnoteNumberPreserver: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const NAME_PREFIX = "user-content-" as const
    
    visit(tree, 'element', (node: Element) => {
      // 处理脚注引用 (sup 元素)
      if (
        node.tagName === 'a' &&
        node.properties?.id?.toString().startsWith(NAME_PREFIX + 'fnref-')
      ) {
        const realLabel = extractOriginalLabel(node.properties.id?.toString())
        if (realLabel) {
          node.children = [{ type: 'text', value: realLabel }]
        }
      }

      // 处理脚注定义 (li 元素)
      if (
        node.tagName === 'li' &&
        node.properties?.id?.toString().startsWith(NAME_PREFIX + 'fn-')
      ) {
        const realLabel = extractOriginalLabel(node.properties.id?.toString())
        
        // 创建包含脚注编号的 span 元素
        const spanElement = {
          type: 'element' as const,
          tagName: 'span',
          properties: {
            className: ['footnote-number'],
            href: `#${NAME_PREFIX}fnref-${realLabel}`
          },
          children: [{
            type: 'text' as const,
            value: realLabel
          }]
        }
        
        // 将 span 元素插入到 li 元素的开头
        if (node.children && Array.isArray(node.children)) {
          node.children.unshift(spanElement)
        }
      }
    })
  }
}

export default rehypeFootnoteNumberPreserver
