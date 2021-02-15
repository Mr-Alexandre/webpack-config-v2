import Singleton from "../../patterns/singleton/Singleton";

export default class FreezingScroll extends Singleton {
    private countFrosts: number = 0;
    private scrollY: number;

    constructor() {
        super();
    }

    public freeze(): void {
        this.countFrosts++;
        if (this.countFrosts > 0) {
            this.toggleFixedPage(true);
        }
    }

    public unfreeze(): void {
        this.countFrosts--;
        if (this.countFrosts <= 0) {
            this.toggleFixedPage(false);
        }
    }

    private toggleFixedPage(isFixed: boolean): void {
        if (isFixed) {
            this.scrollY = this.getBodyScrollTop();
            if (this.existVerticalScroll()) {
                document.body.style.overflowY = 'scroll';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.top = `-${this.scrollY}px`;
            }
        } else {
            document.body.style.overflowY = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, this.scrollY);
        }
    }

    private existVerticalScroll() {
        return document.body.offsetHeight > window.innerHeight;
    }

    private getBodyScrollTop(): number {
        return (
            self.pageYOffset ||
            (document.documentElement && document.documentElement.scrollTop) ||
            (document.body && document.body.scrollTop)
        );
    }
}
