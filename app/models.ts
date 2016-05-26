import {Model, Repository} from 'corona'
export interface Point {
    x:number;
    y:number;
}

export class Mouse extends Model<Point>{
    
}

export class MouseRepository extends Repository<Point, Mouse>{
    
}