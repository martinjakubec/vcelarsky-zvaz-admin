import {Link, Navigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {useAPI} from '../hooks/useAPI';
import {DistrictsResponse, SingleMemberResponse} from '../types/ResponseTypes';
import {useState} from 'react';
import {fetchAPI} from '../utils/fetchAPI';
import {membersSingle} from '../routes/membersRoute';

export function MembersSingle() {
  const {isUserLoggedIn} = useAuth();
  const {id} = membersSingle.useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string>(id);
  const [memberSuccessfullyDeleted, setMemberSuccessfullyDeleted] =
    useState<boolean>(false);

  const {
    data: member,
    error,
    loading,
    refetch,
  } = useAPI<SingleMemberResponse>(`/members/${id}`);

  const {
    data: districts,
    error: districtsError,
    loading: districtsLoading,
  } = useAPI<DistrictsResponse>('/districts');

  async function handleMemberEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUpdateError(null);
    const form = e.currentTarget;
    const name = form.firstName.value;
    const surname = form.surname.value;
    const addressCity = form.addressCity.value;
    const addressStreet = form.addressStreet.value;
    const addressZip = form.addressZip.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const district = form.district.value;
    const memberId = form.memberId.value;
    const oldId = form.oldId.value;
    const title = form.nameTitle.value;
    const birthDate = form.birthDate.value;

    const response = await fetchAPI(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        surname,
        addressCity,
        addressStreet,
        addressZip,
        phone,
        email,
        districtId: district,
        id: memberId,
        oldId,
        title,
        birthDate,
      }),
    });

    if (response.ok) {
      setMemberId(memberId);
      memberId === id && refetch(); // this is done so that refetch is called only when member's id is not changed
      setIsEditing(false);
    } else {
      setUpdateError(await response.text());
      console.error(response);
    }
  }

  async function handleMemberDelete() {
    if (!confirm('Are you sure you want to delete this member?')) return;
    const response = await fetchAPI('/members', {
      method: 'DELETE',
      body: JSON.stringify({
        id,
      }),
    });

    if (response.ok) {
      setMemberSuccessfullyDeleted(true);
    } else {
      console.error(await response.text());
    }
  }
  return (
    <PageBody>
      {memberId !== id && (
        <Navigate to="/members/$id" params={{id: memberId}} />
      )}
      {memberSuccessfullyDeleted && <Navigate to="/members" />}
      {!isUserLoggedIn && <Navigate to="/login" />}
      <Link to="/members" className="text-xs font-light hover:underline">
        &lt; Back to members
      </Link>

      {member && (
        <PageTitle>
          {member.title && member.title + ' '}
          {member.name} {member.surname} ({id}) -{' '}
          {isEditing ? (
            <button
              onClick={() => {
                setIsEditing(false);
              }}
            >
              Cancel edit
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          )}{' '}
          -{' '}
          <button type="button" onClick={handleMemberDelete}>
            Delete
          </button>
        </PageTitle>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {isEditing ? (
        <>
          <p>Member details</p>
          <form onSubmit={handleMemberEdit}>
            <div>
              <label htmlFor="nameTitle">Title</label>
              <input
                className="border border-1"
                type="text"
                id="nameTitle"
                name="nameTitle"
                defaultValue={member?.title}
              />
            </div>
            <div>
              <label htmlFor="firstName">Name</label>
              <input
                className="border border-1"
                type="text"
                id="firstName"
                name="firstName"
                defaultValue={member?.name}
              />
            </div>
            <div>
              <label htmlFor="surname">Surname</label>
              <input
                className="border border-1"
                type="text"
                id="surname"
                name="surname"
                defaultValue={member?.surname}
              />
            </div>
            <div>
              <label htmlFor="memberId">ID</label>
              <input
                className="border border-1"
                type="text"
                id="memberId"
                name="memberId"
                defaultValue={id}
              />
            </div>
            <div>
              <label htmlFor="oldId">Old type ID</label>
              <input
                className="border border-1"
                type="text"
                id="oldId"
                name="oldId"
                defaultValue={member?.oldId}
              />
            </div>
            <div>
              <label htmlFor="birthDate">Date of birth</label>
              <input
                className="border border-1"
                type="date"
                id="birthDate"
                name="birthDate"
                defaultValue={
                  member?.birthDate
                    ? new Date(member.birthDate).toISOString().substring(0, 10)
                    : ''
                }
              />
            </div>
            <div>
              <label htmlFor="addressCity">City</label>
              <input
                className="border border-1"
                type="text"
                id="addressCity"
                name="addressCity"
                defaultValue={member?.addressCity}
              />
            </div>
            <div>
              <label htmlFor="addressStreet">Street</label>
              <input
                className="border border-1"
                type="text"
                id="addressStreet"
                name="addressStreet"
                defaultValue={member?.addressStreet}
              />
            </div>
            <div>
              <label htmlFor="addressZip">ZIP Code</label>
              <input
                className="border border-1"
                type="text"
                id="addressZip"
                name="addressZip"
                defaultValue={member?.addressZip}
              />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input
                className="border border-1"
                type="text"
                id="phone"
                name="phone"
                defaultValue={member?.phone || ''}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                className="border border-1"
                type="text"
                id="email"
                name="email"
                defaultValue={member?.email || ''}
              />
            </div>
            <div>
              <label htmlFor="district">District</label>
              <select
                className="border border-1"
                id="district"
                name="district"
                defaultValue={member?.districtId || ''}
              >
                <option value="">---</option>
                {districts &&
                  districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
              </select>
            </div>
            <br />
            {updateError && <p>{updateError}</p>}
            <button type="submit">Save</button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold pt-2">Member details</h2>
          {member && (
            <div>
              <p>
                Address: {member.addressStreet}, {member.addressCity},{' '}
                {member.addressZip}
              </p>
              {member.oldId && <p>Old type ID: {member.oldId}</p>}
              <p>
                Date of birth:{' '}
                {member.birthDate
                  ? new Date(member.birthDate || '').toLocaleDateString()
                  : '-'}
              </p>
              <p>Phone: {member.phone}</p>
              <p>Email: {member.email}</p>
              <p>
                District:{' '}
                {member.district ? (
                  <Link to="/districts/$id" params={{id: member.district.id}}>
                    {member.district.name}
                  </Link>
                ) : (
                  '-'
                )}
              </p>
              {member.managerDistrict.length !== 0 && (
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
