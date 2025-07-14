// rehype-footnote-hover.ts
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'

const rehypeFootnoteHover: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const footnotes: Record<string, string> = {}
    
    // 提取所有脚注内容
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'section' &&
        Array.isArray(node.properties?.className) &&
        node.properties.className.includes('footnotes')
      ) {
        const list = node.children.find((child): child is Element => 
          child.type === 'element' && child.tagName === 'ol'
        )
        if (!list) return

        for (const li of list.children) {
          if (li.type !== 'element') continue
          const id = li.properties?.id?.toString().replace(/^user-content-fn-/, '')
          if (!id) continue

          // 提取纯文本内容
          const textParts: string[] = []
          visit(li, 'text', (textNode) => {
            textParts.push(textNode.value)
          })

          const text = textParts.join(' ').trim().replace(/\s+/g, ' ')
          footnotes[id] = text
        }
      }
    })

    // 在引用中添加 title 属性
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'a' &&
        typeof node.properties?.href === 'string' &&
        node.properties.href.startsWith('#user-content-fn-')
      ) {
        const id = node.properties.href.slice(17)
        const note = footnotes[id]
        if (note) {
          node.properties.title = note
        }
      }
    })
  }
}

export default rehypeFootnoteHover
