
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { toast as showToast } from "@/hooks/use-toast";
import React from "react";

type TransactionStatus = "success" | "error" | "pending" | "info";

interface TransactionToastProps {
  title: string;
  description: string;
  status?: TransactionStatus;
  txHash?: string;
}

export const transactionToast = ({
  title,
  description,
  status = "success",
  txHash,
}: TransactionToastProps) => {
  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "pending":
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getVariant = () => {
    switch (status) {
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  return showToast({
    title: (
      <div className="flex items-center gap-2">
        {getIcon()}
        <span>{title}</span>
      </div>
    ) as React.ReactNode,
    description: (
      <div className="mt-1">
        <p>{description}</p>
        {txHash && (
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-blue-500 hover:underline inline-block"
          >
            View on Etherscan
          </a>
        )}
      </div>
    ) as React.ReactNode,
    variant: getVariant(),
  });
};
