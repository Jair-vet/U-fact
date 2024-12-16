import { BooleanInput } from '@angular/cdk/coercion';
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FamilyRawMaterialService } from 'src/app/services/family-raw-material.service';
import { SubFamilyRawMaterialService } from 'src/app/services/sub-family-raw-material.service';
import { UserService } from 'src/app/services/user.service';




@Component({
  selector: 'app-catalog-sub-families',
  templateUrl: './catalog-sub-families.component.html',
  styleUrls: ['./catalog-sub-families.component.scss']
})
export class CatalogSubFamiliesComponent {

  loading: Boolean = false
  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['sub_family_product', 'family_product', 'actions'];
  dataSource!: MatTableDataSource<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _familyRawMaterialService: FamilyRawMaterialService, private _userService: UserService, private _subFamilyRawMaterialService: SubFamilyRawMaterialService) {
    this.loadData()
  }

  loadData() {
    this.loading = true
    this._subFamilyRawMaterialService.getSubFamiliesRawMaterials(this._familyRawMaterialService.familyRawMaterial == undefined ? '0' : this._familyRawMaterialService.familyRawMaterial.id!.toString(), this._userService.user.id_company.toString()).subscribe({
      next: (resp) => {
        this.dataSource = resp;
        console.log(resp)
      },
      complete: () => {
        this.loading = false
        this.dataSource.sort = this.sort;
        this.isDisabled = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }



}
