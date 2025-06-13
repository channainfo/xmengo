import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  links?: {
    self: string;
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const url = `${request.protocol}://${request.get('host')}${request.originalUrl}`;

    return next.handle().pipe(
      map(data => {
        // Handle pagination if data has pagination properties
        if (data && data.items && data.meta && data.meta.pagination) {
          const { items, meta } = data;
          const { pagination } = meta;
          
          // Build pagination links
          const links = {
            self: url,
          };
          
          if (pagination.page > 1) {
            links['first'] = url.replace(`page=${pagination.page}`, 'page=1');
            links['prev'] = url.replace(`page=${pagination.page}`, `page=${pagination.page - 1}`);
          }
          
          if (pagination.page < pagination.totalPages) {
            links['next'] = url.replace(`page=${pagination.page}`, `page=${pagination.page + 1}`);
            links['last'] = url.replace(`page=${pagination.page}`, `page=${pagination.totalPages}`);
          }
          
          return {
            data: items,
            meta,
            links,
          };
        }
        
        // Handle regular responses
        return {
          data,
          links: {
            self: url,
          },
        };
      }),
    );
  }
}
