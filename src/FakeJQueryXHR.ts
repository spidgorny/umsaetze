export default class FakeJQueryXHR implements JQueryXHR {
	[Symbol.toStringTag];
	onreadystatechange: (ev: Event) => any;
	readyState: number;
	response: any;
	responseText: string;
	responseType: XMLHttpRequestResponseType;
	responseURL: string;
	responseXML: Document | any;
	status: number;
	statusText: string;
	timeout: number;
	upload: XMLHttpRequestUpload;
	withCredentials: boolean;
	DONE: number;
	HEADERS_RECEIVED: number;
	LOADING: number;
	OPENED: number;
	UNSENT: number;
	onabort: (ev: Event) => any;
	onerror: (ev: ErrorEvent) => any;
	onload: (ev: Event) => any;
	onloadend: (ev: ProgressEvent) => any;
	onloadstart: (ev: Event) => any;
	onprogress: (ev: ProgressEvent) => any;
	ontimeout: (ev: ProgressEvent) => any;

	state();
	state(): string;
	state() {
		return undefined;
	}

	statusCode(map: JQuery.Ajax.StatusCodeCallbacks<any>): void {
	}

	always(alwaysCallback: JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<JQuery.jqXHR<TResolve> | TResolve, JQuery.Ajax.ErrorTextStatus | JQuery.Ajax.SuccessTextStatus, string | JQuery.jqXHR<TResolve>, never | never>>, ...alwaysCallbacks: Array<JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<JQuery.jqXHR<TResolve> | TResolve, JQuery.Ajax.ErrorTextStatus | JQuery.Ajax.SuccessTextStatus, string | JQuery.jqXHR<TResolve>, never | never>>>): this;
	always(alwaysCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[], ...alwaysCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>): JQueryPromise<any>;
	always(alwaysCallback?, ...alwaysCallbacks): any {
	}

	done(doneCallback: JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<TResolve, JQuery.Ajax.SuccessTextStatus, JQuery.jqXHR<TResolve>, never>>, ...doneCallbacks: Array<JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<TResolve, JQuery.Ajax.SuccessTextStatus, JQuery.jqXHR<TResolve>, never>>>): this;
	done(doneCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[], ...doneCallbackN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>): JQueryPromise<any>;
	done(doneCallback?, ...doneCallbacks): any {
	}

	fail(failCallback: JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<JQuery.jqXHR<TResolve>, JQuery.Ajax.ErrorTextStatus, string, never>>, ...failCallbacks: Array<JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<JQuery.jqXHR<TResolve>, JQuery.Ajax.ErrorTextStatus, string, never>>>): this;
	fail(failCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[], ...failCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>): JQueryPromise<any>;
	fail(failCallback?, ...failCallbacks): any {
	}

	progress(progressCallback: JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<never, never, never, never>>, ...progressCallbacks: Array<JQuery.TypeOrArray<JQuery.Deferred.CallbackBase<never, never, never, never>>>): this;
	progress(progressCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[], ...progressCallbackN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>): JQueryPromise<any>;
	progress(progressCallback?, ...progressCallbacks): any {
	}

	promise<TTarget extends Object>(target: TTarget): this & TTarget;
	promise(): this;
	promise(target?: any): JQueryPromise<any>;
	promise(target?): any {
	}

	pipe<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND, ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF, ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>(doneFilter: (t: TResolve, u: JQuery.Ajax.SuccessTextStatus, v: JQuery.jqXHR<TResolve>, ...s: never[]) => (JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND> | JQuery.Thenable<ARD> | ARD), failFilter: (t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<AJF> | AJF), progressFilter: (t: never, u: never, v: never, ...s: never[]) => (JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP> | JQuery.Thenable<ANP> | ANP)): JQuery.PromiseBase<ARD | ARF | ARP, AJD | AJF | AJP, AND | ANF | ANP, BRD | BRF | BRP, BJD | BJF | BJP, BND | BNF | BNP, CRD | CRF | CRP, CJD | CJF | CJP, CND | CNF | CNP, RRD | RRF | RRP, RJD | RJF | RJP, RND | RNF | RNP>;
	pipe<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF, ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>(doneFilter: any, failFilter: (t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<AJF> | AJF), progressFilter: (t: never, u: never, v: never, ...s: never[]) => (JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP> | JQuery.Thenable<ANP> | ANP)): JQuery.PromiseBase<ARP | ARF, AJP | AJF, ANP | ANF, BRP | BRF, BJP | BJF, BNP | BNF, CRP | CRF, CJP | CJF, CNP | CNF, RRP | RRF, RJP | RJF, RNP | RNF>;
	pipe<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND, ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>(doneFilter: (t: TResolve, u: JQuery.Ajax.SuccessTextStatus, v: JQuery.jqXHR<TResolve>, ...s: never[]) => (JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND> | JQuery.Thenable<ARD> | ARD), failFilter: any, progressFilter: (t: never, u: never, v: never, ...s: never[]) => (JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP> | JQuery.Thenable<ANP> | ANP)): JQuery.PromiseBase<ARP | ARD, AJP | AJD, ANP | AND, BRP | BRD, BJP | BJD, BNP | BND, CRP | CRD, CJP | CJD, CNP | CND, RRP | RRD, RJP | RJD, RNP | RND>;
	pipe<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>(doneFilter: any, failFilter: any, progressFilter?: (t: never, u: never, v: never, ...s: never[]) => (JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP> | JQuery.Thenable<ANP> | ANP)): JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>;
	pipe<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND, ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF>(doneFilter: (t: TResolve, u: JQuery.Ajax.SuccessTextStatus, v: JQuery.jqXHR<TResolve>, ...s: never[]) => (JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND> | JQuery.Thenable<ARD> | ARD), failFilter: (t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<AJF> | AJF), progressFilter?: any): JQuery.PromiseBase<ARF | ARD, AJF | AJD, ANF | AND, BRF | BRD, BJF | BJD, BNF | BND, CRF | CRD, CJF | CJD, CNF | CND, RRF | RRD, RJF | RJD, RNF | RND>;
	pipe<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF>(doneFilter: any, failFilter: (t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<AJF> | AJF), progressFilter?: any): JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF>;
	pipe<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND>(doneFilter: (t: TResolve, u: JQuery.Ajax.SuccessTextStatus, v: JQuery.jqXHR<TResolve>, ...s: never[]) => (JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND> | JQuery.Thenable<ARD> | ARD), failFilter?: any, progressFilter?: any): JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND>;
	pipe(doneFilter?: (x: any) => any, failFilter?: (x: any) => any, progressFilter?: (x: any) => any): JQueryPromise<any>;
	pipe(doneFilter?, failFilter?, progressFilter?): any {
	}

	then<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND, ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF, ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>(doneFilter: (t: TResolve, u: JQuery.Ajax.SuccessTextStatus, v: JQuery.jqXHR<TResolve>, ...s: never[]) => (JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND> | JQuery.Thenable<ARD> | ARD), failFilter: (t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<ARF> | ARF), progressFilter: (t: never, u: never, v: never, ...s: never[]) => (JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP> | JQuery.Thenable<ANP> | ANP)): JQuery.PromiseBase<ARD | ARF | ARP, AJD | AJF | AJP, AND | ANF | ANP, BRD | BRF | BRP, BJD | BJF | BJP, BND | BNF | BNP, CRD | CRF | CRP, CJD | CJF | CJP, CND | CNF | CNP, RRD | RRF | RRP, RJD | RJF | RJP, RND | RNF | RNP>;
	then<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF, ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>(doneFilter: any, failFilter: (t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<ARF> | ARF), progressFilter: (t: never, u: never, v: never, ...s: never[]) => (JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP> | JQuery.Thenable<ANP> | ANP)): JQuery.PromiseBase<ARP | ARF, AJP | AJF, ANP | ANF, BRP | BRF, BJP | BJF, BNP | BNF, CRP | CRF, CJP | CJF, CNP | CNF, RRP | RRF, RJP | RJF, RNP | RNF>;
	then<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND, ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>(doneFilter: (t: TResolve, u: JQuery.Ajax.SuccessTextStatus, v: JQuery.jqXHR<TResolve>, ...s: never[]) => (JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND> | JQuery.Thenable<ARD> | ARD), failFilter: any, progressFilter: (t: never, u: never, v: never, ...s: never[]) => (JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP> | JQuery.Thenable<ANP> | ANP)): JQuery.PromiseBase<ARP | ARD, AJP | AJD, ANP | AND, BRP | BRD, BJP | BJD, BNP | BND, CRP | CRD, CJP | CJD, CNP | CND, RRP | RRD, RJP | RJD, RNP | RND>;
	then<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>(doneFilter: any, failFilter: any, progressFilter?: (t: never, u: never, v: never, ...s: never[]) => (JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP> | JQuery.Thenable<ANP> | ANP)): JQuery.PromiseBase<ARP, AJP, ANP, BRP, BJP, BNP, CRP, CJP, CNP, RRP, RJP, RNP>;
	then<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND, ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF>(doneFilter: (t: TResolve, u: JQuery.Ajax.SuccessTextStatus, v: JQuery.jqXHR<TResolve>, ...s: never[]) => (JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND> | JQuery.Thenable<ARD> | ARD), failFilter: (t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<ARF> | ARF), progressFilter?: any): JQuery.PromiseBase<ARF | ARD, AJF | AJD, ANF | AND, BRF | BRD, BJF | BJD, BNF | BND, CRF | CRD, CJF | CJD, CNF | CND, RRF | RRD, RJF | RJD, RNF | RND>;
	then<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF>(doneFilter: any, failFilter: (t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<ARF> | ARF), progressFilter?: any): JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF>;
	then<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND>(doneFilter: (t: TResolve, u: JQuery.Ajax.SuccessTextStatus, v: JQuery.jqXHR<TResolve>, ...s: never[]) => (JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND> | JQuery.Thenable<ARD> | ARD), failFilter?: any, progressFilter?: any): JQuery.PromiseBase<ARD, AJD, AND, BRD, BJD, BND, CRD, CJD, CND, RRD, RJD, RND>;
	then<TResult1, TResult2>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | any | any, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | any | any): Promise<TResult2 | TResult1>;
	then<TResult1, TResult2>(onfulfilled?: ((value: TResolve) => (PromiseLike<TResult1> | TResult1)) | any | any, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | any | any): PromiseLike<TResult2 | TResult1>;
	then<R>(doneCallback: (data: any, textStatus: string, jqXHR: JQueryXHR) => R, failCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): JQueryPromise<R>;
	then<U>(doneFilter: (value?: any, ...values: any[]) => (JQueryPromise<U> | U), failFilter?: (...reasons: any[]) => any, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;
	then(doneFilter: (value?: any, ...values: any[]) => void, failFilter?: (...reasons: any[]) => any, progressFilter?: (...progression: any[]) => any): JQueryPromise<void>;
	then(doneFilter?, failFilter?, progressFilter?): any {
	}

	catch<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF>(failFilter?: ((t: JQuery.jqXHR<TResolve>, u: JQuery.Ajax.ErrorTextStatus, v: string, ...s: never[]) => (JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF> | JQuery.Thenable<ARF> | ARF)) | any | any): JQuery.PromiseBase<ARF, AJF, ANF, BRF, BJF, BNF, CRF, CJF, CNF, RRF, RJF, RNF>;
	catch<TResult>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | any | any): Promise<TResult | T>;
	catch(failFilter?): any {
	}

	overrideMimeType(mimeType: string): any;
	overrideMimeType(mime: string): void;
	overrideMimeType(mimeType: string): any {
		return undefined;
	}

	abort(statusText?: string): void;
	abort(): void;
	abort(statusText?: string): void {
	}

	error(xhr: JQueryXHR, textStatus: string, errorThrown: string): void {
	}

	getAllResponseHeaders(): string {
		return undefined;
	}

	getResponseHeader(header: string): string | any {
		return undefined;
	}

	msCachingEnabled(): boolean {
		return undefined;
	}

	open(method: string, url: string, async?: boolean, user?: string, password?: string): void {
	}

	send(data?: Document): void;
	send(data?: string): void;
	send(data?: any): void;
	send(data?): void {
	}

	setRequestHeader(header: string, value: string): void {
	}

	addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (ev: XMLHttpRequestEventMap[K]) => any, useCapture?: boolean): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
	addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
	addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (ev: XMLHttpRequestEventTargetEventMap[K]) => any, useCapture?: boolean): void;
	addEventListener(type, listener?, useCapture?): void {
	}

	dispatchEvent(evt: Event): boolean {
		return undefined;
	}

	removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
	}

}
