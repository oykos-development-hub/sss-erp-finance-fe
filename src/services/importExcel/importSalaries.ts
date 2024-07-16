export const importSalariesExcel = async (
  file: File,
  organization_unit_id: number,
  token: string,
): Promise<any['data']> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('organization_unit_id', organization_unit_id.toString());

  const response = await fetch(`${import.meta.env.VITE_FILES_URL}/import-salaries-excel`, {
    method: 'POST',
    headers: {
      ...(token && {Authorization: `Bearer ${token}`}),
    },
    body: formData,
  });

  return await response.json();
};
