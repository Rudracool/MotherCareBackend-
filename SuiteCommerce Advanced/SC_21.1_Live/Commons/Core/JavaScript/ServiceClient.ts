/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="ServiceClient"/>
// @Typescript-full

import { jQuery } from './jquery/JQueryExtras';

export interface CommonRequestOptions {
    contentType?: 'application/json';
    dataType: 'json';
    processData: boolean;
    timeout?: number;
}


interface ResponseData {
    readyState: number;
    getResponseHeader: (key: string) => string | null;
}

export interface ServiceClientResponse<TRequest> {
    data?: TRequest;
    textStatus: string;
    response: ResponseData;
}

export interface ServiceClientErrorResponse {
    textStatus: string;
    errorThrown: string;
    response: ResponseData;
}

export type Data<TRequest> =
    | { toJSON?: () => TRequest }
    | { [key in keyof TRequest]: TRequest[key] };
export interface RequestOptions<TRequest> extends CommonRequestOptions {
    url: string;
    data?: TRequest | string;
    method: 'POST' | 'GET' | 'PUT' | 'DELETE';
}
export abstract class ServiceClient {
    private request<TResponse, TRequest>(
        options: RequestOptions<TRequest>
    ): Promise<ServiceClientResponse<TResponse>> {
        const deferred = jQuery.Deferred<
            ServiceClientResponse<TResponse>,
            ServiceClientErrorResponse
        >();
        jQuery
            .ajax(options)
            .done(
                (data: TResponse, textStatus: string, jqXHR: JQuery.jqXHR<object>): void => {
                    deferred.resolve({
                        data,
                        textStatus,
                        response: {
                            readyState: jqXHR.readyState,
                            getResponseHeader: (name: string): string | null =>
                                jqXHR.getResponseHeader(name)
                        }
                    });
                }
            )
            .fail(
                (jqXHR: JQuery.jqXHR<object>, textStatus: string, errorThrown: string): void => {
                    deferred.reject({
                        textStatus,
                        errorThrown,
                        response: {
                            readyState: jqXHR.readyState,
                            getResponseHeader: (name: string): string | null =>
                                jqXHR.getResponseHeader(name)
                        }
                    });
    }
            );

        return deferred;
    }

    protected defaultRequestOptions(): CommonRequestOptions {
        return {
            contentType: 'application/json',
            dataType: 'json',
            processData: false
        };
    }

    protected putRequest<TResponse, TRequest>(
        url: string,
        data: Data<TRequest>,
        options: Partial<RequestOptions<TRequest>> = {}
    ): Promise<ServiceClientResponse<TResponse>> {
        const params: RequestOptions<TRequest> = {
            ...this.defaultRequestOptions(),
            url,
            method: 'PUT',
            data: JSON.stringify('toJSON' in data ? data.toJSON() : data),
            ...options
        };
        return this.request<TResponse, TRequest>(params);
    }

    protected postRequest<TResponse, TRequest>(
        url: string,
        data: Data<TRequest>,
        options: Partial<RequestOptions<TRequest>> = {}
    ): Promise<ServiceClientResponse<TResponse>> {
        const params: RequestOptions<TRequest> = {
            ...this.defaultRequestOptions(),
            url,
            method: 'POST',
            data: JSON.stringify('toJSON' in data ? data.toJSON() : data),
            ...options
        };
        return this.request<TResponse, TRequest>(params);
    }

    protected getRequest<TResponse, TRequest = undefined>(
        url: string,
        data?: TRequest,
        options: Partial<RequestOptions<TRequest>> = {}
    ): Promise<ServiceClientResponse<TResponse>> {
        const params: RequestOptions<TRequest> = {
            ...this.defaultRequestOptions(),
            url,
            method: 'GET',
            data,
            processData: true,
            ...options
        };
        return this.request<TResponse, TRequest>(params);
    }
}
