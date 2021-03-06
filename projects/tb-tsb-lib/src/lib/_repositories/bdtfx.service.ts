import { Injectable } from '@angular/core';
import { RepositoryModel } from '../_models/repository.model';
import { RepositoryItemModel } from '../_models/repository-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isDefined } from '@angular/compiler/src/util';

/**
 * BDTFX
 */
@Injectable({
  providedIn: 'root'
})
export class BdtfxRepositoryService implements RepositoryModel {
  id = 'bdtfx';
  label = 'bdtfx';
  apiUrl = `https://api.tela-botanica.org/service:cel/NameSearch/bdtfx/`;
  apiUrl2 = ``;
  apiUrlValidOccurence = 'https://api.tela-botanica.org/service:eflore:0.1/bdtfx/noms/';
  levels = ['idiotaxon'];
  description_fr = `Base de données des trachéophytes de France métropolitaine.
                    Référentiel taxonomique (espèces) coordonné par Tela Botanica et géré par
                    Benoit Bock.`;

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

  findValidOccurenceByIdNomen(idNomen): Observable<any> {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(this.apiUrlValidOccurence + idNomen, { headers });
    return request;
  }

  standardize = (rawData: any, attachRawData: boolean = false): any => {
    const sData: Array<RepositoryItemModel> = [];

    rawData.forEach(item => {
      const rim: RepositoryItemModel = {repository: null, name: null, author: null, idTaxo: null, idNomen: null, isSynonym: false, rawData: null};
      rim.name = item[3];
      rim.author = item[0].substr(item[3].length + 1, (item[0].length - item[3].length));
      rim.idTaxo = null; // not provided
      rim.idNomen = item[1];
      rim.isSynonym = (+item[2] === 4 ? true : false);
      if (attachRawData) { rim.rawData = item; }
      sData.push(rim);
      });

    return sData;
  }

  standardizeValidOccurence = (rawData: any): RepositoryItemModel => {
    const sData: RepositoryItemModel = {repository: null, name: null, author: null, idTaxo: null, idNomen: null, isSynonym: false, rawData: null};

    if (!isDefined(rawData['nom_retenu.id'])) {
      sData.name = 'NA';
      sData.author = 'NA';
      sData.idTaxo = 'NA';
      sData.idNomen = 'NA';
      sData.isSynonym = false;
    } else {
      const nomSci = rawData['nom_retenu.libelle'];
      sData.name = nomSci;
      sData.author = rawData['auteur'];
      sData.idTaxo = rawData['nom_retenu.id'];
      sData.idNomen = rawData['nom_retenu.id'];
      sData.isSynonym = false;
    }

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
