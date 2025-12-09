import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search senopost"
        className="pl-10 bg-secondary border-none h-9 rounded-full focus-visible:ring-1 focus-visible:ring-primary"
      />
    </div>
  )
}
