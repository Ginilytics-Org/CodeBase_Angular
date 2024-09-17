import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class LocalService {

  key = '123';

  clear() {
    throw new Error('Method not implemented.');
  }

  constructor() { }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = localStorage.getItem(key) || '';
    const decryptData = this.decrypt(data);
    if (decryptData) {
      try {
        return JSON.parse(decryptData);
      } catch (error) {
        console.error('Error parsing decrypted data:', error);
      }
    }
    return [];
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData(key: string) {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(
      CryptoJS.enc.Utf8
    );
  }

  public sessionSaveData(key: string, value: string) {
    sessionStorage.setItem(key, this.encrypt(value));
  }

  public sessionGetData(key: string) {
    let data = sessionStorage.getItem(key) || '';
    const decryptData = this.decrypt(data);
    if (decryptData) {
      try {
        return JSON.parse(decryptData);
      } catch (error) {
        console.error('Error parsing decrypted data:', error);
      }
    }
    return [];
  }

}
