import { pipeline } from "@xenova/transformers";

type ProgressCallbackArg = {
  status: string,
  name: string,
  file: string,
  progress?: number,
  loaded?: number,
  total?: number
};

const init = async (): Promise<void> => {
  const pipe = await pipeline(
    'text2text-generation',
    'Xenova/blenderbot-400M-distill',
    {
      progress_callback: (arg: ProgressCallbackArg): void => {
        // For debug
        self.postMessage({
          action: 'progressCallback',
          data: arg
        });
      }
    }
  );

  addEventListener('message', async (e) => {
    const { action, data } = e.data;

    if (action === 'text2text') {
      const result = await pipe(data);
      self.postMessage({
        action: 'text2textResult',
        data: result[0].generated_text
      });
    }
  });
};
init();
