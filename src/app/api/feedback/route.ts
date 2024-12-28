import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { feedbackSchema } from '@/lib/validations/feedback'
import logger from '@/lib/logger'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      logger.warn('Unauthorized attempt to submit feedback')
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = feedbackSchema.parse(json)

    const feedback = await prisma.feedback.create({
      data: {
        rating: body.rating,
        comment: body.comment,
        userId: userId,
      },
    })

    logger.info({ feedbackId: feedback.id }, 'Feedback submitted successfully')
    return NextResponse.json(feedback)
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ err: error }, 'Error submitting feedback')
      return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
    logger.error('Unknown error submitting feedback')
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      logger.warn('Unauthorized attempt to fetch feedback')
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.feedback.count(),
    ])

    logger.info({ page, limit, total }, 'Feedback fetched successfully')
    return NextResponse.json({
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ err: error }, 'Error fetching feedback')
      return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
    logger.error('Unknown error fetching feedback')
    return new NextResponse("Internal Error", { status: 500 })
  }
}

