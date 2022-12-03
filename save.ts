let isSaving = false;
export async function save(audio: string) {
  if (isSaving) {
    return;
  }
  isSaving = true;

  try {
    // create a new handle
    const newHandle = await window.showSaveFilePicker({
      types: [
        {
          accept: { "audio/ogg": [".ogg"] },
          description: "YAML chapter nodes file",
        },
      ],
      suggestedName: "record.ogg",
    });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    let blobData = new Blob([audio], { type: "audio/ogg" });

    // write our file
    await writableStream.write(blobData);

    // close the file and write the contents to disk.
    await writableStream.close();
  } catch (err) {
    console.error(err);
  } finally {
    isSaving = false;
  }
}
