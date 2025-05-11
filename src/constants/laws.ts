import beforeLaws from './beforeLaws.json';
import afterLaws from './afterLaws.json';
import { Law } from '@/types';

export const laws = [...beforeLaws, ...afterLaws] as Law[];