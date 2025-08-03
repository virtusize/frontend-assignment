import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  mode: 'add' | 'edit' | 'view';

  readonly: boolean = false;

  fieldSchema = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'company', label: 'Company', type: 'text', required: true },
    { key: 'age', label: 'Age', type: 'number', required: true },
    { key: 'gender', label: 'Gender', type: 'text' },
    { key: 'picture', label: 'Picture URL', type: 'text' },
    { key: 'registered', label: 'Registered Date', type: 'date' },
    { key: 'currency', label: 'Currency', type: 'text' },
    { key: 'subscriptionCost', label: 'Subscription Cost', type: 'number', required: true }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elementRef: ElementRef
  ) {
    this.mode = data.mode;

    this.readonly = data.readonly || false;

    const client = data.client || {};
    const today = new Date().toISOString().split('T')[0];

    this.clientForm = this.fb.group({});

    this.fieldSchema.forEach(field => {
      let value = client[field.key] ?? (field.key === 'registered' ? today : field.type === 'number' ? 0 : '');

      if (field.type === 'date' && typeof value === 'string') {
        value = value.replace(/\s(?=[+-]\d{2}:\d{2})/, '');
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
          value = parsed.toISOString().split('T')[0];
        }
      }

      const controlConfig = {
        value,
        disabled: this.readonly || (field.key === 'registered' && this.mode === 'edit')
      };

      this.clientForm.addControl(
        field.key,
        this.fb.control(controlConfig, field.required ? Validators.required : undefined)
      );
    });

    this.clientForm.addControl('id', this.fb.control(client.id || null));
  }

  ngOnInit() {
  if (this.mode === 'view') {
    this.elementRef.nativeElement.classList.add('view-mode');
  }
}

  submit(): void {
    if (this.clientForm.valid) {
      const formValue = this.clientForm.getRawValue();
      this.dialogRef.close(formValue);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
