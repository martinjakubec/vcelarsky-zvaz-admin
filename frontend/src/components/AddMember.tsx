import {useRef, useState} from 'react';
import {useAPI} from '../hooks/useAPI';
import {DistrictsResponse, MembersResponse} from '../types/ResponseTypes';
import {fetchAPI} from '../utils/fetchAPI';
import {TextInput} from './Input/TextInput';
import {EmailInput} from './Input/EmailInput';
import {DateInput} from './Input/DateInput';
import {SelectInput} from './Input/SelectInput';
import {Button} from './Button';

interface AddMemberProps {
  refetchMembers: () => Promise<void>;
  closeModal?: () => void;
}

export function AddMember({refetchMembers, closeModal}: AddMemberProps) {
  const {
    data: districtData,
    error: districtError,
    loading: districtLoading,
  } = useAPI<DistrictsResponse>('/districts');

  const [submitError, setSubmitError] = useState<string>('');

  const nameTitleRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const memberIdRef = useRef<HTMLInputElement>(null);
  const oldMemberIdRef = useRef<HTMLInputElement>(null);
  const addressCityRef = useRef<HTMLInputElement>(null);
  const addressStreetRef = useRef<HTMLInputElement>(null);
  const addressZipRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const districtIdRef = useRef<HTMLSelectElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitError('');
    e.preventDefault();
    const name = firstNameRef.current?.value;
    const surname = surnameRef.current?.value;
    const email = emailRef.current?.value;
    const id = memberIdRef.current?.value;
    const addressCity = addressCityRef.current?.value;
    const addressStreet = addressStreetRef.current?.value;
    const addressZip = addressZipRef.current?.value;
    const phone = phoneRef.current?.value;
    const districtId = districtIdRef.current?.value;
    const title = nameTitleRef.current?.value;
    const oldId = oldMemberIdRef.current?.value;
    const birthDate = birthDateRef.current?.value;

    const response = await fetchAPI('/members', {
      method: 'POST',
      body: JSON.stringify({
        name,
        id,
        surname,
        email,
        addressCity,
        phone,
        districtId,
        addressStreet,
        addressZip,
        title,
        oldId,
        birthDate,
      }),
    });

    if (response.ok) {
      console.log(await response.json());
      refetchMembers();
      closeModal?.();
    } else {
      const error = await response.text();
      setSubmitError(error);
      console.error(error);
    }
  };

  const {data, error, loading} = useAPI<MembersResponse>('/members');

  return (
    <>
      <form className="px-20 py-10" onSubmit={handleSubmit}>
        <p className="text-lg font-bold">Nový člen</p>
        {error && <p className="text-red-500">{error}</p>}
        {submitError && <p className="text-red-500">{submitError}</p>}
        <TextInput
          defaultValue=""
          id="nameTitle"
          name="Titul"
          ref={nameTitleRef}
        />
        <TextInput
          required
          defaultValue=""
          id="firstName"
          name="Meno"
          ref={firstNameRef}
        />
        <TextInput
          required
          defaultValue=""
          id="surname"
          name="Priezvisko"
          ref={surnameRef}
        />
        <EmailInput defaultValue="" id="email" name="Email" ref={emailRef} />
        <DateInput
          defaultValue=""
          id="birthDate"
          name="Dátum narodenia"
          ref={birthDateRef}
        />
        <TextInput
          required
          defaultValue=""
          id="memberId"
          name="Číslo farmy v CEHZ"
          ref={memberIdRef}
        />
        <TextInput
          defaultValue=""
          id="oldMemberId"
          name="Číslo farmy v CR"
          ref={oldMemberIdRef}
        />
        <TextInput
          defaultValue=""
          id="addressCity"
          name="Mesto"
          ref={addressCityRef}
        />
        <TextInput
          defaultValue=""
          id="addressStreet"
          name="Ulica"
          ref={addressStreetRef}
        />
        <TextInput
          defaultValue=""
          id="addressZip"
          name="PSČ"
          ref={addressZipRef}
        />
        <TextInput defaultValue="" id="phone" name="Telefón" ref={phoneRef} />
        <SelectInput id="districtId" name="Obvod" ref={districtIdRef}>
          <option value="">---</option>
          {districtData &&
            districtData.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
        </SelectInput>
        <Button type="submit">Pridať člena</Button>
      </form>
    </>
  );
}
