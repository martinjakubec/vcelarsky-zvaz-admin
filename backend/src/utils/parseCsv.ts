import { once } from "events";
import { createReadStream } from "fs";
import { createInterface } from "readline/promises";

type CsvLine = {
  id: string;
  hiveAmount: number;
};

export type CsvData = CsvLine[];

export async function parseCsvFile(filePath: string): Promise<CsvData> {
  try {
    const results: CsvLine[] = [];
    
    const rs = await createInterface({
      input: createReadStream(filePath),
    });

    rs.on("line", (line) => {
      const values = line.split(";");
      results.push({ id: values[0], hiveAmount: Number(values[9]) });
    });

    await once(rs, "close");

    return results;
  } catch (err) {
    throw err;
  }
}
