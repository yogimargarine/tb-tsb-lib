import { Component, EventEmitter, OnInit } from '@angular/core';
import { RepositoryItemModel } from 'tb-tsb-lib/lib/_models/repository-item.model';

@Component({
  selector: 'app-test-app',
  templateUrl: './test-app.component.html',
  styleUrls: ['./test-app.component.css']
})
export class TestAppComponent implements OnInit {

  taxons: Array<any> = [];
  _updateData: RepositoryItemModel; // = null;
  fixedRepository: string;
  _reset: boolean;
  occ: RepositoryItemModel;

  constructor() { }

  ngOnInit() {
    this.occ = {} as RepositoryItemModel;
    // this._updateData = this.occ;
  }

  reset() {
    this._reset = true;
    setTimeout(() => {
      this._reset = false;
    }, 1000);
  }

  /**
   * When user has entered a new data
   */
  newData(data: TaxonType) {
    console.log('Event \'newData\' :');
    console.log(data);
    this.addTaxon(data);
  }

  addTaxon(taxon: TaxonType) {
    taxon.occurenceId = this.taxons.length;
    this.taxons.push(taxon);
  }

  updateData(taxon: TaxonType): void {
    this._updateData = {
      occurenceId: taxon.occurenceId,
      repository: taxon.repository,
      idNomen: taxon.idNomen,
      idTaxo: taxon.idTaxo,
      name: taxon.name,
      author: taxon.author
    };
  }

  /**
   * When user has updated a data
   */
  updatedData(data: TaxonType) {
    console.log('Event \'updatedData\' :');
    console.log(data);

    //
    // Here, you should register the updated data in db
    //

    // for demo, we only update the data in taxons[]
    let taxonToUpdate: TaxonType;
    this.taxons.forEach(taxon => {
      if (data.occurenceId === taxon.occurenceId) {
        taxonToUpdate = taxon;
      }
    });

    // We need to set manually those data because change detection will not
    // occure while object reference stay the same
    // an other solution could be to use immutable objects
    taxonToUpdate.repository = data.repository;
    taxonToUpdate.idTaxo = data.idTaxo;
    taxonToUpdate.idNomen = data.idNomen;
    taxonToUpdate.name = data.name;
    taxonToUpdate.author = data.author;
    taxonToUpdate.isSynonym = data.isSynonym;
    taxonToUpdate.validOccurence = data.validOccurence;
  }

  /**
   * if user has cancelled
   */
  cancelUpdateData(data: { occurenceId: number }) {
    console.log(`Event 'cancelUpdateData' for occurenceId ${data.occurenceId}`);
  }
}

interface TaxonType {
  occurenceId?: number;
  repository: string;
  idNomen: number | string;
  idTaxo?: number | string;
  name: string;
  author: string;
  isSynonym?: boolean;
  rawData?: any;
  validOccurence: TaxonType;
}
