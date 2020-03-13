type Constructor<T> = new (...args: any[]) => T;

export function Singleton<TFunction extends Function>(target: TFunction): TFunction {
    // target.prototype.getInstance = function (...args: Array<any>) {
    //     const original: Constructor<T> = target;
    //
    //     function construct(constructor: any) {
    //         const c: any = function () {
    //             return constructor.apply(this, args);
    //         };
    //         c.prototype = constructor.prototype;
    //         return new c();
    //     }
    //
    //     const f: any = function () {
    //         return construct(original);
    //     };
    //
    //     if (!original.instance) {
    //         f.prototype = original.prototype;
    //         original.instance = new f();
    //     }
    //
    //     return original.instance
    // };
    // public static getInstance(): Singleton {
    //     if ( !this.instance ) {
    //         Singleton.instance = new Singleton();
    //     }
    //
    //     return Singleton.instance;
    // }


    return target;
}
