import {
  DataPerDistrict,
  FeesData,
  PollinationSubsidiesData,
  TreatingSubsidiesData,
} from './reportData';
import prismaClient from '../prismaClient';
import {
  createCountryFeesReport,
  createLocalFeesReport,
  createSubsidiesReport,
} from './pdfUtils';
import path from 'path';
import {access, mkdir} from 'fs/promises';
import {
  COUNTRY_FEES_REPORT_FILENAME,
  DEFAULT_REPORTS_PATH,
  LOCAL_FEES_REPORT_FILENAME,
  POLLINATION_REPORT_FILENAME,
  TREATING_REPORT_FILENAME,
} from '../constants';

export type PdfReport = {
  type:
    | 'localFees'
    | 'countryFees'
    | 'treatingSubsidies'
    | 'pollinationSubsidies';
  filePath: string;
};

export async function createFolderIfNotExists(path: string): Promise<void> {
  try {
    await access(path);
  } catch (error) {
    await mkdir(path, {recursive: true});
  }
}

export async function createFeesReportPdfs(
  data: DataPerDistrict<FeesData>,
  year: number,
  dataFromDate: Date,
  requestId: string
): Promise<PdfReport[]> {
  const districtsNeeded = await prismaClient.district.findMany({
    where: {id: {in: Object.keys(data)}, deletedAt: null},
    orderBy: {id: 'asc'},
  });
  console.log('generating fees pdfs');

  const localFeesReportPath = path.join(
    DEFAULT_REPORTS_PATH,
    requestId,
    LOCAL_FEES_REPORT_FILENAME
  );

  const localFeesReport = createLocalFeesReport({
    districts: districtsNeeded,
    year,
    data,
    dataFromDate,
  });
  localFeesReport.save(localFeesReportPath);

  const countryFeesReportPath = path.join(
    DEFAULT_REPORTS_PATH,
    requestId,
    COUNTRY_FEES_REPORT_FILENAME
  );
  const countryFeesReport = createCountryFeesReport({
    districts: districtsNeeded,
    year,
    data,
    dataFromDate,
  });
  countryFeesReport.save(countryFeesReportPath);

  return [
    {filePath: localFeesReportPath, type: 'localFees'},
    {filePath: countryFeesReportPath, type: 'countryFees'},
  ];
}

export async function createTreatingSubsidiesReportPdf(
  data: DataPerDistrict<TreatingSubsidiesData>,
  year: number,
  dataFromDate: Date,
  requestId: string
): Promise<PdfReport> {
  console.log('generating treating subsidies pdfs');

  const treatingSubsidiesReportPath = path.join(
    DEFAULT_REPORTS_PATH,
    requestId,
    TREATING_REPORT_FILENAME
  );

  const treatingSubsidiesReport = await createSubsidiesReport({
    data,
    dataFromDate,
    type: 'treating',
    year,
  });

  treatingSubsidiesReport.save(treatingSubsidiesReportPath);

  return {filePath: treatingSubsidiesReportPath, type: 'treatingSubsidies'};
}

export async function createPollinationSubsidiesReportPdf(
  data: DataPerDistrict<PollinationSubsidiesData>,
  year: number,
  dataFromDate: Date,
  requestId: string
): Promise<PdfReport> {
  console.log('generating pollination subsidies pdfs');

  const pollinationSubsidiesReportPath = path.join(
    DEFAULT_REPORTS_PATH,
    requestId,
    POLLINATION_REPORT_FILENAME
  );

  const pollinationSubsidiesReport = await createSubsidiesReport({
    data,
    dataFromDate,
    type: 'pollination',
    year,
  });

  pollinationSubsidiesReport.save(pollinationSubsidiesReportPath);

  return {
    filePath: pollinationSubsidiesReportPath,
    type: 'pollinationSubsidies',
  };
}
