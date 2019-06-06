import 'firebase-admin';
import { Document } from '@/domain/Document';

export default interface IRepository {
    CollectionGroup(collection: string): Promise<Document[]>;
    Update(doc: Document): void;
    Set(doc: Document): void;
}
