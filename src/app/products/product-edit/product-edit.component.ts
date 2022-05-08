import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectUnsubscribedError } from 'rxjs';

import { MessageService } from '../../messages/message.service';

import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  errorMessage: string;

  //product: Product;
  private currentProduct;
  private originalProduct;

  get product() : Product{
    return this.currentProduct;
  }

  set product(val: Product) {
    this.currentProduct=val;
    this.originalProduct = {...val};
  }

  isDirty(): boolean{
    return JSON.stringify(this.originalProduct) !== JSON.stringify(this.currentProduct);
  }

  private dataIsValid : {[keys: string]: boolean}={};

  constructor(private productService: ProductService,
              private messageService: MessageService, private activatedRoute: ActivatedRoute, private route : Router) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
       const resolvedData: ProductResolved = data['resolvedData'];
       this.errorMessage = resolvedData.error;
       this.onProductRetrieved(resolvedData.product);
    });
  }

  isValid(path?: string) : boolean{
    this.validate()
    if(path){
      return this.dataIsValid[path];
    }
    return (this.dataIsValid && Object.keys(this.dataIsValid).every(d => this.dataIsValid[d]===true));
  }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: product => this.onProductRetrieved(product),
      error: err => this.errorMessage = err
    });
  }

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  reset():void{
    this.dataIsValid = null;
    this.currentProduct = null;
    this.originalProduct = null;
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => this.onSaveComplete(`${this.product.productName} was deleted`),
          error: err => this.errorMessage = err
        });
      }
    }
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The new ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The updated ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.reset();
    this.route.navigateByUrl('/products');
  }

  validate(): void {
    if(this.product.productName && this.product.productName.length >= 3 && this.product.productCode){
      this.dataIsValid['info'] = true;
    }else {
      this.dataIsValid['info'] = false;
    }
    if(this.product.category && this.product.category.length >= 3){
      this.dataIsValid['tags'] = true;
    }else {
      this.dataIsValid['tags'] = false;
    }
  }
}
