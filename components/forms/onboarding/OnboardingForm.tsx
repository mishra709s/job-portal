'use client'
import { useState } from 'react'
import Image from 'next/image'
import Logo from '@/public/logo.png'
import { Card, CardContent } from '@/components/ui/card'
import { UserTypeSelection } from '@/app/onboarding/UserTypeForm'
import { CompanyForm } from './CompanyForm'

type UserSelectionType = 'company' | 'jobSeeker' | null

export function OnboardingForm() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserSelectionType>(null)

  const handleUserTypeSelection = (type: UserSelectionType) => {
    setUserType(type)
    setStep(2)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UserTypeSelection onSelect={handleUserTypeSelection} />
      case 2:
        return userType === 'company' ? (
          <CompanyForm />
        ) : (
          <p>User is a Job Seeker</p>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-10">
        <Image src={Logo} alt="JobPortal Logo" width={50} height={50} />
        <h1 className="text-4xl font-bold cursor-pointer">
          Job<span className="text-primary">Portal</span>
        </h1>
      </div>

      <Card className="max-w-lg w-full">
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </>
  )
}
