"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import type {
  UseFormSetError,
  FieldValues,
  UseFormProps,
  DefaultValues,
  Resolver,
  UseFormSetValue,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import type { ZodType } from "zod";

interface ValidateConfig<TValues extends FieldValues> {
  data: TValues;
  goTo: (step: number) => void;
  setError: UseFormSetError<TValues>;
  setValue: UseFormSetValue<TValues>;
}

export interface StepConfig<TValues extends FieldValues> {
  schema: ZodType;
  goBackButton?: boolean;
  action?: (config: ValidateConfig<TValues>) => Promise<boolean>;
}

interface UseMultiStepFormParams<TValues extends FieldValues> {
  steps: StepConfig<TValues>[];
  defaultValues: DefaultValues<TValues>;
  mode?: UseFormProps<TValues>["mode"];
}

export function useMultiStepForm<TValues extends FieldValues>({
  steps,
  defaultValues,
  mode = "onTouched",
}: UseMultiStepFormParams<TValues>) {
  const [step, setStep] = useState(1);

  const validateStep = useCallback(
    (step: number) => Math.min(Math.max(step, 1), steps.length),
    [steps.length],
  );

  const validatedStep = validateStep(step);
  const currentStepConfig = steps[validatedStep - 1];
  const isLastStep = validatedStep === steps.length;
  const hasBackButton = validatedStep > 1 && currentStepConfig.goBackButton;

  const makeResolver = useCallback(
    () => zodResolver as unknown as (schema: ZodType) => Resolver<TValues>,
    [],
  );

  const methods = useForm<TValues>({
    mode,
    defaultValues,
    resolver: makeResolver()(currentStepConfig.schema),
  });

  const goTo = useCallback(
    (step: number) => {
      setStep(() => validateStep(step));
    },
    [validateStep],
  );

  const goPrev = useCallback(() => {
    goTo(validatedStep - 1);
  }, [goTo, validatedStep]);

  const goNext = useCallback(() => {
    goTo(validatedStep + 1);
  }, [goTo, validatedStep]);

  const handleNext = useCallback(async () => {
    const isValid = await methods.trigger();
    if (!isValid) return false;

    const handler = await currentStepConfig.action?.({
      data: methods.getValues(),
      setError: methods.setError,
      setValue: methods.setValue,
      goTo,
    });

    if (handler === false) return false;

    goNext();

    return true;
  }, [currentStepConfig, methods, goNext, goTo]);

  return {
    methods,
    step: validatedStep,
    hasBackButton,
    isLastStep,
    handleNext,
    goTo,
    goPrev,
  };
}
