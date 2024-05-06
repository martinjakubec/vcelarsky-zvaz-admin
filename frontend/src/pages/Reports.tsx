import {Navigate} from '@tanstack/react-router';
import {PageBody} from '../components/PageBody';
import {PageTitle} from '../components/PageTitle';
import {useAuth} from '../hooks/useAuth';
import {fetchAPI} from '../utils/fetchAPI';
import {useRef, useState} from 'react';
import {NumberInput} from '../components/Input/NumberInput';
import {DateInput} from '../components/Input/DateInput';
import {FileInput} from '../components/Input/FileInput';
import {CheckboxInput} from '../components/Input/CheckboxInput';
import {Button} from '../components/Button';

export function ReportPage() {
  const {isUserLoggedIn} = useAuth();
  const [fetchError, setFetchError] = useState<string | null>(null);

  const yearRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const feesReportRef = useRef<HTMLInputElement>(null);
  const pollinationSubsidiesRef = useRef<HTMLInputElement>(null);
  const treatingSubsidiesRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFetchError(null);
    const file = fileRef.current?.files?.[0];
    const year = yearRef.current?.value;
    const dataFrom = dateRef.current?.value;
    const feesReport = feesReportRef.current?.checked;
    const pollinationSubsidies = pollinationSubsidiesRef.current?.checked;
    const treatingSubsidies = treatingSubsidiesRef.current?.checked;

    const formData = new FormData();

    formData.append('file', file || '');
    formData.append('year', year || '');
    formData.append('dataFrom', dataFrom || '');
    formData.append('feesReport', feesReport?.toString() || 'false');
    formData.append(
      'pollinationSubsidies',
      pollinationSubsidies?.toString() || 'false'
    );
    formData.append(
      'treatingSubsidies',
      treatingSubsidies?.toString() || 'false'
    );

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
      a.click();
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
        <NumberInput
          ref={yearRef}
          required
          defaultValue={new Date().getFullYear()}
          id="year"
          name="Rok"
        />
        <DateInput id="csvDate" name="Dáta zo dňa" required ref={dateRef} />
        <FileInput
          id="file"
          name="Dáta vo forme .csv"
          accept=".csv"
          uploadText="Klikni a vyber súbor..."
          required
          ref={fileRef}
        />
        <p className="font-bold text-lg">Ktoré reporty sa majú generovať:</p>
        <CheckboxInput
          id="feesReport"
          name="Členské pre ZO a SZV"
          defaultChecked={true}
          ref={feesReportRef}
        />
        <CheckboxInput
          id="pollinationSubsidies"
          name="Dotácie za opeľovaciu činnosť"
          defaultChecked={true}
          ref={pollinationSubsidiesRef}
        />
        <CheckboxInput
          id="treatingSubsidies"
          name="Dotácie na liečivo"
          defaultChecked={true}
          ref={treatingSubsidiesRef}
        />
        <Button type="submit">Generovať</Button>
      </form>
    </PageBody>
  );
}
