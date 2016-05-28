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
        return mouseRepo.create({x: 0, y: 0}).then((mouse) => {
            this.mouse = mouse;
            this.mouses = mouses;
            done();
        }).catch((e) => {
            console.log(e);
        }).timeout(1000);
    }

    update(x, y) {
        this.mouse.set('x', x)
        this.mouse.set('y', y);
    }

    onexit() {
        mouseRepo.remove(this.mouse.id);
        mouses.remove(this.mouse);
        this.mouse.dispose();
        this.mouse = null;
    }
}
