import {Navigate, useNavigate} from '@tanstack/react-router';
import {useAuth} from '../hooks/useAuth';
import {PageTitle} from '../components/PageTitle';
import {PageBody} from '../components/PageBody';
import {districtsSingle} from '../routes/districtsRoute';

export function DistrictsSingle() {
  const {isUserLoggedIn} = useAuth();

  const {id} = districtsSingle.useParams();

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Single district {id}</PageTitle>
      <p>List of districts</p>
    </PageBody>
  );
}
