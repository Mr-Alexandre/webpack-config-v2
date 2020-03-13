import {Observer} from "./Observer";
import {SubjectSelect} from "../subject/Subject";

export default class ExampleObserver implements Observer {

    public update(subject: SubjectSelect): void {
        document.querySelector('.lav-observer-example-output').textContent = subject.Value;
    }

}
