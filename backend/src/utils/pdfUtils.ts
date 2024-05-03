import jsPDF from 'jspdf';
import {robotoNormal} from '../fonts/Roboto-normal';
import {robotoBold} from '../fonts/Roboto-bold';
import {robotoItalic} from '../fonts/Roboto-italic';
import {robotoBoldItalic} from '../fonts/Roboto-bolditalic';
import {
  COUNTRY_FEES_TABLE_COLOR,
  LOCAL_FEES_TABLE_COLOR,
  PDF_NORMAL_TEXT_FONT_SIZE,
  PDF_TABLE_TEXT_FONT_SIZE,
  PDF_TITLE_FONT_SIZE,
  POLLINATION_TABLE_COLOR,
  TREATING_TABLE_COLOR,
} from '../constants';
import {District} from '@prisma/client';
import {
  DataPerDistrict,
  FeesData,
  PollinationSubsidiesData,
  TreatingSubsidiesData,
} from './reportData';
import prismaClient from '../prismaClient';

export function setupPdfDocument(): jsPDF {
  const document = new jsPDF({orientation: 'landscape'});
  document.addFileToVFS('Roboto-normal.ttf', robotoNormal);
  document.addFont('Roboto-normal.ttf', 'Roboto', 'normal');
  document.addFileToVFS('Roboto-bold.ttf', robotoBold);
  document.addFont('Roboto-bold.ttf', 'Roboto', 'bold');
  document.addFileToVFS('Roboto-italic.ttf', robotoItalic);
  document.addFont('Roboto-italic.ttf', 'Roboto', 'italic');
  document.addFileToVFS('Roboto-bolditalic.ttf', robotoBoldItalic);
  document.addFont('Roboto-bolditalic.ttf', 'Roboto', 'bolditalic');
  return document;
}

interface HeaderOptions {
  year: number;
  district: District;
}

interface FeesPageHeaderOptions extends HeaderOptions {
  type: 'local' | 'country';
}

export function addFeesPageHeader(
  document: jsPDF,
  {type, year, district}: FeesPageHeaderOptions
) {
  document.setFont('Roboto', 'bolditalic');
  document.setFontSize(PDF_TITLE_FONT_SIZE);
  document.text(
    `Členské ${year} pre ${type === 'local' ? 'ZO' : 'SZV'}`,
    10,
    15
  );
  document.text(`Menný zoznam členov ZO po obvodoch`, 100, 15);
  document.setFontSize(PDF_NORMAL_TEXT_FONT_SIZE);
  document.setFont('Roboto', 'normal');
  document.text('Základná organizácia SZV Liptovský Mikuláš', 10, 20);
  document.text(`Obvod ${district.id} ${district.name}`, 10, 25);
}

export interface FeesReportArgs {
  year: number;
  districts: District[];
  data: DataPerDistrict<FeesData>;
  dataFromDate: Date;
}

