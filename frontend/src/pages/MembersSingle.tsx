import {Link, Navigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {useAPI} from '../hooks/useAPI';
import {DistrictsResponse, SingleMemberResponse} from '../types/ResponseTypes';
import {useRef, useState} from 'react';
import {fetchAPI} from '../utils/fetchAPI';
import {membersSingle} from '../routes/membersRoute';
import {Button} from '../components/Button';
import {TextInput} from '../components/Input/TextInput';
import {DateInput} from '../components/Input/DateInput';
import {EmailInput} from '../components/Input/EmailInput';
import {SelectInput} from '../components/Input/SelectInput';

export function MembersSingle() {
  const {isUserLoggedIn} = useAuth();
  const {id} = membersSingle.useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string>(id);
  const [memberSuccessfullyDeleted, setMemberSuccessfullyDeleted] =
    useState<boolean>(false);
  const [memberDeletedError, setMemberDeletedError] = useState<string | null>(
    null
  );

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

  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const addressCityRef = useRef<HTMLInputElement>(null);
  const addressStreetRef = useRef<HTMLInputElement>(null);
  const addressZipRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const districtRef = useRef<HTMLSelectElement>(null);
  const memberIdRef = useRef<HTMLInputElement>(null);
  const oldIdRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);

  async function handleMemberEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUpdateError(null);
    const name = nameRef.current?.value;
    const surname = surnameRef.current?.value;
    const addressCity = addressCityRef.current?.value;
    const addressStreet = addressStreetRef.current?.value;
    const addressZip = addressZipRef.current?.value;
    const phone = phoneRef.current?.value;
    const email = emailRef.current?.value;
    const district = districtRef.current?.value;
    const newMemberId = memberIdRef.current?.value;
    const oldId = oldIdRef.current?.value;
    const title = titleRef.current?.value;
    const birthDate = birthDateRef.current?.value;

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
        id: newMemberId,
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
      const error = await response.text();
      setMemberSuccessfullyDeleted(false);
      setMemberDeletedError(error);
    }
  }

  return (
    <PageBody>
      {memberId !== id && (
        <Navigate to="/members/$id" params={{id: memberId}} />
      )}
      {memberSuccessfullyDeleted && <Navigate to="/members" />}
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>
        {member?.title && member?.title + ' '}
        {member?.name} {member?.surname} ({id})
      </PageTitle>
      <h2 className="text-xl font-bold pt-2">Informácie o členovi</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {memberDeletedError && <p>Error: {memberDeletedError}</p>}
      {member &&
        (isEditing ? (
          <>
            <form onSubmit={handleMemberEdit}>
              <TextInput
                defaultValue={member?.title || ''}
                id="nameTitle"
                name="Titul"
                ref={titleRef}
              />
              <TextInput
                defaultValue={member?.name || ''}
                id="firstName"
                name="Meno"
                ref={nameRef}
              />
              <TextInput
                defaultValue={member?.surname || ''}
                id="surname"
                name="Priezvisko"
                ref={surnameRef}
              />
              <TextInput
                defaultValue={member?.oldId || ''}
                id="oldId"
                name="číslo farmy v CR"
                ref={oldIdRef}
              />
              <DateInput
                defaultValue={new Date(member?.birthDate || '')
                  .toISOString()
                  .slice(0, 10)}
                id="birthDate"
                name="Dátum narodenia"
                ref={birthDateRef}
              />
              <TextInput
                defaultValue={member?.addressCity || ''}
                id="addressCity"
                name="Mesto"
                ref={addressCityRef}
              />
              <TextInput
                defaultValue={member?.addressStreet || ''}
                id="addressStreet"
                name="Ulica"
                ref={addressStreetRef}
              />
              <TextInput
                defaultValue={member?.addressZip || ''}
                id="addressZip"
                name="PSČ"
                ref={addressZipRef}
              />
              <TextInput
                defaultValue={member?.phone || ''}
                id="phone"
                name="Telefón"
                ref={phoneRef}
              />
              <EmailInput
                defaultValue={member?.email || ''}
                id="email"
                name="Email"
                ref={emailRef}
              />
              <SelectInput
                id="district"
                name="Obvod"
                placeholder="---"
                defaultValue={member.district?.id}
                ref={districtRef}
              >
                {districts &&
                  districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
              </SelectInput>
              <br />
              {updateError && <p>{updateError}</p>}
              <Button type="submit">Uložiť</Button>
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Zrušiť zmeny
              </Button>
            </form>
          </>
        ) : (
          <>
            {
              <div className="py-4">
                <p>
                  <span className="font-bold">Adresa: </span>
                  {member.addressStreet}, {member.addressCity},{' '}
                  {member.addressZip}
                </p>
                {member.oldId && (
                  <p>
                    <span className="font-bold">Old type ID: </span>
                    {member.oldId}
                  </p>
                )}
                <p>
                  <span className="font-bold">Dátum narodenia: </span>
                  {member.birthDate
                    ? new Date(member.birthDate || '').toLocaleDateString()
                    : '-'}
                </p>
                <p>
                  <span className="font-bold">Tel. číslo: </span>
                  {member.phone || '-'}
                </p>
                <p>
                  <span className="font-bold">E-mail: </span>
                  {member.email || '-'}
                </p>
                <p>
                  <span className="font-bold">Obvod: </span>
                  {member.district ? (
                    <Link
                      className="hover:underline"
                      to="/districts/$id"
                      params={{id: member.district.id}}
                    >
                      {member.district.name}
                    </Link>
                  ) : (
                    '-'
                  )}
                </p>
                {member.managerDistrict.length !== 0 && (
                  <div>
                    <span className="font-bold">Vedúci v obvodoch: </span>
                    <ul>
                      {member.managerDistrict.map((managerDistrict) => (
                        <li
                          key={managerDistrict.id}
                          className="list-item list-disc list-inside"
                        >
                          <Link
                            to="/districts/$id"
                            className="hover:underline"
                            params={{id: managerDistrict.id}}
                          >
                            {managerDistrict.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            }
            <Button
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Upraviť
            </Button>
            <Button
              onClick={() => {
                handleMemberDelete();
              }}
            >
              Vymazať
            </Button>
          </>
        ))}
    </PageBody>
  );
}
