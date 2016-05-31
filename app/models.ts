import {Model, Repository} from 'corona'
export interface IMouse {
    position: {
        x: number,
        y: number
    },
    color: string,
}

export class Mouse extends Model<IMouse>{

}

export class MouseRepository extends Repository<IMouse, Mouse>{

}