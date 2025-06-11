'use server'

import { requireUser } from './utils/requireUser'
import { z } from 'zod'
import { companySchema, jobSchema, jobSeekerSchema } from './utils/zodSchemas'
import { prisma } from './utils/db'
import { redirect } from 'next/navigation'
import arcjet, { detectBot, shield } from './utils/arcjet'
import { request } from '@arcjet/next'
import { jobListingDurationPricing } from './utils/jobListingDurationPricing'

const aj = arcjet
  .withRule(
    shield({
      // LIVE in prod and DRY_RUN in dev
      mode: 'LIVE',
    })
  )
  .withRule(
    detectBot({
      mode: 'LIVE',
      allow: [],
    })
  )

export async function createCompany(data: z.infer<typeof companySchema>) {
  try {
    const session = await requireUser()

    const req = await request()

    const decision = await aj.protect(req)

    if (decision.isDenied()) {
      throw new Error('Forbidden')
    }

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

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await requireUser()

  const req = await request()

  const decision = await aj.protect(req)

  if (decision.isDenied()) {
    throw new Error('Forbidden')
  }

  const validateData = jobSeekerSchema.parse(data)

  await prisma.user.update({
    where: {
      id: user.id ?? '',
    },
    data: {
      onboardingCompleted: true,
      userType: 'JOB_SEEKER',
      JobSeeker: {
        create: {
          ...validateData,
        },
      },
    },
  })
  return redirect('/')
}

export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await requireUser()

  const req = await request()

  const decision = await aj.protect(req)

  if (decision.isDenied()) {
    throw new Error('Forbidden')
  }

  const validateData = jobSchema.parse(data)

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  })

  if (!company?.id) {
    return redirect('/')
  }

  await prisma.jobPost.create({
    data: {
      jobDescription: validateData.jobDescription,
      jobTitle: validateData.jobTitle,
      employmentType: validateData.employmentType,
      location: validateData.location,
      salaryFrom: validateData.salaryFrom,
      salaryTo: validateData.salaryTo,
      listingDuration: validateData.listingDuration,
      benefits: validateData.benefits,
      companyId: company.id,
    },
    select: {
      id: true,
    },
  })

  return redirect('/')
}
