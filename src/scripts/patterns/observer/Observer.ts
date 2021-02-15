import {Subject} from '../subject/Subject'

export interface Observer {
    update(subject: Subject): void;
}
