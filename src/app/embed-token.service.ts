import { Injectable } from '@angular/core';

// Point this at your backend. In a real integration, read it from Angular's
// environment.ts files (or a build-time define) rather than hardcoding.
const BACKEND_URL = 'http://localhost:4000';

export interface EmbedTokenRequest {
  component: 'builder' | 'workflow' | 'participant';
  workflowId?: string;
  stepKey?: string;
  resourceKey?: string;
  resourceKind?: string;
  version?: string;
}

export interface EmbedTokenResponse {
  embedToken: string;
  orgId: string;
  expiresIn: number;
  expiresAt: string;
  scopes: string[];
}

@Injectable({ providedIn: 'root' })
export class EmbedTokenService {
  async mint(body: EmbedTokenRequest): Promise<EmbedTokenResponse> {
    const res = await fetch(`${BACKEND_URL}/api/embed-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allowedOrigins: [window.location.origin],
        ...body,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend ${res.status}: ${text}`);
    }
    return res.json();
  }
}
