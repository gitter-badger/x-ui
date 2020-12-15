/* eslint-disable */
import {  IDocumentProvider } from './interfaces';

export class InMemoryDocumentProvider implements IDocumentProvider {
  async alert(_message: string): Promise<void> {
    return;
  }
}
