import MigrationFile from '@/domain/MigrationFile';
export default class MigrationFileList {
    constructor(public version: string, public content: MigrationFile) {
        this.version = version;
        this.content = content;
    }
}
