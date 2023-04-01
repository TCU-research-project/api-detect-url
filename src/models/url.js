import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const urlSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		resultDetection: {
			type: String,
			require: true,
		},
		review: {
			type: Number,
			default: null
		}
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
		collection: 'URL',
	},
);

export default mongoose.model('URL', urlSchema);
