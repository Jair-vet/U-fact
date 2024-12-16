import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { UserInterface } from '../interfaces/user-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user!: User;
  constructor(private http: HttpClient) {}
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  get path(): string {
    return 'users';
  }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http
      .get(`${base_url}/auth/renew`, {
        headers: {
          'x-token': token,
        },
      })
      .pipe(
        map((resp: any) => {
          const {
            id,
            name,
            email,
            id_company,
            name_company,
            tradename,
            logo,
            serie,
            address,
            rfc,
            postal_code,
            bank,
            interbank_code,
            account,
            id_regime,
            certificate,
            key_company,
            password,
            email_company,
            telephone,
            phone,
            state,
            municipality,
            suburb,
            num_ext,
            num_int,
            serial,
            valid_to,
            bells,
            code_regime,
            bank_name,
            support_email,
            show_tutorial,
            rol,
            username,
            avatar,
            id_rol,
            number,
            phrase,
            path_key,
          } = resp.user;
          this.user = new User(
            id,
            name,
            email,
            id_company,
            name_company,
            tradename,
            logo,
            id_regime,
            serie,
            rfc,
            address,
            postal_code,
            bank,
            interbank_code,
            account,
            certificate,
            key_company,
            password,
            email_company,
            telephone,
            phone,
            state,
            municipality,
            suburb,
            num_ext,
            num_int,
            serial,
            valid_to,
            bells,
            code_regime,
            bank_name,
            support_email,
            show_tutorial,
            rol,
            username,
            avatar,
            id_rol,
            number,
            phrase,
            path_key
          );
          localStorage.setItem('token', resp.token);
          return true;
        }),

        catchError((error) => of(false))
      );
  }
  login(formData: LoginForm) {
    return this.http.post(`${base_url}/auth`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  updateCompany(
    name: string,
    id_regime: number,
    tradename: string,
    address: string,
    postal_code: string,
    bank: number,
    interbank_code: string,
    account: string,
    logo: string,
    serie: string,
    state: string,
    municipality: string,
    suburb: string,
    num_ext: string,
    num_int: string,
    email_company: string,
    phone: string,
    support_email: string,
    id_company: string
  ) {
    console.log(state);
    const url = `${base_url}/companies/${id_company}`;
    return this.http
      .put(
        url,
        {
          name,
          id_regime,
          tradename,
          address,
          postal_code,
          bank,
          interbank_code,
          account,
          logo,
          serie,
          state,
          municipality,
          suburb,
          num_ext,
          num_int,
          email_company,
          phone,
          support_email,
        },
        this.headers
      )
      .pipe(map((resp: any) => resp.message));
  }

  updateCompanyPhrase(phrase: string) {
    const url = `${base_url}/companies/phrase`;
    return this.http
      .post(url, { phrase }, this.headers)
      .pipe(map((resp: any) => resp.message));
  }

  installCERT(
    certificate: string,
    key_company: string,
    password: string,
    serial: string,
    date: string,
    id_company: string
  ) {
    const url = `${base_url}/companies/install-cert/${id_company}`;
    return this.http
      .put(
        url,
        { certificate, key_company, password, serial, date },
        this.headers
      )
      .pipe(map((resp: any) => resp));
  }

  logout() {
    localStorage.removeItem('token');
  }

  create(user: UserInterface, key: File) {
    const url = `${base_url}/${this.path}/`;
    const formData = new FormData();
    // name, username, email, password, telephone, id_rol, id_company
    formData.append('key', key);
    formData.append('name', user.name);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('telephone', user.telephone);
    formData.append('id_rol', user.id_rol.toString());
    formData.append('id_company', user.id_company.toString());

    console.log(key);

    return this.http
      .post(url, formData, this.headers)
      .pipe(map((resp: any) => resp.message));
  }

  checkPermissionAdmin() {
    if (
      this.user.id_rol == 1 ||
      this.user.id_rol == 2 ||
      this.user.id_rol == 3
    ) {
      return { error: false, message: '' };
    } else {
      return {
        error: true,
        message: 'NO TIENES PERMISO PARA REALIZAR ESTA ACCIÓN',
      };
    }
  }

  checkPermissionSeller() {
    console.log(this.user.id_rol);
    if (
      this.user.id_rol == 1 ||
      this.user.id_rol == 2 ||
      this.user.id_rol == 4
    ) {
      return { error: false, message: '' };
    } else {
      return {
        error: true,
        message: 'NO TIENES PERMISO PARA REALIZAR ESTA ACCIÓN',
      };
    }
  }

  checkPermissionStorer() {
    if (
      this.user.id_rol == 1 ||
      this.user.id_rol == 2 ||
      this.user.id_rol == 5
    ) {
      return { error: false, message: '' };
    } else {
      return {
        error: true,
        message: 'NO TIENES PERMISO PARA REALIZAR ESTA ACCIÓN',
      };
    }
  }

  checkPermissionProductor() {
    if (
      this.user.id_rol == 1 ||
      this.user.id_rol == 2 ||
      this.user.id_rol == 6
    ) {
      return { error: false, message: '' };
    } else {
      return {
        error: true,
        message: 'NO TIENES PERMISO PARA REALIZAR ESTA ACCIÓN',
      };
    }
  }

  update(user: UserInterface, key: File) {
    const url = `${base_url}/${this.path}/${user.id!}`;
    const formData = new FormData();
    // name, username, email, password, telephone, id_rol, id_company
    formData.append('key', key);
    formData.append('name', user.name);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('telephone', user.telephone);
    formData.append('id_rol', user.id_rol.toString());

    return this.http
      .put(url, formData, this.headers)
      .pipe(map((resp: any) => resp.message));
  }

  getAllData(id_company: string, inactive: Boolean) {
    let url = '';
    if (inactive) {
      url = `${base_url}/${this.path}/${id_company}/0`;
    } else {
      url = `${base_url}/${this.path}/${id_company}/1`;
    }

    return this.http
      .get<User[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  getSellers(id_company: string) {
    const url = `${base_url}/${this.path}/${id_company}/1/4`;
    return this.http
      .get<User[]>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  getData(id: string) {
    const url = `${base_url}/${this.path}/${id}`;
    return this.http
      .get<User>(url, this.headers)
      .pipe(map((resp: any) => resp.data));
  }

  inactive(id: string) {
    const url = `${base_url}/${this.path}/${id}/0`;
    console.log(url);
    return this.http
      .put(url, {}, this.headers)
      .pipe(map((resp: any) => resp.message));
  }
  restore(id: string) {
    const url = `${base_url}/${this.path}/${id}/1`;
    return this.http
      .put(url, {}, this.headers)
      .pipe(map((resp: any) => resp.message));
  }
}
