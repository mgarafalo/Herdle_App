import Dropzone, { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import agent from "../../../service/Agent";
import { AppState } from "../../../store/store";

interface Props {
  onDrop: any;
}

export default function FileDropzone({ onDrop }: Props) {
  return (
    <>
      <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)}>
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
