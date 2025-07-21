import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * 从ID中提取脚注编号
 * @param id - 脚注的ID属性值
 * @returns 提取的脚注编号，如果无法提取则返回0
 */
function extractFootnoteNumber(id: string | undefined): number {
  if (!id) return 0
  
  // 处理格式: user-content-fn-5
  const match = id.match(/user-content-fn-(\d+)$/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Rehype插件：对脚注列表项进行排序
 * 该插件会找到脚注列表容器，并按照脚注编号对列表项进行数字排序
 */
const rehypeFootnoteSort: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // 找到脚注容器 (section 元素且包含 footnotes 类)
      if (
        node.tagName === 'section' &&
        String(node.properties?.className || "").includes('footnotes')
      ) {
        // 在 section 中找到 ol 列表
        const list = node.children.find((child): child is Element => 
          child.type === 'element' && child.tagName === 'ol'
        )
        if (!list) return

        // 收集所有脚注列表项
        const footnoteItems = list.children
          .filter((child): child is Element => 
            child.type === 'element' && 
            child.tagName === 'li' &&
            typeof child.properties?.id === 'string' &&
            child.properties.id.startsWith('user-content-fn-')
          )
          .map(li => {
            const id = li.properties?.id?.toString() || ''
            const order = extractFootnoteNumber(id)
            return { element: li, order }
          })
          .sort((a, b) => a.order - b.order) // 按编号升序排序
        
        // 更新列表顺序
        if (footnoteItems.length > 0) {
          // 保留非脚注的子元素（如果有的话）
          const nonFootnoteChildren = list.children.filter(child => 
            !(child.type === 'element' && 
              child.tagName === 'li' &&
              typeof child.properties?.id === 'string' &&
              child.properties.id.startsWith('user-content-fn-'))
          )
          
          // 重新组织子元素：非脚注元素 + 排序后的脚注元素
          list.children = [
            ...nonFootnoteChildren,
            ...footnoteItems.map(item => item.element)
          ]
        }
      }
    })
  }
}

export default rehypeFootnoteSort
