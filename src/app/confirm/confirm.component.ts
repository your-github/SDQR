import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm',
  template: `
    <h2 md-dialog-title><strong>{{ title }}</strong></h2>
    <md-dialog-content>{{ message }}</md-dialog-content>
    <md-dialog-actions>
      <button md-button md-dialog-close>No</button>
      <!-- Can optionally provide a result for the closing dialog. -->
      <button md-button [md-dialog-close]="true">Yes</button>
    </md-dialog-actions>
  `,
  styles: []
})
export class ConfirmComponent implements OnInit {
  title: string;
  message: string;

  constructor(public dialogRef: MdDialogRef<ConfirmComponent>) { }

  ngOnInit() {
  }

}
