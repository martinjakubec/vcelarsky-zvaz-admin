import { AdminData, Member, Prisma } from "@prisma/client";
import { CsvData } from "./parseCsv";

interface MemberData {
  member: Member;
}

type FeesData = MemberData & {
  localFee: number;
  countryFee: number;
};

type PollinationSubsidiesData = MemberData & {
  pollinationSubsidies: number;
};

type TreatingSubsidiesData = MemberData & {
  treatingSubsidies: number;
};

type AllData = FeesData | TreatingSubsidiesData | PollinationSubsidiesData;

type DataPerDistrict = {
  [districtId: string]: AllData[];
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

    const localFee =
      (adminData.membershipLocal * 100 * csvMember.hiveAmount) / 100;
    const countryFee = adminData.membershipCountry;

    feesData.push({
      member,
      localFee,
      countryFee,
    });
  }

  return feesData;
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
      member,
      treatingSubsidies,
    });
  }
  return treatingSubsidiesData;
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
      member,
      pollinationSubsidies,
    });
  }

  return pollinationSubsidiesData;
}

export function sortDataIntoDistricts(memberData: AllData[]): DataPerDistrict {
  const dataPerDistrict: DataPerDistrict = {};
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
