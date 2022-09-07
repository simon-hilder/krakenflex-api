import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BaseUrl, ApiConfig } from '../constants';

interface Outage {
    id: string,
    begin: string,
    end: string
}

const getOutages = async (req: Request, res: Response, next: NextFunction) => {
    const result = await axios.get(`${BaseUrl}/outages`, ApiConfig).catch((error: Error  | AxiosError) => {
        res.send(error.message);
        return res;
    });
    const success = result as AxiosResponse;
    const outages: [Outage] = success.data;
    res.status(200);
    res.send(outages);
    return res;
}

export { Outage, getOutages }