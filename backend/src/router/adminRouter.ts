import express from 'express';
import prismaClient from '../prismaClient';

export const adminRouter = express.Router();

adminRouter.get('/', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  try {
    const adminData = await prismaClient.adminData.findMany();
    return res.json(adminData);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong');
  }
});

adminRouter.post('/', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  const {
    year,
    treatingAmount,
    pollinationAmount,
    membershipLocal,
    membershipCountry,
    voluntaryDonationInter,
    voluntaryDonationExter,
  } = req.body;
  if (!year) return res.status(400).send('Year is required');
  if (!treatingAmount)
    return res.status(400).send('Treating amount is required');
  if (!pollinationAmount)
    return res.status(400).send('Pollination amount is required');
  if (!membershipLocal)
    return res.status(400).send('Local membership is required');
  if (!membershipCountry)
    return res.status(400).send('Country membership is required');
  if (!voluntaryDonationInter)
    return res.status(400).send('Internal voluntary donation is required');
  if (!voluntaryDonationExter)
    return res.status(400).send('External voluntary donation is required');

  const parsedData = {
    pollinationAmount: parseFloat(pollinationAmount),
    treatingAmount: parseFloat(treatingAmount),
    membershipLocal: parseFloat(membershipLocal),
    membershipCountry: parseFloat(membershipCountry),
    voluntaryDonationInter: parseFloat(voluntaryDonationInter),
    voluntaryDonationExter: parseFloat(voluntaryDonationExter),
    year,
  };

  try {
    if (await prismaClient.adminData.findUnique({where: {year}}))
      return res.status(400).send('Data for this year already exists');
    const adminData = await prismaClient.adminData.create({data: parsedData});
    return res.json(adminData);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong');
  }
});

adminRouter.put('/:year', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  const {year} = req.params;
  const {
    treatingAmount,
    pollinationAmount,
    year: newYear,
    membershipLocal,
    membershipCountry,
    voluntaryDonationInter,
    voluntaryDonationExter,
    decreeNumber,
  } = req.body;
  if (!treatingAmount)
    return res.status(400).send('Treating amount is required');
  if (!pollinationAmount)
    return res.status(400).send('Pollination amount is required');
  if (!newYear) return res.status(400).send('Year is required');
  if (!membershipLocal)
    return res.status(400).send('Local membership is required');
  if (!membershipCountry)
    return res.status(400).send('Country membership is required');
  if (!voluntaryDonationInter)
    return res.status(400).send('Internal voluntary donation is required');
  if (!voluntaryDonationExter)
    return res.status(400).send('External voluntary donation is required');
  if (!decreeNumber) return res.status(400).send('Decree is required');

  const parsedData = {
    year: newYear || undefined,
    pollinationAmount: parseFloat(pollinationAmount) || undefined,
    treatingAmount: parseFloat(treatingAmount) || undefined,
    membershipLocal: parseFloat(membershipLocal) || undefined,
    membershipCountry: parseFloat(membershipCountry) || undefined,
    voluntaryDonationInter: parseFloat(voluntaryDonationInter) || undefined,
    voluntaryDonationExter: parseFloat(voluntaryDonationExter) || undefined,
    decreeNumber: decreeNumber || undefined,
  };

  try {
    const adminData = await prismaClient.adminData.update({
      where: {year},
      data: {...parsedData},
    });
    return res.json(adminData);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong');
  }
});

adminRouter.delete('/', async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  const {year} = req.body;
  if (!year) return res.status(400).send('Year is required');
  try {
    await prismaClient.adminData.delete({where: {year}});
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong');
  }
});
