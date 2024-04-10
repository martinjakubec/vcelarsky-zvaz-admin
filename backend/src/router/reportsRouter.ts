import express from "express";
import multer from "multer";
import { parseCsvFile } from "../utils/parseCsv";
import prismaClient from "../prismaClient";
import { rm } from "fs/promises";
import {
  calculateFees,
  calculatePollinationSubsidies,
  calculateTreatingSubsidies,
  sortDataIntoDistricts,
} from "../utils/reportData";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, callback) {
    const fileName = file.originalname.split(".").join(`-${req.requestTime}.`);

    callback(null, fileName);
  },
});

const upload = multer({
  storage,
  preservePath: true,
  fileFilter: (req, file, cb) => {
    file.originalname.endsWith(".csv")
      ? cb(null, true)
      : cb(new Error("File is not a .csv file."));
  },
});

export const reportsRouter = express.Router();

reportsRouter.post("/", upload.single("file"), async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send("Unauthorized");
  const { year, feesReport, pollinationSubsidies, treatingSubsidies } =
    req.body;
  if (!year) return res.status(400).send("Year is required");
  try {
    const filePath = `./uploads/${req.file?.originalname.split(".")[0]}-${
      req.requestTime
    }.csv`;
    const csvData = await parseCsvFile(filePath);
    const adminData = await prismaClient.adminData.findFirst({
      where: {
        year: year,
      },
    });

    if (!adminData)
      return res.status(404).send(`Admin data not found for ${year}`);

    const memberData = await prismaClient.member.findMany({
      where: {
        deletedAt: null,
        id: {
          in: csvData.map((data) => data.id.toString()),
        },
      },
    });

    if (feesReport === "true") {
      const feesData = sortDataIntoDistricts(
        calculateFees(csvData, memberData, adminData)
      );
    }

    if (pollinationSubsidies === "true") {
      const pollinationSubsidiesData = sortDataIntoDistricts(
        calculatePollinationSubsidies(csvData, memberData, adminData)
      );
    }

    if (treatingSubsidies === "true") {
      const treatingSubsidiesData = sortDataIntoDistricts(
        calculateTreatingSubsidies(csvData, memberData, adminData)
      );
    }

    await rm(filePath);

    return res.status(200).send("Report generated successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
});
