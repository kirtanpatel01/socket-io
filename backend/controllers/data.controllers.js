import { Data } from "../models/data.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addData = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(409, "Content is required!");
  }
  const data = await Data.create({ content });

  if (!data) {
    throw new ApiError(500, "Error while adding data into database!");
  }

  req.io.emit("newData", data);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Content is added successfully!"));
});

const getAllData = asyncHandler(async (req, res) => {
  const dataList = await Data.find({});
  
  return res
    .status(200)
    .json(new ApiResponse(200, dataList, "Data fetched successfully!"));
});

export { addData, getAllData };
