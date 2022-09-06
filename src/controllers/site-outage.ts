import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { BaseUrl, ApiConfig } from '../constants';

interface SiteOutage {
    id: string,
    name: string,
    begin: string,
    end: string
}

const createSiteOutage = async (req: Request, res: Response, next: NextFunction) => {
    const siteId = req.query['siteId'];
    const siteOutages: [SiteOutage] = req.body;
    if (siteId && siteOutages && siteOutages.length > 0) {
        const result: AxiosResponse = await axios.post(`${BaseUrl}/site-outages/${siteId}`, siteOutages, ApiConfig);
        const message: string = result.data;
        return res.status(200).json({
            'message': message
        });
    }
}

export default { createSiteOutage }