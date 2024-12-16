import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryInterface } from 'src/app/interfaces/inventory-form.interface';
import { DepartureInventory } from 'src/app/models/departure_inventory.model';
import { InventoryService } from 'src/app/services/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suply-products',
  templateUrl: './suply-products.component.html',
  styleUrls: ['./suply-products.component.scss']
})
export class SuplyProductsComponent implements OnInit {

  waiting = false
  error = false
  error_msg = ''
  objectsNoFound: number = 0
  loading: Boolean = true
  valueInput: number = 0
  inventory: InventoryInterface[] = []
  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['batch', 'number', 'product', 'status', 'date', 'select'];
  dataSource!: MatTableDataSource<any>;
  colBig!: number
  colXBig!: number
  colMedium!: number
  colSmall!: number
  modalWidth!: string
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private breakpointObserver: BreakpointObserver, private _inventoryService: InventoryService) {

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.colBig = 12
          this.colSmall = 12
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 6
          this.colSmall = 6
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 9
          this.colMedium = 6
          this.colSmall = 3
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 9
          this.colMedium = 6
          this.colSmall = 3
        }
      }
    });
  }

  loadData() {
    this.waiting = true
    this.loading = true
    this._inventoryService.getDataByProduct(this.data.data.id_product).subscribe({
      next: (resp) => {
        this.inventory = resp
        this.dataSource = new MatTableDataSource(this.inventory);
      },
      complete: () => {
        this.updateDataSelect()
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }

  checkItemSelect(box: InventoryInterface) {
    return this.data.departure_inventory.find((item: DepartureInventory) => item.id_inventory === box.id) ? true : false
  }

  updateDataSelect() {
    this.data.departure_inventory = this.data.departure_inventory.filter((item: DepartureInventory) => {
      const shouldKeep = this.inventory.some(item_inventory => { return item_inventory.id === item.id_inventory || item.id_product_order != this.data.data.id; });
      if (!shouldKeep) {
        this.objectsNoFound++
      }
      return shouldKeep;
    });
    if (this.objectsNoFound > 0) {
      Swal.fire({ title: 'ERROR', text: this.objectsNoFound + ' PRODUCTO/S YA NO ESTAN DISPONIBLES, TU SURTIMIENTO HA SIDO ACTUALIZADO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
    this.loading = false
    this.isDisabled = false
    this.waiting = false
    this.dataChange.emit(this.data);
  }


  ngOnInit(): void {
    console.log(this.validateNumberBoxes()[1])
    if (this.validateNumberBoxes()[1]) {
      this.loadData()
      this.valueInput = this.calculateCurrentSuply()
      console.log(this.valueInput)
      console.log(this.calculateCurrentSuply())
    }
  }

  selectMultiplesItems(event: any) {
    this.waiting = true
    const numberOFInput = event.target.value
    if (numberOFInput != '') {
      const numberBoxesToSelect = numberOFInput - this.calculateCurrentSuply()
      if (numberBoxesToSelect > 0) {
        this.addBoxes(numberBoxesToSelect)
      } else if (numberBoxesToSelect < 0) {
        this.removeBoxes(numberBoxesToSelect * -1)
      } else {
        this.waiting = false
      }
    }
  }

  removeBoxes(numberBoxesToSelect: number) {
    let i = this.inventory.length - 1
    while (i >= 0) {
      if (this.checkItemSelect(this.inventory[i])) {
        this.select(this.inventory[i], false)
        numberBoxesToSelect--
      }
      if (numberBoxesToSelect == 0) {
        i = -1
      } else {
        i--
      }
    }
    this.waiting = false
  }
  addBoxes(numberBoxesToSelect: number) {
    let i = 0
    while (i < this.inventory.length) {
      if (!this.checkItemSelect(this.inventory[i])) {
        this.select(this.inventory[i], true)
        numberBoxesToSelect--
      }
      if (numberBoxesToSelect == 0) {
        i = this.inventory.length
      } else {
        i++
      }
    }
    this.waiting = false
  }

  calculateCurrentSuply(): number {
    let length = 0
    let i = 0
    while (i < this.data.departure_inventory.length) {
      if (this.data.departure_inventory[i].id_product_order == this.data.data.id) {
        length++
      }
      i++
    }

    return length
  }

  select(box: InventoryInterface, select: boolean) {

    if (select && this.calculateCurrentSuply() < this.validateNumberBoxes()[0]) {
      const object: DepartureInventory = new DepartureInventory(this.data.data.id, box.id);
      this.data.departure_inventory.push(object);
      this.dataChange.emit(this.data);
    } else {
      this.data.departure_inventory = this.data.departure_inventory.filter((item: DepartureInventory) => item.id_inventory !== box.id);
      this.dataChange.emit(this.data);
    }
    this.valueInput = this.calculateCurrentSuply()
  }

  validateNumberBoxes(): [number, boolean] {
    const quantityBox = this.data.data.amount - this.data.data.amount_departure
    if (quantityBox > 0) {
      return [quantityBox, true]
    } else {
      this.error = true
      this.error_msg = 'ESTE PRODUCTO YA FUE FINALIZADO'
      return [0, false]
    }
  }


}
