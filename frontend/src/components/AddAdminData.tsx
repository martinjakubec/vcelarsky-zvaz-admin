import {useRef, useState} from 'react';
import {fetchAPI} from '../utils/fetchAPI';

interface AddAdminDataProps {
  refetchAdminData: () => Promise<void>;
  closeModal?: () => void;
}

export function AddAdminData({
  refetchAdminData,
  closeModal,
}: AddAdminDataProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const pollinationAmountRef = useRef<HTMLInputElement>(null);
  const treatingAmountRef = useRef<HTMLInputElement>(null);
  const membershipLocalRef = useRef<HTMLInputElement>(null);
  const membershipCountryRef = useRef<HTMLInputElement>(null);
  const voluntaryDonationInterRef = useRef<HTMLInputElement>(null);
  const voluntaryDonationExterRef = useRef<HTMLInputElement>(null);
  const decreeNumberRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const year = yearRef.current?.value;
    const pollinationAmount = pollinationAmountRef.current?.value;
    const treatingAmount = treatingAmountRef.current?.value;
    const membershipLocal = membershipLocalRef.current?.value;
    const membershipCountry = membershipCountryRef.current?.value;
    const voluntaryDonationInter = voluntaryDonationInterRef.current?.value;
    const voluntaryDonationExter = voluntaryDonationExterRef.current?.value;
    const decreeNumber = decreeNumberRef.current?.value;

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
        decreeNumber,
      }),
    });

    if (response.ok) {
      await response.json();
      refetchAdminData();
      closeModal?.();
    } else {
      const error = await response.text();
      setSubmitError(error);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-20 py-10">
      <p className="text-lg font-bold">Administratívne dáta</p>
      {submitError && <p className="text-red-500">{submitError}</p>}
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
      <div>
        <label htmlFor="decreeNumber">Decree number for this year:</label>
        <input
          required
          className="p-1 border border-gray-300 rounded"
          type="number"
          step="any"
          id="decreeNumber"
          name="decreeNumber"
        />
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white">
        Add Data
      </button>
      {submitError && <p className="text-red-500">{submitError}</p>}
    </form>
  );
}
