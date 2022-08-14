import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators'

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail: boolean = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: ''
    },
    description: ''
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
    .subscribe(data => {
      this.products = data;
      console.log(this.products);
    });
    // this.productsService.getProductsByPage(10,0)
    // .subscribe(data => {
    //   this.products = data;
    //   console.log(this.products);
    // });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProuctDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.statusDetail = 'loading';
    this.toggleProuctDetail();
    this.productsService.getProduct(id)
    .subscribe(data => {
      console.log(data);
      this.productChosen = data;
      // this.toggleProuctDetail();
      this.statusDetail = 'success';
    }, response => {
      console.error(response);
      console.log(response.error.message)
      this.statusDetail = 'error';
    })
  }

  readAndUpdate(id: string){
    // Esto es una Callback hell este metodo no es recomendable realizar.
    // this.productsService.getProduct(id)
    // .subscribe(data => {
    //   const product = data;
    //   this.productsService.update(product.id, {title: 'change'})
    //   .subscribe(rtaUpdate => {
    //     console.log(rtaUpdate);
    //   })
    // })
    this.productsService.getProduct(id)
    .pipe(
      switchMap((product)=>{
        return this.productsService.update(product.id, {title: 'change'})
      })
    )
    .subscribe(data => {
        console.log(data);
    })
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: "Nuevo producto",
      description: "Descricon de nuevo producto",
      images: ['https://placeimg.com/604/480/any'],
      price: 1000,
      categoryId : 2
    }

    this.productsService.create(product)
      .subscribe(data => {
        console.log('Create:',data);
        this.products.unshift(data)
      });
  }

  updateProducto(){
    const change:UpdateProductDTO = {
      title: "Nuevo edi Carlos",
    }
    const id = this.productChosen.id;
    this.productsService.update(id, change)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
      console.log(data);
    })
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id)
      .subscribe(date => {
        this.toggleProuctDetail();
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products.splice(productIndex, 1);
      })
  }

  loadMore() {
    this.productsService.getProductsByPage(this.limit,this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      console.log(this.products);
      this.offset += this.limit;
    });
  }

}
