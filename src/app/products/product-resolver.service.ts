import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Product } from "./product";
import { ProductService } from "./product.service";

export class ProductResolver implements Resolve<Product>{

  constructor(private productService: ProductService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const id = +route.paramMap.get('id')
    return this.productService.getProduct(id);
  }

}