export function createLocalFeesReport({
  districts,
  year,
  data,
  dataFromDate,
}: FeesReportArgs): jsPDF {
  const doc = setupPdfDocument();
  let totalMembers = 0;
  let totalHives = 0;
  let totalAmount = 0;
  for (let district of districts) {
    let localFee: string | undefined;
    let voluntaryDonationInter: string | undefined;
    let voluntaryDonationExter: string | undefined;
    addFeesPageHeader(doc, {type: 'local', year, district});
    doc.table(
      10,
      30,
      [
        ...data[district.id].map((data, index) => {
          totalMembers++;
          totalHives += data.numberOfHives;
          totalAmount += data.localFee;
          const feesData = data as FeesData;
          localFee = feesData.localFee.toString();
          voluntaryDonationInter = feesData.voluntaryDonationInter
            .toFixed(2)
            .toString()
            .replace('.', ',');
          voluntaryDonationExter = feesData.voluntaryDonationExter
            .toFixed(2)
            .toString()
            .replace('.', ',');

          return {
            number: (index + 1).toString(),
            memberId: data.member.id,
            memberOldId: data.member.oldId || '-',
            name: `${
              district.districtManagerId === data.member.id ? '  ' : ''
            }${data.member.surname} ${data.member.name}${
              data.member.title ? ', ' + data.member.title : ''
            }`,
            address: `${data.member.addressStreet}, ${data.member.addressCity}`,
            birthDate: `${data.member.birthDate?.toLocaleDateString() || ' '}`,
            numberOfHives: data.numberOfHives.toString(),
            localFee: feesData.localFee.toFixed(2).replace('.', ','),
            insurance: ' ',
            total: ' ',
            signature: ' ',
          };
        }),
      ],
      [
        {
          width: 20,
          align: 'left',
          name: 'number',
          padding: 1,
          prompt: 'P.č.',
        },
        {
          width: 20,
          align: 'left',
          name: 'memberId',
          padding: 1,
          prompt: 'Č. farmy',
        },
        {
          width: 20,
          align: 'left',
          name: 'memberOldId',
          padding: 1,
          prompt: 'Č. v CRV',
        },
        {
          width: 50,
          align: 'left',
          name: 'name',
          padding: 1,
          prompt: 'Meno',
        },
        {
          width: 75,
          align: 'left',
          name: 'address',
          padding: 1,
          prompt: 'Adresa',
        },
        {
          width: 30,
          align: 'left',
          name: 'birthDate',
          padding: 1,
          prompt: 'Dátum narodenia',
        },
        {
          width: 30,
          align: 'left',
          name: 'numberOfHives',
          padding: 1,
          prompt: `Včelstvá v CRV ku\n${dataFromDate.toLocaleDateString()}`,
        },
        {
          width: 30,
          align: 'left',
          name: 'localFee',
          padding: 1,
          prompt: `Členské ZO SZV\n${localFee} € / včelára`,
        },
        {
          width: 30,
          align: 'left',
          name: 'insurance',
          padding: 1,
          prompt: `Poistné ZO\n${voluntaryDonationInter} € intra.\n${voluntaryDonationExter} € extra.`,
        },
        {
          width: 22,
          align: 'left',
          name: 'total',
          padding: 1,
          prompt: 'Celkom €',
        },
        {
          width: 40,
          align: 'left',
          name: 'signature',
          padding: 1,
          prompt: 'Podpis',
        },
      ],
      {
        padding: 1,
        fontSize: PDF_TABLE_TEXT_FONT_SIZE,
        headerBackgroundColor: LOCAL_FEES_TABLE_COLOR,
        cellStart(e, doc) {
          if (e.data.startsWith('  ')) {
            doc.setFont('Roboto', 'bolditalic');
          } else {
            doc.setFont('Roboto', 'normal');
          }
        },
      }
    );

    doc.cell(10, 0, 150.25, 0, '', 1, '');
    doc.cell(10, 0, 11, 0, 'Spolu:', 1, '');
    doc.cell(
      10,
      0,
      22.5,
      5,
      data[district.id]
        .reduce((prev, next) => {
          return prev + next.numberOfHives;
        }, 0)
        .toString(),
      1,
      ''
    );
    doc.cell(
      10,
      0,
      22.5,
      5,
      data[district.id]
        .reduce((prev, next) => {
          return prev + next.localFee;
        }, 0)
        .toFixed(2)
        .replace('.', ','),
      1,
      ''
    );
    doc.addPage();
  }
  addTotalFooter(doc, {
    totalMembers,
    totalHives,
    totalAmount,
    tableColor: LOCAL_FEES_TABLE_COLOR,
  });

  return doc;
}

