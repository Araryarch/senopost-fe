'use client'

import { Button } from '@/components/ui/button'
import { Flame, Sparkles, ArrowUpCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'best', label: 'Best', icon: Sparkles },
  { id: 'hot', label: 'Hot', icon: Flame },
  { id: 'new', label: 'New', icon: Clock },
  { id: 'top', label: 'Top', icon: ArrowUpCircle },
]

export function FeedTabs() {
  const [activeTab, setActiveTab] = useState('best')

  return (
    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          size="sm"
          className={cn(
            'rounded-full gap-2 shrink-0',
            activeTab === tab.id
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
          )}
          onClick={() => setActiveTab(tab.id)}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
