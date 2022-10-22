import { Router } from "express";
import { yupObjIdSchema } from "../../models/middlewareSchemas";
import { searchCirclePage, searchHomePage } from "./controllers/search.service";

const searchRoutes = Router();

searchRoutes.post("/homePageSearch", searchHomePage);
searchRoutes.post("/circlePageSearch", searchCirclePage);

export default searchRoutes;