export function createCountryFeesReport({
  districts,
  year,
  data,
  dataFromDate,
}: FeesReportArgs): jsPDF {
  const doc = setupPdfDocument();
  const countryFee =
    data[districts[0].id][0].countryFee /
    data[districts[0].id][0].numberOfHives;
  let totalMembers = 0;
  let totalHives = 0;
  let totalAmount = 0;
  for (let district of districts) {
    addFeesPageHeader(doc, {type: 'country', year, district});
    doc.table(
      10,
      30,
      [
        ...data[district.id].map((data, index) => {
          totalMembers++;
          totalHives += data.numberOfHives;
          totalAmount += data.countryFee;

          const feesData = data as FeesData;

          return {
            number: (index + 1).toString(),
            memberId: data.member.id,
            memberOldId: data.member.oldId || '-',
            name: `${
              district.districtManagerId === data.member.id ? '  ' : ''
            }${data.member.surname} ${data.member.name}${
              data.member.title ? ', ' + data.member.title : ''
            }`,
            address: `${data.member.addressStreet}, ${data.member.addressCity}`,
            birthDate: `${data.member.birthDate?.toLocaleDateString() || ' '}`,
            numberOfHives: data.numberOfHives.toString(),
            countryFee: feesData.countryFee.toFixed(2).replace('.', ','),
            signature: ' ',
          };
        }),
      ],
      [
        {
          width: 20,
          align: 'left',
          name: 'number',
          padding: 1,
          prompt: 'P.č.',
        },
        {
          width: 20,
          align: 'left',
          name: 'memberId',
          padding: 1,
          prompt: 'Č. farmy',
        },
        {
          width: 20,
          align: 'left',
          name: 'memberOldId',
          padding: 1,
          prompt: 'Č. v CRV',
        },
        {
          width: 50,
          align: 'left',
          name: 'name',
          padding: 1,
          prompt: 'Meno',
        },
        {
          width: 75,
          align: 'left',
          name: 'address',
          padding: 1,
          prompt: 'Adresa',
        },
        {
          width: 30,
          align: 'left',
          name: 'birthDate',
          padding: 1,
          prompt: 'Dátum narodenia',
        },
        {
          width: 30,
          align: 'left',
          name: 'numberOfHives',
          padding: 1,
          prompt: `Včelstvá v CRV ku\n${dataFromDate.toLocaleDateString()}`,
        },
        {
          width: 30,
          align: 'left',
          name: 'countryFee',
          padding: 1,
          prompt: `Členské SZV\n${countryFee} € / včelára`,
        },
        {
          width: 40,
          align: 'left',
          name: 'signature',
          padding: 1,
          prompt: 'Podpis',
        },
      ],
      {
        padding: 1,
        fontSize: PDF_TABLE_TEXT_FONT_SIZE,
        headerBackgroundColor: COUNTRY_FEES_TABLE_COLOR,
        cellStart(e, doc) {
          if (e.data.startsWith('  ')) {
            doc.setFont('Roboto', 'bolditalic');
          } else {
            doc.setFont('Roboto', 'normal');
          }
        },
      }
    );

    doc.cell(10, 0, 150.25, 0, '', 1, '');
    doc.cell(10, 0, 11, 0, 'Spolu:', 1, '');
    doc.cell(
      10,
      0,
      22.5,
      5,
      data[district.id]
        .reduce((prev, next) => {
          return prev + next.numberOfHives;
        }, 0)
        .toString(),
      1,
      ''
    );
    doc.cell(
      10,
      0,
      22.5,
      5,
      data[district.id]
        .reduce((prev, next) => {
          return prev + next.countryFee;
        }, 0)
        .toFixed(2)
        .replace('.', ','),
      1,
      ''
    );
    doc.addPage();
  }
  addTotalFooter(doc, {
    totalMembers,
    totalHives,
    totalAmount,
    tableColor: COUNTRY_FEES_TABLE_COLOR,
  });

  return doc;
}

interface SubsidiesPageHeaderOptions extends HeaderOptions {
  type: 'treating' | 'pollination';
}

