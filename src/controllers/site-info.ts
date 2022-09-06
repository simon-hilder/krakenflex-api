import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { BaseUrl, ApiConfig } from '../constants';

interface Device {
    id: string,
    name: string
}

interface SiteInfo {
    id: string,
    name: string,
    devices: [Device]
}

const getSiteInfoById = async (req: Request, res: Response, next: NextFunction) => {
    const siteId = req.query['site-id'];
    if (siteId) {
        const result: AxiosResponse = await axios.get(`${BaseUrl}/site-info/${siteId}`, ApiConfig);
        const siteInfo: [SiteInfo] = result.data;
        return res.status(200).json({
            'siteInfo': siteInfo
        });
    }
}

export default { getSiteInfoById }