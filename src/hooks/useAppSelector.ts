import { useSelector } from 'react-redux';
import { RootState } from '../services/store';

export const useAppSelector = useSelector.withTypes<RootState>();
