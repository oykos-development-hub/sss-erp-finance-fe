import {FileUpload, Typography, Modal} from 'client-library';
import useAppContext from '../../context/useAppContext.ts';
import {useState} from 'react';
import useAcceptBySSSFundRelease from '../../services/graphQL/fundRelease/useAcceptBySSSFundRelease.ts';
import {FundReleaseItem} from '../../types/graphQL/fundRelease.ts';
import FileList from '../fileList/fileList.tsx';

interface fundReleaseModalAcceptBySSSProps {
  onClose: () => void;
  refetch: () => void;
  open: boolean;
  item: FundReleaseItem | null;
}

const fundReleaseModalAcceptBySSS = ({onClose, open, refetch, item}: fundReleaseModalAcceptBySSSProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>();

  const {
    fileService: {uploadFile},
    alert,
  } = useAppContext();

  const handleUpload = (files: FileList) => {
    setUploadedFiles(files);
  };

  const {acceptBySSSFundRelease} = useAcceptBySSSFundRelease();

  const handleSubmit = async () => {
    let file_id;

    if (uploadedFiles?.length) {
      const formData = new FormData();
      const fileArray = Array.from(uploadedFiles);

      formData.append('file', fileArray[0]);

      await uploadFile(
        formData,
        (res: any) => {
          setUploadedFiles(undefined);
          file_id = res[0]?.id;
        },
        () => {
          alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
          return;
        },
      );
    }

    if (!file_id || !item) return;

    await acceptBySSSFundRelease(
      file_id,
      item?.id,
      () => {
        alert.success('Zahtjev za otpuštanje sredstava uspješno odobren!');
        refetch();
        onClose();
      },
      () => {
        alert.error('Greška pri odobravanju zahtjeva za otpuštanje sredstava!');
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="ODOBRI ZAHTJEV ZA OTPUŠTANJE SREDSTAVA"
      leftButtonOnClick={onClose}
      rightButtonOnClick={handleSubmit}
      rightButtonText="Odobri zahtjev"
      leftButtonText="Otkaži"
      content={
        <div style={{marginTop: 25, display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <FileList files={item?.organization_unit_file?.id ? [item?.organization_unit_file] : null} />

          <FileUpload
            icon={null}
            files={uploadedFiles}
            variant="secondary"
            onUpload={handleUpload}
            note={<Typography variant="bodySmall" content="Dodaj fajl" style={{marginLeft: '10px'}} />}
            buttonText="Učitaj"
          />
        </div>
      }
    />
  );
};

export default fundReleaseModalAcceptBySSS;
