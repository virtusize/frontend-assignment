import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ClientService } from '../services/client-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-action-buttons-renderer',
  template: `
    <button mat-icon-button color="primary" (click)="onEdit()" matTooltip="Edit" class="action-btn">
      <mat-icon fontSize="small">edit</mat-icon>
    </button>

    <button mat-icon-button color="warn" (click)="onDelete()" matTooltip="Delete" class="action-btn">
      <mat-icon fontSize="small">delete</mat-icon>
    </button>
  `,
  styleUrls: ['./action-button-renderer.component.scss']
})
export class ActionButtonRendererComponent implements ICellRendererAngularComp {
  constructor(private clientService: ClientService, private dialog: MatDialog){}
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onEdit(): void {
    this.dialog.open(ClientFormComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        client: { ...this.params.data }
      }
    }).afterClosed().subscribe(updatedClient => {
      if (updatedClient) {
        this.clientService.updateClient(updatedClient).subscribe(() => {
          this.params.api.applyTransaction({ update: [updatedClient] });
        });
      }
    });
  }

  onDelete(): void {
    const confirmed = confirm(`Delete client "${this.params.data.name}"?`);
    if (confirmed) {
      this.clientService.deleteClient(this.params.data.id).subscribe(() => {
        this.params.api.applyTransaction({ remove: [this.params.data] });
      });
    }
  }
}
