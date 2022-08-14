import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators'
import { throwError } from 'rxjs';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { environment } from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api/products`;

  constructor(
    private http: HttpClient
  ) { }


  getAllProducts(limit?: number, offset?: number) {
    // return this.http.get<Product[]>('https://fakestoreapi.com/products');
    // return this.http.get<Product[]>(this.apiUrl);

    // Envia los parametros si los tiene
    let params = new HttpParams();
    if (limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, { params})
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    )
  }

  getProductsByPage(limit: number, offset: number) {

    return this.http.get<Product[]>(`${this.apiUrl}`,{params: {limit, offset}});
  }

  getProduct(id: string){
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500){
          return throwError('Algo esta fallando en el server');
        }
        if (error.status === 404) {
          return throwError('El producto no existe');
        }
        return throwError('Ups algo salio mal');
      })
    );
  }

  create(data: CreateProductDTO){
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string, dto: UpdateProductDTO){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
