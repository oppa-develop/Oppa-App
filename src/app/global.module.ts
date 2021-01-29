import { NgModule } from '@angular/core';
import { LoadingPipe } from 'src/app/pipes/loading/loading.pipe';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    LoadingPipe,
    ErrorComponent
  ],
  exports: [
    LoadingPipe,
    ErrorComponent
  ]
})
export class GlobalModule {}
