import { Box } from "@mui/system";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../../Interfaces/Account";
import agent from "../../../service/Agent";
import { setUserState } from "../../../store/slice";
import { AppState } from "../../../store/store";

export default function EditProfile() {
  const store = useSelector((state: AppState) => state.appState.user);
  const dispatch = useDispatch();

  async function OnDrop(file: any): Promise<void> {
    await agent.Account.uploadAvatarImage(store.id!, file).then(
      (response: User) => {
        dispatch(setUserState(response));
      }
    );
  }
  return (
    <>
      <Box className="min-h-screen flex items-center justify-center">
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
      </Box>
    </>
  );
}
