import express from 'express';
import multer from 'multer';
import {parseCsvFile} from '../utils/parseCsv';
import prismaClient from '../prismaClient';
import {rm} from 'fs/promises';
import {
  FeesData,
  PollinationSubsidiesData,
  TreatingSubsidiesData,
  calculateFees,
  calculatePollinationSubsidies,
  calculateTreatingSubsidies,
  sortDataIntoDistricts,
} from '../utils/reportData';
import {
  createFeesReportPdfs,
  createPollinationSubsidiesReportPdf,
  createTreatingSubsidiesReportPdf,
} from '../utils/createReports';
import {createSubsidiesReport} from '../utils/pdfUtils';

const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, callback) {
    const fileName = file.originalname.split('.').join(`-${req.requestTime}.`);

    callback(null, fileName);
  },
});

const upload = multer({
  storage,
  preservePath: true,
  fileFilter: (req, file, cb) => {
    file.originalname.endsWith('.csv')
      ? cb(null, true)
      : cb(new Error('File is not a .csv file.'));
  },
});

export const reportsRouter = express.Router();

reportsRouter.post('/', upload.single('file'), async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
  const {year, dataFrom, feesReport, pollinationSubsidies, treatingSubsidies} =
    req.body;
  if (!year) return res.status(400).send('Year is required');
  if (!dataFrom) return res.status(400).send('Data from date is required');

  try {
    const filePath = `./uploads/${req.file?.originalname.split('.')[0]}-${
      req.requestTime
    }.csv`;
    const csvData = await parseCsvFile(filePath);
    const adminData = await prismaClient.adminData.findFirst({
      where: {
        year: year,
      },
    });

    if (!adminData)
      return res.status(404).send(`Admin data not found for ${year}`);

    const memberData = await prismaClient.member.findMany({
      where: {
        deletedAt: null,
        id: {
          in: csvData.map((data) => data.id.toString()),
        },
      },
    });

    const dataFromDate = new Date(dataFrom);

    if (feesReport === 'true') {
      const feesData = sortDataIntoDistricts<FeesData>(
        calculateFees(csvData, memberData, adminData)
      );
      await createFeesReportPdfs(feesData, year, dataFromDate);
    }

    if (pollinationSubsidies === 'true') {
      const pollinationSubsidiesData =
        sortDataIntoDistricts<PollinationSubsidiesData>(
          calculatePollinationSubsidies(csvData, memberData, adminData)
        );

      await createPollinationSubsidiesReportPdf(
        pollinationSubsidiesData,
        year,
        dataFromDate
      );
    }

    if (treatingSubsidies === 'true') {
      const treatingSubsidiesData =
        sortDataIntoDistricts<TreatingSubsidiesData>(
          calculateTreatingSubsidies(csvData, memberData, adminData)
        );
      await createTreatingSubsidiesReportPdf(
        treatingSubsidiesData,
        year,
        dataFromDate
      );
    }

    await rm(filePath);

    return res.status(200).send('Report generated successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong');
  }
});
