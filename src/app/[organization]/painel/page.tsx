"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/utils";
import { useQuery } from "@tanstack/react-query";

type CallData = {
  appointmentId: string;
  customerName: string;
  barberName: string;
};

export default function PainelPage() {
  const params = useParams();
  const orgSlug = params.organization as string;
  const trpc = useTRPC();

  const [currentCall, setCurrentCall] = useState<CallData | null>(null);
  const [visible, setVisible] = useState(false);
  const lastShownIdRef = useRef<string | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data } = useQuery({
    ...trpc.scheduling.getLatestCall.queryOptions({ orgSlug }),
    refetchInterval: 5_000,
  });

  useEffect(() => {
    if (!data) return;
    if (data.appointmentId === lastShownIdRef.current) return;

    lastShownIdRef.current = data.appointmentId;
    setCurrentCall(data);
    setVisible(true);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setVisible(false), 10_000);
  }, [data]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      {visible && currentCall ? (
        <div className="animate-in fade-in zoom-in-95 duration-500 px-8 text-center">
          <p className="mb-6 text-xl uppercase tracking-widest text-gray-500">
            Por favor, dirija-se ao atendimento
          </p>
          <h1
            className="font-extrabold leading-none tracking-tight text-white"
            style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
          >
            {currentCall.customerName}
          </h1>
          <p className="mt-8 text-xl text-gray-600">{currentCall.barberName}</p>
        </div>
      ) : (
        <p className="text-xl text-gray-700">Aguardando chamados...</p>
      )}
    </div>
  );
}
