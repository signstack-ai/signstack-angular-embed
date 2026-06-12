import { CUSTOM_ELEMENTS_SCHEMA, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmbedTokenService } from '../embed-token.service';
import { remount } from './remount';

@Component({
  selector: 'app-signstack-builder',
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './signstack-builder.component.html',
})
export class SignstackBuilderComponent {
  private readonly embedTokenService = inject(EmbedTokenService);

  readonly resourceKey = signal('');
  readonly resourceKind = signal('blueprint');
  readonly version = signal('');
  readonly loaded = signal<{ embedToken: string } | null>(null);
  readonly status = signal<{ message: string; error: boolean }>({ message: '', error: false });
  readonly lastEvent = signal('');

  readonly resourceKinds = ['blueprint', 'template', 'schema', 'asset', 'jsonata_function'];

  reset() {
    this.loaded.set(null);
    this.status.set({ message: '', error: false });
    this.lastEvent.set('');
  }

  async load() {
    this.status.set({ message: 'Minting token…', error: false });
    try {
      const { embedToken } = await this.embedTokenService.mint({
        component: 'builder',
        resourceKey: this.resourceKey(),
        resourceKind: this.resourceKind(),
        ...(this.version() ? { version: this.version() } : {}),
      });
      await remount(this.loaded, { embedToken });
      this.status.set({ message: 'Builder loaded', error: false });
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
