import {Component, OnInit, Input} from '@angular/core';
import {edSecure} from '../../service/encryption/secure';

@Component({
  selector: 'app-qr-code',
  template: `
    <div>
      <qr-code [value]='qrdata' [size]="350"></qr-code>
    </div>
  `,
  styles: []
})
export class QrCodeComponent implements OnInit {

  @Input() book: {
    key: string,
    bd: {
      author: string,
      bname: string,
      bpic: string,
      category: string,
      description: string,
      export_price: string,
      fpic: string,
      import_price: string,
      quantity: string
    }
  };

  qrdata: string;

  constructor(private protect: edSecure) {
  }

  ngOnInit() {
    const bookdt = this.book;
    this.qrdata = `
    {
      'id': '${this.protect.encrytionUser(bookdt.key)}',
      'ip': '${this.protect.encrytionNumber(bookdt.bd.import_price)}',
      'price': '${bookdt.bd.export_price}'
    }
    `;
  }


}
