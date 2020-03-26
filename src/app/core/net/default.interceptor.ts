import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

const CODEMESSAGE = {
  200: 'Standard response for successful HTTP requests.',
  201: 'The request has been fulfilled, resulting in the creation of a new resource.',
  202: 'The request has been accepted for processing, but the processing has not been completed.',
  204: 'The server successfully processed the request and is not returning any content.',
  400: 'The server cannot or will not process the request due to an apparent client error.',
  401: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.',
  403: 'The request contained valid data and was understood by the server, but the server is refusing action.',
  404: 'The requested resource could not be found but may be available in the future.',
  406: 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.',
  410: 'Indicates that the resource requested is no longer available and will not be available again.',
  422: 'The request was well-formed but was unable to be followed due to semantic errors.',
  500: 'Internal Server Error: A generic error message.',
  502: 'Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
  503: 'Service Unavailable: The server cannot handle the request.',
  504: 'Gateway Timeout: The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
};

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase) {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
      return;
    }

    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    this.notification.error(`Request error ${ev.status}: ${ev.url}`, errortext);
  }

  private handleData(ev: HttpResponseBase): Observable<any> {
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    if (ev.status > 0) {
      this.injector.get(_HttpClient).end();
    }
    this.checkStatus(ev);
    // 业务处理：一些通用操作
    switch (ev.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用
        // if (event instanceof HttpResponse) {
        //     const body: any = event.body;
        //     if (body && body.status !== 0) {
        //         this.msg.error(body.msg);
        //         // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
        //         // this.http.get('/').subscribe() 并不会触发
        //         return throwError({});
        //     } else {
        //         // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
        //         return of(new HttpResponse(Object.assign(event, { body: body.response })));
        //         // 或者依然保持完整的格式
        //         return of(event);
        //     }
        // }
        break;
      case 401:
        this.notification.error(`Login expired or hasn't logged in yet. Please log in again.`, ``);
        // 清空 token 信息
        (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
        this.goTo('/passport/login');
        break;
      case 403:
      case 404:
      case 500:
        this.goTo(`/exception/${ev.status}`);
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn('unknown issue，most likely it is caused by backend not supporting CORS', ev);
        }
        break;
    }
    if (ev instanceof HttpErrorResponse) {
      return throwError(ev);
    } else {
      return of(ev);
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }

    const newReq = req.clone({ url });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponseBase) return this.handleData(event);
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
