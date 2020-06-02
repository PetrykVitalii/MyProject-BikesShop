import { IComponent } from '../interfaces/component.interface';

export class Components implements IComponent {
    constructor(
        public nameEN: string,
        public type: string,
        public price: number,
        public count: number,
        public image: string,
        public category: string = "components",
        public id: string = "id",
        public buyCount?:number,
        public data?:string) {}

}