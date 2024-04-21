import { useAPI } from "../hooks/useAPI";
import { DistrictsResponse, MembersResponse } from "../types/ResponseTypes";
import { fetchAPI } from "../utils/fetchAPI";

export function AddMember({ refetchMembers }: { refetchMembers: () => Promise<void> }) {
  const { data: districtData, error: districtError, loading: districtLoading } = useAPI<DistrictsResponse>('/districts');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.firstName.value;
    const surname = form.surname.value;
    const email = form.email.value;
    const id = form.memberId.value;
    const addressCity = form.addressCity.value;
    const addressStreet = form.addressStreet.value;
    const addressZip = form.addressZip.value;
    const phone = form.phone.value;
    const districtId = form.districtId.value;
    const title = form.nameTitle.value;
    const oldId = form.oldMemberId.value;
    const birthDate = form.birthDate.value;


    const response = await fetchAPI('/members', {
      method: 'POST',
      body: JSON.stringify({ name, id, surname, email, addressCity, phone, districtId, addressStreet, addressZip, title, oldId }),
    });

    if (response.ok) {
      console.log(await response.json())
      refetchMembers()
      form.reset();
    } else {
      const error = await response.text();
      console.error(error);
    }
  }

  const { data, error, loading } = useAPI<MembersResponse>('/members');

  return (
    <form onSubmit={handleSubmit} className="border mt-4">
      <h1>Add Member</h1>
      <div>
        <label htmlFor="nameTitle">Title</label>
        <input required className="p-1 border border-gray-300 rounded" type="text" id="nameTitle" name="nameTitle" />
      </div>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input required className="p-1 border border-gray-300 rounded" type="text" id="firstName" name="firstName" />
      </div>
      <div>
        <label htmlFor="surname">Surname</label>
        <input required className="p-1 border border-gray-300 rounded" type="text" id="surname" name="surname" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input className="p-1 border border-gray-300 rounded" type="email" id="email" name="email" />
      </div>
      <div>
        <label htmlFor="birthDate">Date of birth</label>
        <input className="p-1 border border-gray-300 rounded" type="date" id="birthDate" name="birthDate" />
      </div>
      <div>
        <label htmlFor="memberId">ID</label>
        <input required className="p-1 border border-gray-300 rounded" type="text" id="memberId" name="memberId" />
      </div>
      <div>
        <label htmlFor="oldMemberId">Old type ID</label>
        <input required className="p-1 border border-gray-300 rounded" type="text" id="oldMemberId" name="oldMemberId" />
      </div>
      <div>
        <label htmlFor="addressCity">City</label>
        <input className="border border-1" type="text" id="addressCity" name="addressCity" />
      </div>
      <div>
        <label htmlFor="addressStreet">Street</label>
        <input className="border border-1" type="text" id="addressStreet" name="addressStreet" />
      </div>
      <div>
        <label htmlFor="addressZip">ZIP Code</label>
        <input className="border border-1" type="text" id="addressZip" name="addressZip" />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input className="p-1 border border-gray-300 rounded" type="text" id="phone" name="phone" />
      </div>
      <div>
        <label htmlFor="districtId">District</label>
        <select name="districtId" id="districtId">
          <option value="">---</option>
          {districtData && districtData.map((district) => (
            <option key={district.id} value={district.id}>{district.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white">Add Member</button>
    </form>
  );
} 