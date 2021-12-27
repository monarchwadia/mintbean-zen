import { User } from '@prisma/client';
import {createMockContext} from '@shopify/jest-koa-mocks';
import { prismaMock } from '../../test/prismaMock';
import { createUser } from '../user/dao';
import {setUserMiddleware} from "./middleware";

describe("create new user", () => {
  it("should create new user", async () => {
    const user: User = {
      id: '',
      createdAt: null,
      email: '',
      name: null,
      passwordHash: '',
      isAdmin: false
    }
    
    prismaMock.user.create.mockResolvedValue(user);

    await expect(createUser({...user, password: ''})).resolves.toEqual(user)
  });

})

describe("setUserMiddleware", () => {
  // it("sets the user correctly, then calls next", async () => {
  //   const mockCtx = createMockContext();
  //   const mockNext = jest.fn(() => Promise.resolve());

  //   await setUserMiddleware(mockCtx, mockNext);

  // })
})