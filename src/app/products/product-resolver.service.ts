import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Product, ProductResolved } from "./product";
import { ProductService } from "./product.service";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ProductResolver implements Resolve<ProductResolved>{

  constructor(private productService: ProductService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductResolved> {

    console.log('inside resolver');
    const id = route.paramMap.get('id')
    if(isNaN(+id)){
      const message = ' Product Id should be  number';
      console.log(message);
      return of({product: null, error : message});
    }
    return this.productService.getProduct(+id)
    .pipe(map(prd => ({product: prd})), catchError(err => {
        console.log(err);
        return of({product: null, error : "Retrieval error"})
    }));
  }

}
