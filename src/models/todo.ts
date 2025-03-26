import { Schema, model } from "mongoose";
import { TodoType } from "../types/api/todo";

const todoSchema = new Schema<TodoType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Todo = model<TodoType>("Todo", todoSchema);
