import {useRef, useState} from 'react';
import {useAPI} from '../hooks/useAPI';
import {MembersResponse} from '../types/ResponseTypes';
import {fetchAPI} from '../utils/fetchAPI';
import {Button} from './Button';
import {NumberInput} from './Input/NumberInput';
import {SelectInput} from './Input/SelectInput';
import {TextInput} from './Input/TextInput';

interface AddDistrictProps {
  refetchDistricts: () => Promise<void>;
  closeModal?: () => void;
}

export function AddDistrict({refetchDistricts, closeModal}: AddDistrictProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = districtNameRef.current?.value;
    const id = districtIdRef.current?.value;
    const districtManagerId = districtManagerIdRef.current?.value;

    console.log(name, id, districtManagerId);

    const response = await fetchAPI('/districts', {
      method: 'POST',
      body: JSON.stringify({name, id, districtManagerId}),
    });

    if (response.ok) {
      console.log(await response.json());
      refetchDistricts();
      closeModal?.();
    } else {
      const error = await response.text();
      console.log(error);
      setSubmitError(error);
    }
  }

  const [submitError, setSubmitError] = useState<string>('');

  const {data, error, loading} = useAPI<MembersResponse>('/members');

  const districtNameRef = useRef<HTMLInputElement>(null);
  const districtIdRef = useRef<HTMLInputElement>(null);
  const districtManagerIdRef = useRef<HTMLSelectElement>(null);

  return (
    <form onSubmit={handleSubmit} className="px-20 py-10">
      <p className="text-lg font-bold">Nový obvod</p>
      {error && <p className="text-red-500">{error}</p>}
      {submitError && <p className="text-red-500">{submitError}</p>}
      <TextInput
        ref={districtNameRef}
        required
        defaultValue=""
        id="districtName"
        name="Názov obvodu"
      />
      <NumberInput
        ref={districtIdRef}
        required
        id="districtId"
        name="Číslo obvodu"
      />
      <SelectInput
        ref={districtManagerIdRef}
        id="districtManagerId"
        name="Vedúci obvodu"
        placeholder="---"
      >
        {data ? (
          data.map((user) => (
            <option key={user.id} value={user.id}>
              {user.id} - {user.name} {user.surname}
            </option>
          ))
        ) : (
          <option value="" disabled>
            Loading...
          </option>
        )}
      </SelectInput>
      <Button type="submit">Pridať obvod</Button>
    </form>
  );
}
