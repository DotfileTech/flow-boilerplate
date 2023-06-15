import { createRef, memo, useEffect } from 'react';

// @NOTE no TypeScript SDK available need to live with this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Ubble: any;

interface UbbleIframeProps {
  url: string;
  onComplete: () => void;
  onAbort: () => void;
  onExpired: () => void;
}

// Pure component to not rerender if url don't change
// Make sure you put onComplete & onAbort in useCallback to not trigger rerender
export const UbbleIframe = memo(
  ({ url, onComplete, onAbort, onExpired }: UbbleIframeProps) => {
    const ref = createRef<HTMLDivElement>();

    useEffect(() => {
      const ubble = new Ubble.IDV(ref.current, {
        width: '100%',
        height: '715', // size of Ubble UI
        identificationUrl: url,
        allowCamera: true,
        events: {
          onComplete: () => {
            ubble.destroy();
            onComplete();
          },
          onAbort: () => {
            onAbort();
          },
          onExpired: () => {
            ubble.destroy();
            onExpired();
          },
        },
      });

      return () => {
        ubble.destroy();
      };
    }, [url, ref, onComplete, onAbort, onExpired]);

    return <div ref={ref} className="iframe-ref" />;
  }
);
