import { OnboardingForm } from '@/components/forms/onboarding/OnboardingForm'
import { prisma } from '../utils/db'
import { redirect } from 'next/navigation'
import { auth } from '../utils/auth'
import { requireUser } from '../utils/requireUser'

async function checkIfUserHasFinishedOnboarding(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onboardingCompleted: true,
    },
  })

  if (user?.onboardingCompleted === true) {
    return redirect('/')
  }
  return user
}

export default async function OnboardingPage() {
  const session = await requireUser()
  await checkIfUserHasFinishedOnboarding(session.id as string)

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <OnboardingForm />
    </div>
  )
}
