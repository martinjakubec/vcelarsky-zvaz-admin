import {AdminData, Member, Prisma} from '@prisma/client';
import {CsvData} from './parseCsv';

export interface MemberData {
  member: Member;
  numberOfHives: number;
}

export type FeesData = MemberData & {
  localFee: number;
  countryFee: number;
  voluntaryDonationInter: number;
  voluntaryDonationExter: number;
};

export type PollinationSubsidiesData = MemberData & {
  pollinationSubsidies: number;
};

export type TreatingSubsidiesData = MemberData & {
  treatingSubsidies: number;
};

export type AllData =
  | FeesData
  | TreatingSubsidiesData
  | PollinationSubsidiesData;

export type DataPerDistrict<T> = {
  [districtId: string]: T[];
};

export function calculateFees(
  csvData: CsvData,
  memberData: Member[],
  adminData: AdminData
): FeesData[] {
  const feesData: FeesData[] = [];

  for (let i = 0; i < memberData.length; i++) {
    const member = memberData[i];
    const csvMember = csvData.find((data) => data.id === member.id.toString());

    if (!csvMember) continue;

    const countryFee =
      (adminData.membershipCountry * 100 * csvMember.hiveAmount) / 100;
    const localFee = adminData.membershipLocal;

    feesData.push({
      member,
      numberOfHives: csvMember.hiveAmount,
      localFee,
      countryFee,
      voluntaryDonationInter: adminData.voluntaryDonationInter,
      voluntaryDonationExter: adminData.voluntaryDonationExter,
    });
  }

  return feesData.toSorted((memberA, memberB) => {
    return memberA.member.surname.localeCompare(memberB.member.surname);
  });
}

export function calculateTreatingSubsidies(
  csvData: CsvData,
  memberData: Member[],
  adminData: AdminData
): TreatingSubsidiesData[] {
  const treatingSubsidiesData: TreatingSubsidiesData[] = [];
  for (let i = 0; i < memberData.length; i++) {
    const member = memberData[i];
    const csvMember = csvData.find((data) => data.id === member.id.toString());

    if (!csvMember) continue;

    const treatingSubsidies =
      (adminData.treatingAmount * 100 * csvMember.hiveAmount) / 100;

    treatingSubsidiesData.push({
      numberOfHives: csvMember.hiveAmount,
      member,
      treatingSubsidies,
    });
  }
  return treatingSubsidiesData.toSorted((memberA, memberB) => {
    return memberA.member.surname.localeCompare(memberB.member.surname);
  });
}

export function calculatePollinationSubsidies(
  csvData: CsvData,
  memberData: Member[],
  adminData: AdminData
): PollinationSubsidiesData[] {
  const pollinationSubsidiesData: PollinationSubsidiesData[] = [];
  for (let i = 0; i < memberData.length; i++) {
    const member = memberData[i];
    const csvMember = csvData.find((data) => data.id === member.id.toString());

    if (!csvMember) continue;

    const pollinationSubsidies =
      (adminData.pollinationAmount * 100 * csvMember.hiveAmount) / 100;

    pollinationSubsidiesData.push({
      numberOfHives: csvMember.hiveAmount,
      member,
      pollinationSubsidies,
    });
  }

  return pollinationSubsidiesData.toSorted((memberA, memberB) => {
    return memberA.member.surname.localeCompare(memberB.member.surname);
  });
}

export function sortDataIntoDistricts<DataType extends AllData>(
  memberData: DataType[]
): DataPerDistrict<DataType> {
  const dataPerDistrict: DataPerDistrict<DataType> = {};
  for (let data of memberData) {
    const districtId = data.member.districtId?.toString();
    if (!districtId) continue;

    if (!dataPerDistrict[districtId]) {
      dataPerDistrict[districtId] = [];
    }

    dataPerDistrict[districtId].push(data);
  }

  return dataPerDistrict;
}
