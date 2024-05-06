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
  PdfReport,
  createFeesReportPdfs,
  createPollinationSubsidiesReportPdf,
  createTreatingSubsidiesReportPdf,
} from '../utils/createReports';
import path from 'path';
import {DEFAULT_REPORTS_PATH, DEFAULT_UPLOADS_PATH} from '../constants';
import {createFolderMiddleware} from '../middleware/uploadMiddleware';
import AdmZip from 'adm-zip';

const storage = multer.diskStorage({
  destination: DEFAULT_UPLOADS_PATH,
  filename: function (req, file, callback) {
    const fileName = file.originalname.split('.').join(`-${req.requestId}.`);

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

reportsRouter.post(
  '/',
  createFolderMiddleware,
  upload.single('file'),
  async (req, res) => {
    if (!res.locals.isUserLoggedIn) return res.status(401).send('Unauthorized');
    const {
      year,
      dataFrom,
      feesReport,
      pollinationSubsidies,
      treatingSubsidies,
    } = req.body;
    if (!year) return res.status(400).send('Year is required');
    if (!dataFrom) return res.status(400).send('Data from date is required');

    try {
      const filePath = path.join(
        DEFAULT_UPLOADS_PATH,
        `${req.file?.originalname.split('.')[0]}-${req.requestId}.csv`
      );

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
        await createFeesReportPdfs(feesData, year, dataFromDate, req.requestId);
      }

      if (pollinationSubsidies === 'true') {
        const pollinationSubsidiesData =
          sortDataIntoDistricts<PollinationSubsidiesData>(
            calculatePollinationSubsidies(csvData, memberData, adminData)
          );

        await createPollinationSubsidiesReportPdf(
          pollinationSubsidiesData,
          year,
          dataFromDate,
          req.requestId
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
          dataFromDate,
          req.requestId
        );
      }

      await rm(filePath);

      const zip = new AdmZip();

      await zip.addLocalFolder(path.join(DEFAULT_REPORTS_PATH, req.requestId));
      zip.writeZip(
        path.join(DEFAULT_REPORTS_PATH, req.requestId, 'reports.zip')
      );

      return res
        .on('finish', async () => {
          await rm(path.join(DEFAULT_REPORTS_PATH, req.requestId), {
            recursive: true,
          });
        })
        .header('Content-Disposition', 'attachment; filename="reports.zip"')
        .contentType('application/zip')
        .sendFile(
          path.join(DEFAULT_REPORTS_PATH, req.requestId, 'reports.zip')
        );
    } catch (err) {
      console.error(err);
      return res.status(500).send('Something went wrong');
    }
  }
);
