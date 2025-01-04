import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { feedbackSchema } from '@/lib/validations/feedback'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  let userId: string | null = null;
  try {
    const auth_result = await auth();
    userId = auth_result.userId;
    if (!userId) {
      return new NextResponse("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      });
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

    return NextResponse.json(feedback, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  let userId: string | null = null;
  try {
    const auth_result = await auth();
    userId = auth_result.userId;
    if (!userId) {
      return new NextResponse("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      });
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

    return NextResponse.json({
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

