import { Component, signal } from '@angular/core';
import { SignstackBuilderComponent } from './embeds/signstack-builder.component';
import { SignstackWorkflowComponent } from './embeds/signstack-workflow.component';
import { SignstackParticipantComponent } from './embeds/signstack-participant.component';

type Tab = 'builder' | 'workflow' | 'participant';

@Component({
  selector: 'app-root',
  imports: [
    SignstackBuilderComponent,
    SignstackWorkflowComponent,
    SignstackParticipantComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly tab = signal<Tab>('builder');
}
