export type DistrictsResponse = ({
  districtManager: {
    id: string;
    name: string;
    surname: string;
  } | null;
} & {
  id: string;
  name: string;
  districtManagerId: string | null;
  deletedAt: Date | null;
})[];

export type MembersResponse = {
  district: {
    id: string;
    name: string;
    districtManagerId: string | null;
    deletedAt: Date | null;
  } | null;
  id: string;
  oldId: string;
  title: string;
  name: string;
  surname: string;
  addressCity: string;
  addressStreet: string;
  addressZip: string;
  phone: string | null;
  email: string | null;
  districtId: string | null;
  managerDistrict: {
    id: string;
    name: string;
    districtManagerId: string | null;
    deletedAt: Date | null;
  }[];
  birthDate: Date | null;
}[];

export type SingleDistrictResponse =
  | ({
      members: {
        id: string;
        name: string;
        surname: string;
        addressCity: string;
        addressStreet: string;
        addressZip: string;
        phone: string | null;
        email: string | null;
        districtId: string | null;
        deletedAt: Date | null;
      }[];
      districtManager: {
        id: string;
        name: string;
        surname: string;
        addressCity: string;
        addressStreet: string;
        addressZip: string;
        phone: string | null;
        email: string | null;
        districtId: string | null;
        deletedAt: Date | null;
      } | null;
    } & {
      id: string;
      name: string;
      districtManagerId: string | null;
      deletedAt: Date | null;
    })
  | null;

export type SingleMemberResponse =
  | ({
      district: {
        id: string;
        name: string;
        districtManagerId: string | null;
        deletedAt: Date | null;
      } | null;
      managerDistrict: {
        id: string;
        name: string;
        districtManagerId: string | null;
        deletedAt: Date | null;
      }[];
    } & {
      id: string;
      oldId: string;
      name: string;
      surname: string;
      title: string;
      addressCity: string;
      addressStreet: string;
      addressZip: string;
      phone: string | null;
      email: string | null;
      districtId: string | null;
      deletedAt: string | null;
      birthDate: string | null;
    })
  | null;

export type AdminData = {
  year: string;
  treatingAmount: number;
  pollinationAmount: number;
  membershipLocal: number;
  membershipCountry: number;
  voluntaryDonationInter: number;
  voluntaryDonationExter: number;
  decreeNumber: string;
};

export type AdminResponse = AdminData[];
