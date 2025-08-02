import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client-service.service';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  userName: string = 'User';
  clients: any[] = [];

  columnDefs = [
  {
    headerName: 'Profile',
    field: 'picture',
    cellRenderer: (params: any) =>
      `<img src="${params.value}" alt="profile" style="width: 32px; height: 32px; border-radius: 50%;" />`,
    width: 80,
    hide: true
  },
  { field: 'name', headerName: 'Client Name' },
  { field: 'gender', headerName: 'Gender', width: 100, hide: true },
  { field: 'company', headerName: 'Company' },
  { field: 'currency', headerName: 'Currency', width: 100, hide: true },
  {
    field: 'subscriptionCost',
    headerName: 'Subscription Cost',
    valueFormatter: (params: any) =>
      Number(params.value).toLocaleString(undefined, {
        style: 'currency',
        currency: params.data.currency || 'USD',
        maximumFractionDigits: 2
      })
  },
  { field: 'age', headerName: 'Age', width: 80 },
  {
  headerName: 'Registered',
  field: 'registered',
  hide: true,
  valueFormatter: (params: { value: string; }) => {
    const cleaned = params.value.replace(' -', '-');
    const date = new Date(cleaned);
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
  }
}
];

gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true
    },
    sideBar: {
  toolPanels: [
    {
      id: 'columns',
      labelDefault: 'Columns',
      labelKey: 'columns',
      iconKey: 'columns',
      toolPanel: 'agColumnsToolPanel'
    }
  ],
  defaultToolPanel: 'columns'
},
    animateRows: true,
    rowSelection: 'single'
  };

  constructor(private router: Router, private clientService: ClientService, private authService: AuthService) {
    this.userName = this.authService.getUserName();
  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(data => {
      this.clients = data;
    });
  }

  logout() {
    this.authService.logout();
  }

}
