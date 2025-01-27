import { Component } from '@angular/core';

import { Product } from './models/product.model';

import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent:string = '';
  showImg:boolean = true;
  token:string = '';
  imgRta:string = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private filesService: FilesService
  ){

  }


  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService.create({
      name: 'Carlos',
      email: 'carlos@carlos.com',
      password: '1212'
    })
    .subscribe(rta => {
      console.log(rta);
    })
  }

  loguin() {
    this.authService.login('carlos@carlos.com', '1212')
    .subscribe(rta => {
      console.log(rta.access_token);
      this.token = rta.access_token;
    })
  }

  getProfile() {
    this.authService.profile(this.token)
    .subscribe(rta => {
      console.log("Respuesta de perfil:",rta)
    })
  }

  descargarPDF(){
    this.filesService.getFile('my.pdf','https://young-sands-07814.herokuapp.com/api/files/dummy.pdf','application/pdf')
    .subscribe()
  }

  onUpload(event:Event){
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if(file){
      this.filesService.uploadFile(file)
      .subscribe(rta =>{
        this.imgRta = rta.location;
      });
    }
  }
}
