import {Controller} from 'corona'
import {Mouse, MouseRepository} from './models'
var mouseRepo: MouseRepository = new MouseRepository(Mouse);
export class MouseController extends Controller {
    private mouse: Mouse;
    init(params) {
        this.sync({
            include: ['mouse']
        })
        return mouseRepo.create(params).then((mouse) => {
            this.mouse = mouse;
        })
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