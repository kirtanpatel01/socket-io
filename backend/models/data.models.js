import { Schema, model } from "mongoose";

const dataSchema = new Schema({
    content: {
        type: String
    },
});

export const Data = model('Data', dataSchema);