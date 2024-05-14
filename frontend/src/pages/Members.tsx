import {Link, Navigate, useNavigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {useAPI} from '../hooks/useAPI';
import {MembersResponse} from '../types/ResponseTypes';
import {AddMember} from '../components/AddMember';
import {Table} from '../components/Table/Table';
import {TableHead} from '../components/Table/TableHead';
import {Cell, HeadCell} from '../components/Table/TableCell';
import {TableBody} from '../components/Table/TableBody';
import {TableRow} from '../components/Table/TableRow';
import {CellLink} from '../components/Table/CellLink';
import {Dialog} from '../components/Dialog';
import {useRef} from 'react';
import {Button} from '../components/Button';

export function Members() {
  const {isUserLoggedIn} = useAuth();
  const {data, error, loading, refetch} = useAPI<MembersResponse>('/members');

  const addMemberDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Členovia</PageTitle>
      {loading && <p>Načítavam...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <Table>
          <TableHead>
            <HeadCell>
              Číslo farmy
              <br />v CEHZ
            </HeadCell>
            <HeadCell>
              Číslo farmy
              <br />v CR
            </HeadCell>
            <HeadCell>Meno</HeadCell>
            <HeadCell>Email</HeadCell>
            <HeadCell>Dátum narodenia</HeadCell>
            <HeadCell>Telefón</HeadCell>
            <HeadCell>Adresa</HeadCell>
            <HeadCell>Vedúci v obvode</HeadCell>
            <HeadCell>Obvod</HeadCell>
          </TableHead>
          <TableBody>
            {data.length == 0 && (
              <TableRow hover={false}>
                <Cell colspan={9}>
                  <div className="text-center w-100 italic">
                    Žiadni členovia.
                  </div>
                </Cell>
              </TableRow>
            )}
            {data.map((member, index) => {
              return (
                <TableRow key={member.id} index={index + 1}>
                  <Cell>
                    <CellLink to="/members/$id" params={{id: member.id}}>
                      {member.id}
                    </CellLink>
                  </Cell>
                  <Cell>{member.oldId || '-'}</Cell>
                  <Cell>
                    <CellLink to="/members/$id" params={{id: member.id}}>
                      {member.name} {member.surname}
                      {member.title && `, ${member.title}`}
                    </CellLink>
                  </Cell>
                  <Cell>{member.email || '-'}</Cell>
                  <Cell>
                    {(member.birthDate &&
                      new Date(member.birthDate).toLocaleDateString()) ||
                      '-'}
                  </Cell>
                  <Cell>{member.phone || '-'}</Cell>
                  <Cell>
                    {member.addressStreet}, {member.addressCity},{' '}
                    {member.addressZip}
                  </Cell>
                  <Cell>
                    {member.managerDistrict.length !== 0 ? (
                      <>
                        {member.managerDistrict.map((managerDistrict) => (
                          <CellLink
                            to={`/districts/$id`}
                            params={{id: managerDistrict.id}}
                            key={managerDistrict.id}
                          >
                            {managerDistrict.name}
                          </CellLink>
                        ))}
                      </>
                    ) : (
                      '-'
                    )}
                  </Cell>
                  <Cell>
                    {member.district ? (
                      <CellLink
                        to={`/districts/$id`}
                        params={{id: member.district.id}}
                      >
                        {member.district.name}
                      </CellLink>
                    ) : (
                      '-'
                    )}
                  </Cell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <Button
        onClick={() => {
          addMemberDialogRef.current?.showModal();
        }}
      >
        Pridať člena
      </Button>
      <Dialog ref={addMemberDialogRef}>
        <AddMember
          refetchMembers={refetch}
          closeModal={() => {
            addMemberDialogRef.current?.close();
          }}
        />
      </Dialog>
    </PageBody>
  );
}
