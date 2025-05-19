import UploadImageForm from '@/components/admin/ImageUploader';

export default function Page() {
  return (
    <UploadImageForm
      folder='/content'
      onUpload={(url: string) => console.log(url)}
    />
  );
}
