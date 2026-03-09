import { HttpClient } from './axios-client';
import type { AxiosRequestConfig } from 'axios';

export const getData = <T = any>(type: string, url: string, request: any = {}) =>
    HttpClient.getInstance(type).get<T>(url, { params: request });

export const postData = <T = any>(type: string, url: string, data: any, options: AxiosRequestConfig = {}) =>
    HttpClient.getInstance(type).post<T>(url, data, options);

export const patchData = <T = any>(type: string, url: string, data: any) =>
    HttpClient.getInstance(type).patch<T>(url, data);

export const putData = <T = any>(type: string, url: string, data: any) =>
    HttpClient.getInstance(type).put<T>(url, data);

export const destroyData = <T = any>(type: string, url: string) =>
    HttpClient.getInstance(type).delete<T>(url);

export const uploadData = <T = any>(type: string, url: string, data: any) =>
    HttpClient.getInstance(type).post<T>(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const downloadFile = (type: string, url: string, request: any = []) =>
    HttpClient.getInstance(type).get(url, { responseType: 'blob', params: request });

export const errorHelper = (err: any) => {
    const error = err?.response?.data;
    return {
        message: error?.message || 'Jaringan Bermasalah',
        success: error?.success || false,
        original: err
    };
};
