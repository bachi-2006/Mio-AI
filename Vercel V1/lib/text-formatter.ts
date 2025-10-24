/**
 * Formats text by converting markdown-style formatting to HTML
 * - *text* or _text_ -> <strong>text</strong> (bold)
 * - **text** or __text__ -> <em>text</em> (italic)
 * - `text` -> <code>text</code> (code)
 */
export function formatText(text: string): string {
  if (!text) return ""

  // Replace code blocks first to avoid interference with other formatting
  let formattedText = text.replace(
    /`([^`]+)`/g,
    '<code class="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-sm">$1</code>',
  )

  // Replace bold (single asterisks or underscores)
  formattedText = formattedText.replace(/\*([^*]+)\*/g, "<strong>$1</strong>")
  formattedText = formattedText.replace(/_([^_]+)_/g, "<strong>$1</strong>")

  // Replace italic (double asterisks or underscores)
  formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, "<em>$1</em>")
  formattedText = formattedText.replace(/__([^_]+)__/g, "<em>$1</em>")

  // Replace URLs with links
  formattedText = formattedText.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:text-primary-600 underline">$1</a>',
  )

  // Replace line breaks with <br>
  formattedText = formattedText.replace(/\n/g, "<br>")

  return formattedText
}

/**
 * Removes all markdown formatting from text
 */
export function stripFormatting(text: string): string {
  if (!text) return ""

  // Remove markdown formatting
  let plainText = text.replace(/\*\*([^*]+)\*\*/g, "$1") // Remove **bold**
  plainText = plainText.replace(/\*([^*]+)\*/g, "$1") // Remove *italic*
  plainText = plainText.replace(/__([^_]+)__/g, "$1") // Remove __bold__
  plainText = plainText.replace(/_([^_]+)_/g, "$1") // Remove _italic_
  plainText = plainText.replace(/`([^`]+)`/g, "$1") // Remove `code`

  return plainText
}
