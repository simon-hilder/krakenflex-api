import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError, AxiosResponse } from 'axios';
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
        const result = await axios.get(`${BaseUrl}/site-info/${siteId}`, ApiConfig).catch((error: Error | AxiosError) => {
            res.send(error.message);
            return res;
        });
        const success = result as AxiosResponse;
        const siteInfo: [SiteInfo] = success.data;
        res.status(200)
        res.send(siteInfo);
    }
}

export { SiteInfo, getSiteInfoById }