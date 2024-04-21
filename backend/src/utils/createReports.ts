import {DataPerDistrict, FeesData, PollinationSubsidiesData, TreatingSubsidiesData} from './reportData';
import prismaClient from '../prismaClient';
import {
  createCountryFeesReport,
  createLocalFeesReport,
  createSubsidiesReport,
} from './pdfUtils';
import path from 'path';

export type FeesReport = {
  type: 'local' | 'country';
  filePath: string;
};

export async function createFeesReportPdfs(
  data: DataPerDistrict<FeesData>,
  year: number,
  dataFromDate: Date
): Promise<FeesReport[]> {
  const districtsNeeded = await prismaClient.district.findMany({
    where: {id: {in: Object.keys(data)}, deletedAt: null},
    orderBy: {id: 'asc'},
  });
  console.log('generating fees pdfs');

  const defaultPath = path.join(__dirname, '..', '..', 'uploads');

  const localFeesReportPath = path.join(defaultPath, 'fees-report-local.pdf');

  const localFeesReport = createLocalFeesReport({
    districts: districtsNeeded,
    year,
    data,
    dataFromDate,
  });
  localFeesReport.save(localFeesReportPath);

  const countryFeesReportPath = path.join(
    defaultPath,
    'fees-report-country.pdf'
  );
  const countryFeesReport = createCountryFeesReport({
    districts: districtsNeeded,
    year,
    data,
    dataFromDate,
  });
  countryFeesReport.save(countryFeesReportPath);

  return [{filePath: localFeesReportPath, type: 'local'}];
}

export async function createTreatingSubsidiesReportPdf(
  data: DataPerDistrict<TreatingSubsidiesData>,
  year: number,
  dataFromDate: Date
) {
  console.log('generating treating subsidies pdfs');

  const defaultPath = path.join(__dirname, '..', '..', 'uploads');

  const treatingSubsidiesReportPath = path.join(
    defaultPath,
    'treating-subsidies-report.pdf'
  );

  const treatingSubsidiesReport = await createSubsidiesReport({
    data,
    dataFromDate,
    type: 'treating',
    year,
  });

  treatingSubsidiesReport.save(treatingSubsidiesReportPath);
}

export async function createPollinationSubsidiesReportPdf(
  data: DataPerDistrict<PollinationSubsidiesData>,
  year: number,
  dataFromDate: Date
) {
  console.log('generating pollination subsidies pdfs');

  const defaultPath = path.join(__dirname, '..', '..', 'uploads');

  const pollinationSubsidiesReportPath = path.join(
    defaultPath,
    'pollination-subsidies-report.pdf'
  );

  const pollinationSubsidiesReport = await createSubsidiesReport({
    data,
    dataFromDate,
    type: 'pollination',
    year,
  });

  pollinationSubsidiesReport.save(pollinationSubsidiesReportPath);
}
