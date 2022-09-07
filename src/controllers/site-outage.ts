import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BaseUrl, ApiConfig } from '../constants';

interface SiteOutage {
    id: string,
    name: string,
    begin: string,
    end: string
}

const badSiteIdOrOutagesError = "Invalid Site Id or Site Outages provided";

const createSiteOutage = async (req: Request, res: Response, next: NextFunction) => {
    const siteId = req.query['siteId'];
    const siteOutages: [SiteOutage] = req.body;
    if (siteId && siteOutages && siteOutages.length > 0) {
        const result = await axios.post(`${BaseUrl}/site-outages/${siteId}`, siteOutages, ApiConfig).catch((error: Error | AxiosError) => {
            res.send(error.message);
            return res;
        });
        const success = result as AxiosResponse;
        const message: string = success.data;
        res.status(200)
        res.send(message);
        return res;
    } else {
        res.status(400);
        res.send(badSiteIdOrOutagesError);
        return res;
    }
}

export { SiteOutage, badSiteIdOrOutagesError, createSiteOutage }