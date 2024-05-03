import {useEffect, useState} from 'react';
import {PageBody} from '../components/PageBody';
import {PageTitle} from '../components/PageTitle';
import {useAPI} from '../hooks/useAPI';
import {AdminData, AdminResponse} from '../types/ResponseTypes';
import {useAuth} from '../hooks/useAuth';
import {Navigate} from '@tanstack/react-router';
import {fetchAPI} from '../utils/fetchAPI';
import {AddAdminData} from '../components/AddAdminData';

export function AdminPage() {
  const {isUserLoggedIn} = useAuth();
  const {data, error, loading, refetch} = useAPI<AdminResponse>('/admin');

  const [currentYear, setCurrentYear] = useState<string | undefined>(undefined);
  const [selectedData, setSelectedData] = useState<AdminData | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [sortedData, setSortedData] = useState<AdminData[] | undefined>();

  useEffect(() => {
    setSortedData(
      data?.toSorted((a, b) => parseInt(b.year) - parseInt(a.year))
    );
  }, [data]);

  useEffect(() => {
    if (currentYear) return;
    setCurrentYear(
      sortedData?.toSorted((a, b) => parseInt(b.year) - parseInt(a.year))[0]
        ?.year || ''
    );
  }, [sortedData]);

  useEffect(() => {
    setSelectedData(sortedData?.find((d) => d.year === currentYear));
  }, [sortedData, currentYear]);

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const treatingAmount = form.treatingAmount.value;
    const pollinationAmount = form.pollinationAmount.value;
    const membershipLocal = form.membershipLocal.value;
    const membershipCountry = form.membershipCountry.value;
    const voluntaryDonationInter = form.voluntaryDonationInter.value;
    const voluntaryDonationExter = form.voluntaryDonationExter.value;
    const decreeNumber = form.decreeNumber.value;

    await fetchAPI(`/admin/${selectedData?.year}`, {
      method: 'PUT',
      body: JSON.stringify({
        treatingAmount,
        pollinationAmount,
        year: selectedData?.year,
        membershipLocal,
        membershipCountry,
        voluntaryDonationInter,
        voluntaryDonationExter,
        decreeNumber,
      }),
    });

    refetch();
    setIsEditing(false);
    setCurrentYear(selectedData?.year);
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this data?')) return;
    if (!selectedData) return;
    await fetchAPI(`/admin`, {
      method: 'DELETE',
      body: JSON.stringify({year: selectedData.year}),
    });
    refetch();
    setCurrentYear(undefined);
  }

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Admin</PageTitle>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {sortedData && selectedData && !isEditing && (
        <>
          <select
            className="p-1 border border-gray-300 rounded"
            defaultValue={currentYear || ''}
            onChange={(e) => setCurrentYear(e.target.value)}
          >
            <option value="" disabled>
              Select year
            </option>
            {sortedData?.map((d) => (
              <option key={d.year} value={d.year}>
                {d.year}
              </option>
            ))}
          </select>
          <div>
            <p>Treating amount: {selectedData.treatingAmount}</p>
            <p>Pollination amount: {selectedData.pollinationAmount}</p>
            <p>Local membership amount: {selectedData.membershipLocal}</p>
            <p>Country membership amount: {selectedData.membershipCountry}</p>
            <p>
              Voluntary donation inter amount:{' '}
              {selectedData.voluntaryDonationInter}
            </p>
            <p>
              Voluntary donation exter amount:{' '}
              {selectedData.voluntaryDonationExter}
            </p>
            <p>Decree number: {selectedData.decreeNumber}</p>
          </div>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>{' '}
          - <button onClick={handleDelete}>Delete</button>
        </>
      )}
      {isEditing && (
        <form onSubmit={handleEditSubmit}>
          <h2 className="text-lg">{selectedData?.year}</h2>
          <div>
            <label htmlFor="treatingAmount">Treating amount:</label>
            <input
              className="p-1 border border-gray-300 rounded"
              step="any"
              type="number"
              id="treatingAmount"
              defaultValue={selectedData?.treatingAmount || ''}
            />
          </div>
          <div>
            <label htmlFor="pollinationAmount">Pollination amount:</label>
            <input
              className="p-1 border border-gray-300 rounded"
              type="number"
              id="pollinationAmount"
              step="any"
              defaultValue={selectedData?.pollinationAmount || ''}
            />
          </div>
          <div>
            <label htmlFor="membershipLocal">Local membership amount:</label>
            <input
              className="p-1 border border-gray-300 rounded"
              type="number"
              id="membershipLocal"
              step="any"
              defaultValue={selectedData?.membershipLocal || ''}
            />
          </div>
          <div>
            <label htmlFor="membershipCountry">
              Country membership amount:
            </label>
            <input
              className="p-1 border border-gray-300 rounded"
              type="number"
              id="membershipCountry"
              step="any"
              defaultValue={selectedData?.membershipCountry || ''}
            />
          </div>
          <div>
            <label htmlFor="voluntaryDonationInter">
              Voluntary donation inter amount:
            </label>
            <input
              className="p-1 border border-gray-300 rounded"
              type="number"
              id="voluntaryDonationInter"
              step="any"
              defaultValue={selectedData?.voluntaryDonationInter || ''}
            />
          </div>
          <div>
            <label htmlFor="voluntaryDonationExter">
              Voluntary donation exter amount:
            </label>
            <input
              className="p-1 border border-gray-300 rounded"
              type="number"
              id="voluntaryDonationExter"
              step="any"
              defaultValue={selectedData?.voluntaryDonationExter || ''}
            />
          </div>
          <div>
            <label htmlFor="decreeNumber">Decree number for this year:</label>
            <input
              className="p-1 border border-gray-300 rounded"
              type="text"
              id="decreeNumber"
              defaultValue={selectedData?.decreeNumber || ''}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      )}
      <AddAdminData refetchAdminData={refetch} />
    </PageBody>
  );
}