export async function addSubsidiesPageHeader(
  document: jsPDF,
  {year, district, type}: SubsidiesPageHeaderOptions
): Promise<void> {
  const subsidiesAdminData = await prismaClient.adminData.findFirst({
    where: {year: year.toString()},
  });
  if (!subsidiesAdminData) {
    throw new Error(`Admin data for year ${year} not found`);
  }
  let description: string;
  switch (type) {
    case 'treating':
      description = `Zoznam včelárov, ktorým bola vyplatená dotácia na liečivo za rok ${year} - ${subsidiesAdminData?.treatingAmount
        .toString()
        .replace('.', ',')} € / včelstvo`;
      break;
    case 'pollination':
      description = `Zoznam včelárov, ktorým bola vyplatená dotácia podľa Výnosu MPRV SR č.${
        subsidiesAdminData?.decreeNumber || ' '
      }, na opeľovaciu činnosť, za rok ${year} - ${subsidiesAdminData?.pollinationAmount
        .toString()
        .replace('.', ',')} € / včelstvo`;
      break;
  }
  document.setFont('Roboto', 'bolditalic');
  document.setFontSize(PDF_TITLE_FONT_SIZE);
  document.text(`Výplatná listina`, 10, 15);
  document.setFontSize(PDF_NORMAL_TEXT_FONT_SIZE);
  document.setFont('Roboto', 'normal');
  document.text('Základná organizácia SZV Liptovský Mikuláš', 10, 20);
  document.text(description, 10, 25);
  document.text(`Obvod ${district.id} ${district.name}`, 10, 30);
}

interface SubsidiesFooterOptions {
  totalMembers: number;
  totalHives: number;
  totalAmount: number;
  tableColor: string;
}

export function addTotalFooter(
  document: jsPDF,
  {totalMembers, totalHives, totalAmount, tableColor}: SubsidiesFooterOptions
): void {
  document.setFontSize(PDF_TITLE_FONT_SIZE);
  document.setFont('Roboto', 'bolditalic');
  document.text('Sumár', 10, 10);
  document.setFontSize(PDF_NORMAL_TEXT_FONT_SIZE);
  document.setFont('Roboto', 'normal');
  document.table(
    10,
    20,
    [
      {
        totalMembers: totalMembers.toString(),
        totalHives: totalHives.toString(),
        totalAmount: totalAmount.toFixed(2).replace('.', ','),
      },
    ],
    [
      {
        name: 'totalMembers',
        prompt: 'Počet včelárov',
        align: 'left',
        padding: 1,
        width: 50,
      },
      {
        name: 'totalHives',
        prompt: 'Počet včelstiev',
        align: 'left',
        padding: 1,
        width: 50,
      },
      {
        name: 'totalAmount',
        prompt: 'Celková suma €',
        align: 'left',
        padding: 1,
        width: 50,
      },
    ],
    {
      padding: 1,
      fontSize: PDF_TABLE_TEXT_FONT_SIZE,
      headerBackgroundColor: tableColor,
    }
  );

  const dots = '..................................................';
  const leftPadding = 122;

  document.text(`V Liptovskom Mikuláši dňa: ${dots}`, leftPadding, 50, {
    align: 'right',
    maxWidth: 150,
  });
  document.text(`Vystavil: ${dots}`, leftPadding, 60, {align: 'right'});
  document.text(`Podpis: ${dots}`, leftPadding, 70, {
    align: 'right',
  });
}

export interface SubsidiesReportArgs<
  T extends TreatingSubsidiesData | PollinationSubsidiesData
> {
  type: 'treating' | 'pollination';
  year: number;
  data: DataPerDistrict<T>;
  dataFromDate: Date;
}

export async function createSubsidiesReport<
  T extends TreatingSubsidiesData | PollinationSubsidiesData
