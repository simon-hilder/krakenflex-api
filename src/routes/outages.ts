import express from 'express';
import controller from '../controllers/outages';
const router = express.Router();

router.get('/outages', controller.getOutages);

export = router;