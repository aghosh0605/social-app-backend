import { Router } from "express";
import { handleExolore } from "./controllers/subtopic.services";

const subtopicRoute = Router();

subtopicRoute.get("/explore", handleExolore);

export default subtopicRoute;
