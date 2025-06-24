// pagination.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PAGE_SIZE = parseInt(process.env.PAGE_SIZE, 10) || 10;

const getPaginatedData = async (model, page) => {
  const skip = (page - 1) * PAGE_SIZE;
  const totalItems = await model.countDocuments();
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const data = await model.find().skip(skip).limit(PAGE_SIZE);

  return {
    data,
    page,
    totalPages,
  };
};
export default getPaginatedData;
