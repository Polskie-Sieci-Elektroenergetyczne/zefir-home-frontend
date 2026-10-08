import { getInfoMock } from '@/api/info/info.msw';

export const handlers = [...getInfoMock()];
