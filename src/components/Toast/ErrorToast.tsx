import type { FC } from "react";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

interface Props {
  errorMsg: string;
}

const ErrorToast: FC<Props> = ({ errorMsg }) => {
  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [errorMsg]);

  return <Toaster richColors position="top-right" closeButton />;
};
export default ErrorToast;
