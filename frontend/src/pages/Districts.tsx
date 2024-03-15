import { Link, Navigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { PageTitle } from '../components/PageTitle';
import { PageBody } from '../components/PageBody';
import { useAPI } from '../hooks/useAPI';
import { AddDistrict } from '../components/AddDistrict';
import { DistrictsResponse } from '../types/ResponseTypes';

export function Districts() {
  const { isUserLoggedIn } = useAuth();
  const { data, error, loading, refetch } = useAPI<DistrictsResponse>('/districts');

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Districts</PageTitle>
      <p>List of districts</p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 border text-left">District ID</th>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Manager</th>
            </tr>
          </thead>
          <tbody>
            {data.length !== 0 ? data.map((district) => (
              <tr key={district.id} className='hover:bg-slate-50'>
                <td className='p-2 border'>{district.id}</td>
                <td className='border'>
                  <Link to='/districts/$id' params={{ id: district.id }} className='w-full block p-2 hover:underline'>
                    {district.name}
                  </Link>
                </td>
                <td className='p-2 border'>{district.districtManagerId ? `${district.districtManager?.name} ${district.districtManager?.surname}` : '-----'}</td>
              </tr>
            )) : <tr><td className='p-2 border' colSpan={3}>No districts found</td></tr>}
          </tbody>
        </table>
      )}
      <AddDistrict refetchDistricts={refetch} />
    </PageBody>
  );
}
