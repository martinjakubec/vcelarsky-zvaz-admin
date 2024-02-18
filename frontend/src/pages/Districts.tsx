import {Navigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {useEffect} from 'react';
import {useAPI} from '../hooks/useAPI';

type DistrictsResponse = {
  id: string;
  name: string;
  districtManagerId: string | null;
}[];

export function Districts() {
  const {isUserLoggedIn} = useAuth();

  const {data, error, loading} = useAPI<DistrictsResponse>('/districts', {
    method: 'GET',
  });

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
            <tr>
              <td className="p-2 border">1</td>
              <td className="p-2 border">Liptovsky Mikulas - 1</td>
              <td className="p-2 border">Meno Priezvisko</td>
            </tr>
            <tr>
              <td className="p-2 border">2</td>
              <td className="p-2 border">Liptovsky Mikulas - 2</td>
              <td className="p-2 border">Meno Priezvisko</td>
            </tr>
            {data.map((district) => (
              <tr key={district.id}>
                <td>{district.id}</td>
                <td>{district.name}</td>
                <td>{district.districtManagerId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageBody>
  );
}
