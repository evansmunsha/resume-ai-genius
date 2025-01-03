import pino from 'pino'

const pinoLogger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export const logger = {
  ...pinoLogger,
  trialStatus: (userId: string, data: any) => {
    pinoLogger.info({
      msg: `Trial status check for user ${userId}`,
      userId,
      ...data,
      event: 'trial_status_check'
    });
  },
  trialStarted: (userId: string, trialEnd: Date) => {
    pinoLogger.info({
      msg: `Trial started for user ${userId}`,
      userId,
      trialEnd,
      event: 'trial_started'
    });
  },
  trialExpired: (userId: string) => {
    pinoLogger.info({
      msg: `Trial expired for user ${userId}`,
      userId,
      event: 'trial_expired'
    });
  },
  discountApplied: (userId: string, couponId: string, amount: number) => {
    pinoLogger.info({
      msg: `Discount applied for user ${userId}`,
      userId,
      couponId,
      amount,
      event: 'discount_applied'
    });
  },
  error: (error: Error, context: string, userId?: string) => {
    pinoLogger.error({
      msg: `Error in ${context}`,
      error: error.message,
      stack: error.stack,
      userId,
      event: 'error'
    });
  }
};

export default logger;

