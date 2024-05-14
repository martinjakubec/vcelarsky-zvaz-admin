import {Link, Navigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {useAPI} from '../hooks/useAPI';
import {AddDistrict} from '../components/AddDistrict';
import {DistrictsResponse} from '../types/ResponseTypes';
import {useRef} from 'react';
import {Button} from '../components/Button';
import {Dialog} from '../components/Dialog';
import {Table} from '../components/Table/Table';
import {TableHead} from '../components/Table/TableHead';
import {TableRow} from '../components/Table/TableRow';
import {Cell, HeadCell} from '../components/Table/TableCell';
import {TableBody} from '../components/Table/TableBody';
import {CellLink} from '../components/Table/CellLink';

export function Districts() {
  const {isUserLoggedIn} = useAuth();
  const {data, error, loading, refetch} =
    useAPI<DistrictsResponse>('/districts');

  const addDistrictDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Obvody</PageTitle>
      {loading && <p>Načítavam...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <Table>
          <TableHead>
            <HeadCell>Číslo obvodu</HeadCell>
            <HeadCell>Názov obvodu</HeadCell>
            <HeadCell>Vedúci obvodu</HeadCell>
          </TableHead>
          <TableBody>
            {data.length == 0 && (
              <TableRow hover={false}>
                <Cell colspan={3}>
                  <div className="text-center w-100 italic">
                    Žiadni členovia.
                  </div>
                </Cell>
              </TableRow>
            )}
            {data.map((district, index) => {
              return (
                <TableRow key={district.id} index={index + 1}>
                  <Cell>
                    <CellLink to="/districts/$id" params={{id: district.id}}>
                      {district.id}
                    </CellLink>
                  </Cell>
                  <Cell>
                    <CellLink to="/districts/$id" params={{id: district.id}}>
                      {district.name}
                    </CellLink>
                  </Cell>
                  <Cell>
                    {district.districtManager ? (
                      <CellLink
                        to="/members/$id"
                        params={{id: district.districtManager.id}}
                      >
                        {district.districtManager.name}{' '}
                        {district.districtManager.surname}
                        {district.districtManager.title
                          ? `, ${district.districtManager.title}`
                          : ''}
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
          addDistrictDialogRef.current?.showModal();
        }}
      >
        Pridať obvod
      </Button>
      <Dialog ref={addDistrictDialogRef}>
        <AddDistrict
          refetchDistricts={refetch}
          closeModal={() => {
            addDistrictDialogRef.current?.close();
          }}
        />
      </Dialog>
    </PageBody>
  );
}
