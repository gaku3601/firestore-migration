import Param from '@/domain/Param';

export default class MigrationFile {
    public method!: string;
    public collection!: string;
    public document!: string;
    public params!: Param[];
}
