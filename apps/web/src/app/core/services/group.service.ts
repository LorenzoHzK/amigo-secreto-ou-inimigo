import { Injectable } from '@angular/core';
import { Group } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private readonly baseUrl = `${environment.apiUrl}/groups`;

  async getGroups(): Promise<Group[]> {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  async getGroupById(id: string): Promise<Group | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  async getGroupByAdminToken(token: string): Promise<Group | null> {
    const response = await fetch(`${this.baseUrl}?admin_token=${token}`);
    const groups: Group[] = await response.json();
    return groups.length > 0 ? groups[0] : null;
  }

  async getGroupByInviteToken(token: string): Promise<Group | null> {
    const response = await fetch(`${this.baseUrl}?invite_token=${token}`);
    const groups: Group[] = await response.json();
    return groups.length > 0 ? groups[0] : null;
  }

  async createGroup(name: string, priceLimit: number | null): Promise<Group> {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      admin_token: crypto.randomUUID(),
      invite_token: crypto.randomUUID(),
      price_limit: priceLimit,
      drawn_at: null,
      created_at: new Date().toISOString(),
    };
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGroup),
    });
    return response.json();
  }

  async updateGroupPriceLimit(
    id: string,
    priceLimit: number | null,
  ): Promise<Group> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price_limit: priceLimit }),
    });
    return response.json();
  }

  async updateGroupDrawnAt(id: string, drawnAt: string | null): Promise<Group> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drawn_at: drawnAt }),
    });
    return response.json();
  }
}
