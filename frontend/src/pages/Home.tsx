import {Navigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';

export function Home() {
  const {isUserLoggedIn} = useAuth();

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Home</PageTitle>
      <p>Welcome home!</p>
    </PageBody>
  );
}
