import express from "express";
import memberRouter from "./memberRouter";
import userRouter from "./userRouter";
import loginRouter from "./loginRouter";
import districtRouter from "./districtRouter";
import verifyRouter from "./verifyRouter";
import { adminRouter } from "./adminRouter";
import { reportsRouter } from "./reportsRouter";

const apiRouter = express.Router();

apiRouter.use("/members", memberRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/login", loginRouter);
apiRouter.use("/districts", districtRouter);
apiRouter.use("/verify", verifyRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/reports", reportsRouter)

export default apiRouter;
