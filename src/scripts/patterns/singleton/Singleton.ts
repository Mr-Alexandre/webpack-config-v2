import SubjectModel from '../subject/Subject';

export default class Singleton {
    private static instance: Singleton;

    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }

    public static getInstance(): Singleton {
        if ( !this.instance ) {
            Singleton.instance = new Singleton();
        }

        return Singleton.instance;
    }

}

export class SingletonSubject extends SubjectModel {
    constructor(){
        super();
    }
}
