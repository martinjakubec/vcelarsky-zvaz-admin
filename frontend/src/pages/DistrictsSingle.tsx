import {Link, Navigate, useNavigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {districtsSingle} from '../routes/districtsRoute';
import {useAPI} from '../hooks/useAPI';
import {MembersResponse, SingleDistrictResponse} from '../types/ResponseTypes';
import {useRef, useState} from 'react';
import {fetchAPI} from '../utils/fetchAPI';
import {Table} from '../components/Table/Table';
import {TableHead} from '../components/Table/TableHead';
import {Cell, HeadCell} from '../components/Table/TableCell';
import {TableBody} from '../components/Table/TableBody';
import {TableRow} from '../components/Table/TableRow';
import {CellLink} from '../components/Table/CellLink';
import {TextInput} from '../components/Input/TextInput';
import {NumberInput} from '../components/Input/NumberInput';
import {SelectInput} from '../components/Input/SelectInput';
import {Button} from '../components/Button';

export function DistrictsSingle() {
  const {isUserLoggedIn} = useAuth();

  const {id} = districtsSingle.useParams();

  const {
    data: district,
    error: districtError,
    loading: districtLoading,
    refetch,
  } = useAPI<SingleDistrictResponse>(`/districts/${id}`);
  const {
    data: managers,
    error: managersError,
    loading: managersLoading,
  } = useAPI<MembersResponse>('/members');

  const [isEditing, setIsEditing] = useState(false);
  const [districtId, setDistrictId] = useState<string>(id);
  const [districtSuccessfullyDeleted, setDistrictSuccessfullyDeleted] =
    useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const districtNameRef = useRef<HTMLInputElement>(null);
  const districtIdRef = useRef<HTMLInputElement>(null);
  const districtManagerIdRef = useRef<HTMLSelectElement>(null);

  async function handleDistrictEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUpdateError(null);

    const districtName = districtNameRef.current?.value;
    const districtId = districtIdRef.current?.value;
    const districtManagerId = districtManagerIdRef.current?.value;

    if (!districtName || !districtId) {
      setUpdateError('Vyplnte názov a číslo obvodu.');
      return;
    }

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
    if (!confirm('Určite chcete vymazať obvod?')) return;
    const response = await fetchAPI(`/districts`, {
      method: 'DELETE',
      body: JSON.stringify({
        id,
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
      {districtError && <Navigate to="/districts" />}
      <PageTitle>
        {district?.name} ({id})
      </PageTitle>
      {districtLoading && <p>Loading...</p>}
      {districtError && <p>Error: {districtError}</p>}
      <h2 className="text-xl font-bold pt-2">Informácie o obvode</h2>

      {isEditing ? (
        <>
          <form onSubmit={handleDistrictEdit}>
            <p>{updateError}</p>
            <TextInput
              required
              defaultValue={district?.name || ''}
              id="districtName"
              name="Názov obvodu"
              ref={districtNameRef}
            />
            <NumberInput
              required
              defaultValue={parseInt(district?.id || '') || undefined}
              id="districtId"
              name="Číslo obvodu"
              ref={districtIdRef}
            />
            <SelectInput
              id="districtManager"
              name="Vedúci obvodu"
              ref={districtManagerIdRef}
              defaultValue={district?.districtManagerId || ''}
            >
              <option value="">---</option>
              {managers &&
                managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.id} - {manager.name} {manager.surname}
                  </option>
                ))}
            </SelectInput>
            <Button type="submit">Uložiť</Button>
            <Button
              onClick={() => {
                setIsEditing(false);
              }}
              type="button"
            >
              Zrušiť úpravy
            </Button>
          </form>
        </>
      ) : (
        <>
          {district && (
            <div className='py-4'>
              <p>
                <span className="font-bold">Počet členov: </span>
                {district.members.length}
              </p>
              <p>
                <span className="font-bold">Vedúci: </span>
                {district.districtManager ? (
                  <Link
                    to="/members/$id"
                    className="hover:underline"
                    params={{id: district.districtManager.id}}
                  >
                    {district.districtManager.name}{' '}
                    {district.districtManager.surname}
                    {district.districtManager.title
                      ? `, ${district.districtManager.title}`
                      : ''}
                  </Link>
                ) : (
                  '-'
                )}
              </p>
              <Button
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                Upraviť
              </Button>
              <Button onClick={handleDistrictDelete}>Vymazať</Button>
            </div>
          )}
        </>
      )}
      <h2 className="text-xl font-bold pt-2">Členovia</h2>
      {district && (
        <>
          <Table>
            <TableHead>
              <HeadCell>Číslo farmy v CEHZ</HeadCell>
              <HeadCell>Meno</HeadCell>
              <HeadCell>Adresa</HeadCell>
              <HeadCell>Tel. číslo</HeadCell>
              <HeadCell>E-mail</HeadCell>
            </TableHead>
            <TableBody>
              {district.members.map((member, index) => {
                return (
                  <TableRow key={member.id} index={index + 1}>
                    <Cell>
                      <CellLink to="/members/$id" params={{id: member.id}}>
                        {member.id}
                      </CellLink>
                    </Cell>
                    <Cell>
                      <CellLink to="/members/$id" params={{id: member.id}}>
                        {member.name} {member.surname}
                        {member.title ? `, ${member.title}` : ''}
                      </CellLink>
                    </Cell>
                    <Cell>
                      {member.addressStreet}, {member.addressCity},{' '}
                      {member.addressZip}
                    </Cell>
                    <Cell>{member.phone || '-'}</Cell>
                    <Cell>{member.email || '-'}</Cell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </PageBody>
  );
}
