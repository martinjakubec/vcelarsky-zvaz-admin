import {Navigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {useRef} from 'react';
import {SelectInput} from '../components/Input/SelectInput';
import {TextInput} from '../components/Input/TextInput';
import {NumberInput} from '../components/Input/NumberInput';
import {FileInput} from '../components/Input/FileInput';
import {DateInput} from '../components/Input/DateInput';
import {CheckboxInput} from '../components/Input/CheckboxInput';
import {Button} from '../components/Button';

export function Home() {
  const {isUserLoggedIn} = useAuth();

  const textRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Home</PageTitle>
      <p>Welcome home!</p>
    </PageBody>
  );
}
