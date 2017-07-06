import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  template: `
    <div>
      <!--<qr-code [value]= 'qrcode' [size]="250"></qr-code>-->
    </div>
  `,
  styles: []
})
export class QrCodeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
