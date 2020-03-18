import { Component, OnInit, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'steps-naics-filter',
  templateUrl: './naics-filter.component.html',
  styleUrls: ['./naics-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=>NaicsFilterComponent),
      multi: true
    }
  ]
})
export class NaicsFilterComponent implements OnInit, ControlValueAccessor {
  propagateChange = (_: any) => { };
  writeValue(values: string[]): void {
    if (values !== undefined) {
      this.tags = values;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error("Method not implemented.");
  }
  _tags = [];
  get tags() {
    return this._tags;
  }
  set tags(val) {
    this._tags = val;
    this.propagateChange(this._tags);
  }
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 8;
    return isLongTag ? `${tag.slice(0, 8)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    this.inputValue = '';
    this.inputVisible = false;
  }
}
