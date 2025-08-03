import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../model/client-model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private baseUrl = 'https://glowing-fishstick-g6vjrxjwjwpfvxpp-4090.app.github.dev/clients';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client);
  }

  updateClient(client: Client): Observable<Client> {
    const url = `${this.baseUrl}/${client.id}`;
    return this.http.put<Client>(url, client);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
