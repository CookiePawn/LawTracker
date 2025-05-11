// 의안 리스트
import beforeLaws from './beforeLaws.json';
import afterLaws from './afterLaws.json';
import lawDetailsList from './lawDetails.json';
import { AssemblyMember, Law, LawDetail } from '@/types';

// 국회의원 리스트
import naasList from './assemblyMembers.json';

export const laws = [...beforeLaws, ...afterLaws] as Law[];
export const naas = naasList as AssemblyMember[];
export const lawDetails = lawDetailsList as LawDetail[];