import { Injectable } from '@angular/core';
import { RepositoryModel } from '../_models/repository.model';
import { RepositoryItemModel } from '../_models/repository-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * BDTFXR
 */
@Injectable({
  providedIn: 'root'
})
export class ApdRepositoryService implements RepositoryModel {
  id = 'apd';
  label = 'apd';
  apiUrl = `http://api.tela-botanica.org/service:cel/NameSearch/apd/`;
  apiUrl2 = ``;
  levels = ['idiotaxon'];
  description_fr = `APD.`;

  constructor(private http: HttpClient) { }

  findElement = (query: string) => {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(this.apiUrl + query, { headers });

    return request;
  }

  findById(id) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(this.apiUrl2 + id, { headers });
    return request;
  }

  findByIdNomen(idNomen) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(this.apiUrl + `?q=numero_nomenclatural:${idNomen}`, { headers });
    return request;
  }

  findByIdTaxo(idTaxo) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(this.apiUrl + `?q=numero_nomenclatural_du_nom_retenu:${idTaxo}`, { headers });
    return request;
  }

  standardize = (rawData: any, attachRawData: boolean = false): any => {
    const sData: Array<RepositoryItemModel> = [];

    rawData.forEach(item => {
      const rim: RepositoryItemModel = {repository: null, name: null, author: null, idTaxo: null, idNomen: null, isSynonym: false, rawData: null};
      rim.name = item[3];
      rim.author = item[0].substr(item[3].length + 1, (item[0].length - item[3].length));
      rim.idTaxo = null;
      rim.idNomen = item[1];
      if (attachRawData) { rim.rawData = item; }
      sData.push(rim);
      });

    return sData;
  }

  /**
   * Before returning an Observable, some data may needs to be transformed
   * i.e. data from elasticsearch are nested (rawData.hits.hits / _source)
   * @param rawData
   */
  filter(rawData) {
    return rawData;
  }

}
