import mongoose, { Schema, model } from 'mongoose';

const eventSchema = new Schema(
  {
    // id: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() },
    event: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

eventSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    const { _id, __v, ...rest } = ret;
    return {
      id: _id.toString(), // `id` を最初に配置
      ...rest, // 残りのプロパティを展開
    };
  },
});

const Event = model('Event', eventSchema);
export default Event;
