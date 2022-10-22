import { Router } from "express";
import { yupObjIdSchema } from "../../models/middlewareSchemas";
import { searchHomePage } from "./controllers/search.service";

const searchRoutes = Router();

searchRoutes.post("/homePageSearch", searchHomePage);

export default searchRoutes;
