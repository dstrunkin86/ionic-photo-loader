import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  text = 'Starting...';

  constructor(private camera: Camera, private http: HttpClient) { }

  base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }

  public takePhoto() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(imageData);
      this.text = this.text + "\r\nGot file";

      let headers = {
        "Accept": "application/json",
        "Authorization": "Bearer 1265|vaRxp1ECUYCK8oqt8c2kIaJSAn7CIzNOe7jrTike"
      }

      let bodyContent = new FormData();
      bodyContent.append("message", "я ваш новый сосед!");
      bodyContent.append("personal_account_id", "120");
      bodyContent.append("image", this.base64ToBlob(imageData,'image/jpeg'),'img.jpg');


      this.http.post('https://dev.domoteka.online/api/citizen/houses/592465/chat', bodyContent, { headers: headers })
        .subscribe(res => {
          console.log(res);
          this.text = this.text + "\r\nChat message saved";
        },
          err => {
            console.log(err);
          })

    }, (err) => {
      console.log(err);
    });
  }



}