>({data, dataFromDate, year, type}: SubsidiesReportArgs<T>): Promise<jsPDF> {
  const districtsNeeded = await prismaClient.district.findMany({
    where: {id: {in: Object.keys(data)}, deletedAt: null},
    orderBy: {id: 'asc'},
  });

  let totalMembers = 0;
  let totalHives = 0;
  let totalAmount = 0;

  const doc = setupPdfDocument();
  for (let district of districtsNeeded) {
    await addSubsidiesPageHeader(doc, {type, year, district});

    doc.table(
      10,
      35,
      [
        ...data[district.id].map((data, index) => {
          totalMembers++;
          totalHives += data.numberOfHives;
          totalAmount +=
            'treatingSubsidies' in data
              ? data.treatingSubsidies
              : data.pollinationSubsidies;
          if ('treatingSubsidies' in data) {
            return {
              number: (index + 1).toString(),
              id: data.member.id,
              oldId: data.member.oldId || '-',
              name: `${
                district.districtManagerId === data.member.id ? '  ' : ''
              }${data.member.surname} ${data.member.name}${
                data.member.title ? ', ' + data.member.title : ''
              }`,
              address: `${data.member.addressStreet}, ${data.member.addressCity}`,
              birthDate: data.member.birthDate?.toLocaleDateString() || ' ',
              numberOfHives: data.numberOfHives.toString(),
              amount: data.treatingSubsidies
                .toFixed(2)
                .toString()
                .replace('.', ','),
              signature: ' ',
            };
          } else {
            return {
              number: (index + 1).toString(),
              id: data.member.id,
              oldId: data.member.oldId || '-',
              name: `${
                district.districtManagerId === data.member.id ? '  ' : ''
              }${data.member.surname} ${data.member.name}${
                data.member.title ? ', ' + data.member.title : ''
              }`,
              address: `${data.member.addressStreet}, ${data.member.addressCity}`,
              birthDate: data.member.birthDate?.toLocaleDateString() || ' ',
              numberOfHives: data.numberOfHives.toString(),
              amount: data.pollinationSubsidies
                .toFixed(2)
                .toString()
                .replace('.', ','),
              signature: ' ',
            };
          }
        }),
      ],
      [
        {
          name: 'number',
          width: 20,
          align: 'left',
          padding: 1,
          prompt: 'P.č.',
        },
        {
          name: 'id',
          width: 30,
          align: 'left',
          padding: 1,
          prompt: 'Registračné číslo farmy v CEHZ',
        },
        {
          name: 'oldId',
          width: 30,
          align: 'left',
          padding: 1,
          prompt: 'Registračné číslo v CR',
        },
        {
          name: 'name',
          width: 50,
          align: 'left',
          padding: 1,
          prompt: 'Meno a priezvisko',
        },
        {
          name: 'address',
          width: 70,
          align: 'left',
          padding: 1,
          prompt: 'Adresa',
        },
        {
          name: 'birthDate',
          width: 30,
          align: 'left',
          padding: 1,
          prompt: 'Dátum narodenia',
        },
        {
          name: 'numberOfHives',
          width: 30,
          align: 'left',
          padding: 1,
          prompt: `Počet včelstiev ku\n${dataFromDate.toLocaleDateString()}`,
        },
        {
          name: 'amount',
          width: 30,
          align: 'left',
          padding: 1,
          prompt: 'Celková výška v €',
        },
        {
          name: 'signature',
          width: 40,
          align: 'left',
          padding: 1,
          prompt: 'Podpis',
        },
      ],
      {
        padding: 1,
        fontSize: PDF_TABLE_TEXT_FONT_SIZE,
        headerBackgroundColor:
          type === 'pollination'
            ? POLLINATION_TABLE_COLOR
            : TREATING_TABLE_COLOR,
        cellStart(e, doc) {
          if (e.data.startsWith('  ')) {
            doc.setFont('Roboto', 'bolditalic');
          } else {
            doc.setFont('Roboto', 'normal');
          }
        },
      }
    );
    doc.cell(10, 0, 161.5, 0, '', 1, '');
    doc.cell(10, 0, 11, 0, 'Spolu:', 1, '');
    doc.cell(
      10,
      0,
      22.5,
      5,
      data[district.id]
        .reduce((prev, next) => {
          return prev + next.numberOfHives;
        }, 0)
        .toString(),
      1,
      ''
    );
    doc.cell(
      10,
      0,
      22.5,
      5,
      data[district.id]
        .reduce((prev, next) => {
          if ('treatingSubsidies' in next) {
            return prev + next.treatingSubsidies;
          } else {
            return prev + next.pollinationSubsidies;
          }
        }, 0)
        .toFixed(2)
        .replace('.', ','),
      1,
      ''
    );
    doc.addPage();
  }
  addTotalFooter(doc, {
    totalMembers,
    totalHives,
    totalAmount,
    tableColor:
      type === 'pollination' ? POLLINATION_TABLE_COLOR : TREATING_TABLE_COLOR,
  });

  return doc;
}
