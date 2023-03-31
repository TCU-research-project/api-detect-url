import express from 'express';
import { body, query, validationResult } from 'express-validator';
import cURL from "../services/url";

const router = express.Router();

router.get('/list', async (req, res) => {
	const { page, page_size } = req.query;
	try {
		const urlService = new cURL();
		let query = {};
		const depositService = new cDeposit();
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

		const response = await urlService.Find(query, skip, pageSize, sortQuery);

		if (response.length) {
			const countResponse = await urlService.Count();
			if (countResponse) {
				return res.json({
					success: true,
					message: 'Success',
					data: {
						data: response,
						count: countResponse,
					}
				});
			}
			return res.status(400).json({
				success: false,
				message: 'Count fail'
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
			message: "Server error",
		});
	}

});

router.post('/detect-url', body('url').notEmpty(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array(),
			data: null,
		});
	}
	const { url } = req.body;
	try {
		const urlService = new cURL();
		const response = await urlService.FindOne({ name: url });
		if (response) {
			return res.json({
				success: true,
				message: 'Success',
				data: response
			});
		}

	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: 'Server error'
		});
	}
});

export default router;
