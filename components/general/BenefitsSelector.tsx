import { benefits } from '@/app/utils/listOfBenefits'
import { Badge } from '../ui/badge'
import { ControllerRenderProps } from 'react-hook-form'

interface Props {
  field: ControllerRenderProps
}

const BenefitsSelector = ({ field }: Props) => {
  const toggleBenefit = (benefitId: string) => {
    const currentBenefits = field.value || []

    const newBenefits = currentBenefits.includes(benefitId)
      ? currentBenefits.filter((id: string) => id !== benefitId)
      : [...currentBenefits, benefitId]

    field.onChange(newBenefits)
  }

  return (
    <div className="">
      <div className="flex flex-wrap gap-3">
        {/* {benefits.map((benefit) => (
          <Badge
            key={benefit.id}
            variant="outline"
            onClick={() => toggleBenefit(benefit.id)}
            className="cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm px-4 py-1.5 rounded-full"
          >
            <span className="flex items-center gap-2">
              {benefit.icon}
              {benefit.label}
            </span>
          </Badge>
        ))} */}

        {benefits.map((benefit) => {
          const isSelected = (field.value || []).includes(benefit.id)

          return (
            <Badge
              key={benefit.id}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => toggleBenefit(benefit.id)}
              className="cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm px-4 py-1.5 rounded-full"
            >
              <span className="flex items-center gap-2">
                {benefit.icon}
                {benefit.label}
              </span>
            </Badge>
          )
        })}
      </div>
      <div className="mt-4 text-sm text-muted-foreground font-medium">
        Selected Benefits:{' '}
        <span className="text-primary">{(field.value || []).length}</span>
      </div>
    </div>
  )
}

export default BenefitsSelector
