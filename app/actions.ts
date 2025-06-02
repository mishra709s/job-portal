'use server'

import { requireUser } from './utils/requireUser'
import { z } from 'zod'
import { companySchema } from './utils/zodSchemas'
import { prisma } from './utils/db'
import { redirect } from 'next/navigation'

export async function createCompany(data: z.infer<typeof companySchema>) {
  try {
    const session = await requireUser()

    if (!session) {
      throw new Error('Unauthorized - Please sign in')
    }

    const validateData = companySchema.parse(data)

    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        onboardingCompleted: true,
        userType: 'COMPANY',
        Company: {
          create: {
            ...validateData,
          },
        },
      },
    })

    return redirect('/')
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Something went wrong' }
  }
}
