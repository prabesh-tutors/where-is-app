import { Router } from "express";
import { createItem, getItems, getItemById, updateItem, deleteItem } from "../controllers/itemController";
import { validateObjectId } from "../middleware/validateObjectId";

const router = Router();

router
  .route("/")
  .get(getItems)
  .post(createItem);

router
  .route("/:id")
  .get(validateObjectId, getItemById)
  .put(validateObjectId, updateItem)
  .delete(validateObjectId, deleteItem);

export default router;
