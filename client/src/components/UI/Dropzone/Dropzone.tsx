import Dropzone, { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import agent from "../../../service/Agent";
import { AppState } from "../../../store/store";

export default function FileDropzone() {
  const store = useSelector((state: AppState) => state.appState.user);

  async function OnDrop(file: any): Promise<any> {
    await agent.Account.uploadAvatarImage(store.id!, file).then(
      (response: any) => {
        console.log(response);
      }
    );
  }

  return (
    <>
      <Dropzone onDrop={(acceptedFiles) => OnDrop(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
    </>
  );
}
