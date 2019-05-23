import 'firebase-admin';
import { Document } from '@/domain/Document';
import Param from '@/domain/Param';

export default interface IRepository {
    DeleteField(): FirebaseFirestore.FieldValue;
    CollectionGroup(collection: string): Promise<FirebaseFirestore.QuerySnapshot>;
    Collection(collection: string): Promise<FirebaseFirestore.QuerySnapshot>;
    CollectionGroupQuery(collection: string): FirebaseFirestore.Query;
    Update(documentPath: string, list: {[key: string]: any}): Promise<FirebaseFirestore.WriteResult>;
    Set(documentPath: string, list: {[key: string]: any}): Promise<FirebaseFirestore.WriteResult>;
    Batch(): FirebaseFirestore.WriteBatch;
    CollectionGroup2(collection: string): Promise<Document[]>;
    Update2(documentPath: string, params: Param[], operation: string): void;
}