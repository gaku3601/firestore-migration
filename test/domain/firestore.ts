import firestore from '@/domain/firestore';
import repo from '@/db/firestore';
import { assert } from "chai"

describe('test実装', () => {
    it('firestore domainのtest関数読み込める?', () => {
        const db = new repo();
        const f = new firestore(db);
        assert.equal(f.test(), "aaaa");
    });
})