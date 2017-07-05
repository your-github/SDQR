import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  @Input() data: Object;
  @Input() checkInsert: boolean;

  @Output() success: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor() {
  }

  ngOnInit() {
    console.log(this.checkInsert);
    console.log(this.data);
  }


  picfile(fileID) {
    document.getElementById(fileID).click();
  }

  updateBook() {
    this.success.emit(false);
  }

}
