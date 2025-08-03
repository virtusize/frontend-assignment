import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client-service.service';
import { GridOptions } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';
import { ActionButtonRendererComponent } from '../action-button-renderer/action-button-renderer.component';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  userName: string = 'User';

  clients: any[] = [];

  columnDefs = [
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: 'actionButtonsRenderer',
      width: 150
    },
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
    { field: 'company', headerName: 'Company', width: 150 },
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
    { field: 'age', headerName: 'Age', width: 110 },
    {
      headerName: 'Registered',
      field: 'registered',
      hide: true,
      valueFormatter: (params: { value: string }) => {
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
    rowSelection: 'single',
    getRowId: params => params.data.id,
    frameworkComponents: {
      actionButtonsRenderer: ActionButtonRendererComponent
    },
    context: {
      componentParent: this
    },
    onRowDoubleClicked: event => this.onRowDoubleClicked(event)
  };

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.userName = this.authService.getUserName();
  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(data => {
      this.clients = data;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  onRowDoubleClicked(event: any): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '400px',
      data: { mode: 'view', client: event.data, readonly: true }
    });

    dialogRef.afterClosed().subscribe();
}

  openClientDialog(mode: 'add'): void {
    const maxId = Math.max(...this.clients.map(c => +c.id), 0);
    const today = new Date().toISOString().split('T')[0];

    const newClientPayload = {
      id: (maxId + 1).toString(),
      name: '',
      company: '',
      age: null,
      gender: '',
      picture: 'https://via.placeholder.com/32',
      registered: today,
      currency: 'USD',
      subscriptionCost: ''
    };

    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '400px',
      data: { mode, client: newClientPayload }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.addClient(result).subscribe(client => {
          this.agGrid.api.applyTransaction({ add: [client] });
        });
      }
    });
  }
}
