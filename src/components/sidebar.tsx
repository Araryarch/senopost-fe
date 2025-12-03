'use client'

import Link from 'next/link'
import {
  Home,
  Flame,
  ArrowUpCircle,
  ChevronDown,
  Plus,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

const mainLinks = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Flame, label: 'Popular', href: '/r/popular' },
  { icon: ArrowUpCircle, label: 'All', href: '/r/all' },
]

const topics = [
  { label: 'Gaming', href: '/t/gaming' },
  { label: 'News', href: '/t/news' },
  { label: 'Movies & TV', href: '/t/movies' },
  { label: 'Music', href: '/t/music' },
  { label: 'Books', href: '/t/books' },
  { label: 'Relationships', href: '/t/relationships' },
  { label: 'Fitness', href: '/t/fitness' },
  { label: 'Programming', href: '/t/programming' },
  { label: 'Careers', href: '/t/careers' },
]

const communities = [
  { name: 'r/programming', members: '6.2M' },
  { name: 'r/webdev', members: '2.1M' },
  { name: 'r/javascript', members: '2.4M' },
  { name: 'r/reactjs', members: '423K' },
  { name: 'r/nextjs', members: '98K' },
]

export function Sidebar() {
  const [topicsOpen, setTopicsOpen] = useState(true)
  const [communitiesOpen, setCommunitiesOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'h-[calc(100vh-48px)] sticky top-12 hidden lg:block border-r border-border bg-card transition-all duration-300',
          isCollapsed ? 'w-[68px] p-2' : 'w-[270px] p-3',
        )}
      >
        <ScrollArea className="h-full pr-1">
          <div
            className={cn(
              'mb-2',
              isCollapsed ? 'flex justify-center' : 'flex justify-end',
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-secondary"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>

          <nav className="space-y-1">
            {mainLinks.map((link) => (
              <Tooltip key={link.href}>
                <TooltipTrigger asChild>
                  <Link href={link.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full h-10 hover:bg-secondary rounded-lg',
                        isCollapsed
                          ? 'justify-center px-2'
                          : 'justify-start gap-3 px-4',
                      )}
                    >
                      <link.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{link.label}</span>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{link.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>

          <div className="my-4 border-t border-border" />

          {!isCollapsed && (
            <>
              <Collapsible open={topicsOpen} onOpenChange={setTopicsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-9 px-4 hover:bg-secondary rounded-lg"
                  >
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Topics
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        topicsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {topics.map((topic) => (
                    <Link key={topic.href} href={topic.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-9 px-4 hover:bg-secondary rounded-lg text-sm"
                      >
                        <span>{topic.label}</span>
                      </Button>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <div className="my-4 border-t border-border" />

              <Collapsible
                open={communitiesOpen}
                onOpenChange={setCommunitiesOpen}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-9 px-4 hover:bg-secondary rounded-lg"
                  >
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Communities
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        communitiesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  <Link href="/communities/create">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-9 px-4 hover:bg-secondary rounded-lg text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create a community</span>
                    </Button>
                  </Link>

                  {communities.map((community) => (
                    <Link key={community.name} href={`/${community.name}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-9 px-4 hover:bg-secondary rounded-lg text-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary-foreground">
                            {community.name.charAt(2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{community.name}</span>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </ScrollArea>
      </aside>
    </TooltipProvider>
  )
}
