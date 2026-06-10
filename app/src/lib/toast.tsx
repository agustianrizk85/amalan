import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastFn = (msg: string) => void;
const Ctx = createContext<ToastFn | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState("");
  const [on, setOn] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  const fire = useCallback<ToastFn>((m) => {
    setMsg(m);
    setOn(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOn(false), 2400);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  return (
    <Ctx.Provider value={fire}>
      {children}
      <div className={`toast ${on ? "on" : ""}`}>{msg}</div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be inside ToastProvider");
  return v;
}
