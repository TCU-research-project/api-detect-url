import cArticle from "../services/article";
import express from 'express';

const router = express.Router();

router.get('/list', async (req, res) => {
	const { page, page_size } = req.query;
	try {
		const articleService = new cArticle();
		let query = {};
		let pageSize = 20;
		if (!page_size) {
			pageSize = 20;
		} else {
			pageSize = +page_size;
		}
		if (Number(page_size) > 50) {
			pageSize = 50;
		}
		let offset = 1;
		if (!page) {
			offset = 1;
		} else {
			offset = +page;
		}
		let sortQuery = {
			created_at: -1,
		};

		const skip = (offset - 1) * pageSize;

		const response = await articleService.Find(query, skip, pageSize, sortQuery);

		if (response) {
			const countResponse = await articleService.Count();
			if (countResponse) {
				return res.json({
					success: true,
					message: 'Success',
					data: {
						data: response,
						count: countResponse,
					},
				});
			}
			return res.status(400).json({
				success: false,
				message: 'Count fail',
			});
		}
		return res.status(400).json({
			success: false,
			message: 'Not found any record',
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: 'Server error',
		});
	}
});

export default router;
