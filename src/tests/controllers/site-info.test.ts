import { describe, expect, test } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Request, Response, NextFunction } from 'express';
import { SiteInfo, badSiteIdError, getSiteInfoById } from '../../controllers/site-info';
import { BaseUrl, ApiConfig } from '../../constants';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let mockNext: Partial<NextFunction>;
const mockAxios = new MockAdapter(axios);

describe('getOutages', () => {
    test('Calls expected KrakenFlex API endpoint', () => {
        const spy = jest.spyOn(axios, 'get');
        mockAxios.onGet().reply(200, {});
        const siteId = 'test';
        mockRequest = {
            query: {
                'site-id': siteId
            }
        };
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
        mockRequest = {
            query: {
                'site-id': 'test'
            }
        };
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spy = jest.spyOn(mockResponse, 'send');
        await getSiteInfoById(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(siteInfo);
    });
    
    test('Returns 400 with error message, when bad site id is provided', async () => {
        mockRequest = {
            query: {
                'site-id': ''
            }
        };
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spyStatus = jest.spyOn(mockResponse, 'status');
        const spySend = jest.spyOn(mockResponse, 'send');
        await getSiteInfoById(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spyStatus).toHaveBeenCalledWith(400);
        expect(spySend).toHaveBeenCalledWith(badSiteIdError);
    });

    test('Returns status code with error message, on failed response from KrakenFlex API', async () => {
        const expectedError = 'Request failed with status code 500';
        mockAxios.onGet().reply(500, '');
        mockRequest = {
            query: {
                'site-id': 'test'
            }
        };
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spy = jest.spyOn(mockResponse, 'send');
        await getSiteInfoById(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(expectedError);
    });
})


