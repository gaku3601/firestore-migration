import 'firebase-admin';
import { Document } from '@/domain/Document';

export default interface IRepository {
    CollectionGroup2(collection: string): Promise<Document[]>;
    Update2(doc: Document): void;
}
