import fs from "fs";

export const deleteFile = async(filename: string) => {
  try {
    fs.promises.stat(filename)
  } catch {
    return
  }
  await fs.promises.unlink(filename)
}