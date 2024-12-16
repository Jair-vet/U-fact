import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';
import { Contact } from '../models/contact.model';
import { DocumentPDF } from '../models/document.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get path(): string {
    return 'tools';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  sendEmail(
    emails: Contact[],
    documents: DocumentPDF[],
    subject: string,
    body: string,
    title: string
  ) {
    const url = `${base_url}/${this.path}/send/email`;
    return this.http
      .post(url, { emails, documents, subject, body, title }, this.headers)
      .pipe(map((resp: any) => resp.message));
  }

  getExchangeRateToDollars() {
    const url = `https://www.binteapi.com:8084/api/helpers/usd-value/`;
    return this.http.get(url).pipe(map((resp: any) => resp));
  }
  getExchangeRateToDollarsByDate(date: string) {
    console.log(date);
    const url = `https://www.binteapi.com:8084/api/helpers/usd-value/date`;
    return this.http.post(url, { date }).pipe(map((resp: any) => resp));
  }
}
