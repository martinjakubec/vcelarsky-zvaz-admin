import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { PageTitle } from '../components/PageTitle';
import { PageBody } from '../components/PageBody';
import { districtsSingle } from '../routes/districtsRoute';
import { useAPI } from '../hooks/useAPI';
import { SingleDistrictResponse } from '../types/ResponseTypes';

export function DistrictsSingle() {
  const { isUserLoggedIn } = useAuth();

  const { id } = districtsSingle.useParams();

  const { data, error, loading, refetch } = useAPI<SingleDistrictResponse>(`/districts/${id}`)

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <Link to="/districts" className='text-xs font-light hover:underline'> &lt; Back to districts</Link>
      <PageTitle>{data?.name} ({id})</PageTitle>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <h2 className='text-xl font-bold pt-2'>District details</h2>
      {data &&
        <div>
          <p>{data.members.length} members</p>
          <p>{data.districtManager ? `Manager: ${data.districtManager.name} ${data.districtManager.surname}` : 'No manager'}</p>
        </div>
      }

      <h2 className='text-xl font-bold pt-2'>Members</h2>
      {data && (
        <table>
          <thead>
            <tr>
              <th className='p-2 border'>ID</th>
              <th className='p-2 border'>Name</th>
              <th className='p-2 border'>Surname</th>
              <th className='p-2 border'>Address</th>
              <th className='p-2 border'>Phone</th>
              <th className='p-2 border'>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.members.map(member => (
              <tr key={member.id}>
                <td className='p-2 border'>{member.id}</td>
                <td className='p-2 border'>{member.name}</td>
                <td className='p-2 border'>{member.surname}</td>
                <td className='p-2 border'>{member.address}</td>
                <td className='p-2 border'>{member.phone}</td>
                <td className='p-2 border'>{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageBody>
  );
}
