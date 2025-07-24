import { Button } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Sparkles } from 'lucide-react'
import React from 'react'
import NewSummary from './NewSummary'

type ArticleSummaryProps = {
  currentSummary: string
  newSummary: string | null
  regenerateSummary: () => Promise<void>
  useNewSummary: () => Promise<void>
  keepOldSummary: () => void
  isRegenerating: boolean
}

const ArticleSummary = ({
  currentSummary,
  newSummary,
  useNewSummary,
  keepOldSummary,
  regenerateSummary,
  isRegenerating,
}: ArticleSummaryProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Summary
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={regenerateSummary}
            disabled={isRegenerating}
            className="gap-2 bg-transparent"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`}
            />
            {isRegenerating ? 'Generating...' : 'Regenerate'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Summary */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default">Current Summary</Badge>
          </div>
          <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            {currentSummary ?? "No summary available."}
          </p>
        </div>

        {/* New Generated Summary */}
        {newSummary ? (
          <NewSummary
            newSummary={newSummary}
            useNewSummary={useNewSummary}
            keepOldSummary={keepOldSummary}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}

export default ArticleSummary
