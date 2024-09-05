export function useWorker(worker: Worker) {
    function getWorkerData() {
        return new Promise((resolve) => worker.addEventListener('message', (ev) => resolve(ev.data))) as Promise<{
            action: string;
            res: unknown;
        }>;
    }

    function sendWorkerMessage(message: { action: string; data?: unknown }) {
        worker.postMessage(message);
        return getWorkerData();
    }

    return { getWorkerData, sendWorkerMessage };
}
