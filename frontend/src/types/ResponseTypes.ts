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
  name: string;
  surname: string;
  address: string;
  phone: string | null;
  email: string | null;
  districtId: string | null;
  isManager: boolean;
  managerDistrict: {
    id: string;
    name: string;
    districtManagerId: string | null;
    deletedAt: Date | null;
  }[];
}[];

export type SingleDistrictResponse =
  | ({
      members: {
        id: string;
        name: string;
        surname: string;
        address: string;
        phone: string | null;
        email: string | null;
        districtId: string | null;
        deletedAt: Date | null;
        isManager: boolean;
      }[];
      districtManager: {
        id: string;
        name: string;
        surname: string;
        address: string;
        phone: string | null;
        email: string | null;
        districtId: string | null;
        deletedAt: Date | null;
        isManager: boolean;
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
      name: string;
      surname: string;
      address: string;
      phone: string | null;
      email: string | null;
      districtId: string | null;
      deletedAt: Date | null;
      isManager: boolean;
    })
  | null;
