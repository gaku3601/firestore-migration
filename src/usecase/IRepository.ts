import 'firebase-admin';
import { Document } from '@/domain/Document';
import Param from '@/domain/Param';

export default interface IRepository {
    CollectionGroup2(collection: string): Promise<Document[]>;
    Update2(documentPath: string, Params: Param[], operation: string): void;
}
