import { Button } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import React from 'react'

type NewSummaryProps = {
  newSummary: string
  useNewSummary: () => Promise<void>
  keepOldSummary: () => void
}

const NewSummary = ({
  newSummary,
  useNewSummary,
  keepOldSummary,
}: NewSummaryProps) => {
  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary">New AI Generated Summary</Badge>
      </div>
      <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mb-4">
        {newSummary}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button onClick={useNewSummary} className="gap-2">
          <Check className="h-4 w-4" />
          Use New Summary
        </Button>
        <Button
          variant="outline"
          onClick={keepOldSummary}
          className="gap-2 bg-transparent"
        >
          <X className="h-4 w-4" />
          Keep Current Summary
        </Button>
      </div>
    </div>
  )
}

export default NewSummary
