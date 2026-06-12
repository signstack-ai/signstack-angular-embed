import { CUSTOM_ELEMENTS_SCHEMA, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmbedTokenService } from '../embed-token.service';
import { remount } from './remount';

@Component({
  selector: 'app-signstack-participant',
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './signstack-participant.component.html',
})
export class SignstackParticipantComponent {
  private readonly embedTokenService = inject(EmbedTokenService);

  readonly workflowId = signal('');
  readonly stepKey = signal('');
  readonly loaded = signal<{ embedToken: string } | null>(null);
  readonly status = signal<{ message: string; error: boolean }>({ message: '', error: false });
  readonly lastEvent = signal('');

  reset() {
    this.loaded.set(null);
    this.status.set({ message: '', error: false });
    this.lastEvent.set('');
  }

  async load() {
    this.status.set({ message: 'Minting token…', error: false });
    try {
      const { embedToken } = await this.embedTokenService.mint({
        component: 'participant',
        workflowId: this.workflowId(),
        stepKey: this.stepKey(),
      });
      await remount(this.loaded, { embedToken });
      this.status.set({ message: 'Signing session loaded', error: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.status.set({ message, error: true });
    }
  }

  onWCEvent(type: string, event: Event) {
    const detail = (event as CustomEvent).detail;
    this.lastEvent.set(`${type}: ${JSON.stringify(detail ?? null)}`);
  }
}
