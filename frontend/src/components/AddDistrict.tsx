import { useAPI } from "../hooks/useAPI";
import { MembersResponse } from "../types/ResponseTypes";
import { fetchAPI } from "../utils/fetchAPI";
import { getLoginToken } from "../utils/localStorageUtils";

export function AddDistrict({ refetchDistricts }: { refetchDistricts: () => Promise<void> }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.districtName.value;
    const id = form.districtId.value;
    const districtManagerId = form.districtManagerId.value;

    const response = await fetchAPI('/districts', {
      method: 'POST',
      body: JSON.stringify({ name, id, districtManagerId }),
    });

    if (response.ok) {
      console.log(await response.json())
      refetchDistricts()
      form.reset();
    } else {
      const error = await response.text();
      console.log(error);
    }
  }

  const { data, error, loading } = useAPI<MembersResponse>('/members');

  return (
    <form onSubmit={handleSubmit} className="border mt-4">
      <h1>Add District</h1>
      <div>
        <label htmlFor="districtName">District Name</label>
        <input required className="p-1 border border-gray-300 rounded" type="text" id="districtName" name="districtName" />
      </div>
      <div>
        <label htmlFor="districtId">District ID</label>
        <input required className="p-1 border border-gray-300 rounded" type="text" id="districtId" name="districtId" />
      </div>
      <div>
        <label htmlFor="districtManagerId">District Manager</label>
        <select className="p-1 border border-gray-300 rounded" id="districtManagerId" name="districtManagerId">
          <option value="">---</option>
          {
            data ? data.map((user) => (
              <option key={user.id} value={user.id}>{user.id} - {user.name} {user.surname}</option>
            )) : <option value="" disabled>Loading...</option>
          }
        </select>
      </div>
      <button type="submit" className="p-1 border border-gray-300 rounded bg-blue-500 text-white">Add District</button>
    </form>
  );
} 