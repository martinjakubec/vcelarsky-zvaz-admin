import express from "express";
import prismaClient from "../prismaClient";
import { log } from "console";

const districtRouter = express.Router();

districtRouter.get("/", async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send("Unauthorized");
  try {
    const districts = await prismaClient.district.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        districtManager: {
          select: {
            name: true,
            surname: true,
            id: true,
          },
        },
      },
    });
    return res.json(districts);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

districtRouter.get("/:districtId", async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send("Unauthorized");
  try {
    const district = await prismaClient.district.findUnique({
      where: {
        id: req.params.districtId,
        deletedAt: null,
      },
      include: {
        districtManager: true,
        members: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
    if (!district) return res.status(404).send("District not found");
    return res.json(district);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

districtRouter.post("/", async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send("Unauthorized");
  if (!req.body) return res.status(400).send("No body provided");

  const { id, name, districtManagerId } = req.body;
  if (!id) return res.status(400).send("Id is required");
  if (!name) return res.status(400).send("Name is required");

  try {
    if (await prismaClient.district.findUnique({ where: { id } })) {
      return res.status(400).send("District with this ID already exists");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }

  try {
    const district = await prismaClient.district.create({
      data: {
        id,
        name,
        districtManagerId: districtManagerId
          ? districtManagerId.toString()
          : undefined,
      },
    });
    return res.json(district);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

districtRouter.put("/:districtId", async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send("Unauthorized");
  const { districtId } = req.params;
  if (!req.body) return res.status(400).send("Bad request");

  const { name, managerId, id: newId } = req.body;
  if (name === null) return res.status(400).send("Name is required");

  try {
    if (
      !(await prismaClient.district.findUnique({ where: { id: districtId } }))
    )
      return res.status(404).send("District not found");

    if (
      newId.toString() &&
      newId.toString() !== districtId &&
      (await prismaClient.district.findUnique({
        where: { id: newId.toString() },
      }))
    )
      return res.status(400).send("District with this ID already exists");

    if (
      managerId &&
      !(await prismaClient.member.findUnique({
        where: { id: managerId.toString() },
      }))
    )
      return res.status(404).send("Manager not found");

    const district = await prismaClient.district.update({
      where: {
        id: districtId,
      },
      data: {
        id: newId.toString(),
        name,
        districtManager: managerId
          ? { connect: { id: managerId.toString() } }
          : { disconnect: true },
      },
    });

    return res.json(district);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

districtRouter.delete("/", async (req, res) => {
  if (!res.locals.isUserLoggedIn) return res.status(401).send("Unauthorized");

  const { id } = req.body;
  if (!id) return res.status(400).send("Id is required");

  try {
    if (!(await prismaClient.district.findUnique({ where: { id: id } })))
      return res.status(404).send("District not found");

    const deletedDistrict = await prismaClient.district.delete({
      where: {
        id: id,
      },
    });

    return res.json(deletedDistrict);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

export default districtRouter;
