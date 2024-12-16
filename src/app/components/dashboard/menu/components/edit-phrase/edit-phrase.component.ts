
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-edit-phrase',
    templateUrl: './edit-phrase.component.html',
    styleUrls: ['./edit-phrase.component.scss']
})
export class EditPhraseComponent {
    colBig!: number
    colXBig!: number
    colMedium!: number
    colSmall!: number
    user!: User
    form: FormGroup
    loading: boolean = true
    constructor(private _userService: UserService, private _formBuider: FormBuilder) {
        this.form = this._formBuider.group({
            phrase: ['', Validators.required],
        })
        this.user = this._userService.user
        this.setField()
    }

    setUser() {

        this._userService.user.phrase = this.form.value.phrase


    }

    updatePhrase() {
        this.loading = true
        this._userService.updateCompanyPhrase(this.form.value.phrase).subscribe({
            next: (resp) => {
                this.setUser()
                Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
            },
            error: (err) => {
                console.log(err)
                Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
            },
            complete: () => {
                this.loading = false
            },
        })
    }

    setField() {
        this.form.controls['phrase'].setValue(this._userService.user.phrase)
        this.loading = false
    }

}
