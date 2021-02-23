import { NgModule } from '@angular/core';
import { LoadingPipe } from 'src/app/pipes/loading/loading.pipe';
import { RutParsePipe } from 'src/app/pipes/rut-parser/rut-parser.pipe';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    LoadingPipe,
    ErrorComponent,
    RutParsePipe
  ],
  exports: [
    LoadingPipe,
    ErrorComponent,
    RutParsePipe
  ]
})
export class GlobalModule {}
