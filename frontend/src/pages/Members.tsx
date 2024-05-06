import {Link, Navigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {useAPI} from '../hooks/useAPI';
import {AddDistrict} from '../components/AddDistrict';
import {DistrictsResponse, MembersResponse} from '../types/ResponseTypes';
import {AddMember} from '../components/AddMember';

export function Members() {
  const {isUserLoggedIn} = useAuth();
  const {data, error, loading, refetch} = useAPI<MembersResponse>('/members');

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Members</PageTitle>
      <p>List of members</p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-yellow-500">
              <th className="p-2 border border-black text-left">Member ID</th>
              <th className="p-2 border border-black text-left">Old type ID</th>
              <th className="p-2 border border-black text-left">Name</th>
              <th className="p-2 border border-black text-left">Email</th>
              <th className="p-2 border border-black text-left">
                Date of birth
              </th>
              <th className="p-2 border border-black text-left">Phone</th>
              <th className="p-2 border border-black text-left">Address</th>
              <th className="p-2 border border-black text-left">
                Is manager in districts
              </th>
              <th className="p-2 border border-black text-left">District</th>
            </tr>
          </thead>
          <tbody>
            {data.length !== 0 ? (
              data.map((member, index) => (
                <tr
                  key={member.id}
                  className={
                    'hover:bg-yellow-100 ' + (index % 2 == 1 && 'bg-yellow-50')
                  }
                >
                  <td className="p-2 border border-black">{member.id}</td>
                  <td className="p-2 border border-black">{member.oldId}</td>
                  <td className="p-2 border border-black">
                    <Link to="/members/$id" params={{id: member.id}}>
                      {member.name} {member.surname}
                    </Link>
                  </td>
                  <td className=" p-2 border border-black">{member.email || '-'}</td>
                  <td className=" p-2 border border-black">
                    {member.birthDate
                      ? new Date(member.birthDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="p-2 border border-black">{member.phone}</td>
                  <td className="p-2 border border-black">
                    {member.addressStreet}, {member.addressCity},{' '}
                    {member.addressZip}
                  </td>
                  <td className="p-2 border border-black">
                    {member.managerDistrict.length !== 0 ? (
                      <>
                        {member.managerDistrict.map((managerDistrict) => (
                          <div key={managerDistrict.id}>
                            {managerDistrict.name}
                          </div>
                        ))}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  {member.district ? (
                    <td className="p-2 border border-black">
                      <Link
                        to={`/districts/$id`}
                        params={{id: member.district.id}}
                      >
                        {member.district.name}
                      </Link>
                    </td>
                  ) : (
                    <td className="p-2 border border-black">-</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border border-black" colSpan={7}>
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <AddMember refetchMembers={refetch} />
    </PageBody>
  );
}
