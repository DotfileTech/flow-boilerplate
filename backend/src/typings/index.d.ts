export {}

declare global {
  namespace Express {
    interface Request {
      organizationId: string
      locals: any
      auth: any
      emailVerified: any
    }
  }
}