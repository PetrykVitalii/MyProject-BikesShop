import { IBike } from '../interfaces/bike.interface';

export class Bike implements IBike {
    constructor(
        public nameEN: string,
        public type:string,
        public price: number,
        public count: number,
        public weight: number,
        public size: string,
        public color: string,
        public image: string,
        public fork: string,
        public steeringColumn: string,
        public shifters: string,
        public connectingRodSystem: string,
        public brake: string,
        public frontSwitch: string,
        public rearSwitch: string,
        public cassette: string,
        public shain: string,
        public wheels: string,
        public col: string,
        public reinforcingPin: string,
        public collar: string,
        public category: string = "bikes",
        public id:string = "id" ,
        public buyCount?:number,
        public data?:string
    ) { }


}