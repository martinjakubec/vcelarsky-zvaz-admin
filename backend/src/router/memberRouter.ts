import express from 'express';
import prismaClient from '../prismaClient';
import {District} from '@prisma/client';

const memberRouter = express.Router();

memberRouter.get('/', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  try {
    const members = await prismaClient.member.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        deletedAt: false,
        address: true,
        district: true,
        email: true,
        id: true,
        name: true,
        phone: true,
        surname: true,
        districtId: true,
        isManager: true,
        managerDistrict: true,
      },
    });
    return res.json(members);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
});

memberRouter.get('/:farmId', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  try {
    const member = await prismaClient.member.findUnique({
      where: {
        id: req.params.farmId,
        deletedAt: null,
      },
      include: {
        district: true,
        managerDistrict: true,
      },
    });
    if (!member) return res.status(404).send('Member not found');
    return res.json(member);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
});

memberRouter.post('/', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  if (!req.body) return res.status(400).send('Bad request');
  const {name, email, surname, id, address, phone, districtId} = req.body;
  console.log(req.body);

  if (!id) return res.status(400).send('Id is required');
  if (!name) return res.status(400).send('Name is required');
  if (!surname) return res.status(400).send('Surname is required');
  if (!address) return res.status(400).send('Adress is required');

  try {
    if (await prismaClient.member.findUnique({where: {id}}))
      return res.status(400).send('Member already exists');

    let district: District | null = null;
    if (districtId) {
      district = await prismaClient.district.findUnique({
        where: {
          id: districtId,
        },
      });
    }
    const member = await prismaClient.member.create({
      data: {
        name,
        email,
        surname,
        id,
        address,
        phone,
        district: district ? {connect: {id: district.id}} : undefined,
      },
    });
    return res.json(member);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
});

memberRouter.put('/:farmId', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  if (!req.body) return res.status(400).send('Bad request');
  const {name, email, surname, address, phone, districtId, id} = req.body;

  if (id === null) return res.status(400).send('Id is required');
  if (name === null) return res.status(400).send('Name is required');
  if (surname === null) return res.status(400).send('Surname is required');
  if (address === null) return res.status(400).send('Adress is required');

  try {
    const member = await prismaClient.member.findUnique({
      where: {
        id: req.params.farmId,
      },
    });
    if (!member) return res.status(404).send('Member not found');
    let district: District | null = null;
    if (districtId) {
      district = await prismaClient.district.findUnique({
        where: {
          id: districtId,
        },
      });
    }
    const updatedMember = await prismaClient.member.update({
      where: {
        id: req.params.farmId,
      },
      data: {
        id,
        name,
        email,
        surname,
        address,
        phone,
        district: district ? {connect: {id: district.id}} : undefined,
      },
    });
    return res.json(updatedMember);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
});

memberRouter.delete('/', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  if (!req.body) return res.status(400).send('Bad request');
  const {id} = req.body;
  if (!id) return res.status(400).send('Id is required');

  try {
    if (
      !(await prismaClient.member.findUnique({
        where: {
          id,
        },
      }))
    )
      return res.status(404).send('Member not found');
    const deletedMember = await prismaClient.member.delete({
      where: {
        id,
      },
    });
    return res.json(deletedMember);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
});

export default memberRouter;
