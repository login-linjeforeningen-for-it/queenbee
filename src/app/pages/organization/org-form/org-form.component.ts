import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageManagerComponent } from 'src/app/components/dialog/image-manager/image-manager.component';
import { Organization } from 'src/app/models/dataInterfaces.model';

@Component({
  selector: 'app-org-form',
  templateUrl: './org-form.component.html',
  styleUrls: ['./org-form.component.css']
})
export class OrgFormComponent {
  @Input() org!: Organization;
  @Input() disableShortnameInput!: boolean;
  orgForm!: FormGroup;
  uploadStatus: string = ''

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {
    this.initForm();

    // If a rule is inputed into this component: populate input fields with data
    if(this.org) {
      this.updateFormFields();
    }
  }

  getFormValues(): Organization {
    // Create a separate variable to store the shortname value
    const shortnameValue = this.orgForm.get('shortname')!.value;
    
    // Get the other form values
    const formValues = this.orgForm.value;

    // Add the shortname value to the form values
    formValues.shortname = shortnameValue;

    return formValues;
  }

  onDescriptionNoChange(newVal: { md: string }) {
    this.orgForm.get('description_no')!.setValue(newVal.md);
  }

  onDescriptionEnChange(newVal: { md: string }) {
    this.orgForm.get('description_en')!.setValue(newVal.md);
  }

  onImageLogoChange(newVal: {val: string}) {
    this.orgForm.get('logo')?.setValue(newVal.val);
  }

  imageManager() {
    const dialogRef = this.dialog.open(ImageManagerComponent, {
      data: {
        title: "Organizations",
        path: "/organizations",
        aspectRatio: 3 / 2
      }
    })
    
    dialogRef.afterClosed().subscribe(dialog => {
      if (dialog.result === 'success') {
          this.uploadStatus = 'success'
          this.orgForm.patchValue({ logo: dialog.name })
      } else {
          this.uploadStatus = dialog.result
      }
  })
  }

  private initForm() {
    if(this.disableShortnameInput) {
      this.orgForm = this.fb.group({
        // Disabled to communicate that it cannot be edited
        shortname: [{value: '', disabled: true}],
        name_no: ['', Validators.required],
        name_en: ['', Validators.required],
        description_no: ['', Validators.required],
        description_en: ['', Validators.required],
        link_homepage: ['', Validators.required],
        link_linkedin: '',
        link_facebook: '',
        link_instagram: '',
        logo: ['', Validators.required],
      })
    } else {
      this.orgForm = this.fb.group({
        shortname: [{value: '', disabled: false}],
        name_no: ['', Validators.required],
        name_en: ['', Validators.required],
        description_no: ['', Validators.required],
        description_en: ['', Validators.required],
        link_homepage: ['', Validators.required],
        link_linkedin: '',
        link_facebook: '',
        link_instagram: '',
        logo: ['', Validators.required],
      })
    }
  }

  private updateFormFields() {
    if(this.org) {
      this.orgForm.patchValue({
        shortname: this.org.shortname || '',
        name_no: this.org.name_no || '',
        name_en: this.org.name_en || '',
        description_no: this.org.description_no || '',
        description_en: this.org.description_en || '',
        link_homepage: this.org.link_homepage || '',
        link_linkedin: this.org.link_linkedin || '',
        link_facebook: this.org.link_facebook || '',
        link_instagram: this.org.link_instagram || '',
        logo: this.org.logo || ''
      })
    }
  }
}
