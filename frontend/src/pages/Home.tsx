import {Navigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {Input} from '../components/Input/Input';
import {useRef} from 'react';
import {SelectInput} from '../components/Input/SelectInput';

export function Home() {
  const {isUserLoggedIn} = useAuth();

  const textRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Home</PageTitle>
      <p>Welcome home!</p>
      <Input
        ref={textRef}
        name="some name"
        id="someId"
        defaultValue="aaa"
        type="text"
        required
      />
      <Input
        type="number"
        ref={numberRef}
        defaultValue={2}
        id="number"
        name="number"
      />
      <Input type="file" name="file" id="file" defaultValue="" />
      <Input type="date" defaultValue="1999-12-30" id="date" name="date" />
      <SelectInput id="selectInput" name="Select" required placeholder='test'>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </SelectInput>
    </PageBody>
  );
}
