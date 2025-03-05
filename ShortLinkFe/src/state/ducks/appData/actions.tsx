import apiAction, { defaultAction } from '@/state/ducks/utils/createAction';
import * as types from './types';
import parseObjToQuery from '../utils/parseObjToQuery';

export const initAppData = () => ({ type: types.INIT_APP_DATA });

