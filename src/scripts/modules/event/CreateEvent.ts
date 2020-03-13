export default class CreateEvent {
    constructor(private eventName: string) {}

    public createDefault(
        config: EventInit = {cancelable: true, bubbles: true}
    ): Event {
        let event: Event;
        if (typeof Event === 'function') {
            event = new Event(this.eventName);
        } else {
            event = document.createEvent('Event');
            event.initEvent(this.eventName, config.bubbles, config.cancelable);
        }
        return event;
    }

    public createCustom(
        config: CustomEventInit = {cancelable: true, bubbles: true}
    ): CustomEvent {
        let event: CustomEvent;

        if (typeof CustomEvent === 'function') {
            event = new CustomEvent(this.eventName);
        } else {
            event = document.createEvent('CustomEvent');
        }
        event.initCustomEvent(
            this.eventName,
            config.bubbles,
            config.cancelable,
            config.detail || ''
        );
        return event;
    }
}
