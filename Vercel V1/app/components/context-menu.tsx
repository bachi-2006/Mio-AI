"use client"

import type * as React from "react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Copy, RefreshCw, Download, Share } from "lucide-react"

interface OutputContextMenuProps {
  children: React.ReactNode
  onCopy?: () => void
  onRegenerate?: () => void
  onDownload?: () => void
  onShare?: () => void
  isImage?: boolean
}

export function OutputContextMenu({
  children,
  onCopy,
  onRegenerate,
  onDownload,
  onShare,
  isImage = false,
}: OutputContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-gray-900 border border-gray-800">
        {onCopy && (
          <ContextMenuItem onClick={onCopy} className="flex items-center gap-2 cursor-pointer hover:bg-gray-800">
            <Copy className="h-4 w-4" />
            <span>Copy to clipboard</span>
          </ContextMenuItem>
        )}

        {onRegenerate && (
          <ContextMenuItem onClick={onRegenerate} className="flex items-center gap-2 cursor-pointer hover:bg-gray-800">
            <RefreshCw className="h-4 w-4" />
            <span>Regenerate response</span>
          </ContextMenuItem>
        )}

        {isImage && onDownload && (
          <ContextMenuItem onClick={onDownload} className="flex items-center gap-2 cursor-pointer hover:bg-gray-800">
            <Download className="h-4 w-4" />
            <span>Download image</span>
          </ContextMenuItem>
        )}

        {isImage && onShare && (
          <ContextMenuItem onClick={onShare} className="flex items-center gap-2 cursor-pointer hover:bg-gray-800">
            <Share className="h-4 w-4" />
            <span>Share image</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
