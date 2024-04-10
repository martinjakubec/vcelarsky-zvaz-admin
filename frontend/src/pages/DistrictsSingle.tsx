import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { PageTitle } from '../components/PageTitle';
import { PageBody } from '../components/PageBody';
import { districtsSingle } from '../routes/districtsRoute';
import { useAPI } from '../hooks/useAPI';
import { MembersResponse, SingleDistrictResponse } from '../types/ResponseTypes';
import { useState } from 'react';
import { fetchAPI } from '../utils/fetchAPI';

export function DistrictsSingle() {
  const { isUserLoggedIn } = useAuth();

  const { id } = districtsSingle.useParams();

  const { data: district, error: districtError, loading: districtLoading, refetch } = useAPI<SingleDistrictResponse>(`/districts/${id}`)
  const { data: managers, error: managersError, loading: managersLoading } = useAPI<MembersResponse>("/members")


  const [isEditing, setIsEditing] = useState(false);
  const [districtId, setDistrictId] = useState<string>(id);
  const [districtSuccessfullyDeleted, setDistrictSuccessfullyDeleted] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  async function handleDistrictEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUpdateError(null);
    
    const districtName = e.currentTarget.districtName.value;
    const districtId = e.currentTarget.districtId.value;
    const districtManagerId = e.currentTarget.districtManager.value;
    
    const response = await fetchAPI(`/districts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: districtName,
        id: districtId,
        managerId: districtManagerId,
      }),
    });

    if (response.ok) {
      setDistrictId(districtId);
      districtId === id && refetch(); // this is done so that refetch is called only when district id is not changed
      setIsEditing(false);
    } else {
      setUpdateError(await response.text());
      console.error(response);
    }
  }

  async function handleDistrictDelete() {
    if (!confirm('Are you sure you want to delete this member?')) return
    const response = await fetchAPI(`/districts`, {
      method: 'DELETE',
      body: JSON.stringify({
        id
      }),
    });

    if (response.ok) {
      setDistrictSuccessfullyDeleted(true);
    } else {
      console.error(await response.text());
    }
  }

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      {districtSuccessfullyDeleted && <Navigate to="/districts" />}
      <Link to="/districts" className='text-xs font-light hover:underline'> &lt; Back to districts</Link>
      <PageTitle>
        {id} - {district?.name} - {' '}
        {isEditing ? (<button onClick={() => { setIsEditing(false) }}>Cancel edit</button>) : (<button onClick={() => { setIsEditing(true) }}>Edit</button>)} -{' '}
        <button type='button' onClick={handleDistrictDelete}>Delete</button>
      </PageTitle>
      {districtLoading && <p>Loading...</p>}
      {districtError && <p>Error: {districtError}</p>}

      {isEditing ? (
        <>
          <p>District details</p>
          <form onSubmit={handleDistrictEdit}>
            <div>
              <label htmlFor="districtName">Name</label>
              <input className="border border-1" type="text" id="districtName" name="districtName" defaultValue={district?.name} />
            </div>
            <div>
              <label htmlFor="districtId">District ID</label>
              <input className="border border-1" type="text" id="districtId" name="districtId" defaultValue={district?.id} />
            </div>
            <div>
              <label htmlFor="districtManager">District Manager</label>
              <select id='districtManager' name="districtManager" className='border border-1' defaultValue={district?.districtManagerId || ''}>
                <option value="">---</option>
                {managers && managers.map(manager => (
                  <option key={manager.id} value={manager.id}>{manager.id} - {manager.name} {manager.surname}</option>
                ))}
              </select>
            </div>
            <button type="submit">Save</button>
          </form>
        </>
      ) : <>
        <h2 className='text-xl font-bold pt-2'>District details</h2>
        {district &&
          <div>
            <p>{district.members.length} members</p>
            <p>{district.districtManager ? `Manager: ${district.districtManager.name} ${district.districtManager.surname}` : 'No manager'}</p>
          </div>
        }

        <h2 className='text-xl font-bold pt-2'>Members</h2>
        {district && (
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
              {district.members.map(member => (
                <tr key={member.id}>
                  <td className='p-2 border'><Link to='/members/$id' params={{ id: member.id }}>{member.id}</Link></td>
                  <td className='p-2 border'>{member.name}</td>
                  <td className='p-2 border'>{member.surname}</td>
                  <td className='p-2 border'>{member.addressStreet}, {member.addressCity}, {member.addressZip}</td>
                  <td className='p-2 border'>{member.phone}</td>
                  <td className='p-2 border'>{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>}
    </PageBody>
  );
}
