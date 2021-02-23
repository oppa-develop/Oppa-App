import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  public createAccountForm: FormGroup
  public passConfirmationWrong = null
  public accountType = 'elder'

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createAccountForm = this.createCreateAccountForm()
  }

  createAccount() {
    console.log(this.createAccountForm.value);
  }

  createCreateAccountForm() {
    return this.formBuilder.group({
      firstname: ['test 2', Validators.required],
      lastname: ['client', Validators.required],
      birthdate: ['1993/03/27', Validators.required],
      gender: ['hombre', Validators.required],
      rut: ['18.463.527-k', Validators.required],
      phone: ['+569499382', Validators.required],
      email: ['t.client2@example.com', [Validators.email, Validators.required]],
      img_file: [''],
      password: ['asd', Validators.required],
      checkPassword: ['asd', Validators.required],
      elders: this.formBuilder.array([])
    })
  }

  get elders(): FormArray {
    return this.createAccountForm.get('elders') as FormArray
  }

  addElder() {
    const elder = this.formBuilder.group({
      firstname: ['test 2', Validators.required],
      lastname: ['client', Validators.required],
      birthdate: ['1993/03/27', Validators.required],
      gender: ['hombre', Validators.required],
      rut: ['18.463.527-k', Validators.required],
      phone: ['+569499382', Validators.required],
      email: ['t.client2@example.com', [Validators.email, Validators.required]],
      img_file: ['']
    })

    this.elders.push(elder)
  }

  removeElder(index: number) {
    this.elders.removeAt(index)
  }

  // confirm new password validator
  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors({ mismatch: false });
      this.passConfirmationWrong = false;
    } else {
      this.confirm_password.setErrors({ mismatch: true });
      this.passConfirmationWrong = true;
    }
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.createAccountForm.controls['password'];
  }

  get confirm_password(): AbstractControl {
    return this.createAccountForm.controls['checkPassword'];
  }

}
