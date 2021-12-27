import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { prismaClient } from '../prismaClient';

jest.mock('../prismaClient', () => ({
  __esModule: true,
  prismaClient: mockDeep<PrismaClient>(),
}))

export const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
  prismaMock && mockReset(prismaMock)
})
