import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";

const ErrorMessage = ({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}) => {
  return (
    <Card className={cn("p-6 bg-destructive border-destructive", className)}>
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-destructive rounded-full">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-destructive/20 text-destructive hover:bg-destructive hover:opacity-15 hover:text-destructive"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorMessage;
