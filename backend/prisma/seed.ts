import {hash} from 'bcrypt';
import prismaClient from '../src/prismaClient';

const TEST_SIMPLE_MEMBER_ID = '12345';
const TEST_SIMPLE_MEMBER_ADDRESS = '123 Main St';
const TEST_SIMPLE_MEMBER_EMAIL = 'mail@mail.com';
const TEST_SIMPLE_MEMBER_NAME = 'jozko';
const TEST_SIMPLE_MEMBER_SURNAME = 'mrkvicka';
const TEST_SIMPLE_MEMBER_PHONE = '123456789';
const TEST_SIMPLE_MEMBER_IS_MANAGER = false;

const TEST_MANAGER_MEMBER_ID = '54321';
const TEST_MANAGER_MEMBER_ADDRESS = '12 Manager St';
const TEST_MANAGER_MEMBER_EMAIL = 'manager@mail.com';
const TEST_MANAGER_MEMBER_NAME = 'teufil';
const TEST_MANAGER_MEMBER_SURNAME = 'daheck';
const TEST_MANAGER_MEMBER_PHONE = '987654321';
const TEST_MANAGER_MEMBER_IS_MANAGER = true;

const TEST_DISTRICT_ID = '1';
const TEST_DISTRICT_NAME = 'Test District';

async function seed() {
  if (!(await prismaClient.user.findFirst({where: {username: 'test'}}))) {
    await prismaClient.user.create({
      data: {
        username: 'test',
        password: await hash('test', 10),
      },
    });
  }

  if (
    !(await prismaClient.user.findFirst({
      where: {id: TEST_SIMPLE_MEMBER_ID},
    }))
  ) {
    await prismaClient.member.create({
      data: {
        id: TEST_SIMPLE_MEMBER_ID,
        address: TEST_SIMPLE_MEMBER_ADDRESS,
        email: TEST_SIMPLE_MEMBER_EMAIL,
        name: TEST_SIMPLE_MEMBER_NAME,
        surname: TEST_SIMPLE_MEMBER_SURNAME,
        phone: TEST_SIMPLE_MEMBER_PHONE,
      },
    });
  }

  if (
    !(await prismaClient.user.findFirst({
      where: {id: TEST_MANAGER_MEMBER_ID},
    }))
  ) {
    await prismaClient.member.create({
      data: {
        id: TEST_MANAGER_MEMBER_ID,
        address: TEST_MANAGER_MEMBER_ADDRESS,
        email: TEST_MANAGER_MEMBER_EMAIL,
        name: TEST_MANAGER_MEMBER_NAME,
        surname: TEST_MANAGER_MEMBER_SURNAME,
        phone: TEST_MANAGER_MEMBER_PHONE,
      },
    });
  }

  if (
    !(await prismaClient.district.findFirst({
      where: {id: TEST_DISTRICT_ID},
    }))
  ) {
    await prismaClient.district.create({
      data: {
        id: TEST_DISTRICT_ID,
        name: TEST_DISTRICT_NAME,
        districtManager: {
          connect: {
            id: TEST_MANAGER_MEMBER_ID,
          },
        },
        members: {
          connect: [{id: TEST_SIMPLE_MEMBER_ID}, {id: TEST_MANAGER_MEMBER_ID}],
        },
      },
    });
  }
}

seed();
