import { getFirestore } from '../data/database';
import * as admin from 'firebase-admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface UserInfo {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
  activityFactor: number;
  bmr: number;
  tdee: number;
  avatarUrl?: string;
}

export class UserRepository {
  private db = getFirestore();

  async findById(id: string): Promise<User | null> {
    const doc = await this.db.collection('user').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as User;
  }

  async findInfoById(id: string): Promise<UserInfo | null> {
    const doc = await this.db.collection('userInfo').doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as UserInfo;
  }

  async create(id: string, data: Partial<User>): Promise<void> {
    await this.db.collection('user').doc(id).set(data);
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.db.collection('user').doc(id).update(data);
  }

  async updateInfo(id: string, data: Partial<UserInfo>): Promise<void> {
    await this.db.collection('userInfo').doc(id).set(data, { merge: true });
  }

  async delete(id: string): Promise<void> {
    await this.db.collection('user').doc(id).delete();
    await this.db.collection('userInfo').doc(id).delete();
  }
}
