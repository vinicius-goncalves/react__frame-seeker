import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFrame } from '../../common/classes/FrameManager';

interface FramesManagerProcess {
    isFinished: boolean;
    isExtracting: boolean;
    isVideoLoaded: boolean;
}

const framesManagerProcess: FramesManagerProcess = {
    isFinished: false,
    isExtracting: false,
    isVideoLoaded: false,
};

const initialState = {
    frames: [] as IFrame[],
    status: framesManagerProcess,
};

const framesSlice = createSlice({
    name: 'framesSlice',
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<Partial<FramesManagerProcess>>) {
            state.status = { ...state.status, ...action.payload };
        },

        pushFrame(state, action: PayloadAction<IFrame>) {
            if (action.payload) state.frames.push(action.payload);
        },
    },
});

export const framesActions = framesSlice.actions;
export default framesSlice;
