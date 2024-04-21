import {useState} from 'react';
import {fetchAPI} from '../utils/fetchAPI';

export function AddAdminData({
  refetchAdminData,
}: {
  refetchAdminData: () => Promise<void>;
}) {
  const [postError, setPostError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostError(null);
    const form = e.currentTarget;
    const year = form.year.value;
    const pollinationAmount = form.pollinationAmount.value;
    const treatingAmount = form.treatingAmount.value;
    const membershipLocal = form.membershipLocal.value;
    const membershipCountry = form.membershipCountry.value;
    const voluntaryDonationInter = form.voluntaryDonationInter.value;
    const voluntaryDonationExter = form.voluntaryDonationExter.value;

    const response = await fetchAPI('/admin', {
      method: 'POST',
      body: JSON.stringify({
        year,
        pollinationAmount,
        treatingAmount,
        membershipLocal,
        membershipCountry,
        voluntaryDonationInter,
        voluntaryDonationExter,
      }),
    });

    if (response.ok) {
      await response.json();
      refetchAdminData();
      form.reset();
    } else {
      const error = await response.text();
      setPostError(error);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border mt-4">
      <h1>Add Year</h1>
      <div>
        <label htmlFor="year">Year</label>
        <input
          required
          className="p-1 border border-gray-300 rounded"
          type="number"
          step="any"
          id="year"
          name="year"
        />
      </div>
      <div>
        <label htmlFor="pollinationAmount">Pollination amount</label>
        <input
          required
          className="p-1 border border-gray-300 rounded"
          type="number"
          step="any"
          id="pollinationAmount"
          name="pollinationAmount"
        />
      </div>
      <div>
        <label htmlFor="treatingAmount">Treating amount</label>
        <input
          required
          className="p-1 border border-gray-300 rounded"
          type="number"
          step="any"
          id="treatingAmount"
          name="treatingAmount"
        />
      </div>
      <div>
        <label htmlFor="membershipLocal">Local membership amount</label>
        <input
          required
          className="p-1 border border-gray-300 rounded"
          type="number"
          step="any"
          id="membershipLocal"
          name="membershipLocal"
        />
      </div>
      <div>
        <label htmlFor="membershipCountry">Country membership amount</label>
        <input
          required
          className="p-1 border border-gray-300 rounded"
          type="number"
          step="any"
          id="membershipCountry"
          name="membershipCountry"
        />
      </div>
      <div>
        <label htmlFor="voluntaryDonationInter">
          Voluntary inter donation amount
        </label>
        <input
          required
          className="p-1 border border-gray-300 rounded"
          type="number"
          step="any"
          id="voluntaryDonationInter"
          name="voluntaryDonationInter"
        />
      </div>
      <div>
        <label htmlFor="voluntaryDonationExter">
          Voluntary exter donation amount
        </label>
        <input
          required
          className="p-1 border border-gray-300 rounded"
          type="number"
          step="any"
          id="voluntaryDonationExter"
          name="voluntaryDonationExter"
        />
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white">
        Add Data
      </button>
      {postError && <p className="text-red-500">{postError}</p>}
    </form>
  );
}
