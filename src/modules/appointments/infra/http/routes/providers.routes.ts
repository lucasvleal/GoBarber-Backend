import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvaliabilityController from '../controllers/ProviderMonthAvaliabilityController';
import ProviderDayAvaliabilityController from '../controllers/ProviderDayAvaliabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvaliability = new ProviderMonthAvaliabilityController();
const provideDayAvaliability = new ProviderDayAvaliabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get('/:id/month-availability', providerMonthAvaliability.index);
providersRouter.get('/:id/day-availability', provideDayAvaliability.index);

export default providersRouter;
