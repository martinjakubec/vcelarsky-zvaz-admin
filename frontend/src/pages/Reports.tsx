import {Navigate} from '@tanstack/react-router';
import {PageBody} from '../components/PageBody';
import {PageTitle} from '../components/PageTitle';
import {useAuth} from '../hooks/useAuth';
import {fetchAPI} from '../utils/fetchAPI';
import {useState} from 'react';

export function ReportPage() {
  const {isUserLoggedIn} = useAuth();
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFetchError(null);
    const form = e.currentTarget as HTMLFormElement;
    const file = form.file.files?.[0];
    const year = form.year.value;
    const dataFrom = form.csvDate.value;
    const feesReport = form.feesReport.checked;
    const pollinationSubsidies = form.pollinationSubsidies.checked;
    const treatingSubsidies = form.treatingSubsidies.checked;

    const formData = new FormData();

    formData.append('file', file);
    formData.append('year', year);
    formData.append('dataFrom', dataFrom);
    formData.append('feesReport', feesReport.toString());
    formData.append('pollinationSubsidies', pollinationSubsidies.toString());
    formData.append('treatingSubsidies', treatingSubsidies.toString());

    const response = await fetchAPI('/reports', {
      method: 'POST',
      body: formData,
      contentType: null,
    });
    if (response.ok) {
      const blob = await response.blob();
      const file = new File([blob], 'reports.zip', {type: 'application/zip'});
      const fileUrl = window.URL.createObjectURL(file);
      let a: HTMLAnchorElement | null = document.createElement('a');
      a.href = fileUrl;
      a.download = 'reports.zip';
      // a.click();
      a.remove();
      a = null;
      console.log('Report generated successfully');
    } else if (response.status === 404) {
      setFetchError(await response.text());
    } else {
      setFetchError("Couldn't generate report");
      console.error(await response.text());
    }
  }

  return (
    <PageBody>
      {!isUserLoggedIn && <Navigate to="/login" />}
      <PageTitle>Generate a report</PageTitle>
      <form onSubmit={handleSubmit}>
        {fetchError && <p className="text-red-500">{fetchError}</p>}
        <div>
          <label htmlFor="year">Year</label>
          <input
            required
            id="year"
            type="number"
            name="year"
            className="border border-1"
            defaultValue={new Date().getFullYear()}
          />
        </div>
        <div>
          <label htmlFor="csvDate">Data from</label>
          <input
            required
            id="csvDate"
            type="date"
            name="csvDate"
            className="border border-1"
          />
        </div>
        <div>
          <label htmlFor="file">Upload a .csv file</label>
          <input
            required
            id="file"
            type="file"
            name="files"
            accept=".csv"
            className="border border-1"
          />
        </div>
        <p>Choose which reports to generate</p>
        <div>
          <label htmlFor="feesReport">Generate fees report</label>
          <input
            defaultChecked={true}
            type="checkbox"
            id="feesReport"
            name="feesReport"
          />
        </div>
        <div>
          <label htmlFor="pollinationSubsidies">
            Generate pollination subsidies report
          </label>
          <input
            defaultChecked={true}
            type="checkbox"
            id="pollinationSubsidies"
            name="pollinationSubsidies"
          />
        </div>
        <div>
          <label htmlFor="treatingSubsidies">
            Generate treating subsidies report
          </label>
          <input
            defaultChecked={true}
            type="checkbox"
            id="treatingSubsidies"
            name="treatingSubsidies"
          />
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white">
          Submit
        </button>
      </form>
    </PageBody>
  );
}
