import url from "../models/url";

export default class cURL {
	Create = async (data) => {

		const newUrl = new url(data);
		const response = await newUrl.save();

		if (response) {
			return response;
		}

	};

	Find = async (query = {}, skip = null, limit = null, sort = null) => {

		const Query = url.find(query);
		if (skip) Query.skip(skip);
		if (limit) Query.limit(limit);
		if (sort) Query.sort(sort);

		const results = await Query;

		return results || [];

	};

	Count = async (query) => {
		const count = await url.countDocuments(query).exec();

		return count;
	};

	FindOne = async (query) => {
		const response = await url.findOne(query).exec();

		return response || null;
	};

	FindById = async (id) => {
		const response = await url.findById(id).exec();

		return response || null;
	};

	Update = async (query, dataUpdate) => {
		const urlUpdated = await url.findOneAndUpdate(
			query,
			{
				$set: { ...dataUpdate },
			},
			{
				returnDocument: 'after',
			},
		);

		return urlUpdated;
	};

	Upsert = async (query, dataUpdate) => {
		const urlUpdated = await url.findOneAndUpdate(
			query,
			{
				$set: { ...dataUpdate },
			},
			{
				returnDocument: 'after',
				upsert: true,
			},
		);

		return urlUpdated;
	};
}
