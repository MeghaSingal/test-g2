import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'item-type-filter',
  templateUrl: './item-type-filter.component.html',
  styleUrls: ['./item-type-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemTypeFilterComponent),
      multi: true
    }
  ]
})
export class ItemTypeFilterComponent implements OnInit, ControlValueAccessor {

  itemTypes = [
    { label: 'CV', value: 'CV', checked: false },
    { label: 'EST', value: 'EST', checked: false },
    { label: 'IMP', value: 'IMP', checked: false },
    { label: 'SE', value: 'SE', checked: false },
    { label: 'YY', value: 'YY', checked: false }
  ];
  itemTypeButtonText: string = "Item Types";
  itemTypeButtonStyle: 'selected' | 'default' = 'default';
  configureItemTypeButton() {
    const selectedItemTypes = this.itemTypes.filter(itemType => itemType.checked == true).map(itemType => itemType.label);
    if (selectedItemTypes.length == 1) {
      this.itemTypeButtonText = selectedItemTypes[0];
      this.itemTypeButtonStyle = 'selected';
    } else if (selectedItemTypes.length > 1) {
      this.itemTypeButtonText = `Item Types: ${selectedItemTypes.length}`;
      this.itemTypeButtonStyle = 'selected';
    } else {
      this.itemTypeButtonText = 'Item Types';
      this.itemTypeButtonStyle = 'default';
    }
  }

  writeValue(values: string[]): void {
    if (values !== undefined) {
      values.forEach(val => {
        this.itemTypes.find(itemType => itemType.value == val).checked = true;
      });
      this.configureItemTypeButton();
    }
  }
  propagateChange = (_: any) => { };
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error("Method not implemented.");
  }

  visible: boolean;
  save(): void {
    this.visible = false;
    this.configureItemTypeButton();
    this.propagateChange(this.itemTypes.filter(itemType => itemType.checked == true).map(itemType => itemType.label));
  }
  clear(): void {
    this.itemTypes.forEach(itemType => itemType.checked = false);
  }
  close(): void {
    this.configureItemTypeButton();
    this.propagateChange(this.itemTypes.filter(itemType => itemType.checked == true).map(itemType => itemType.label));
  }

  constructor() { }

  ngOnInit() {
  }

}
