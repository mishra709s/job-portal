'use client'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface GeneralSubmitButtonProps {
  text: string
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined
  className?: string
  icon?: ReactNode
}

export function GeneralSubmitButton({
  text,
  variant,
  className,
  icon,
}: GeneralSubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button variant={variant} className={className} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          {icon ? <div>{icon}</div> : null}
          <span>{text}</span>
        </>
      )}
    </Button>
  )
}
