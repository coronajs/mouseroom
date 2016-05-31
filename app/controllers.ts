import {Controller} from 'corona'
import {Mouse, MouseRepository} from './models'
var mouseRepo: MouseRepository = new MouseRepository(Mouse);
var mouses = mouseRepo.toModel();
export class MouseController extends Controller {
    private mouse: Mouse;
    private mouses: any;

    init(params, done) {
        // this.sync({
        //     include: ['mouse']
        // })
        this.expose('update');
        return mouseRepo.create({
            position: { x: 0, y: 0},
            color: `rgb(${parseInt((Math.random() * 255).toString())},${parseInt((Math.random() * 255).toString())},${parseInt((Math.random() * 255).toString())})`
        }).then((mouse) => {
            this.mouse = mouse;
            this.mouses = mouses;
            this.mouses.add(mouse);
            done();
        }).catch((e) => {
            console.log(e);
        }).timeout(1000);
    }

    update(x, y) {
        this.mouse.set('position.x', x)
        this.mouse.set('position.y', y);
    }

    onexit() {
        mouseRepo.remove(this.mouse.id);
        mouses.remove(this.mouse);
        this.mouse.dispose();
        this.mouse = null;
        this.mouses = null;
    }
}
