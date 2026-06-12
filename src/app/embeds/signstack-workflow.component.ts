import { CUSTOM_ELEMENTS_SCHEMA, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmbedTokenService } from '../embed-token.service';
import { remount } from './remount';

@Component({
  selector: 'app-signstack-workflow',
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './signstack-workflow.component.html',
})
export class SignstackWorkflowComponent {
  private readonly embedTokenService = inject(EmbedTokenService);

  readonly workflowId = signal('');
  readonly loaded = signal<{ embedToken: string } | null>(null);
  readonly status = signal<{ message: string; error: boolean }>({ message: '', error: false });

  reset() {
    this.loaded.set(null);
    this.status.set({ message: '', error: false });
  }

  async load() {
    this.status.set({ message: 'Minting token…', error: false });
    try {
      const { embedToken } = await this.embedTokenService.mint({
        component: 'workflow',
        workflowId: this.workflowId(),
      });
      await remount(this.loaded, { embedToken });
      this.status.set({ message: 'Loaded', error: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.status.set({ message, error: true });
    }
  }
}
