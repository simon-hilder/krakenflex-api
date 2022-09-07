import express from 'express';
import { getOutages } from './controllers/outage';
import siteInfoController from './controllers/site-info';
import siteOutageController from './controllers/site-outage';
const router = express.Router();

router.get('/outages', getOutages);
router.get('/site-info', siteInfoController.getSiteInfoById);
router.post('/site-outages', siteOutageController.createSiteOutage);

export = router;