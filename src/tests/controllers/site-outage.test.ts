import { describe, expect, test } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Request, Response, NextFunction } from 'express';
import { SiteOutage, badSiteIdOrOutagesError, createSiteOutage } from '../../controllers/site-outage';
import { BaseUrl, ApiConfig } from '../../constants';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let mockNext: Partial<NextFunction>;
const mockAxios = new MockAdapter(axios);

describe('createSiteOutage', () => {
    test('Calls expected KrakenFlex API endpoint', () => {
        const spy = jest.spyOn(axios, 'post');
        mockAxios.onPost().reply(200, {});
        const siteId = 'test';
        mockRequest = {
            query: {
                'siteId': siteId
            },
            body: [{
                id: 'test',
                name: 'test',
                begin: 'test',
                end: 'test'
            }]
        };
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        createSiteOutage(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(`${BaseUrl}/site-outages/${siteId}`, mockRequest.body, ApiConfig);
    });

    test('Returns 200 with Site Outages data, on success response from KrakenFlex API', async () => {
        const siteOutages: [SiteOutage] = [{
            id: 'test',
            name: 'test',
            begin: 'test',
            end: 'test'
        }];
        mockAxios.onPost().reply(200, siteOutages);
        mockRequest = {
            query: {
                'siteId': 'test'
            },
            body: [{
                id: 'test',
                name: 'test',
                begin: 'test',
                end: 'test'
            }]
        };
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spy = jest.spyOn(mockResponse, 'send');
        await createSiteOutage(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(siteOutages);
    });
    
    test('Returns 400 with error message, when bad site id is provided', async () => {
        mockRequest = {
            query: {
                'siteId': ''
            }
        };
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spyStatus = jest.spyOn(mockResponse, 'status');
        const spySend = jest.spyOn(mockResponse, 'send');
        await createSiteOutage(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spyStatus).toHaveBeenCalledWith(400);
        expect(spySend).toHaveBeenCalledWith(badSiteIdOrOutagesError);
    });

    test('Returns 400 with error message, when bad site outages are provided', async () => {
        mockRequest = {
            query: {
                'siteId': 'test'
            },
            body: []
        };
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spyStatus = jest.spyOn(mockResponse, 'status');
        const spySend = jest.spyOn(mockResponse, 'send');
        await createSiteOutage(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spyStatus).toHaveBeenCalledWith(400);
        expect(spySend).toHaveBeenCalledWith(badSiteIdOrOutagesError);
    });

    test('Returns status code with error message, on failed response from KrakenFlex API', async () => {
        const expectedError = 'Request failed with status code 500';
        mockAxios.onPost().reply(500, '');
        mockRequest = {
            query: {
                'siteId': 'test'
            },
            body: [{
                id: 'test',
                name: 'test',
                begin: 'test',
                end: 'test'
            }]
        };
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spy = jest.spyOn(mockResponse, 'send');
        await createSiteOutage(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(expectedError);
    });
})


