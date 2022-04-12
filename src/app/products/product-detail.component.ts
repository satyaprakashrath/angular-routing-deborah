import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ResolveData } from '@angular/router';

import { Product, ProductResolved } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle = 'Product Detail';
  product: Product;
  errorMessage: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const resolvedData : ProductResolved = this.activatedRoute.snapshot.data['resolvedData'];
    console.log(resolvedData);
    this.errorMessage = resolvedData.error;
    this.onProductRetrieved(resolvedData.product);

  }

  /*getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: product => this.onProductRetrieved(product),
      error: err => this.errorMessage = err
    });
  }*/

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (this.product) {
      this.pageTitle = `Product Detail: ${this.product.productName}`;
    } else {
      this.pageTitle = 'No product found';
    }
  }
}
