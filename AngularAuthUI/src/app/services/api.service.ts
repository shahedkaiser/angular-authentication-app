import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl:string='https://localhost:7017/api';
  constructor(private http:HttpClient) { }
  getUsers()
  {
    return this.http.get<any>(`${this.baseUrl}/User`);
  }
}
