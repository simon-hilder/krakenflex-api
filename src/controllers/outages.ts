import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { BaseUrl, ApiConfig } from '../constants';

interface Outage {
    id: string,
    begin: string,
    end: string
}

const getOutages = async (req: Request, res: Response, next: NextFunction) => {
    let result: AxiosResponse = await axios.get(`${BaseUrl}/outages`, ApiConfig);
    let outages: [Outage] = result.data;
    return res.status(200).json({
        'outages': outages
    });
}

export default { getOutages }