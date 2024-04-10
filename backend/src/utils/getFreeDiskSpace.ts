import { statfs } from "fs/promises";

/**
 * Returns the free disk space in the current directory in MB.
 */
export async function getFreeDiskSpace(): Promise<number> {
  const space = await statfs(__dirname);
  return (space.bsize * space.bfree) / 1000 / 1000;
}
