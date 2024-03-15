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
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 border text-left">Member ID</th>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Email</th>
              <th className="p-2 border text-left">Phone</th>
              <th className="p-2 border text-left">Address</th>
              <th className="p-2 border text-left">Is manager in districts</th>
              <th className="p-2 border text-left">District</th>
            </tr>
          </thead>
          <tbody>
            {data.length !== 0 ? (
              data.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="p-2 border">{member.id}</td>
                  <td className="p-2 border">
                    <Link to="/members/$id" params={{id: member.id}}>
                      {member.name} {member.surname}
                    </Link>
                  </td>
                  <td className=" p-2 border">{member.email || '-'}</td>
                  <td className="p-2 border">{member.phone}</td>
                  <td className="p-2 border">{member.address}</td>
                  <td className="p-2 border">
                    {member.isManager ? (
                      <>
                        {member.managerDistrict.map((managerDistrict) => (
                          <div key={member.id}>{managerDistrict.name}</div>
                        ))}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  {member.district ? (
                    <td className="p-2 border">
                      <Link
                        to={`/districts/$id`}
                        params={{id: member.district.id}}
                      >
                        {member.district.name}
                      </Link>
                    </td>
                  ) : (
                    <td className="p-2 border">-</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border" colSpan={7}>
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
