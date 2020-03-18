import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'series-edit',
  templateUrl: './series-edit.component.html',
})
export class SeriesEditComponent {
  @Input()
  record: any;

  constructor(private modal: NzModalRef) { }

  ok() {
    this.modal.close(`new time: ${+new Date()}`);
    this.cancel();
  }

  cancel() {
    this.modal.destroy();
  }

}
