import { describe, expect, test } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Request, Response, NextFunction } from 'express';
import { SiteInfo, getSiteInfoById } from '../../controllers/site-info';
import { BaseUrl, ApiConfig } from '../../constants';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let mockNext: Partial<NextFunction>;
const mockAxios = new MockAdapter(axios);

const siteId = 'test'
beforeEach(() => {
    mockRequest = {
        query: {
            'site-id': siteId
        }
    };
});

describe('getOutages', () => {
    test('Calls expected KrakenFlex API endpoint', () => {
        const spy = jest.spyOn(axios, 'get');
        mockAxios.onGet().reply(200, {});
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        getSiteInfoById(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(`${BaseUrl}/site-info/${siteId}`, ApiConfig);
    });

    test('Returns 200 with Outages data, on success response from KrakenFlex API', async () => {
        const siteInfo: [SiteInfo] = [{
            id: 'test',
            name: 'test',
            devices: [{
                id: 'test',
                name: 'test'
            }]
        }];
        mockAxios.onGet().reply(200, siteInfo);
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spy = jest.spyOn(mockResponse, 'send');
        await getSiteInfoById(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(siteInfo);
    });

    test('Returns status code with error message, on failed response from KrakenFlex API', async () => {
        const expectedError = 'Request failed with status code 500';
        mockAxios.onGet().reply(500, '');
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spy = jest.spyOn(mockResponse, 'send');
        await getSiteInfoById(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(expectedError);
    });
})


