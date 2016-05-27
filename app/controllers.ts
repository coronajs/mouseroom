import {Controller} from 'corona'
import {Mouse, MouseRepository} from './models'
var mouseRepo: MouseRepository = new MouseRepository(Mouse);
var mouses = mouseRepo.toModel();
export class MouseController extends Controller {
    private mouse: Mouse;
    private mouses: any;
    
    init(params) {
        this.sync({
            include: ['mouse']
        })
        return mouseRepo.create(params).then((mouse) => {
            this.mouse = mouse;
            this.mouses = mouses;
        });
    }

    update(x, y) {
        this.mouse.set('x', x)
        this.mouse.set('y', y);
    }

    onexit() {
        mouseRepo.remove(this.mouse.id);
        this.mouse.dispose();
        this.mouse = null;
    }
}