import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.page.html',
  styleUrls: ['./recover-account.page.scss'],
})
export class RecoverAccountPage implements OnInit {

  recoverAccountForm: FormGroup
  changePassForm: FormGroup
  step: number = 1
  public passConfirmationWrong = null

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public router: Router // para enviar al usuario a otra vista
  ) { }

  ngOnInit() {
    this.recoverAccountForm = this.createRecoverAccountForm()
    this.changePassForm = this.createChangePassForm()
  }

  createRecoverAccountForm() {
    return this.formBuilder.group({
      rut: ['', Validators.required]
    })
  }

  createChangePassForm() {
    return this.formBuilder.group({
      code: ['', Validators.required],
      password: ['', Validators.required],
      checkPassword: ['', Validators.required]
    })
  }

  getCode() {
    this.step = 2
  }
  
  sendNewPass() {
    this.router.navigate(['/login']);
    this.step = 1
    this.recoverAccountForm.reset()
    this.changePassForm.reset()
  }

  // confirm new password validator
  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors({ mismatch: false });
      this.passConfirmationWrong = false;
    } else {
      this.confirm_password.setErrors({ mismatch: false });
      this.passConfirmationWrong = true;
    }
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.changePassForm.controls['password'];
  }

  get confirm_password(): AbstractControl {
    return this.changePassForm.controls['checkPassword'];
  }

}
