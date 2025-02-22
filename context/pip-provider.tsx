"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type PiPContextType = {
  // isSupported: boolean;
  pipWindow: Window | null;
  requestPipWindow: (width: number, height: number) => Promise<void>;
  closePipWindow: () => void;
};

const PiPContext = createContext<PiPContextType | undefined>(undefined);

type PiPProviderProps = {
  children: React.ReactNode;
};

export function PiPProvider({ children }: PiPProviderProps) {
  // Detect if the feature is available.
  // const isSupported = "documentPictureInPicture" in window;

  // if(typeof window !== 'undefined') {
  //   console.log("window.documentPictureInPicture", window.documentPictureInPicture)
  // }

  // Expose pipWindow that is currently active
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  // Close pipWidnow programmatically
  const closePipWindow = useCallback(() => {
    if (pipWindow !== null) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  // Open new pipWindow
  const requestPipWindow = useCallback(
    async (width: number, height: number) => {
      // We don't want to allow multiple requests.
      if (pipWindow !== null) {
        return;
      }

      const pip = await window.documentPictureInPicture.requestWindow({
        width,
        height,
      });

  
      // Detect when window is closed by user
      pip.addEventListener("pagehide", () => {
        setPipWindow(null);
      });

      // It is important to copy all parent widnow styles. Otherwise, there would be no CSS available at all
      // https://developer.chrome.com/docs/web-platform/document-picture-in-picture/#copy-style-sheets-to-the-picture-in-picture-window
      // [...document.styleSheets].forEach((styleSheet) => {
      Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
          // const cssRules = [...styleSheet.cssRules]
          const cssRules = Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
          const style = document.createElement("style");

          style.textContent = cssRules;
          pip.document.head.appendChild(style);
        } catch (e) {
          console.error(e);
          const link = document.createElement("link");
          if (styleSheet.href === null) {
            return;
          }

          link.rel = "stylesheet";
          link.type = styleSheet.type;
          link.media = styleSheet.media.toString();
          link.href = styleSheet.href;
          pip.document.head.appendChild(link);
        }
      });

      setPipWindow(pip);
    },
    [pipWindow]
  );

  const value = useMemo(() => {
    {
      return {
        // isSupported,
        pipWindow,
        requestPipWindow,
        closePipWindow,
      };
    }
  }, [
    closePipWindow,
    //  isSupported,
    pipWindow,
    requestPipWindow,
  ]);

  return <PiPContext.Provider value={value}>{children}</PiPContext.Provider>;
}

export function usePiPWindow(): PiPContextType {
  const context = useContext(PiPContext);

  if (context === undefined) {
    throw new Error("usePiPWindow must be used within a PiPContext");
  }

  return context;
}
