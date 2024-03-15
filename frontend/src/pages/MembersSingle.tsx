import {
  Link,
  Navigate,
  useNavigate,
  useRouteContext,
  useRouter,
} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {districtsSingle} from '../routes/districtsRoute';
import {useAPI} from '../hooks/useAPI';
import {SingleMemberResponse} from '../types/ResponseTypes';

export function MembersSingle() {
  const {isUserLoggedIn} = useAuth();

  const {id} = districtsSingle.useParams();

  const [isEditing, setIs];

  const {
    data: member,
    error,
    loading,
    refetch,
  } = useAPI<SingleMemberResponse>(`/members/${id}`);

  return (
    <PageBody>
      {isEditing && 'edit view'}
      {!isUserLoggedIn && <Navigate to="/login" />}
      <Link to="/members" className="text-xs font-light hover:underline">
        &lt; Back to members
      </Link>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {member && (
        <PageTitle>
          {member.name} {member.surname} ({id}) -{' '}
          <Link to="/members/$id/edit" params={{id}}>
            Edit
          </Link>
        </PageTitle>
      )}
      {isEditing ? (
        <p>Member details</p>
      ) : (
        <>
          <h2 className="text-xl font-bold pt-2">Member details</h2>
          {member && (
            <div>
              <p>Address: {member.address}</p>
              <p>Phone: {member.phone}</p>
              <p>Email: {member.email}</p>
              <p>District: {member.district ? member.district.name : '-'}</p>
              {member.isManager && (
                <div>
                  Manager for:{' '}
                  <ul>
                    {member.managerDistrict.map((managerDistrict) => (
                      <li
                        key={managerDistrict.id}
                        className="list-item list-disc list-inside"
                      >
                        {managerDistrict.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </PageBody>
  );
}
